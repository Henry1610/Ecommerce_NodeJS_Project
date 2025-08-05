import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const VoucherCard = ({ discount, selected, onSelect }) => {

  // Tính số ngày còn lại
  const handleChange = () => {
    onSelect(discount);
  };

  // Hiển thị điều kiện
  const renderConditions = () => {
    const conditions = [];
    const cond = discount.conditions || {};

    if (cond.minimumOrderValue > 0) {
      conditions.push(`Đơn hàng tối thiểu ${cond.minimumOrderValue.toLocaleString()}đ`);
    }

    if (cond.minimumQuantity > 1) {
      conditions.push(`Tối thiểu ${cond.minimumQuantity} sản phẩm`);
    }

    if (cond.applicableCategories && cond.applicableCategories.length > 0) {
      conditions.push('Áp dụng cho một số danh mục');
    }

    if (cond.applicableBrands && cond.applicableBrands.length > 0) {
      conditions.push('Áp dụng cho một số thương hiệu');
    }

    if (cond.maxUsagePerUser > 1) {
      conditions.push(`Sử dụng tối đa ${cond.maxUsagePerUser} lần`);
    }

    return conditions;
  };

  const conditions = renderConditions();

  return (
    <div className="mx-auto py-2" style={{ maxWidth: '420px' }}>
      <div className="d-flex bg-white rounded-4 shadow-sm position-relative overflow-hidden border voucher-container" style={{ minHeight: '120px' }}>
        {/* Bên trái - Mã giảm */}
        <div
          className="d-flex flex-column justify-content-center text-white px-3 py-2 text-center"
          style={{
            width: '100px',
            backgroundColor: '#8dc9c7',
            borderRight: '2px dashed white',
          }}
        >
          <span className="fw-bold fst-italic fs-6 lh-1">{discount.discountPercent}%</span>
          <span className="fw-bold fst-italic fs-6 lh-1">OFF</span>
          <small className="fw-semibold mt-1 lh-sm">{discount.code}</small>
          
        </div>

        {/* Nội dung giữa */}
        <div className="flex-grow-1 p-2 ms-2">
          <p className="fw-semibold mb-1 text-dark" style={{ fontSize: '16px' }}>{discount.description}</p>
          <p className="text-muted mb-1 lh-sm" style={{ fontSize: '0.85rem' }}>
            HSD: {new Date(discount.validTo).toLocaleDateString()}
          </p>
          
          <p className="text-muted mb-1 lh-sm" style={{ fontSize: '0.85rem' }}>
            Giảm tối đa: {discount.maxDiscount?.toLocaleString() || 0}đ
          </p>

          {/* Hiển thị điều kiện */}
          {/* Đã chuyển icon info lên góc trên trái, không cần hiện ở đây nữa */}

        </div>

        {/* Badge số lượng */}
        <div
          className="position-absolute top-0 end-0 mt-2 me-2 px-2 rounded-pill fw-semibold text-xs"
          style={{
            backgroundColor: '#ffe6e6',
            color: '#ff4d4f',
            fontSize: '0.75rem',
          }}
        >
          x{discount.quantity}
        </div>

        {/* Radio chọn */}
        <div className="d-flex align-items-center px-3">
          <input type="radio" className="form-check-input border border-secondary" checked={selected} onChange={handleChange}
          />
        </div>

        {/* Icon info ở góc dưới phải */}
        {conditions.length > 0 && (
          <div style={{ position: 'absolute', bottom: 8, right: 8, zIndex: 20 }}>
            <span
              className="info-icon"
              tabIndex={0}
              style={{
                display: 'inline-block',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#e0e0e0',
                color: '#333',
                textAlign: 'center',
                lineHeight: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
                position: 'relative',
              }}
            >
              i
              <div className="tooltip-custom" style={{
                visibility: 'hidden',
                opacity: 0,
                width: 'max-content',
                minWidth: '250px',
                maxWidth: '300px',
                background: '#333',
                color: '#fff',
                textAlign: 'left',
                borderRadius: '6px',
                padding: '12px',
                position: 'absolute',
                zIndex: 10,
                left: '-20px',
                bottom: '120%',
                transform: 'translateX(-100%)',
                transition: 'opacity 0.2s',
                fontSize: '0.85rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                wordWrap: 'break-word'
              }}>
                <div className="fw-bold mb-1" style={{fontSize: '0.9rem'}}>Điều kiện áp dụng:</div>
                <ul style={{margin: 0, paddingLeft: '18px'}}>
                  {conditions.map((condition, idx) => (
                    <li key={idx}>{condition}</li>
                  ))}
                </ul>
              </div>
            </span>
            <style>{`
              .info-icon:hover .tooltip-custom, .info-icon:focus .tooltip-custom {
                visibility: visible !important;
                opacity: 1 !important;
              }
              .info-icon:hover ~ .voucher-container, .info-icon:focus ~ .voucher-container {
                overflow: visible !important;
              }
              .voucher-container:hover {
                overflow: visible !important;
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherCard;
