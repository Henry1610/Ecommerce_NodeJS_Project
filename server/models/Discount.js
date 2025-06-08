import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    discountPercent: { type: Number, required: true, min: 0, max: 100 },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    isActive: { type: Boolean, default: false },
    quantity: { type: Number, required: true, min: 0 },
    usedCount: { type: Number, default: 0, min: 0 },    
    maxDiscount: { type: Number, default: null, min: 0 },

});

export default mongoose.model('Discount', discountSchema);

