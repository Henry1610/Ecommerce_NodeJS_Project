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
        const { status } = req.body;
        const allowedStatuses = ['pending', 'confirmed', 'paid', 'cpod', 'shipped', 'delivered', 'cancelled'];
    
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
    
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
    
        order.status = status;
        order.statusUpdatedAt = new Date();
        await order.save();
    
        res.json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
};
  
