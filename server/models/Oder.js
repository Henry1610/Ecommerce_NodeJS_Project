import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
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
    type: String, // discount code
    default: null
  },
  totalPrice: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  isShipped: {
    type: Boolean,
    default: false
  },
  shippedAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  }
  
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);
