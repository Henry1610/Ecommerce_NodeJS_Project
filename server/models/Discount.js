const mongoose = require('mongoose')

const discountSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    discountPercent: { type: Number, required: true, min: 0, max: 100 },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    isActive: { type: Boolean, default: false },



})
module.exports = mongoose.model('Discount', discountSchema)

