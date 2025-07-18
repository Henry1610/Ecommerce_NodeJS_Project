import mongoose from 'mongoose';
import slugify from 'slugify';
const brandSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    logo: { type: String },
    slug: { type: String, unique: true }
});

brandSchema.pre('save', function (next) {
    if (this.isModified('name')) {
      this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
  });
  
export default mongoose.model('Brand', brandSchema);