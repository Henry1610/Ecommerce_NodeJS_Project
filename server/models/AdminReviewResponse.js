import mongoose from 'mongoose';

const adminReviewResponseSchema = new mongoose.Schema({
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: true,
    unique: true // Each review can only have one admin response
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responseContent: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('AdminReviewResponse', adminReviewResponseSchema); 