import Order from '../../models/Oder.js';
import shippingAddress from '../../models/shippingAddress.js';

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user')
            .populate('shippingAddress')
            .populate('paymentInfo')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch(err) {
        res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user')
            .populate('shippingAddress')
            .populate('paymentInfo');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ order });
    } catch(error) {
        res.status(500).json({ message: 'Failed to fetch order', error: error.message });
    }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { isShipped, isDelivered } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // isPaid luôn luôn true nên bỏ kiểm tra isPaid

    if (typeof isShipped === 'boolean') {
      order.isShipped = isShipped;
      order.shippedAt = isShipped ? new Date() : null;
    }

    if (typeof isDelivered === 'boolean') {
      if (isDelivered && !order.isShipped) {
        return res.status(400).json({ message: 'Order must be shipped before delivery.' });
      }
      order.isDelivered = isDelivered;
      order.deliveredAt = isDelivered ? new Date() : null;
    }

    await order.save();

    res.status(200).json({
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

  
