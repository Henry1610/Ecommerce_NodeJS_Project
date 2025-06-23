import Order from '../../models/Order.js';

// Lấy tất cả đơn hàng
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user')
      .populate('shippingAddress')
      .populate('payment')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

// Lấy chi tiết 1 đơn hàng theo ID
export const getOrderByOrderNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params
    const order = await Order.findOne({ orderNumber })
      .populate('user')
      .populate({
        path: 'shippingAddress',
        populate: {
          path: 'city',
          model: 'ShippingZone'
        }
      })
      .populate('payment');


    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

// Lấy danh sách yêu cầu hoàn tiền
export const getRefundRequests = async (req, res) => {
  try {
    const refundOrders = await Order.find({ refundStatus: { $in: ['requested', 'approved', 'rejected'] } })
      .populate('user')
      .populate('payment')
      .populate('shippingAddress');

    res.status(200).json(refundOrders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách refund', error: error.message });
  }
};



export const updateOrderStatus = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const newStatus = req.body.statusData;

    const allowedStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancel_requested',
      'cancelled',
      'cancel_rejected',
    ];

    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findOne({ orderNumber }).populate('payment');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const currentStatus = order.status;

    const validTransitions = {
      pending: ['processing', 'cancel_requested', 'cancelled'],
      processing: ['shipped', 'cancel_requested', 'cancelled'],
      shipped: ['delivered'],
      cancel_requested: ['cancelled', 'cancel_rejected'],
    };

    // Nếu trạng thái hiện tại là "cancel_requested" và admin từ chối hủy
    if (currentStatus === 'cancel_requested' && newStatus === 'cancel_rejected') {
      // Lấy trạng thái trước khi yêu cầu hủy
      const history = order.statusHistory;
      const index = history.map(h => h.status).lastIndexOf('cancel_requested');

      // Trạng thái trước đó chính là phần tử ngay trước cancel_requested
      const previousStatus = index > 0 ? history[index - 1].status : 'pending';

      // Quay lại trạng thái trước
      order.status = previousStatus;

      // Ghi lại lịch sử
      order.statusHistory.push({ status: 'cancel_rejected', updatedAt: new Date() });
      order.statusHistory.push({ status: previousStatus, updatedAt: new Date() });

      await order.save();

      return res.status(200).json({
        message: 'Cancel request rejected and status reverted',
        order,
      });
    }

    // Trường hợp chuyển trạng thái hợp lệ bình thường
    if (
      validTransitions[currentStatus] &&
      !validTransitions[currentStatus].includes(newStatus)
    ) {
      return res.status(400).json({
        message: `Invalid transition from '${currentStatus}' to '${newStatus}'`,
      });
    }

    // Cập nhật trạng thái bình thường
    order.status = newStatus;
    order.statusHistory.push({ status: newStatus, updatedAt: new Date() });
    if (newStatus === 'cancelled' && order.payment) {
      order.payment.refundStatus = 'requested';
      order.payment.refundHistory.push({
        status: 'requested',
        updatedAt: new Date(),
      });
      await order.payment.save();
    }
    await order.save();

    res.status(200).json({
      message: 'Order status updated successfully',
      order,
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

