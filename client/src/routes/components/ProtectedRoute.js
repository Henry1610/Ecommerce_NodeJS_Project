import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import useTokenManager from '../../hooks/useTokenManager';

const ProtectedRoute = ({ children, role }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);
  const { isInitialized, isRefreshing } = useTokenManager();

  // Nếu chưa khởi tạo xong, hiển thị loading
  if (!isInitialized || isRefreshing) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Nếu không có token hoặc user, redirect login
  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có role requirement và user không có role phù hợp
  if (role && (!user.role || user.role !== role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default ProtectedRoute;
