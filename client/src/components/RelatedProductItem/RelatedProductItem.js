import React from 'react';
import { Link } from 'react-router-dom';

function RelatedProductItem({ product }) {
  if (!product) return null;
  const discountPercent = product.discountPercent || 0;
  const originalPrice = product.price || 0;
  const discountPrice = discountPercent > 0
    ? originalPrice - (originalPrice * discountPercent) / 100
    : originalPrice;
  return (
    <Link to={`/product/${product.slug || product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="d-flex align-items-center p-2 bg-white rounded-4 shadow-sm border border-1 hover-shadow" style={{ minHeight: 90, marginBottom: 8, borderColor: '#eee', transition: 'box-shadow 0.2s' }}>
        <div style={{ width: 75, height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', borderRadius: 8, overflow: 'hidden' }}>
          <img
            src={product.images && product.images[0] ? product.images[0] : '/default-product.jpg'}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <div className="ms-2 flex-grow-1">
          <div className="fw-bold" style={{ fontSize: 14, lineHeight: 1.3 }}>{product.name}</div>
          {product.configuration && (
            <div className="text-muted small mb-1" style={{ fontSize: 12 }}>{product.configuration}</div>
          )}
          <div className="d-flex align-items-center gap-2 mt-1">
            <span className="fw-bold" style={{ color: '#e91e63', fontSize: 15 }}>
              {discountPrice.toLocaleString('vi-VN')}đ
            </span>
            {discountPercent > 0 && (
              <>
                <span className="text-muted text-decoration-line-through" style={{ fontSize: 12 }}>
                  {originalPrice.toLocaleString('vi-VN')}đ
                </span>
                <span className="badge bg-light text-danger border border-1 border-danger" style={{ fontSize: 10, fontWeight: 500, background: '#fff0f3', padding: '2px 6px' }}>
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default RelatedProductItem; 