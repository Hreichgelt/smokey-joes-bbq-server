const { gql } = require('apollo-server-express');


const typeDefs = gql`
type User {
    _id: ID 
    username: String
    email: String
    password: String
    orders: [Order]
}

type Sauce {
_id: ID
name: String
description: String
image: String
meal: [Meal]
price: Float
featured: Boolean
}

type Meal {
_id: ID
name: String
image: String
}

type Order {
_id: ID
purchaseDate: String
totalCost: Float
products: [Sauce]
}

type Checkout {
session: ID
}

type Auth {
token: ID!
user: User
}

type Query {
users: [User]
me: User
meals: [Meal]
allSauces(mealId: ID!): [Sauce]
sauce(sauceId: ID!): Sauce
featured: [Sauce]
checkout(products: [ID]!): Checkout
}

type Mutation {
addUser(email:String!, username:String!, password:String!): Auth
login(email:String!, password:String!): Auth
addOrder(products: [ID]!): Order
}
`;

module.exports = typeDefs;