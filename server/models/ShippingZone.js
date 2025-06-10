import mongoose from 'mongoose';

const shippingZoneSchema = new mongoose.Schema({
  city: { type: String, required: true, unique: true },
  fee: { type: Number, required: true },
});

shippingZoneSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
      this.slug = slugify(this.name, { lower: true, strict: true })
      next();

  }
})
const ShippingZone = mongoose.models.ShippingZone || mongoose.model('ShippingZone', shippingZoneSchema);
export default ShippingZone;