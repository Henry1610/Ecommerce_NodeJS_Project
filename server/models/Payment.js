import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order',  // Tham chiếu đến bảng Orders
    required: true 
  },
  paymentMethod: { 
    type: String, 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    required: true 
  },
  paidAt: { 
    type: Date, 
    default: Date.now  
  }
});

export default mongoose.model('Payment', paymentSchema);
