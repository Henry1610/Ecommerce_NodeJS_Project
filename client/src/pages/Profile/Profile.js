import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        avatar: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Fetch user info from API and setFormData
        // Example: fetch('/api/users/me').then(...)
        // For now, just set dummy data
        setFormData({
            username: '',
            email: '',
            password: '',
            avatar: '',
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData({ ...formData, avatar: event.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send formData to backend (API call)
        // Example: fetch('/api/users/me', { method: 'PUT', body: JSON.stringify(formData) })
        console.log('Form submitted:', formData);
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="mb-4">
                        <h4 className="fw-bold">Profile</h4>
                        <h6 className="text-muted">User Profile</h6>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="profile-set">
                                <div className="profile-top d-flex justify-content-between align-items-center">
                                    <div className="profile-content d-flex align-items-center">
                                        <div className="profile-contentimg position-relative">
                                            <img src={formData.avatar || '/default-avatar.png'} alt="profile" id="blah" className="profile-img" />
                                            <div className="profileupload">
                                                <input
                                                    type="file"
                                                    id="imgInp"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                                <a href="#">
                                                    <i className="fas fa-edit"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="profile-contentname ms-3">
                                            <h2>{formData.username}</h2>
                                            <h4>Update Your Photo and Personal Details.</h4>
                                        </div>
                                    </div>
                                    <div className="ms-auto d-flex gap-2">
                                        <button className="btn btn-submit" onClick={handleSubmit}>
                                            Save
                                        </button>
                                        <button className="btn btn-cancel">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-3 mt-4">
                                <div className="col-lg-6 col-sm-12">
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="william@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-12">
                                    <div className="form-group">
                                        <label className="form-label">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            placeholder="williamc"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-12">
                                    <div className="form-group">
                                        <label className="form-label">Password</label>
                                        <div className="pass-group position-relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                className="form-control pass-input"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                            />
                                            <span
                                                className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} toggle-password`}
                                                onClick={togglePasswordVisibility}
                                            ></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 d-flex gap-2">
                                    <button className="btn btn-submit" onClick={handleSubmit}>
                                        Submit
                                    </button>
                                    <button className="btn btn-cancel">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;