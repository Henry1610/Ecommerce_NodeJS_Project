import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderByOrderNumber } from '../../../../redux/user/orderSlice';
import { fetchUserProfile } from '../../../../redux/user/userSlice';

const OrderDetail = () => {
  const dispatch = useDispatch();
  const { orderNumber } = useParams();
  const { profile } = useSelector(state => state.user.userUser);
  const user = profile?.user;

  const { orderDetail, loading, error } = useSelector(state => state.user.userOrder);

  useEffect(() => {
    if (orderNumber) {
      dispatch(fetchOrderByOrderNumber(orderNumber));
    }
  }, [dispatch, orderNumber]);
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>Có lỗi xảy ra: {error}</div>;
  }

  if (!orderDetail) {
    return <div>Không tìm thấy đơn hàng.</div>;
  }
  const totalSteps = 4;
  let completedSteps = 1; // Bước "Đặt hàng" luôn completed

  if (orderDetail.isPaid) completedSteps++;
  if (orderDetail.isShipped) completedSteps++;
  if (orderDetail.isDelivered) completedSteps++;

  const progressPercent = (completedSteps / totalSteps) * 100;
  const steps = [
    {
      icon: 'bi-cart-fill',
      label: 'Đặt hàng',
      completed: true,  // luôn hoàn thành
      date: new Date(orderDetail.createdAt).toLocaleDateString('vi-VN')
    },
    {
      icon: 'bi-credit-card-fill',
      label: 'Đã thanh toán',
      completed: orderDetail.isPaid,
      date: orderDetail.paidAt ? new Date(orderDetail.paidAt).toLocaleDateString('vi-VN') : '-'
    },
    {
      icon: 'bi-truck',
      label: 'Đang giao',
      completed: orderDetail.isShipped,
      date: orderDetail.shippedAt ? new Date(orderDetail.shippedAt).toLocaleDateString('vi-VN') : '-'
    },
    {
      icon: 'bi-house-door-fill',
      label: 'Đã giao',
      completed: orderDetail.isDelivered,
      date: orderDetail.deliveredAt ? new Date(orderDetail.deliveredAt).toLocaleDateString('vi-VN') : '-'
    }
  ];
