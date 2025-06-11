import Order from '../../models/Order.js';

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate('shippingAddress') 
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Fetched user orders successfully',
      orders
    });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const getOrderById = async (req, res) => {
    try {
      const { orderId } = req.params;
      const userId = req.user.id;
  
      const order = await Order.findOne({ _id: orderId, user: userId })
        .populate('appliedDiscount')
        .populate('shippingAddress')
        .populate('payment');
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found or access denied' });
      }
  
      res.status(200).json({
        message: 'Fetched order successfully',
        order
      });
  
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  