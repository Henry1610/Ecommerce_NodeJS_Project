import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({

  stripeSessionId: {
    type: String,
    required: false
  },
  paymentIntentId: String,
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['succeeded', 'fail'],
    default: 'none'
  },
  refundStatus: {
    type: String,
    enum: ['none', 'requested', 'rejected', 'refunded'],
    default: 'none'
  },
  refundHistory: [
    {
      status: {
        type: String,
        enum: ['requested', 'rejected', 'refunded'],
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  paidAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Payment', paymentSchema);
