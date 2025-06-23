import React, { useEffect } from 'react';
import './OrderList.css';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../../../../redux/admin/orderSlice';
import { useDispatch, useSelector } from 'react-redux';
import formatDateTime from '../../../../untils/dateUtils'
const OrderList = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);
  const { orders } = useSelector(state => state.admin.adminOrder)
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-secondary'; // Xám
      case 'processing':
        return 'bg-primary'; // Xanh dương
      case 'shipped':
        return 'bg-info'; // Xanh lơ
      case 'delivered':
        return 'bg-success'; // Xanh lá
      case 'cancel_requested':
        return 'bg-warning text-dark'; // Vàng
      case 'cancelled':
        return 'bg-danger'; // Đỏ
      case 'cancel_rejected':
        return 'bg-dark'; // Đen hoặc màu riêng
      default:
        return 'bg-light text-dark'; // Trạng thái không xác định
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold text-primary">🧾 Danh sách đơn hàng</h2>

      <div className="table-responsive shadow-sm rounded-3 border bg-white">
        <table className="table table-hover align-middle modern-table">
          <thead className="table-light">
            <tr>
              <th className="text-start">🆔 Order #</th>
              <th className="text-start">👤 User</th>
              <th className="text-end">💵 Total</th>
              <th className="text-center">🔁 Status</th>
              <th className="text-center">📅 Created</th>
              <th className="text-center">🔍 Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="text-start">#{order.orderNumber}</td>
                <td className="text-start">{order.shippingAddress.fullName}</td>
                <td className="text-end">{order.totalPrice.toLocaleString()}đ</td>
                
                <td className="text-center">
                  <span
                    className={`badge rounded-pill px-3 py-2 fw-semibold ${getStatusBadgeClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="text-center">{formatDateTime(order.createdAt)}</td>
                <td className="text-center">
                  <Link
                    to={`${order.orderNumber}`}
                    className="btn btn-outline-primary btn-sm rounded-pill px-3"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
