import mongoose from 'mongoose';

const shippingAddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShippingZone',
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  isDefault:{
    type: Boolean,
    default: false
  }
});

const ShippingAddress = mongoose.models.shippingAddress || mongoose.model('shippingAddress', shippingAddressSchema);
export default ShippingAddress;
