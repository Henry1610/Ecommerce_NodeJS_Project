import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true, default: 0, min: 0 },
        slug: { type: String, unique: true, lowercase: true, trim: true },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        color: {
            type: String,
            required: true
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
            required: true,
        },

        images: {
            type: [ String ],
            validate: [arr => arr.length <= 10, 'Chỉ cho phép tối đa 3 ảnh'],

        },

        ratings: {
            type: Number,
            default: 0,
        },

        numReviews: {
            type: Number,
            default: 0,
        },
        statusCurrent: {
            type: String,
            enum: ['active', 'unactive'],
            default: 'active',
            required: true,
        },
        discountPercent: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        attributes: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
            default: {}
        },
        sold: {
            type: Number,
            default: 0,
            min: 0
          },
    }
);


productSchema.pre('save', function (next) {
    if (!this.slug && this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true })

    }
    next(); 
});

// Index phục vụ GET /api/products/filter
productSchema.index({ statusCurrent: 1, category: 1 });
productSchema.index({ statusCurrent: 1, brand: 1 });
productSchema.index({ statusCurrent: 1, price: 1 });
productSchema.index({ statusCurrent: 1, ratings: -1 });
productSchema.index({ statusCurrent: 1, discountPercent: 1 });
productSchema.index({ statusCurrent: 1, _id: -1 });
productSchema.index({ name: 'text' });

export default mongoose.model('Product', productSchema);
