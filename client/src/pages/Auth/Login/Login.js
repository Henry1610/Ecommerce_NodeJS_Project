import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../redux/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { token } = useSelector((state) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await dispatch(login({ email, password })).unwrap();
            if (result) {
                const user = JSON.parse(localStorage.getItem("user"));
                
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
        <div className="container mt-2">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Login</li>
                </ol>
            </nav>

            <div className="row justify-content-center mb-4">
                <div className="col-md-6">
                    <div className="card ">
                        <div className="card-body">
                            <h4 className="card-title mb-4 text-center">Login</h4>
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3 form-check">
                                    <input type="checkbox" className="form-check-input" id="remember_me" />
                                    <label className="form-check-label" htmlFor="remember_me">Remember me</label>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <a href="#">Forgot password?</a>
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-warning fw-bold ">Login</button>
                                </div>
                            </form>
                            <div className="mt-3 text-center">
                                <p>Don't have an account? <Link to="/register" >Register here</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
