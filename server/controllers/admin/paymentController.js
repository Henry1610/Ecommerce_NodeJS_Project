import Order from "../../models/Order.js";
import Stripe from 'stripe';
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
export const approveRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('payment');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Chỉ xử lý khi đã hủy đơn hàng (ví dụ: status === 'cancelled')
    if (order.status !== 'cancelled') {
      return res.status(400).json({ message: 'Chỉ hoàn tiền cho đơn đã hủy' });
    }

    // Kiểm tra nếu đã hoàn tiền rồi
    if (order.payment.refundStatus === 'refunded') {
      return res.status(400).json({ message: 'Đơn hàng đã được hoàn tiền' });
    }

    // Nếu có Stripe
    if (order.payment.stripeSessionId) {
      await stripe.refunds.create({
        payment_intent: order.payment.paymentIntentId, // ✅ Dùng đúng field
        amount: order.payment.amount,
      });
    }

    // Cập nhật payment
    order.payment.refundStatus = 'refunded';
    order.payment.refundHistory.push({
      status: 'refunded',
      updatedAt: new Date()
    });
    await order.payment.save();

    res.status(200).json({ message: 'Đã hoàn tiền thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi duyệt refund', error: error.message });
  }
};


export const rejectRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('payment');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.payment.refundStatus !== 'requested') {
      return res.status(400).json({ message: 'Không thể từ chối đơn này' });
    }

    order.payment.refundStatus = 'rejected';
    order.payment.refundHistory.push({
      status: 'rejected',
      updatedAt: new Date()
    });
    await order.payment.save();

    res.status(200).json({ message: 'Đã từ chối yêu cầu hoàn tiền' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi từ chối refund', error: error.message });
  }
};

