import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  stripeSessionId: { 
    type: String,
    required: false
  },
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
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paidAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Payment', paymentSchema);
