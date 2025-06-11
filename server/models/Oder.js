import mongoose from 'mongoose';
import { generateOrderNumber } from '../middleware/generateOrderNumber';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    default: generateOrderNumber
  },
  shippingAddress: {
    type: mongoose.Schema.ObjectId,
    ref: 'ShippingAddress',
    required: true
  },
  payment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Payment',
    required: true
  },
  items: [
    {
      product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      image: { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }

    }
  ],
  appliedDiscount: {
    type: mongoose.Schema.ObjectId,
    ref: 'Discount',
    default: null
  },
  totalPrice: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: true
  },
  paidAt: {
    type: Date,
    default: Date.now

  },
  isShipped: {
    type: Boolean,
    default: false
  },
  shippedAt: {
    type: Date,
    default: null
  },

  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date,
    default: null

  }

}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);
