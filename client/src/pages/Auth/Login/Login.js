import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../redux/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEnvelope, FaLock } from 'react-icons/fa';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { token } = useSelector((state) => state.auth);
    // Lấy email và password đã nhớ (nếu có)
    const rememberedEmail = localStorage.getItem('rememberedEmail') || '';
    const rememberedPassword = localStorage.getItem('rememberedPassword') || '';
    const [email, setEmail] = useState(rememberedEmail);
    const [password, setPassword] = useState(rememberedPassword);
    const [rememberMe, setRememberMe] = useState(!!rememberedPassword);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await dispatch(login({ email, password })).unwrap();
            if (result) {
                const user = JSON.parse(localStorage.getItem("user"));
                // Nếu tick ghi nhớ thì lưu cả email và password, không thì chỉ lưu email
                localStorage.setItem('rememberedEmail', email);
                if (rememberMe) {
                    localStorage.setItem('rememberedPassword', password);
                } else {
                    localStorage.removeItem('rememberedPassword');
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công!',
                });
                if (user?.role === "admin") {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
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
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    return (
        <div className="login-bg" style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="login-card" style={{
                background: '#fff',
                borderRadius: 18,
                boxShadow: '0 4px 32px rgba(59,130,246,0.10)',
                padding: '40px 32px',
                maxWidth: 400,
                width: '100%',
                margin: '32px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h2 style={{ fontWeight: 700, color: '#3b82f6', marginBottom: 18, fontSize: 28 }}>Đăng nhập</h2>
                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                    <div className="mb-4" style={{ position: 'relative' }}>
                        <label htmlFor="email" className="form-label" style={{ fontWeight: 500 }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <FaEnvelope style={{ position: 'absolute', left: 14, top: 13, color: '#a0aec0', fontSize: 16 }} />
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    paddingLeft: 38,
                                    height: 44,
                                    borderRadius: 10,
                                    fontSize: 16,
                                    border: '1px solid #e5e7eb',
                                    background: '#f9fafb'
                                }}
                            />
                        </div>
                    </div>
                    <div className="mb-4" style={{ position: 'relative' }}>
                        <label htmlFor="password" className="form-label" style={{ fontWeight: 500 }}>Mật khẩu</label>
                        <div style={{ position: 'relative' }}>
                            <FaLock style={{ position: 'absolute', left: 14, top: 13, color: '#a0aec0', fontSize: 16 }} />
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    paddingLeft: 38,
                                    height: 44,
                                    borderRadius: 10,
                                    fontSize: 16,
                                    border: '1px solid #e5e7eb',
                                    background: '#f9fafb'
                                }}
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="remember_me" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                            <label className="form-check-label" htmlFor="remember_me">Ghi nhớ đăng nhập</label>
                        </div>
                        <Link to="/reset-password" style={{ color: '#3b82f6', fontWeight: 500, fontSize: 15 }}>Quên mật khẩu?</Link>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold btn-info text-white" style={{
                        border: 'none',
                        borderRadius: 10,
                        height: 44,
                        fontSize: 17,
                        marginBottom: 8
                    }}>Đăng nhập</button>
                </form>
                <div className="mt-3 text-center">
                    <span style={{ color: '#6b7280', fontSize: 15 }}>Chưa có tài khoản? </span>
                    <Link to="/register" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none', fontSize: 15 }}>Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
