import React from 'react';

const OrderDetail = () => {
  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f9fafb', fontFamily: "'Inter', sans-serif" }}>
      <header className="bg-white shadow-sm mb-4">
        <div className="container-lg py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <button className="btn btn-light rounded-circle me-3" aria-label="Quay lại">
              <i className="bi bi-arrow-left"></i>
            </button>
            <h1 className="h5 m-0 fw-semibold text-dark">Chi tiết đơn hàng #68428c4</h1>
          </div>
          <div>
            <span className="badge bg-success d-inline-flex align-items-center">
              <i className="bi bi-check-circle-fill me-1"></i> Đã thanh toán
            </span>
          </div>
        </div>
      </header>

      <main className="container-lg">
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-lg-8">
            {/* Order Status */}
            <div className="bg-white rounded shadow-sm p-4 mb-4 position-relative">
              <h2 className="h6 fw-semibold mb-3">Trạng thái đơn hàng</h2>
              <div className="d-flex justify-content-between mb-2 position-relative">
                {[
                  {
                    icon: 'bi-cart',
                    label: 'Đặt hàng',
                    date: '06/06/2025',
                    active: true,
                  },
                  {
                    icon: 'bi-credit-card',
                    label: 'Đã thanh toán',
                    date: '06/06/2025',
                    active: true,
                  },
                  {
                    icon: 'bi-truck',
                    label: 'Đang giao',
                    date: '-',
                    active: false,
                  },
                  {
                    icon: 'bi-house-door',
                    label: 'Đã giao',
                    date: '-',
                    active: false,
                  },
                ].map(({ icon, label, date, active }, idx, arr) => (
                  <div key={label} className="text-center flex-fill position-relative">
                    <div
                      className={`mx-auto mb-2 rounded-circle d-flex justify-content-center align-items-center ${
                        active ? 'bg-primary text-white' : 'bg-light text-secondary'
                      }`}
                      style={{ width: 40, height: 40 }}
                    >
                      <i className={`bi ${icon}`}></i>
                    </div>
                    <span className={`d-block fw-medium small ${active ? '' : 'text-secondary'}`}>{label}</span>
                    <span className="text-muted small">{date}</span>
                    {/* Timeline line except last */}
                    {idx < arr.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '100%',
                          height: 'calc(100% - 10px)',
                          width: 2,
                          backgroundColor: '#e5e7eb',
                          transform: 'translateX(-50%)',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              {/* Progress Bar */}
              <div className="position-absolute top-50 start-0 end-0 translate-middle-y" style={{ pointerEvents: 'none' }}>
                <div className="bg-light rounded" style={{ height: 4 }}>
                  <div className="bg-primary rounded" style={{ width: '50%', height: 4 }}></div>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded shadow-sm p-4 mb-4">
              <h2 className="h6 fw-semibold mb-3">Sản phẩm đã mua</h2>
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
                ].map(({ img, title, description, quantity, price }) => (
                  <div key={title} className="d-flex align-items-center border rounded p-3">
                    <div
                      className="bg-light rounded overflow-hidden me-3 d-flex align-items-center justify-content-center"
                      style={{ width: 80, height: 80 }}
                    >
                      <img src={img} alt={title} className="img-fluid" />
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="fw-medium mb-1 fs-6">{title}</h3>
                      <p className="text-muted small mb-2">{description}</p>
                      <div className="d-flex justify-content-between">
                        <span className="small">Số lượng: {quantity}</span>
                        <span className="fw-semibold">{price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded shadow-sm p-4">
              <h2 className="h6 fw-semibold mb-3">Lịch sử đơn hàng</h2>
              <div className="d-flex flex-column gap-4">
                {[
                  {
                    icon: 'bi-bag-check-fill',
                    label: 'Đơn hàng đã được tạo',
                    date: '06/06/2025 14:00',
                    active: true,
                  },
                  {
                    icon: 'bi-credit-card-fill',
                    label: 'Thanh toán thành công',
                    date: '06/06/2025 14:05',
                    active: true,
                  },
                  {
                    icon: 'bi-truck',
                    label: 'Đang giao hàng',
                    date: '-',
                    active: false,
                  },
                  {
                    icon: 'bi-house-door-fill',
                    label: 'Đã giao hàng',
                    date: '-',
                    active: false,
                  },
                ].map(({ icon, label, date, active }) => (
                  <div key={label} className="d-flex">
                    <div className="flex-shrink-0 me-3 text-center" style={{ width: 48 }}>
                      <div
                        className={`rounded-circle d-flex justify-content-center align-items-center ${
                          active ? 'bg-primary text-white' : 'bg-light text-secondary'
                        }`}
                        style={{ width: 32, height: 32 }}
                      >
                        <i className={`bi ${icon}`}></i>
                      </div>
                    </div>
                    <div>
                      <p className={`mb-1 fw-semibold ${active ? '' : 'text-secondary'}`}>{label}</p>
                      <p className="mb-0 text-muted small">{date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-lg-4">
            <div className="bg-white rounded shadow-sm p-4 mb-4">
              <h2 className="h6 fw-semibold mb-3">Thông tin thanh toán</h2>
              <p className="mb-1">
                <strong>Phương thức:</strong> Thanh toán qua thẻ tín dụng
              </p>
              <p className="mb-0">
                <strong>Trạng thái:</strong> Đã thanh toán
              </p>
            </div>

            <div className="bg-white rounded shadow-sm p-4">
              <h2 className="h6 fw-semibold mb-3">Thông tin giao hàng</h2>
              <p className="mb-1">
                <strong>Người nhận:</strong> Nguyễn Văn A
              </p>
              <p className="mb-1">
                <strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP. HCM
              </p>
              <p className="mb-0">
                <strong>Điện thoại:</strong> 0909123456
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetail;
