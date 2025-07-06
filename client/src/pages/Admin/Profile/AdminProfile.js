import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProfile, updateAdminProfile, changeAdminPassword } from '../../../redux/admin/adminSlice';

const AdminProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector(state => state.admin.adminAdmin );
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: '',
    avatarFile: null,
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData(f => ({
        ...f,
        username: profile.username || '',
        email: profile.email || '',
        avatar: profile.avatar || '',
      }));
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatarFile: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, avatar: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    let formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    if (formData.avatarFile) formDataToSend.append('avatar', formData.avatarFile);
    await dispatch(updateAdminProfile(formDataToSend));
    setSuccessMsg('Cập nhật thành công!');
    dispatch(fetchAdminProfile());
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    await dispatch(changeAdminPassword(passwordForm));
    setSuccessMsg('Đổi mật khẩu thành công!');
    setShowChangePassword(false);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="px-2 px-md-4 py-4">
      <h2 className="fw-bold mb-4" style={{ fontSize: 28 }}>Thông tin tài khoản</h2>
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column flex-md-row align-items-center gap-4 mb-4">
          <div className="position-relative" style={{ width: 110, height: 110 }}>
            <img
              src={formData.avatar || '/default-avatar.png'}
              alt="avatar"
              style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none', background: '#f3f4f6' }}
            />
            <label htmlFor="avatar-upload" style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: '#fff',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(59,130,246,0.10)',
              cursor: 'pointer',
              border: '1.5px solid #e5e7eb',
              transition: 'background 0.2s',
            }}
              title="Đổi ảnh đại diện"
            >
              <i className="fas fa-camera" style={{ color: '#00b6ff', fontSize: 16 }}></i>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <div className="flex-grow-1 w-100">
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="username" style={{ fontSize: 16 }}>Tên đăng nhập</label>
              <div className="input-group">
                <span className="input-group-text bg-white" style={{ borderRight: 0, borderColor: '#e5e7eb' }}>
                  <i className="fas fa-user" style={{ color: '#bdbdbd' }}></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Nhập tên đăng nhập"
                  style={{ borderLeft: 0, borderColor: '#e5e7eb', fontSize: 16, height: 46 }}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="email" style={{ fontSize: 16 }}>Email</label>
              <div className="input-group">
                <span className="input-group-text bg-white" style={{ borderRight: 0, borderColor: '#e5e7eb' }}>
                  <i className="fas fa-envelope" style={{ color: '#bdbdbd' }}></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  style={{ borderLeft: 0, borderColor: '#e5e7eb', fontSize: 16, height: 46, background: '#fafbfc' }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 d-flex align-items-center gap-3">
          <button type="submit" className="btn btn-dark rounded-pill px-4 py-2 fw-bold" style={{ fontSize: 17, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          <button type="button" className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold" style={{ fontSize: 17 }} onClick={() => setShowChangePassword(true)}>
            Đổi mật khẩu
          </button>
        </div>
      </form>
      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0,0,0,0.18)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4" style={{ border: 'none', minWidth: 400 }}>
              <div className="modal-header border-0 pb-0">
                <h4 className="modal-title fw-bold w-100 text-center" style={{ fontSize: 24 }}>Đổi mật khẩu</h4>
                <button type="button" className="btn-close position-absolute end-0 me-3 mt-2" style={{ fontSize: 22 }} onClick={() => setShowChangePassword(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body pt-2 pb-4 px-4">
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="oldPassword">Mật khẩu cũ</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white" style={{ borderRight: 0, borderColor: '#e5e7eb' }}>
                        <i className="fas fa-lock" style={{ color: '#bdbdbd' }}></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="oldPassword"
                        name="oldPassword"
                        value={passwordForm.oldPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="Nhập mật khẩu cũ"
                        style={{ borderLeft: 0, borderColor: '#e5e7eb', fontSize: 16, height: 46 }}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="newPassword">Mật khẩu mới</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white" style={{ borderRight: 0, borderColor: '#e5e7eb' }}>
                        <i className="fas fa-lock" style={{ color: '#bdbdbd' }}></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="Nhập mật khẩu mới"
                        style={{ borderLeft: 0, borderColor: '#e5e7eb', fontSize: 16, height: 46 }}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white" style={{ borderRight: 0, borderColor: '#e5e7eb' }}>
                        <i className="fas fa-lock" style={{ color: '#bdbdbd' }}></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="Xác nhận mật khẩu mới"
                        style={{ borderLeft: 0, borderColor: '#e5e7eb', fontSize: 16, height: 46 }}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-4">
                    <button type="submit" className="btn btn-primary rounded-pill px-4 py-2 fw-bold" style={{ fontSize: 17 }}>Lưu mật khẩu</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile; 