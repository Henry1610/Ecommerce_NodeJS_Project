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
            type: [{ type: String }],
            required: true,
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
        }
    }
);


productSchema.pre('save', function (next) {
    if (!this.slug && this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true })
        next();

    }
})
export default mongoose.model('Product', productSchema);
