import mongoose from 'mongoose';

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
    status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], // Các trạng thái của đơn hàng
        default: 'pending'
    }
});

export default mongoose.model('Order', oderSchema);