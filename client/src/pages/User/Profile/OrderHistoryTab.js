import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../../redux/user/orderSlice';
import { Link } from 'react-router-dom';
import formatDateTime from '../../../untils/dateUtils';

const formatVND = (price) => {
  return price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 ₫';
};

const OrderHistoryTab = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.user.userOrder);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': {
        text: 'Mới tạo',
        className: 'badge bg-primary'
      },
      'processing': {
        text: 'Đang xử lý',
        className: 'badge bg-warning'
      },
      'shipped': {
        text: 'Đã giao cho đơn vị vận chuyển',
        className: 'badge bg-info'
      },
      'delivered': {
        text: 'Đã giao thành công',
        className: 'badge bg-success'
      },
      'cancel_requested': {
        text: 'Người dùng yêu cầu hủy',
        className: 'badge bg-warning'
      },
      'cancelled': {
        text: 'Đã hủy thành công',
        className: 'badge bg-danger'
      },
      'cancel_rejected': {
        text: 'Từ chối hủy đơn',
        className: 'badge bg-secondary'
      }
    };

    const config = statusConfig[status] || {
      text: status,
      className: 'badge bg-secondary'
    };

    return (
      <span className={config.className}>
        {config.text}
      </span>
    );
  };

  if (loading) return <p className="text-center">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-danger text-center">Lỗi: {error}</p>;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="mb-4">
            <h2 className="fw-bold">Lịch Sử Đơn Hàng</h2>
            <p className="text-muted">Theo dõi tất cả đơn hàng của bạn tại đây</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="bi bi-inbox fs-1 text-muted"></i>
              </div>
              <h4 className="text-muted mb-3">Chưa có đơn hàng nào</h4>
              <p className="text-secondary">Bạn chưa thực hiện đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
              <Link to="/products" className="btn btn-info text-white">
                <i className="bi bi-shop me-2"></i>
                Mua sắm ngay
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded shadow ">
              {/* Table for larger screens */}
              <div className="d-none d-lg-block">
                <div className="table-responsive rounded">
                  <table className="table table-hover mb-0">
                    <thead className="table-dark">
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
                          <td>
                            <span className="fw-bold text-primary">#{order.orderNumber}</span>
                          </td>
                          <td>
                            <span className="text-muted">{formatDateTime(order.createdAt)}</span>
                          </td>
                          <td>
                            <div>
                              <div className="fw-medium">{order.shippingAddress?.city?.city}</div>
                              <small className="text-muted">{order.shippingAddress?.address}</small>
                            </div>
                          </td>
                          <td>
                            {getStatusBadge(order.status)}
                          </td>
                          <td>
                            <span className="fw-bold">{formatVND(order.totalPrice)}</span>
                          </td>
                          <td>
                            <Link 
                              to={`/order-detail/${order.orderNumber}`} 
                              className="btn btn-outline-primary btn-sm"
                            >
                              <i className="bi bi-eye me-1"></i>
                              Xem
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Card layout for mobile screens */}
              <div className="d-lg-none p-3">
                <div className="row g-3">
                  {orders.map((order) => (
                    <div key={order._id} className="col-12">
                      <div className="card">
                        <div className="card-header bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold text-primary">#{order.orderNumber}</span>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-6">
                              <small className="text-muted d-block">Ngày đặt</small>
                              <span className="fw-medium">{formatDateTime(order.createdAt)}</span>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Tổng tiền</small>
                              <span className="fw-bold">{formatVND(order.totalPrice)}</span>
                            </div>
                            <div className="col-12">
                              <small className="text-muted d-block">Địa chỉ giao hàng</small>
                              <div>
                                <div className="fw-medium">{order.shippingAddress?.city?.city}</div>
                                <small className="text-muted">{order.shippingAddress?.address}</small>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer bg-transparent">
                          <Link 
                            to={`/order-detail/${order.orderNumber}`} 
                            className="btn btn-primary w-100"
                          >
                            <i className="bi bi-eye me-2"></i>
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryTab; 