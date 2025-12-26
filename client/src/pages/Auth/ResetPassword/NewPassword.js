import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPasswordConfirm, clearResetState } from '../../../redux/auth/authSlice';
import { FaLock } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../auth.css';

const NewPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading, error, resetSuccess } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return;
    try {
      await dispatch(resetPasswordConfirm({ token, newPassword: password })).unwrap();
      toast.success('Đặt lại mật khẩu thành công!');
    } catch (error) {
      toast.error(error || 'Đặt lại mật khẩu thất bại!');
    }
  };

  React.useEffect(() => {
    if (resetSuccess) {
      setTimeout(() => {
        dispatch(clearResetState());
        navigate('/login');
      }, 2000);
    }
  }, [resetSuccess, dispatch, navigate]);

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Đặt lại mật khẩu mới</h2>
        
        {resetSuccess ? (
          <div className="auth-success-message">
            <div className="auth-success-title">Đặt lại mật khẩu thành công!</div>
            <div className="auth-success-subtitle">Đang chuyển về trang đăng nhập...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-medium">Mật khẩu mới</label>
              <div className="auth-input-wrapper">
                <FaLock className="auth-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control auth-input auth-input-password"
                  id="password"
                  placeholder="Nhập mật khẩu mới"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword((v) => !v)}
                  className="auth-eye-icon"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label fw-medium">Nhập lại mật khẩu</label>
              <div className="auth-input-wrapper">
                <FaLock className="auth-input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-control auth-input auth-input-password ${password && confirm && password !== confirm ? 'auth-input-error' : ''}`}
                  id="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="auth-eye-icon"
                  title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {password && confirm && password !== confirm && (
                <div className="auth-error-text">Mật khẩu không khớp</div>
              )}
            </div>

            {error && (
              <div className="auth-error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || password !== confirm || !password || !confirm}
              className="btn btn-info w-100 fw-bold text-white auth-btn mb-2"
            >
              {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
            </button>
          </form>
        )}

        <div className="mt-3 text-center">
          <Link to="/login" className="auth-link">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewPassword; 