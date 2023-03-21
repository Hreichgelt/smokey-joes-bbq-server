const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const orderSchema = new Schema({
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    totalCost: {
        type: Number
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Sauce'
    }]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;