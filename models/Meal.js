const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const mealSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String
    }
});

const Meal = mongoose.model('Meal', mealSchema)

module.exports = Meal;