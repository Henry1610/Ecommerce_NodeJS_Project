import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendOTP, registerWithOTP, clearOTPState } from '../../../redux/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEnvelope, FaLock, FaUser, FaKey } from 'react-icons/fa';

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, otpSent, otpEmail } = useSelector(state => state.auth);
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        otp: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Vui lòng điền đầy đủ thông tin',
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Mật khẩu xác nhận không khớp',
            });
            return;
        }

        if (formData.password.length < 6) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Mật khẩu phải có ít nhất 6 ký tự',
            });
            return;
        }

        try {
            await dispatch(sendOTP({ 
                username: formData.username, 
                email: formData.email 
            })).unwrap();
            
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Mã OTP đã được gửi đến email của bạn',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: error || 'Gửi OTP thất bại',
            });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!formData.otp) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Vui lòng nhập mã OTP',
            });
            return;
        }

        try {
            const result = await dispatch(registerWithOTP({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                otp: formData.otp
            })).unwrap();
            
            if (result) {
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng ký thành công!',
                    text: 'Chào mừng bạn đến với chúng tôi!',
                });
                navigate('/');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: error || 'Đăng ký thất bại',
            });
        }
    };

    const handleResendOTP = async () => {
        try {
            await dispatch(sendOTP({ 
                username: formData.username, 
                email: formData.email 
            })).unwrap();
            
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Mã OTP mới đã được gửi đến email của bạn',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: error || 'Gửi OTP thất bại',
            });
        }
    };

    const handleBackToForm = () => {
        dispatch(clearOTPState());
        setFormData({
            ...formData,
            otp: ''
        });
    };

    return (
        <div className="register-bg" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold text-dark mb-2">
                                        {otpSent ? 'Xác thực OTP' : 'Đăng ký tài khoản'}
                                    </h2>
                                    <p className="text-muted">
                                        {otpSent 
                                            ? 'Nhập mã OTP đã được gửi đến email của bạn'
                                            : 'Tạo tài khoản mới để bắt đầu mua sắm'
                                        }
                                    </p>
                                </div>

                                {!otpSent ? (
                                    // Form đăng ký
                                    <form onSubmit={handleSendOTP}>
                                        <div className="mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0">
                                                    <FaUser className="text-muted" />
                                                </span>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    className="form-control border-start-0"
                                                    placeholder="Tên đăng nhập"
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0">
                                                    <FaEnvelope className="text-muted" />
                                                </span>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control border-start-0"
                                                    placeholder="Email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0">
                                                    <FaLock className="text-muted" />
                                                </span>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className="form-control border-start-0"
                                                    placeholder="Mật khẩu"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0">
                                                    <FaLock className="text-muted" />
                                                </span>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    className="form-control border-start-0"
                                                    placeholder="Xác nhận mật khẩu"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-info text-white w-100 py-2 fw-bold"
                                            disabled={loading}
                                        >
                                            {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
                                        </button>
                                    </form>
                                ) : (
                                    // Form xác thực OTP
                                    <form onSubmit={handleRegister}>
                                        <div className="text-center mb-4">
                                            <div className="bg-light rounded-3 p-3 mb-3">
                                                <small className="text-muted">
                                                    Mã OTP đã được gửi đến:
                                                </small>
                                                <div className="fw-bold text-dark">
                                                    {otpEmail}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
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
                                            className="btn btn-info text-white w-100 py-2 fw-bold mb-3"
                                            disabled={loading}
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
