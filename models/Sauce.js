const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const sauceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
    },
    meal: [{
        type: Schema.Types.ObjectId,
        ref: "Meal"
    }],
    featured: {
        type: Boolean,
        required: true,
    }
});

const Sauce = mongoose.model('Sauce', sauceSchema);

module.exports = Sauce