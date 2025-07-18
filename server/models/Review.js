import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  
    required: true 
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',  
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5  
  },
  comment: { 
    type: String, 
    required: true 
  },
  images: {
    type: [String], 
    validate: [arr => arr.length <= 3, 'Chỉ cho phép tối đa 3 ảnh']
  },
  orderNumber: {
    type: String,
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
