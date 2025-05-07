const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', // Reference to the Order model
        required: true,
    },
}, {
    timestamps: true, // Optionally add createdAt and updatedAt fields
});
module.exports = mongoose.model('OrderItem', orderItemSchema);

