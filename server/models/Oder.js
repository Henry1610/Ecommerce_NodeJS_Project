const mongoose = require('mongoose')

const oderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true

    },
    shippingAddress: {
        type: mongoose.Schema.ObjectId,
        ref: 'Shipping',
        required: true

    },
    paymentInfo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Payment',
        required: true

    },

    totalPrice: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date

})

module.exports = mongoose.model('Order',oderSchema)