import mongoose from 'mongoose';

const shippingZoneSchema = new mongoose.Schema({
  city: { type: String, required: true, unique: true },
  fee: { type: Number, required: true },
});

export default mongoose.model('ShippingZone', shippingZoneSchema);
