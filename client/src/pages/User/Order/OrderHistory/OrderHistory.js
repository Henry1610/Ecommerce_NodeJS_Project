import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../../../redux/user/orderSlice';
import { Link } from 'react-router-dom';
import formatDateTime from '../../../../untils/dateUtils'

const formatVND = (price) => {
  return price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 ₫';
};


const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.user.userOrder);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) return <p className="text-center">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-danger text-center">Lỗi: {error}</p>;

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold text-center text-info">Lịch Sử Đơn Hàng</h2>

      {orders.length === 0 ? (
        <p className="text-center text-secondary">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle">
            <thead className="table-info">
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Địa chỉ giao hàng</th>
                <th>Trạng thái</th>
                <th>Tổng tiền</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderNumber}</td>
                  <td>{formatDateTime(order.createdAt)}</td>
                  <td>{order.shippingAddress?.city?.city}, {order.shippingAddress?.address}</td>
                  <td>
                    <span className={`badge ${order.status === 'Đã giao' ? 'bg-success' : 'bg-warning'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="fw-bold">{formatVND(order.totalPrice)}</td>
                  <td>
                    <Link to={`/order-detail/${order.orderNumber}`} className="btn btn-outline-info btn-sm">
                      Xem
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
