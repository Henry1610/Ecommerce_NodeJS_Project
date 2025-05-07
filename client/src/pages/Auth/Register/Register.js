import { Link } from 'react-router-dom';
import React, { useState,useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../../redux/auth/authSlice';
import Swal from 'sweetalert2';

function Register() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Thêm confirmPassword
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, loading, error } = useSelector((state) => state.auth);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Mật khẩu xác nhận không khớp',
            confirmButtonText: 'Thử lại'
          });
          return;
        }
        try {
            const result = await dispatch(register({ username, email, password })).unwrap();
            if (result) {
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng ký thành công!',
                    
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/login');
                    }
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: error || 'Đăng ký thất bại',
                confirmButtonText: 'Thử lại'
            });
        }
    };
      
        return (
            <div>
                <div class="breadcrumb-area">
                    <div className="container ">
                        <div class="breadcrumb-content">
                            <ul>
                                <li><a href="index.html">Home</a></li>
                                <li class="active"> Register</li>
                            </ul>
                        </div>
                    </div>


                </div>
                <div class="page-section mb-60">
                    <div class="container">
                        <div class="row">

                            <div class="col-sm-12 col-md-12 col-lg-6 col-xs-12">
                                <form onSubmit={handleRegister}>
                                    <div class="login-form">
                                        <h4 class="login-title">Register</h4>
                                        <div class="row">
                                            <div class="col-md-6 col-12 mb-20">
                                                <label>Your Name</label>
                                                <input class="mb-0" type="text" placeholder="Your Name" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                                            </div>

                                            <div class="col-md-12 mb-20">
                                                <label>Email Address*</label>
                                                <input class="mb-0" type="email" placeholder="Email Address" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                                            </div>
                                            <div class="col-md-6 mb-20">
                                                <label>Password</label>
                                                <input class="mb-0" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                                            </div>
                                            <div class="col-md-6 mb-20">
                                                <label>Confirm Password</label>
                                                <input className="mb-0" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />                                            </div>
                                            <div className="d-flex justify-content-between w-100">
                                                <div className="d-flex justify-content-start">
                                                    <button className="register-button mt-0">Register</button>
                                                </div>
                                                <div className="d-flex justify-content-end">
                                                    <p>Already have an account? <Link to="/login">Log in here</Link></p>
                                                </div>
                                            </div>



                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
    }
    export default Register
