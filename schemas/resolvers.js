require('dotenv');
const { AuthenticationError } = require('apollo-server-express');
const { User, Sauce, Meal, Order } = require('../models');
const { signToken } = require('../utils/auth');
const stripe = require('stripe')(process.env.API);

const resolvers = {
    Query: {
        users: async () => {
            const users = await User.find().populate('orders');
            return users;
        },
        me: async (_, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('orders');
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        meals: async () => {
            return Meal.find();
        },

        allSauces: async (_, { mealId }) => {
            return Sauce.find({ meal: mealId }).populate('meal');
        },
        sauce: async (_, { sauceId }) => {
            return Sauce.findOne({ _id: sauceId }).populate('meal');
        },
        featured: async () => {
            return Sauce.find({ featured: true }).populate('meal');
        },
        checkout: async (parent, args, context) => {
            const url = new URL(context.headers.referer).origin:
            const order = new Order({ products: args.products });
            const line_items = [];

            const { products } = await order.populate('products');

            for (let i = 0; i < products.length; i++) {
                const product = await stripe.products.create({
                    name: products[i].name,
                    description: products[i].description,
                });

                const price = await stripe.prices.create({
                    product: product.id,
                    unit_amount: products[i].price * 100,
                    currency: 'usd',
                });

                line_items.push({
                    price: price.id,
                    quantity: 1
                });
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items,
                mode: 'payment',
                success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${url}/`
            });

            return { session: session.id };
        }
    },
    // mutation to add users
    Mutation: {
        addUser: async (_, args) => {
            // create a user through mongoose passing args: email, UN, PW
            const user = await User.create(args);
            // signing a token using jwt.sign
            const token = signToken(user);
            // returning an Auth result
            return { token, user };
        },
        // mutation to log in as a user
        login: async (_, { email, password }) => {
            // finds one user who's email matches the posted email
            const user = await User.findOne({ email });
            // checks to see if user exists
            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }
            // if user exists check for correct password
            const correctPw = await user.isCorrectPassword(password);
            // if password is incorrect throw auth error
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            // signing a token using jwt.sign
            const token = signToken(user);
            // return an auth result 
            return { token, user };
        },
        addOrder: async (parent, { products }, context) => {
            if (context.user) {
                const order = new Order({ products });

                await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });

                return order;
            }

            throw new AuthenticationError('Not logged in');
        },
    },
};

module.exports = resolvers;