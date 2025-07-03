import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../../../redux/admin/orderSlice';
import formatDateTime from '../../../../untils/dateUtils';
import { Link } from 'react-router-dom';
import { FaUndo, FaBox, FaUser, FaMoneyBillWave, FaCreditCard, FaClock, FaEye } from 'react-icons/fa';

const RefundOrder = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const { orders } = useSelector((state) => state.admin.adminOrder);

  const refundRequestedOrders = orders.filter(
    (order) => order.payment?.refundStatus === 'requested'
  );

  const getRefundBadgeStyle = (status) => {
    switch (status) {
      case 'requested':
        return { background: '#fef3c7', color: '#d97706' }; // Vàng
      case 'approved':
        return { background: '#dcfce7', color: '#16a34a' }; // Xanh lá
      case 'rejected':
        return { background: '#fee2e2', color: '#dc2626' }; // Đỏ
      default:
        return { background: '#f3f4f6', color: '#374151' }; // Xám
    }
  };

  const getPaymentBadgeStyle = (isPaid) => {
    return isPaid 
      ? { background: '#dcfce7', color: '#16a34a' }  // Xanh lá
      : { background: '#fee2e2', color: '#dc2626' }; // Đỏ
  };

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
        background: "#fff",
        borderRadius: 16,
        padding: 28,
        marginBottom: 28,
        boxShadow: "0 2px 12px rgba(59,130,246,0.08)"
      }}>
        <h2 style={{ 
          fontWeight: 700, 
          marginBottom: 24, 
          color: "#f59e42", 
          fontSize: 24,
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          <FaUndo size={28} />
          Yêu cầu hủy đơn hàng
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse", 
            minWidth: 900, 
            fontSize: 14 
          }}>
            <thead>
              <tr style={{ background: "#f3f6fa" }}>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, fontSize: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <FaBox size={14} />
                    Mã đơn
                  </div>
                </th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, fontSize: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <FaUser size={14} />
                    Khách hàng
                  </div>
                </th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, fontSize: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <FaMoneyBillWave size={14} />
                    Tổng tiền
                  </div>
                </th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, fontSize: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <FaCreditCard size={14} />
                    Thanh toán
                  </div>
                </th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, fontSize: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <FaUndo size={14} />
                    Hoàn tiền
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
              {refundRequestedOrders.map((order) => (
                <tr key={order._id} style={{
                  borderBottom: "1px solid #eee",
                  transition: "background 0.2s",
                  cursor: "pointer"
                }}
                  onMouseOver={e => e.currentTarget.style.background = "#f6f8fa"}
                  onMouseOut={e => e.currentTarget.style.background = ""}
                >
                  <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#3b82f6" }}>
                    #{order.orderNumber}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: 500 }}>
                    {order.shippingAddress?.fullName || 'Không xác định'}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#10b981" }}>
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
                        minWidth: 100,
                        ...getPaymentBadgeStyle(order.payment?.paymentStatus)
                      }}
                    >
                      {order.payment?.paymentStatus ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </td>

                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        display: "inline-block",
                        minWidth: 120,
                        ...getRefundBadgeStyle(order.payment?.refundStatus)
                      }}
                    >
                      {order.payment?.refundStatus === 'requested'
                        ? 'Yêu cầu hoàn tiền'
                        : order.payment?.refundStatus === 'refunded'
                        ? 'Đã chấp nhận'
                        : order.payment?.refundStatus === 'rejected'
                        ? 'Đã từ chối'
                        : 'Không'}
                    </span>
                  </td>

                  <td style={{ padding: "12px 16px", textAlign: "center", color: "#6b7280" }}>
                    {formatDateTime(order.createdAt)}
                  </td>

                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <Link
                      to={`/admin/order/${order.orderNumber}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 16px",
                        background: "#3b82f6",
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
              {refundRequestedOrders.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ 
                    padding: "40px 16px", 
                    textAlign: "center", 
                    color: "#6b7280",
                    fontSize: 16,
                    fontStyle: "italic"
                  }}>
                    Không có yêu cầu hoàn tiền nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RefundOrder;
