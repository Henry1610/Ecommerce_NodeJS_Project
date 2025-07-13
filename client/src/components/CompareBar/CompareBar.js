import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCompare } from '../../redux/public/compareSlice';
import { useNavigate } from 'react-router-dom';

const CompareBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { compareList, enabled } = useSelector(state => state.public.compare);

  if (!enabled || !compareList || compareList.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1050,
      background: '#fff',
      boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      minHeight: 72,
      maxWidth: 900,
      margin: '0 auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        {compareList.map(product => (
          <div key={product._id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8f9fa', borderRadius: 8, padding: '4px 12px' }}>
            <img src={product.images?.[0] || '/assets/logo/Logo.png'} alt={product.name} style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 6, border: '1px solid #eee', background: '#fff', padding: 4 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{product.name}</div>
              {product.brand && <div style={{ fontSize: 12, color: '#888' }}>{product.brand.name || product.brand}</div>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="btn btn-outline-secondary rounded-pill px-3 fw-semibold"
          onClick={() => dispatch(clearCompare())}
        >
          Xóa tất cả
        </button>
        <button
          className="btn btn-info rounded-pill px-4 fw-bold text-white"
          onClick={() => navigate('/compare')}
        >
          So sánh <i className="fas fa-arrow-right ms-2"></i>
        </button>
      </div>
    </div>
  );
};

export default CompareBar; 