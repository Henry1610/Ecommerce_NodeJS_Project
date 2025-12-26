import React, { useEffect, useState } from 'react';
import './OrderList.css';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../../../../redux/admin/orderSlice';
import { useDispatch, useSelector } from 'react-redux';
import formatDateTime from '../../../../untils/dateUtils'
import { FaEye, FaBox, FaUser, FaMoneyBillWave, FaClock, FaCog } from 'react-icons/fa';

const OrderList = () => {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);
  const { orders } = useSelector(state => state.admin.adminOrder)
  
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'pending':
        return { background: '#f3f4f6', color: '#374151' }; // Xám
      case 'processing':
        return { background: '#dbeafe', color: '#1d4ed8' }; // Xanh dương
      case 'shipped':
        return { background: '#e0f2fe', color: '#0369a1' }; // Xanh lơ
      case 'delivered':
        return { background: '#dcfce7', color: '#16a34a' }; // Xanh lá
      case 'cancel_requested':
        return { background: '#fef3c7', color: '#d97706' }; // Vàng
      case 'cancelled':
        return { background: '#fee2e2', color: '#dc2626' }; // Đỏ
      case 'cancel_rejected':
        return { background: '#f3f4f6', color: '#1f2937' }; // Đen
      default:
        return { background: '#f9fafb', color: '#374151' }; // Trạng thái không xác định
    }
  };

  const filteredOrders = orders.filter(order =>
    (order.orderNumber + '').toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
    (order.shippingAddress?.fullName || '').toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div style={{
      maxWidth: 1200,
      margin: "0 auto",
      fontFamily: "Inter, Arial, sans-serif"
    }}>
      {/* Header */}
      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark mb-2">Quản lý đơn hàng</h1>
        <p className="text-muted mb-0">Danh sách và quản lý tất cả đơn hàng trong hệ thống</p>
      </div>

      {/* Search Bar */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-body p-2">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-5">
              <div className="position-relative">
                <i className="fas fa-search position-absolute top-50 translate-middle-y ms-3 text-muted"></i>
                <input
                  type="text"
                  className="form-control form-control-md ps-5 border-2"
                  placeholder="Tìm kiếm theo mã đơn hoặc tên khách..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ borderRadius: '10px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div className="card-body">

          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead style={{ background: '#f3f6fa', borderBottom: '2px solid #e0e7ef' }}>
                <tr>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, border: 'none' }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <FaBox size={14} />
                      Mã đơn
                    </div>
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, border: 'none' }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <FaUser size={14} />
                      Khách hàng
                    </div>
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, border: 'none' }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                      <FaMoneyBillWave size={14} />
                      Tổng tiền
                    </div>
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, border: 'none' }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                      <FaCog size={14} />
                      Trạng thái
                    </div>
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, border: 'none' }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                      <FaClock size={14} />
                      Ngày tạo
                    </div>
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, border: 'none' }}>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover-bg-light" style={{
                    borderBottom: "1px solid #e5e7eb",
                    transition: "background 0.2s",
                    cursor: "pointer"
                  }}>
                    <td className='fw-bold' style={{ padding: "12px 16px", fontWeight: 600, border: 'none' }}>
                      #{order.orderNumber}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 500, border: 'none' }}>
                      {order.shippingAddress?.fullName || "N/A"}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#10b981", border: 'none' }}>
                      {order.totalPrice?.toLocaleString()}₫
                    </td>
                    
                    <td style={{ padding: "12px 16px", textAlign: "center", border: 'none' }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        display: "inline-block",
                        minWidth: 80,
                        ...getStatusBadgeStyle(order.status)
                      }}
                    >
                      {order.status}
                    </span>
                  </td>

                    <td style={{ padding: "12px 16px", textAlign: "center", color: "#6b7280", border: 'none' }}>
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center", border: 'none' }}>
                      <Link
                        className='btn btn-info btn-sm'
                        to={`${order.orderNumber}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          color: "#fff",
                          textDecoration: "none",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600
                        }}
                      >
                        <FaEye size={12} />
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style>{`
        .hover-bg-light:hover {
          background-color: #f8fafc !important;
        }
      `}</style>
    </div>
  );
};

export default OrderList;
