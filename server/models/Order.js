import mongoose from 'mongoose';
import { generateOrderNumber } from '../middleware/generateOrderNumber.js';

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
  discountValue: {
    type: Number,
  },
  shippingFee: {
    type: Number,
    required: true
  },
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    cityId: {
      type: mongoose.Schema.ObjectId,
      ref: 'ShippingZone'
    },
    phoneNumber: {
      type: String,
      required: true
    },
    originalAddressId: {
      type: mongoose.Schema.ObjectId,
      ref: 'ShippingAddress'
    },
    shippingZoneName: {
      type: String,
      required: true
    }
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
      price: { type: Number, required: true },
      originalPrice: { type: Number, required: true },
      reviewed: { type: Boolean, default: false },
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
  status: {
    type: String,
    enum: [
      'pending',             // Mới tạo
      'processing',          // Đang xử lý
      'shipped',             // Đã giao cho đơn vị vận chuyển
      'delivered',           // Đã giao thành công
      'cancel_requested',    // Người dùng yêu cầu hủy
      'cancelled',           // Đã hủy thành công
      'cancel_rejected'      // Admin từ chối yêu cầu hủy
    ],
    default: 'pending'
  },
  statusHistory: [
    {
      status: {
        type: String,
        enum: [
          'pending',
          'processing',
          'shipped',
          'delivered',
          'cancel_requested',
          'cancelled',
          'cancel_rejected',
        ],
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }
    },
  ],

}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);
