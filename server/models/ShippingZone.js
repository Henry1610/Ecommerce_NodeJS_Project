import mongoose from 'mongoose';
import slugify from 'slugify';

const shippingZoneSchema = new mongoose.Schema({
  city: { type: String, required: true, unique: true },
  fee: { type: Number, required: true },
  slug: { type: String }
});

shippingZoneSchema.pre('save', function (next) {
  if (!this.slug && this.city) {
    this.slug = slugify(this.city, { lower: true, strict: true });
  }
  next();
});

const ShippingZone = mongoose.models.ShippingZone || mongoose.model('ShippingZone', shippingZoneSchema);
export default ShippingZone;