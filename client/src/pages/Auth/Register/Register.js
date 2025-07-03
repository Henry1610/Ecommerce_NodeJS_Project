import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../../redux/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Mật khẩu xác nhận không khớp',
            });
            return;
        }
        try {
            const result = await dispatch(register({ email, password, username })).unwrap();
            if (result) {
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng ký thành công!',
                });
                navigate('/login');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: error || 'Đăng ký thất bại',
            });
        }
    };

    return (
        <div className="register-bg" style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="register-card" style={{
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
                <h2 style={{ fontWeight: 700, color: '#3b82f6', marginBottom: 18, fontSize: 28 }}>Đăng ký</h2>
                <form onSubmit={handleRegister} style={{ width: '100%' }}>
                    <div className="mb-4" style={{ position: 'relative' }}>
                        <label htmlFor="username" className="form-label" style={{ fontWeight: 500 }}>Họ và tên</label>
                        <div style={{ position: 'relative' }}>
                            <FaUser style={{ position: 'absolute', left: 14, top: 13, color: '#a0aec0', fontSize: 16 }} />
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Nhập họ và tên"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                    <div className="mb-4" style={{ position: 'relative' }}>
                        <label htmlFor="confirmPassword" className="form-label" style={{ fontWeight: 500 }}>Xác nhận mật khẩu</label>
                        <div style={{ position: 'relative' }}>
                            <FaLock style={{ position: 'absolute', left: 14, top: 13, color: '#a0aec0', fontSize: 16 }} />
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                    <button type="submit" className="btn btn-primary w-100 fw-bold" style={{
                        background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)',
                        border: 'none',
                        borderRadius: 10,
                        height: 44,
                        fontSize: 17,
                        marginBottom: 8
                    }}>Đăng ký</button>
                </form>
                <div className="mt-3 text-center">
                    <span style={{ color: '#6b7280', fontSize: 15 }}>Đã có tài khoản? </span>
                    <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none', fontSize: 15 }}>Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
