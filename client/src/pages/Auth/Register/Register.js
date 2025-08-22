import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendOTP, registerWithOTP, clearOTPState } from '../../../redux/auth/authSlice';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEnvelope, FaLock, FaUser, FaKey } from 'react-icons/fa';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, otpSent } = useSelector(state => state.auth);
  const { accessToken, user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  useEffect(() => {
    // Khi chuyển sang bước OTP, nếu formData trống thì load từ localStorage
    const stored = localStorage.getItem('pendingRegister');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFormData(prev => ({
          ...prev,
          username: prev.username || parsed.username || '',
          email: prev.email || parsed.email || '',
          password: prev.password || parsed.password || ''
        }));
      } catch {}
    }
  }, []);

  if (accessToken && user) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Mật khẩu xác nhận không khớp' });
      return;
    }
    if (formData.password.length < 6) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return;
    }
    try {
      // Lưu lại thông tin để dùng ở bước OTP
      localStorage.setItem('pendingRegister', JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password
      }));
      
      await dispatch(sendOTP({ username: formData.username, email: formData.email })).unwrap();
      Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Mã OTP đã được gửi đến email của bạn' });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: error || 'Gửi OTP thất bại' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Vui lòng nhập mã OTP' });
      return;
    }
    
    // Đảm bảo luôn có đủ username/email/password từ localStorage nếu formData trống
    let { username, email, password } = formData;
    if (!username || !email || !password) {
      const stored = localStorage.getItem('pendingRegister');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          username = username || parsed.username;
          email = email || parsed.email;
          password = password || parsed.password;
        } catch {}
      }
    }

    // Debug: In ra console để kiểm tra dữ liệu
    console.log('Registration Data:', { username, email, password, otp: formData.otp });

    try {
      const result = await dispatch(registerWithOTP({
        username,
        email,
        password,
        otp: formData.otp
      })).unwrap();
      
      if (result) {
        // Dọn dữ liệu tạm
        localStorage.removeItem('pendingRegister');
        Swal.fire({ icon: 'success', title: 'Đăng ký thành công!', text: 'Chào mừng bạn đến với chúng tôi!' });
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          otp: ''
        });
        navigate('/', { replace: true });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: error || 'Đăng ký thất bại' });
    }
  };

  const handleResendOTP = async () => {
    // Lấy thông tin từ localStorage để gửi lại OTP
    let username = formData.username;
    let email = formData.email;
    
    if (!username || !email) {
      const stored = localStorage.getItem('pendingRegister');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          username = username || parsed.username;
          email = email || parsed.email;
        } catch {}
      }
    }

    try {
      await dispatch(sendOTP({ username, email })).unwrap();
      Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Mã OTP mới đã được gửi đến email của bạn' });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: error || 'Gửi OTP thất bại' });
    }
  };

  const handleBackToForm = () => {
    dispatch(clearOTPState());
    setFormData({ ...formData, otp: '' });
  };

  // Lấy thông tin hiển thị từ localStorage nếu cần
  const getDisplayInfo = () => {
    if (formData.username && formData.email) {
      return { username: formData.username, email: formData.email };
    }
    
    const stored = localStorage.getItem('pendingRegister');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { username: parsed.username, email: parsed.email };
      } catch {}
    }
    
    return { username: '', email: '' };
  };

  const displayInfo = getDisplayInfo();

  return (
    <div className="register-bg" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#fff'
    }}>
      <div className="container" style={{ maxWidth: 400 }}>
        <div className="row justify-content-center">
          <div className="col-12">
            <div
              className="card rounded-4 border-0"
              style={{ boxShadow: '0 4px 32px rgba(59,130,246,0.10)' }}
            >
              <div className="card-body p-4">
                <h4 className="card-title text-center mb-4 fw-bold mt-2">
                  {otpSent ? 'Xác thực OTP' : 'Đăng ký tài khoản'}
                </h4>

                {!otpSent ? (
                  <form onSubmit={handleSendOTP}>
                    <div className="mb-3">
                      <label className="form-label">Tên đăng nhập</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FaUser className="text-muted" />
                        </span>
                        <input
                          type="text"
                          name="username"
                          className="form-control border-start-0"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FaEnvelope className="text-muted" />
                        </span>
                        <input
                          type="email"
                          name="email"
                          className="form-control border-start-0"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Mật khẩu</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FaLock className="text-muted" />
                        </span>
                        <input
                          type="password"
                          name="password"
                          className="form-control border-start-0"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Xác nhận mật khẩu</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FaLock className="text-muted" />
                        </span>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="form-control border-start-0"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-info text-white w-100 fw-bold"
                      disabled={loading}
                      style={{ borderRadius: 10, height: 44, border: 'none' }}
                    >
                      {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister}>
                    <div className="text-center mb-4">
                      <div className="bg-light rounded-3 p-3 mb-3">
                        <small className="text-muted">Đăng ký cho tài khoản:</small>
                        <div className="fw-bold text-dark mb-1">{displayInfo.username}</div>
                        <small className="text-muted">Mã OTP đã được gửi đến:</small>
                        <div className="fw-bold text-dark">{displayInfo.email}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Mã OTP</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FaKey className="text-muted" />
                        </span>
                        <input
                          type="text"
                          name="otp"
                          className="form-control border-start-0 text-center fw-bold fs-4"
                          placeholder="000000"
                          value={formData.otp}
                          onChange={handleInputChange}
                          maxLength="6"
                          style={{ letterSpacing: '8px' }}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-info text-white w-100 fw-bold mb-3"
                      disabled={loading}
                      style={{ borderRadius: 10, height: 44, border: 'none' }}
                    >
                      {loading ? 'Đang xác thực...' : 'Xác thực & Đăng ký'}
                    </button>

                    <div className="d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={handleBackToForm}
                      >
                        Quay lại
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-info btn-sm"
                        onClick={handleResendOTP}
                        disabled={loading}
                      >
                        Gửi lại OTP
                      </button>
                    </div>
                  </form>
                )}

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="text-decoration-none fw-bold">
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}

export default Register;