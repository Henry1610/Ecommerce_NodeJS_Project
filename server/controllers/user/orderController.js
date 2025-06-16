import Order from '../../models/Oder.js';

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
  .populate({
    path: 'shippingAddress',
    populate: {
      path: 'city',  
      model: 'ShippingZone'
    }
  })
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
export const getOrderByOrderNumber = async (req, res) => {
  try {
    
    const { orderNumber } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ orderNumber, user: userId })
      .populate('appliedDiscount')
      .populate('shippingAddress')
      .populate('payment')
      .populate('items.product');

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
