import mongoose from 'mongoose';
import slugify from 'slugify';
const brandSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    logo: { type: String },
    
});

brandSchema.pre('save', function (next) {
    if (!this.slug && this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true })
        next();

    }
})
export default mongoose.model('Brand', brandSchema);