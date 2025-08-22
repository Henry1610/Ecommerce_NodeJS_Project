import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCompare, clearCompare } from '../../../redux/public/compareSlice';
import { Link } from 'react-router-dom';
import './ComparePage.css';
const ComparePage = () => {
  const compareList = useSelector(state => state.public.compare.compareList);
  const dispatch = useDispatch();

  const fontStyle = {
    fontFamily: 'Inter, Roboto, Segoe UI, Arial, sans-serif',
    fontSize: 16,
    color: '#222',
  };

  if (compareList.length < 2) {
    return (
      <div className="container py-5 text-center border-top" style={fontStyle}>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Trang chủ</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">So sánh sản phẩm</li>
        </ol>
        <h2 className="fw-bold mb-3">So sánh sản phẩm</h2>
        <p className="text-muted mb-4">Hãy chọn đủ 2 sản phẩm để so sánh!</p>
        <Link to="/product" className="btn btn-info text-white">
          Quay lại trang sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5 border-top" style={fontStyle}>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/" className="text-decoration-none">Trang chủ</Link>
        </li>
        <li className="breadcrumb-item active" aria-current="page">So sánh sản phẩm</li>
      </ol>
      <h2 className="fw-bold mb-5 text-center" style={{ fontSize: 28 }}>So sánh sản phẩm</h2>
      <div className="table-responsive shadow-sm rounded-4 overflow-hidden">
        <table className="table align-middle text-center mb-0 compare-table"   style={{ background: '#fff', tableLayout: 'fixed', width: '100%' }}
        >
          <thead style={{ background: '#f1f5f9' }}>
            <tr>
            <th className="d-none d-md-table-cell" style={{ width: 200 }}></th>
            {compareList.map((product, idx) => (
                <th key={product._id} style={{ minWidth: 220 }} className="border-start ">
                  <div className="d-flex flex-column align-items-center gap-2 py-3">
                    <img
                      src={product.images?.[0] || '/placeholder-image.jpg'}
                      alt={product.name}
                      className="compare-product-img"
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: 'contain',
                        background: '#f9fafb',
                        borderRadius: '1rem',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                      }}
                    />

                    <div className="fw-semibold text-dark" style={{ fontSize: 17 }}>{product.name}</div>
                    <button
                      className="btn btn-sm btn-outline-danger px-3"
                      onClick={() => dispatch(removeFromCompare(product._id))}
                    >
                      <i className="fas fa-times me-1"></i> Bỏ so sánh
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Giá', render: p => (<span className="fw-bold text-danger">{p.price?.toLocaleString('vi-VN')}₫</span>) },
              {
                label: 'Thương hiệu', render: p => (
                  <>
                    {p.brand?.logo && <img src={p.brand.logo} alt={p.brand.name} style={{ width: 32, height: 32, objectFit: 'contain', marginBottom: 4 }} />}
                    <div>{p.brand?.name}</div>
                  </>
                )
              },
              {
                label: 'Kho hàng', render: p => (
                  p.stock > 0
                    ? <span className="badge bg-success">Còn hàng</span>
                    : <span className="badge bg-danger">Hết hàng</span>
                )
              },
              {
                label: 'Khuyến mãi', render: p => (
                  p.discountPercent > 0
                    ? <span className="badge bg-warning text-dark">-{p.discountPercent}%</span>
                    : <span className="text-muted">Không</span>
                )
              },
              {
                label: 'Mô tả', render: p => (
                  <span style={{ fontSize: 14, color: '#555' }}>
                    {p.description || <span className="text-muted">Không có</span>}
                  </span>
                )
              },
              {
                label: 'Thuộc tính', render: p => (
                  p.attributes && Object.keys(p.attributes).length > 0 ? (
                    <div className="text-start px-2">
                      {Object.entries(p.attributes).map(([key, val]) => (
                        <div key={key} style={{ lineHeight: 1.7 }}>
                          <strong>{key}:</strong>{' '}
                          <span className="text-muted small" style={{ color: '#6c757d' }}>{val}</span>
                        </div>
                      ))}

                    </div>
                  ) : <span className="text-muted">Không có</span>
                )
              },
            ].map((row, rowIdx) => (
              <tr key={row.label}>
                <th className="bg-light text-start px-3 py-3 d-none d-md-table-cell">{row.label}</th>
                {compareList.map((product, idx) => (
                  <td key={product._id} className="border-start px-3 py-3">
                    {row.render(product)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-outline-secondary me-2"
          onClick={() => dispatch(clearCompare())}
        >
          <i className="fas fa-trash me-1"></i> Xóa tất cả
        </button>
        <Link to="/product" className="btn btn-info text-white">
          <i className="fas fa-arrow-left me-1"></i> Quay lại trang sản phẩm
        </Link>
      </div>
    </div>
  );
};

export default ComparePage;
