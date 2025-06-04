import mongoose from 'mongoose';

const shippingZoneSchema = new mongoose.Schema({
  city: { type: String, required: true, unique: true },
  fee: { type: Number, required: true },
});

const ShippingZone = mongoose.models.ShippingZone || mongoose.model('ShippingZone', shippingZoneSchema);
export default ShippingZone;