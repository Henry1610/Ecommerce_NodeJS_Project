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
    <div className="container my-5" style={{ maxWidth: '400px' }}>
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
                  className="form-control rounded-3 focus-ring-info"
                  style={{
                    boxShadow: 'none',
                    outline: 'none',
                  }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

           

              <button
                type="submit"
                disabled={loading}
                className="btn btn-info w-100 fw-semibold rounded-3 border-0 shadow-sm focus-ring-0 text-white"
                style={{
                  outline: 'none',
                  boxShadow: 'none',
                }}
              >
                {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
