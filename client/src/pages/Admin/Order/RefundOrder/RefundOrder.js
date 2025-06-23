import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../../../redux/admin/orderSlice';
import formatDateTime from '../../../../untils/dateUtils';
import { Link } from 'react-router-dom';

const RefundOrder = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const { orders } = useSelector((state) => state.admin.adminOrder);

  const refundRequestedOrders = orders.filter(
    (order) => order.payment.refundStatus === 'requested'
  );

  const getRefundBadgeClass = (status) => {
    switch (status) {
      case 'requested':
        return 'bg-warning text-dark';
      case 'approved':
        return 'bg-success';
      case 'rejected':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const getPaymentBadgeClass = (isPaid) => {
    return isPaid ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger';
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold text-primary">📦 Yêu cầu hủy đơn hàng</h2>

      <div className="table-responsive shadow-sm rounded-3 border bg-white">
        <table className="table table-hover align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>🆔 Order #</th>
              <th>👤 User</th>
              <th>💰 Total</th>
              <th>💳 Payment</th>
              <th>🔁 Refund</th>
              <th>📅 Created</th>
              <th>⚙️ Action</th>
            </tr>
          </thead>
          <tbody>
            {refundRequestedOrders.map((order) => (
              <tr key={order._id}>
                <td>#{order.orderNumber}</td>
                <td>{order.shippingAddress?.fullName || 'Unknown'}</td>
                <td>{order.totalPrice.toLocaleString()}₫</td>

                <td>
                  <span
                    className={`badge rounded-pill px-3 py-2 fw-semibold ${getPaymentBadgeClass(order.payment.paymentStatus)}`}
                  >
                    {order.payment.paymentStatus ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </td>

                <td>
                  <span
                    className={`badge rounded-pill px-3 py-2 fw-semibold ${getRefundBadgeClass(order.payment.refundStatus)}`}
                  >
                    {order.payment.refundStatus === 'requested'
                      ? 'Yêu cầu hoàn tiền'
                      : order.payment.refundStatus === 'refunded'
                      ? 'Đã chấp nhận'
                      : order.payment.refundStatus === 'rejected'
                      ? 'Đã từ chối'
                      : 'Không'}
                  </span>
                </td>

                <td>{formatDateTime(order.createdAt)}</td>

                <td className="text-center">
                  <Link
                    to={`/admin/order/${order.orderNumber}`}
                    className="btn btn-outline-primary btn-sm rounded-pill px-3"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
            {refundRequestedOrders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-muted py-3">
                  Không có yêu cầu hoàn tiền nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RefundOrder;