console.log('pr',steps[1].completed);


  return (
    <div
      className="min-vh-100 "
    >
      {/* Main content */}
      <div >
        {/* Enhanced Header */}
        <header className="shadow-lg mb-3" style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div className="container-lg py-4">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-primary rounded-pill me-4 shadow-sm"

                  aria-label="Quay lại"
                >
                  <i class="fa-solid fa-person-walking-arrow-loop-left"></i>
                </button>
                <div>
                  <h1
                    className="h4 m-0 fw-bold text-dark mb-1 bg-info"
                    style={{
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    Chi tiết đơn hàng
                  </h1>
                  <p className="text-muted mb-0 fw-bold "># {orderDetail.orderNumber}</p>
                </div>
              </div>
              <div>
                <span
                  className="badge fs-6 px-3 py-2 rounded-pill shadow-sm"
                  style={{
                    background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                    color: 'white'
                  }}
                >
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Đã thanh toán
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className=" pb-5">
          <div className="row g-4">
            {/* Left Column */}
            <div className="col-lg-8">
              {/* Enhanced Order Status */}
              <div
                className="bg-white rounded-4 shadow-lg p-5 mb-4 position-relative overflow-hidden"
                style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
              >
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 opacity-25"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    zIndex: -1
                  }}
                ></div>
                <h2 className="h5 fw-bold mb-4 text-dark">
                  <i className="bi bi-truck text-primary me-2"></i>
                  Trạng thái đơn hàng
                </h2>

                <div className="row g-3 mb-4">
                  <div className="row g-3 ">
                    {steps.map(({ icon, label, date, completed }) => (
                      <div key={label} className="col-6 col-lg-3 text-center">
                        <div className="position-relative">
                          <div
                            className={`mx-auto mb-3 rounded-circle d-flex justify-content-center align-items-center shadow-lg transition-all`}
                            style={{
                              width: 64,
                              height: 64,
                              background: completed
                                ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
                                : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
                              transform: completed ? 'scale(1.1)' : 'scale(1)',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <i className={`bi ${icon} fs-4 ${completed ? 'text-white' : 'text-dark'}`}></i>
                          </div>
                          <span className={`d-block fw-semibold small mb-1 ${completed ? 'text-dark' : 'text-secondary'}`}>
                            {label}
                          </span>
                          <span className="text-muted small">{date}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
                {/* Enhanced Progress Bar */}
                <div className="progress rounded-pill shadow-sm" style={{ height: '8px' }}>
                  <div
                    className="progress-bar rounded-pill"
                    style={{
                      width: `${progressPercent}%`,
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      transition: 'width 0.5s ease'  // cho mượt
                    }}
                  ></div>
                </div>

              </div>

              {/* Enhanced Products List (Compact Version) */}
              <div className="bg-white rounded-4 shadow-lg p-4 mb-4">
                <h2 className="h6 fw-bold mb-4 text-dark">
                  <i className="bi bi-bag-check text-success me-2"></i>
                  Sản phẩm đã mua
                </h2>

                <div className="d-flex flex-column gap-3">
                  {[
                    {
                      img: 'https://readdy.ai/api/search-image?query=a%20professional%20photo%20of%20a%20modern%20smartphone%20with%20high%20resolution%20display%2C%20sleek%20design%2C%20minimal%20bezel%2C%20in%20dark%20blue%20color%2C%20on%20white%20background%2C%20product%20photography&width=200&height=200&seq=1&orientation=squarish',
                      title: 'Điện thoại Samsung Galaxy S25 Ultra',
                      description: 'Màu: Xanh đậm • Bộ nhớ: 512GB',
                      quantity: 1,
                      price: '12.490.000đ',
                    },
                    {
                      img: 'https://readdy.ai/api/search-image?query=a%20professional%20photo%20of%20wireless%20earbuds%20in%20charging%20case%2C%20premium%20design%2C%20white%20color%2C%20product%20photography%20on%20white%20background&width=200&height=200&seq=2&orientation=squarish',
                      title: 'Tai nghe không dây Samsung Galaxy Buds Pro 2',
                      description: 'Màu: Trắng',
                      quantity: 1,
                      price: '4.290.000đ',
                    },
                  ].map(({ img, title, description, quantity, price }, index) => (
                    <div
                      key={title}
                      className="d-flex align-items-center border rounded-4 p-3 shadow-sm position-relative overflow-hidden"
                      style={{
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }}
                    >
                      <div
                        className="rounded-3 overflow-hidden me-3 shadow-sm"
                        style={{
                          width: 60,
                          height: 60,
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                        }}
                      >
                        <img src={img} alt={title} className="img-fluid w-100 h-100 object-fit-cover" />
                      </div>
                      <div className="flex-grow-1">
                        <h3 className="fw-bold mb-1 text-dark fs-6">{title}</h3>
                        <p className="text-muted mb-2 small">{description}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span
                            className="badge rounded-pill px-2 py-1"
                            style={{
                              background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                              color: '#4338ca',
                              fontSize: '0.75rem'
                            }}
                          >
                            Số lượng: {quantity}
                          </span>
                          <span
                            className="fw-bold fs-6"
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                            }}
                          >
                            {price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              <div className="bg-white rounded-4 shadow-lg p-5">
                <h2 className="h5 fw-bold mb-4 text-dark">
                  <i className="bi bi-clock-history text-info me-2"></i>
                  Lịch sử đơn hàng
                </h2>

                <div className="position-relative">

                  {/* Timeline line bên trái */}
                  <div
                    className="position-absolute top-0 bottom-0"
                    style={{
                      left: '30px',
                      width: '3px',
                      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '10px',
                      zIndex: 1
                    }}
                  ></div>

                  <div className="d-flex flex-column gap-4">

                    {/* Item 1 */}
                    <div className="d-flex align-items-start position-relative">
                      <div className="flex-shrink-0 position-relative" style={{ zIndex: 2, marginLeft: '8px', marginRight: '15px' }}>
                        <div
                          className="rounded-circle d-flex justify-content-center align-items-center shadow-lg text-white"
                          style={{
                            width: 48,
                            height: 48,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          }}
                        >
                          <i className="bi bi-bag-check-fill fs-5"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 pt-2">
                        <p className="mb-1 fw-bold text-dark">Đơn hàng đã được tạo</p>
                        <p className="mb-0 text-muted small">06/06/2025 14:00</p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="d-flex align-items-start position-relative">
                      <div className="flex-shrink-0 position-relative" style={{ zIndex: 2, marginLeft: '8px', marginRight: '15px' }}>
                        <div
                          className={`rounded-circle d-flex justify-content-center align-items-center shadow-lg ${steps[1].completed ? 'text-white' : 'text-secondary'}`}
                          style={{
                            width: 48,
                            height: 48,
                            background: steps[1].completed
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : '#f8f9fa' // bg-light màu hex tương đương
                          }}
                        >
                          <i className="bi bi-credit-card-fill fs-5"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 pt-2">
                        <p className={`mb-1 fw-bold ${steps[1].completed ? 'text-dark' : 'text-secondary'}`}>Thanh toán thành công</p>
                        {/* <p className="mb-0 text-muted small">{date}</p> */}
                      </div>
                    </div>


                    {/* Item 3 */}
                    <div className="d-flex align-items-start position-relative">
                      <div className="flex-shrink-0 position-relative" style={{ zIndex: 2, marginLeft: '8px', marginRight: '15px' }}>
                        <div
                          className="rounded-circle d-flex justify-content-center align-items-center shadow-lg bg-light text-secondary"
                          style={{ width: 48, height: 48 }}
                        >
                          <i className="bi bi-truck fs-5"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 pt-2">
                        <p className="mb-1 fw-bold text-secondary">Đang giao hàng</p>
                        <p className="mb-0 text-muted small">-</p>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="d-flex align-items-start position-relative">
                      <div className="flex-shrink-0 position-relative" style={{ zIndex: 2, marginLeft: '8px', marginRight: '15px' }}>
                        <div
                          className="rounded-circle d-flex justify-content-center align-items-center shadow-lg bg-light text-secondary"
                          style={{ width: 48, height: 48 }}
                        >
                          <i className="bi bi-house-door-fill fs-5"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 pt-2">
                        <p className="mb-1 fw-bold text-secondary">Đã giao hàng</p>
                        <p className="mb-0 text-muted small">-</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* Enhanced Right Column - Sidebar */}
            <div className="col-lg-4">
              {/* Payment Info Card */}
              <div className="bg-white rounded-4 shadow-lg p-4 mb-4 position-relative overflow-hidden">
                <div
                  className="position-absolute top-0 end-0"
                  style={{
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                    borderRadius: '50%',
                    transform: 'translate(50%, -50%)',
                    opacity: 0.1
                  }}
                ></div>
                <h2 className="h6 fw-bold mb-4 text-dark">
                  <i className="bi bi-credit-card-2-front text-success me-2"></i>
                  Thông tin thanh toán
                </h2>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-light">
                    <span className="text-muted fw-medium">Phương thức:</span>
                    <span className="fw-bold text-dark">Thẻ tín dụng</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-light">
                    <span className="text-muted fw-medium">Trạng thái:</span>
                    <span
                      className="badge rounded-pill px-3 py-2"
                      style={{
                        background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                        color: 'white'
                      }}
                    >
                      <i className="bi bi-check-circle me-1"></i>
                      Đã thanh toán
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Info Card */}
              <div className="bg-white rounded-4 shadow-lg p-4 mb-4 position-relative overflow-hidden">
                <div
                  className="position-absolute top-0 end-0"
                  style={{
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    transform: 'translate(50%, -50%)',
                    opacity: 0.1
                  }}
                ></div>
                <h2 className="h6 fw-bold mb-4 text-dark">
                  <i className="bi bi-geo-alt text-primary me-2"></i>
                  Thông tin giao hàng
                </h2>
                <div className="d-flex flex-column gap-3">
                  <div className="p-3 rounded-3 bg-light">
                    <label className="text-muted small fw-medium mb-1 d-block">Người nhận</label>
                    <span className="fw-bold text-dark">{user.username}</span>
                  </div>
                  <div className="p-3 rounded-3 bg-light">
                    <label className="text-muted small fw-medium mb-1 d-block">Địa chỉ</label>
                    <span className="text-dark">{orderDetail.shippingAddress.address}</span>
                  </div>
                  <div className="p-3 rounded-3 bg-light">
                    <label className="text-muted small fw-medium mb-1 d-block">Điện thoại</label>
                    <span className="fw-bold text-dark">0909123456</span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div
                className="rounded-4 shadow-lg p-4 text-white position-relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
                  style={{
                    background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.2"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/svg%3E")'
                  }}
                ></div>
                <h2 className="h6 fw-bold mb-4 position-relative">
                  <i className="bi bi-receipt me-2"></i>
                  Tổng kết đơn hàng
                </h2>
                <div className="d-flex flex-column gap-3 position-relative">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="opacity-75">Tạm tính:</span>
                    <span className="fw-bold">16.780.000đ</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="opacity-75">Phí vận chuyển:</span>
                    <span className="fw-bold text-warning">Miễn phí</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="opacity-75">Giảm giá:</span>
                    <span className="fw-bold text-warning">-0đ</span>
                  </div>
                  <hr className="border-white opacity-25" />
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fs-5 fw-bold">Tổng cộng:</span>
                    <span className="fs-4 fw-bold">16.780.000đ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderDetail;