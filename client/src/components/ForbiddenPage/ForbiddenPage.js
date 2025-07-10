import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ForbiddenPage = () => {
  const navigate = useNavigate();
  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow p-5" style={{ maxWidth: '500px' }}>
        <h1 className="display-4 text-dark fw-bold text-center">403</h1>
        <h4 className="text-center mb-3">Không đủ quyền truy cập</h4>
        <p className="text-muted text-center">
          Bạn không có quyền truy cập vào trang này.<br/>Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là nhầm lẫn.
        </p>
        <div className="d-grid">
          <button
            className="btn btn-info text-white"
            onClick={() => navigate('/')}
          >
            ⬅ Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage; 