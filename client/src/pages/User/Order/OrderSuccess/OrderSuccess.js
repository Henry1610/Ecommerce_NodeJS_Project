import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderSuccess = () => {
    const [showDetails, setShowDetails] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    return (
        <div className="container py-5  border-top">
            {/* Thông báo thành công */}
            <div className="text-center mb-5">
                <div className="bg-success bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 p-3 fs-1" >
                    <i class="fa-solid fa-check"></i>
                </div>
                <h2 className="fw-bold">Thanh Toán Thành Công</h2>
                <p className="text-muted">Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi</p>
                <h3 className="fw-bold">2.450.000 ₫</h3>
                <p className="text-secondary">Mã đơn hàng: <strong>DH25062023</strong></p>
                <p className="text-secondary">Ngày đặt hàng: <strong>07/06/2025</strong></p>
            </div>

            {/* Nút */}
            <div className="d-flex justify-content-center text-center gap-3 ">
                <button onClick={() => setShowDetails(!showDetails)} className="btn btn-outline-secondary fw-bold p-2 bg-info text-dark">
                    <i className="ri-file-list-line me-2"></i>Xem chi tiết đơn hàng
                </button>
                <button onClick={() => setShowHistory(!showHistory)} className="btn btn-outline-secondary fw-bold bg-info text-dark">
                    <i className="ri-history-line me-2"></i>Xem lịch sử đơn hàng
                </button>
            </div>

            {/* Chi tiết đơn hàng */}
            {showDetails && (
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between">
                        <strong>Chi Tiết Đơn Hàng</strong>
                        <button className="btn-close" onClick={() => setShowDetails(false)}></button>
                    </div>
                    <div className="card-body">
                        <h5>Sản phẩm đã mua</h5>
                        <ul className="list-group mb-3">
                            <li className="list-group-item d-flex justify-content-between">
                                <span>iPhone 14 Pro Max 256GB (SL: 1)</span>
                                <strong>22.990.000 ₫</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Tai nghe AirPods Pro 2 (SL: 1)</span>
                                <strong>5.990.000 ₫</strong>
                            </li>
                        </ul>

                        <h5>Thông tin người nhận</h5>
                        <address className="mb-3">
                            Nguyễn Văn Hoàng<br />
                            0912 345 678<br />
                            123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM
                        </address>

                        <h5>Phương thức thanh toán</h5>
                        <p>Thẻ tín dụng (VISA **** 4567)</p>

                        <h5>Tổng cộng</h5>
                        <ul className="list-group">
                            <li className="list-group-item d-flex justify-content-between"><span>Tạm tính</span><span>28.980.000 ₫</span></li>
                            <li className="list-group-item d-flex justify-content-between"><span>Phí vận chuyển</span><span>30.000 ₫</span></li>
                            <li className="list-group-item d-flex justify-content-between"><span>Giảm giá</span><span>-560.000 ₫</span></li>
                            <li className="list-group-item d-flex justify-content-between fw-bold"><span>Tổng cộng</span><span>28.450.000 ₫</span></li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Lịch sử đơn hàng */}
            {showHistory && (
                <div className="card">
                    <div className="card-header d-flex justify-content-between">
                        <strong>Lịch Sử Đơn Hàng</strong>
                        <button className="btn-close" onClick={() => setShowHistory(false)}></button>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between">
                            <div>
                                <strong>DH25062023</strong><br />
                                <small className="text-muted">07/06/2025</small>
                            </div>
                            <div className="text-end">
                                <span className="badge bg-success">Hoàn thành</span><br />
                                <strong>28.450.000 ₫</strong>
                            </div>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <div>
                                <strong>DH15052023</strong><br />
                                <small className="text-muted">15/05/2025</small>
                            </div>
                            <div className="text-end">
                                <span className="badge bg-success">Hoàn thành</span><br />
                                <strong>1.250.000 ₫</strong>
                            </div>
                        </li>
                        {/* Add more orders here */}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default OrderSuccess;
