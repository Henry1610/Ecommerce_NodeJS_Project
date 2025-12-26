import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../../redux/auth/authSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import '../auth.css';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { loading, resetSuccess } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await dispatch(resetPassword({ email })).unwrap();
      toast.success('Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.');
    } catch (error) {
      toast.error(error || 'Gửi email thất bại!');
      setSubmitted(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="container" style={{ maxWidth: '400px' }}>
        <div className="card shadow-sm rounded-4">
          <div className="card-body p-4">
            <h4 className="card-title text-center mb-4 fw-bold">Quên mật khẩu</h4>

            {resetSuccess && submitted ? (
              <div className="alert alert-success text-center">
                Vui lòng kiểm tra email để đặt lại mật khẩu.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control rounded-3"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-info w-100 fw-semibold rounded-3 border-0 text-white auth-btn mb-3"
                >
                  {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
                </button>
              </form>
            )}

            <div className=" text-center">
              <span className="auth-text-muted">Nhớ mật khẩu? </span>
              <Link to="/login" className="auth-link">Đăng nhập</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
