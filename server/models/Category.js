import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    slug: { type: String, unique: true }
});

categorySchema.pre('save', function (next) {
    if (!this.slug && this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true })
        next();

    }
})
export default mongoose.model('Category', categorySchema);
