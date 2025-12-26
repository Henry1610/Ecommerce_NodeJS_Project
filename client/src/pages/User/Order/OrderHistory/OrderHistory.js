import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../../../redux/user/orderSlice';
import { Link } from 'react-router-dom';
import formatDateTime from '../../../../untils/dateUtils';
import './OrderHistory.css';

const formatVND = (price) => {
  return price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 ₫';
};

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.user.userOrder);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': {
        text: 'Mới tạo',
        className: 'badge rounded-pill px-3 py-2',
        style: { backgroundColor: '#6366f1', color: '#ffffff', fontSize: '0.75rem' }
      },
      'processing': {
        text: 'Đang xử lý',
        className: 'badge rounded-pill px-3 py-2',
        style: { backgroundColor: '#f59e0b', color: '#ffffff', fontSize: '0.75rem' }
      },
      'shipped': {
        text: 'Đã giao cho đơn vị vận chuyển',
        className: 'badge rounded-pill px-3 py-2',
        style: { backgroundColor: '#0ea5e9', color: '#ffffff', fontSize: '0.75rem' }
      },
      'delivered': {
        text: 'Đã giao thành công',
        className: 'badge rounded-pill px-3 py-2',
        style: { backgroundColor: '#10b981', color: '#ffffff', fontSize: '0.75rem' }
      },
      'cancel_requested': {
        text: 'Người dùng yêu cầu hủy',
        className: 'badge rounded-pill px-3 py-2',
        style: { backgroundColor: '#f97316', color: '#ffffff', fontSize: '0.75rem' }
      },
      'cancelled': {
        text: 'Đã hủy thành công',
        className: 'badge rounded-pill px-3 py-2',
        style: { backgroundColor: '#ef4444', color: '#ffffff', fontSize: '0.75rem' }
      },
      'cancel_rejected': {
        text: 'Từ chối hủy đơn',
        className: 'badge rounded-pill px-3 py-2',
        style: { backgroundColor: '#6b7280', color: '#ffffff', fontSize: '0.75rem' }
      }
    };

    const config = statusConfig[status] || {
      text: status,
      className: 'badge rounded-pill px-3 py-2',
      style: { backgroundColor: '#6b7280', color: '#ffffff', fontSize: '0.75rem' }
    };

    return (
      <span className={config.className} style={config.style}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="text-center">
          <div className="spinner-border text-info mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="text-muted fw-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-danger border-0 shadow-sm rounded-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Lỗi: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 border-top" 
         style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="mb-4">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-3">
                <li className="breadcrumb-item">
                  <Link to="/" className="text-decoration-none" style={{ color: '#0ea5e9' }}>
                    Trang chủ
                  </Link>
                </li>
                <li className="breadcrumb-item active fw-medium" aria-current="page" style={{ color: '#64748b' }}>
                  Lịch sử đơn hàng
                </li>
              </ol>
            </nav>
            
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <h1 className="fw-bold mb-2" style={{ 
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  color: '#1e293b',
                  letterSpacing: '-0.025em'
                }}>
                  Lịch sử đơn hàng
                </h1>
                <p className="text-muted mb-0" style={{ color: '#64748b' }}>
                  Theo dõi và quản lý tất cả đơn hàng của bạn
                </p>
              </div>
              {orders.length > 0 && (
                <div className="badge bg-light text-dark fs-6 px-3 py-2 rounded-3">
                  <i className="bi bi-box-seam me-2"></i>
                  {orders.length} đơn hàng
                </div>
              )}
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="row justify-content-center">
              <div className="col-12 col-md-8 col-lg-6">
                <div className="text-center py-5">
                  <div className="mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                         style={{ 
                           width: '80px', 
                           height: '80px', 
                           backgroundColor: '#f1f5f9' 
                         }}>
                      <i className="bi bi-inbox" style={{ fontSize: '2rem', color: '#0ea5e9' }}></i>
                    </div>
                  </div>
                  <h4 className="text-muted mb-3 fw-bold" style={{ color: '#1e293b' }}>
                    Chưa có đơn hàng nào
                  </h4>
                  <p className="text-secondary mb-4" style={{ color: '#64748b', lineHeight: '1.6' }}>
                    Bạn chưa thực hiện đơn hàng nào. Hãy bắt đầu mua sắm ngay!
                  </p>
                  <Link 
                    to="/products" 
                    className="btn btn-info text-white px-4 py-3 fw-semibold rounded-3 shadow-sm"
                    style={{
                      border: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <i className="bi bi-shop me-2"></i>
                    Mua sắm ngay
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-4 shadow-sm overflow-hidden">
              {/* Table for larger screens */}
              <div className="d-none d-lg-block">
                <div className="table-responsive">
                  <table className="table table-hover mb-0" style={{ fontSize: '0.925rem' }}>
                    <thead style={{ 
                      backgroundColor: '#0ea5e9',
                      color: '#ffffff'
                    }}>
                      <tr>
                        <th className="fw-semibold py-3 px-4 border-0">Mã đơn</th>
                        <th className="fw-semibold py-3 px-4 border-0">Ngày đặt</th>
                        <th className="fw-semibold py-3 px-4 border-0">Địa chỉ giao hàng</th>
                        <th className="fw-semibold py-3 px-4 border-0 text-center">Trạng thái</th>
                        <th className="fw-semibold py-3 px-4 border-0 text-end">Tổng tiền</th>
                        <th className="fw-semibold py-3 px-4 border-0 text-center">Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr key={order._id} style={{ 
                          borderBottom: index === orders.length - 1 ? 'none' : '1px solid #f1f5f9' 
                        }}>
                          <td className="py-4 px-4">
                            <span className="fw-bold" style={{ color: '#0ea5e9' }}>
                              #{order.orderNumber}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-muted fw-medium">
                              {formatDateTime(order.createdAt)}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="d-flex flex-wrap">
                              <small className="text-muted me-1" style={{ color: '#64748b' }}>
                                {order.shippingAddress?.address},
                              </small>
                              <small className="text-muted" style={{ color: '#64748b' }}>
                                {order.shippingAddress?.city}
                              </small>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="py-4 px-4 text-end">
                            <span className="fw-bold" style={{ color: '#1e293b' }}>
                              {formatVND(order.totalPrice)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                          <Link
  to={`/order-detail/${order.orderNumber}`}
  className="btn btn-sm btn-outline-info px-3 py-2 fw-medium rounded-3"
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
              <div className="d-lg-none p-4">
                <div className="row g-3">
                  {orders.map((order) => (
                    <div key={order._id} className="col-12">
                      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                        <div className="card-header border-0 py-3" style={{ backgroundColor: '#f8fafc' }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold" style={{ color: '#0ea5e9' }}>
                              #{order.orderNumber}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                        <div className="card-body p-4">
                          <div className="row g-3">
                            <div className="col-6">
                              <small className="fw-semibold d-block mb-1" style={{ color: '#64748b' }}>
                                Ngày đặt
                              </small>
                              <span className="fw-medium text-muted small" style={{ color: '#334155' }}>
                                {formatDateTime(order.createdAt)}
                              </span>
                            </div>
                            <div className="col-6">
                              <small className="fw-semibold d-block mb-1" style={{ color: '#64748b' }}>
                                Tổng tiền
                              </small>
                              <span className="fw-bold" style={{ color: '#1e293b' }}>
                                {formatVND(order.totalPrice)}
                              </span>
                            </div>
                            <div className="col-12">
                              <small className="fw-semibold d-block mb-1" style={{ color: '#64748b' }}>
                                Địa chỉ giao hàng
                              </small>
                              <div className="d-flex flex-wrap">
                                <small className="text-muted me-1" style={{ color: '#64748b' }}>
                                  {order.shippingAddress?.address},
                                </small>
                                <small className="text-muted" style={{ color: '#64748b' }}>
                                  {order.shippingAddress?.city}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer bg-transparent border-0 p-4">
                          <Link
                            to={`/order-detail/${order.orderNumber}`}
                            className="btn w-100 text-white fw-bold py-3 rounded-3"
                            style={{
                              backgroundColor: '#0ea5e9',
                              border: 'none',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={e => e.target.style.backgroundColor = '#0284c7'}
                            onMouseLeave={e => e.target.style.backgroundColor = '#0ea5e9'}
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

export default OrderHistory;