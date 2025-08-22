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
        className: 'badge rounded-pill',
        style: { backgroundColor: '#6366f1', color: '#ffffff' }
      },
      'processing': { 
        text: 'Đang xử lý', 
        className: 'badge rounded-pill',
        style: { backgroundColor: '#f59e0b', color: '#ffffff' }
      },
      'shipped': { 
        text: 'Đang vận chuyển', 
        className: 'badge rounded-pill',
        style: { backgroundColor: '#0ea5e9', color: '#ffffff' }
      },
      'delivered': { 
        text: 'Hoàn thành', 
        className: 'badge rounded-pill',
        style: { backgroundColor: '#10b981', color: '#ffffff' }
      },
      'cancel_requested': { 
        text: 'Yêu cầu hủy', 
        className: 'badge rounded-pill',
        style: { backgroundColor: '#f97316', color: '#ffffff' }
      },
      'cancelled': { 
        text: 'Đã hủy', 
        className: 'badge rounded-pill',
        style: { backgroundColor: '#ef4444', color: '#ffffff' }
      },
      'cancel_rejected': { 
        text: 'Từ chối hủy', 
        className: 'badge rounded-pill',
        style: { backgroundColor: '#6b7280', color: '#ffffff' }
      },
    };
    const config = statusConfig[status] || { 
      text: status, 
      className: 'badge rounded-pill',
      style: { backgroundColor: '#6b7280', color: '#ffffff' }
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
          <div className="spinner-border text-info mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="text-muted fw-medium">Đang tải lịch sử đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-danger border-0 shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Có lỗi xảy ra: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 px-md-4 py-4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {/* Modern Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h1 className="fw-bold mb-1" style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                color: '#1e293b',
                letterSpacing: '-0.025em'
              }}>
                Lịch sử đơn hàng
              </h1>
              <p className="text-muted mb-0 fs-6" style={{ color: '#64748b' }}>
                Theo dõi và quản lý tất cả đơn hàng của bạn
              </p>
            </div>
            {orders.length > 0 && (
              <div className="d-flex align-items-center gap-3">
                <div className="badge bg-light text-dark fs-6 px-3 py-2">
                  <i className="bi bi-box-seam me-2"></i>
                  {orders.length} đơn hàng
                </div>
              </div>
            )}
          </div>
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
              <h3 className="fw-bold mb-3" style={{ color: '#1e293b' }}>Chưa có đơn hàng nào</h3>
              <p className="text-muted mb-4 fs-6" style={{ color: '#64748b', lineHeight: '1.6' }}>
                Bạn chưa thực hiện đơn hàng nào. Khám phá các sản phẩm tuyệt vời và bắt đầu mua sắm ngay hôm nay!
              </p>
              <Link 
                to="/products" 
                className="btn text-white px-4 py-3 fw-semibold rounded-3 shadow-sm"
                style={{
                  backgroundColor: '#0ea5e9',
                  border: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => e.target.style.backgroundColor = '#0284c7'}
                onMouseLeave={e => e.target.style.backgroundColor = '#0ea5e9'}
              >
                <i className="bi bi-shop me-2"></i>
                Khám phá sản phẩm
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="d-none d-xl-block">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.925rem' }}>
                  <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <tr>
                      <th className="fw-semibold py-3 px-4 border-0" style={{ color: '#475569' }}>
                        Mã đơn hàng
                      </th>
                      <th className="fw-semibold py-3 px-4 border-0" style={{ color: '#475569' }}>
                        Ngày đặt hàng
                      </th>
                      <th className="fw-semibold py-3 px-4 border-0" style={{ color: '#475569' }}>
                        Địa chỉ giao hàng
                      </th>
                      <th className="fw-semibold py-3 px-4 border-0 text-center" style={{ color: '#475569' }}>
                        Trạng thái
                      </th>
                      <th className="fw-semibold py-3 px-4 border-0 text-end" style={{ color: '#475569' }}>
                        Tổng tiền
                      </th>
                      <th className="fw-semibold py-3 px-4 border-0 text-center" style={{ color: '#475569' }}>
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={order._id} style={{ borderBottom: index === orders.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                        <td className="py-4 px-4">
                          <div className="fw-bold" style={{ color: '#0ea5e9' }}>
                            #{order.orderNumber}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-muted fw-medium">
                            {formatDateTime(order.createdAt)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="fw-semibold mb-1" style={{ color: '#334155' }}>
                              {order.shippingAddress?.city?.city}
                            </div>
                            <div className="text-muted small" style={{ color: '#64748b' }}>
                              {order.shippingAddress?.address}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-4 px-4 text-end">
                          <div className="fw-bold fs-6" style={{ color: '#1e293b' }}>
                            {formatVND(order.totalPrice)}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Link 
                            to={`/order-detail/${order.orderNumber}`} 
                            className="btn text-white btn-sm px-3 py-2 fw-medium rounded-3"
                            style={{
                              backgroundColor: '#0ea5e9',
                              border: 'none',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={e => e.target.style.backgroundColor = '#0284c7'}
                            onMouseLeave={e => e.target.style.backgroundColor = '#0ea5e9'}
                          >
                            <i class="fa-solid fa-eye"></i>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Tablet View */}
          <div className="d-none d-lg-block d-xl-none">
            <div className="row g-3">
              {orders.map((order) => (
                <div key={order._id} className="col-12">
                  <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="card-body p-4">
                      <div className="row align-items-center g-3">
                        <div className="col-8">
                          <div className="d-flex align-items-center gap-3 mb-2">
                            <div className="fw-bold fs-5" style={{ color: '#0ea5e9' }}>
                              #{order.orderNumber}
                            </div>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="text-muted small mb-2">
                            {formatDateTime(order.createdAt)}
                          </div>
                          <div className="fw-semibold" style={{ color: '#334155' }}>
                            {order.shippingAddress?.city?.city}
                          </div>
                          <div className="text-muted small">
                            {order.shippingAddress?.address}
                          </div>
                        </div>
                        <div className="col-4 text-end">
                          <div className="fw-bold fs-5 mb-3" style={{ color: '#1e293b' }}>
                            {formatVND(order.totalPrice)}
                          </div>
                          <Link 
                            to={`/order-detail/${order.orderNumber}`} 
                            className="btn text-white px-3 py-2 fw-medium rounded-3"
                            style={{
                              backgroundColor: '#0ea5e9',
                              border: 'none',
                              fontSize: '0.875rem'
                            }}
                          >
                            <i className="bi bi-eye me-1"></i>
                            Chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile View */}
          <div className="d-lg-none">
            <div className="row g-3">
              {orders.map((order) => (
                <div key={order._id} className="col-12">
                  <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="card-header border-0 py-3 px-4" style={{ backgroundColor: '#f8fafc' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="fw-bold" style={{ color: '#0ea5e9' }}>
                          #{order.orderNumber}
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-3">
                        <div className="col-6">
                          <div className="small text-muted mb-1" style={{ color: '#64748b' }}>
                            Ngày đặt
                          </div>
                          <div className="fw-medium" style={{ color: '#334155', fontSize: '0.875rem' }}>
                            {formatDateTime(order.createdAt)}
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="small text-muted mb-1" style={{ color: '#64748b' }}>
                            Tổng tiền
                          </div>
                          <div className="fw-bold" style={{ color: '#1e293b', fontSize: '0.875rem' }}>
                            {formatVND(order.totalPrice)}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="small text-muted mb-1" style={{ color: '#64748b' }}>
                            Địa chỉ giao hàng
                          </div>
                          <div className="fw-semibold mb-1" style={{ color: '#334155', fontSize: '0.875rem' }}>
                            {order.shippingAddress?.city?.city}
                          </div>
                          <div className="text-muted small" style={{ color: '#64748b' }}>
                            {order.shippingAddress?.address}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer border-0 p-4" style={{ backgroundColor: '#f8fafc' }}>
                      <Link 
                        to={`/order-detail/${order.orderNumber}`} 
                        className="btn text-white w-100 py-3 fw-semibold rounded-3"
                        style={{
                          backgroundColor: '#0ea5e9',
                          border: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <i className="bi bi-eye me-2"></i>
                        Xem chi tiết đơn hàng
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderHistoryTab;