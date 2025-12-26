import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../redux/auth/authSlice';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../auth.css';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { accessToken, user } = useSelector((state) => state.auth);
    // Lấy email đã nhớ (nếu có) - không lưu password nữa
    const rememberedEmail = localStorage.getItem('rememberedEmail') || '';
    const [email, setEmail] = useState(rememberedEmail);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await dispatch(login({ email, password, rememberMe: false })).unwrap();
            if (result) {
                // Lưu email
                localStorage.setItem('rememberedEmail', email);
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công!',
                });
                if (result.user?.role === "admin") {
                    navigate('/admin/dashboard', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: error || 'Đăng nhập thất bại',
                confirmButtonText: 'Thử lại'
            });
        }
    };

    useEffect(() => {
        if (accessToken && user) {
            if (user.role === "admin") {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [accessToken, user, navigate]);

    if (accessToken && user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Đăng nhập</h2>
                <form onSubmit={handleLogin} className="auth-form">
                    <div className="mb-4">
                        <label htmlFor="email" className="form-label fw-medium">Email</label>
                        <div className="auth-input-wrapper">
                            <FaEnvelope className="auth-input-icon" />
                            <input
                                type="email"
                                className="form-control auth-input"
                                id="email"
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label fw-medium">Mật khẩu</label>
                        <div className="auth-input-wrapper">
                            <FaLock className="auth-input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control auth-input auth-input-password"
                                id="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                    <div className="d-flex justify-content-end mb-3">
                        <Link to="/reset-password" className="fw-medium small" style={{ fontSize: 13 }}>Quên mật khẩu?</Link>
                    </div>
                    <button type="submit" className="btn btn-info w-100 fw-bold text-white auth-btn mb-2">
                        Đăng nhập
                    </button>
                </form>
                <div className="mt-3 text-center">
                    <span className="auth-text-muted">Chưa có tài khoản? </span>
                    <Link to="/register" className="auth-link">Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
