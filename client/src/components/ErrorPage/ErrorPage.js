import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ErrorPage.css'; // CSS bổ sung nhẹ nhàng (dưới)

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow p-5" style={{ maxWidth: '500px' }}>
        <h1 className="display-4 text-dark fw-bold text-center">404</h1>
        <h4 className="text-center mb-3">Không tìm thấy trang</h4>
        <p className="text-muted text-center">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
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

export default ErrorPage;
