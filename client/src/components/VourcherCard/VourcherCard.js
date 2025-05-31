import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const VoucherCard = ({ discount, selected, onSelect }) => {


  // Tính số ngày còn lại
  const handleChange = () => {
    onSelect(discount);
  };
  return (
    <div className="mx-auto py-2" style={{ maxWidth: '420px' }}>
      <div className="d-flex bg-white rounded-4 shadow-sm position-relative overflow-hidden border" style={{ height: '100px' }}>
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
      </div>
    </div>
  );
};


export default VoucherCard;
