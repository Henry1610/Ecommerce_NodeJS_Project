import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../../redux/auth/authSlice';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { loading, error, resetSuccess } = useSelector(state => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ email }));
    setSubmitted(true);
  };

  return (
    <div className="reset-password-container" style={{ maxWidth: 400, margin: '40px auto', padding: 24, borderRadius: 12, boxShadow: '0 2px 16px #e0e7ef' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Quên mật khẩu</h2>
      {resetSuccess && submitted ? (
        <div style={{ color: 'green', textAlign: 'center' }}>Vui lòng kiểm tra email để đặt lại mật khẩu.</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, borderRadius: 6, background: '#3b82f6', color: '#fff', fontWeight: 600 }}>
            {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
