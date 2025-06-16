import React, { useEffect } from 'react';
import {fetchMyOrders} from '../../../../redux/user/orderSlice'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import formatDateTime from '../../../../untils/dateUtils'
const OrderSuccess = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.user.userOrder);
  
      
    useEffect(() => {

        dispatch(fetchMyOrders());
    }, [dispatch]);
    if (loading) return <p>Đang tải đơn hàng...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  const latestOrder = orders[0];
    return (

        <div className="container py-5 border-top">
            {/* Thông báo thành công */}
            <div className="text-center mb-5">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                    style={{
                        backgroundColor: '#d1e7dd',
                        width: '100px',
                        height: '100px'
                    }}>
                    <i className="fa-solid fa-check text-success" style={{ fontSize: '40px' }}></i>
                </div>

                <h2 className="fw-bold mb-3">Đặt Hàng Thành Công!</h2>
                <p className="text-muted mb-4 fs-5">Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn đang được xử lý.</p>

                <div className="bg-light p-4 rounded shadow-sm d-inline-block text-start">
                    <h4 className="fw-bold mb-3 text-info">Tổng Thanh Toán: {latestOrder?.totalPrice.toLocaleString()} ₫</h4>
                    <p className="mb-2 text-secondary">Mã đơn hàng: <strong>{latestOrder?.orderNumber}</strong></p>
                    <p className="mb-0 text-secondary">Ngày đặt hàng: <strong>{formatDateTime(latestOrder?.createdAt)}</strong></p>
                </div>
            </div>

            {/* Nút điều hướng */}
            <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to={`/order-detail/${orders[0]?.orderNumber}`} className="btn btn-outline-info px-4 py-2 fw-bold shadow">
                    <i className="ri-file-list-line me-2"></i> Xem Chi Tiết Đơn Hàng
                </Link>

                <Link to='/order-history'  className="btn btn-outline-info px-4 py-2 fw-bold shadow">
                    <i className="ri-history-line me-2"></i> Xem Lịch Sử Đơn Hàng
                </Link>
                <Link to='/'  className="btn btn-outline-info px-4 py-2 fw-bold shadow">
                    <i className="ri-history-line me-2"></i> Trở về trang chủ
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
