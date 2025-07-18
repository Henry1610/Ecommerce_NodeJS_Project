import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  appliedDiscount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discount',
    default: null
  },
  shippingFee: {
    type: Number,
    default: 0
  }

});

export default mongoose.model('Cart', cartSchema);

