const mongoose = require('mongoose')

const discountSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true, unique: true },
    discountPercent: { type: String, required: true, unique: true },
    validFrom: { type: Date, required: true, unique: true },
    validTo: { type: Date, required: true, unique: true },
    isActive: { type: Boolean, default: false },



})
module.exports = mongoose.model('Discount', discountSchema)

