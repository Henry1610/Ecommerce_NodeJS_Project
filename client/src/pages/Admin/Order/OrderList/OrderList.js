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
      margin: "40px auto",
      fontFamily: "Inter, Arial, sans-serif",
      background: "#f6f8fa",
      minHeight: "100vh",
      padding: "32px 32px"
    }}>
      <div style={{
        borderRadius: 16,
        padding: 28,
        marginBottom: 28,
        boxShadow: "0 2px 12px rgba(59,130,246,0.08)"
      }}>
        <h2  style={{ 
          fontWeight: 700, 
          marginBottom: 24, 
          fontSize: 24,
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          <FaBox size={28} />
          Danh sách đơn hàng
        </h2>
        <div className="row mb-3">
          <div className="col-lg-4 col-md-6 col-12">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm theo mã đơn hoặc tên khách..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-searchset btn-info" type="button">
                <i className="fas fa-search text-white"></i>
              </button>
            </div>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse", 
            minWidth: 800, 
            fontSize: 14 
          }}>
            <thead>
              <tr style={{ background: "#f3f6fa" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FaBox size={14} />
                    Mã đơn
                  </div>
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FaUser size={14} />
                    Khách hàng
                  </div>
                </th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, fontSize: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                    <FaMoneyBillWave size={14} />
                    Tổng tiền
                  </div>
                </th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, fontSize: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <FaCog size={14} />
                    Trạng thái
                  </div>
                </th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, fontSize: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <FaClock size={14} />
                    Ngày tạo
                  </div>
                </th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, fontSize: 14 }}>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} style={{
                  borderBottom: "1px solid #eee",
                  transition: "background 0.2s",
                  cursor: "pointer"
                }}
                  onMouseOver={e => e.currentTarget.style.background = "#f6f8fa"}
                  onMouseOut={e => e.currentTarget.style.background = ""}
                >
                  <td className='fw-bold' style={{ padding: "12px 16px", fontWeight: 60 }}>
                    #{order.orderNumber}
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 500 }}>
                    {order.shippingAddress?.fullName || "N/A"}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#10b981" }}>
                    {order.totalPrice?.toLocaleString()}₫
                  </td>
                  
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
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

                  <td style={{ padding: "12px 16px", textAlign: "center", color: "#6b7280" }}>
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <Link
                    className='bg-info'
                      to={`${order.orderNumber}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 16px",
                        color: "#fff",
                        textDecoration: "none",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        transition: "all 0.2s",
                        border: "none",
                        cursor: "pointer"
                      }}
                      onMouseOver={e => e.target.style.background = "#2563eb"}
                      onMouseOut={e => e.target.style.background = "#3b82f6"}
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
  );
};

export default OrderList;
