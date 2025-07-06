import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPasswordConfirm, clearResetState } from '../../../redux/auth/authSlice';

const NewPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { loading, error, resetSuccess } = useSelector(state => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) return;
    dispatch(resetPasswordConfirm({ token, newPassword: password }));
  };

  React.useEffect(() => {
    if (resetSuccess) {
      setTimeout(() => {
        dispatch(clearResetState());
        navigate('/login');
      }, 2000);
    }
  }, [resetSuccess, dispatch, navigate]);

  return (
    <div className="reset-password-container" style={{ maxWidth: 400, margin: '40px auto', padding: 24, borderRadius: 12, boxShadow: '0 2px 16px #e0e7ef' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Đặt lại mật khẩu mới</h2>
      {resetSuccess ? (
        <div style={{ color: 'green', textAlign: 'center' }}>Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label>Mật khẩu mới</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Nhập lại mật khẩu</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
            {password && confirm && password !== confirm && <div style={{ color: 'red' }}>Mật khẩu không khớp</div>}
          </div>
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <button type="submit" disabled={loading || password !== confirm} style={{ width: '100%', padding: 10, borderRadius: 6, background: '#3b82f6', color: '#fff', fontWeight: 600 }}>
            {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
          </button>
        </form>
      )}
    </div>
  );
};

export default NewPassword; 