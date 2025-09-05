import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser, updateUserRole } from '../../../redux/admin/userSlice';
import Swal from 'sweetalert2';

const UserList = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector(state => state.admin.adminUser);

    const [selectAll, setSelectAll] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [editedRoles, setEditedRoles] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleSelectAll = () => {
        const isSelectingAll = !selectAll;
        setSelectAll(isSelectingAll);
        setSelectedUsers(isSelectingAll ? users.map(u => u._id) : []);
    };

    const handleSelectUser = (id) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
        );
    };

    const filteredUsers = users.filter(user =>
        (user.username || '').toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    const handleDeleteUser = async (userId) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc?',
            text: 'Thao tác này sẽ xoá người dùng!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ',
        });

        if (result.isConfirmed) {
            try {
                await dispatch(deleteUser(userId)).unwrap();
                await dispatch(fetchUsers());
                Swal.fire('Đã xoá!', 'Người dùng đã được xoá thành công.', 'success');
            } catch (err) {
                Swal.fire('Lỗi!', err?.message || 'Không thể xoá người dùng.', 'error');
            }
        }
    };

    return (
        <div className="container-fluid py-4" style={{  minHeight: '100vh' }}>
            <div className="row justify-content-center">
                <div className="col-12 ">
                    {/* Header */}
                    <div className="mb-4">
                        <h1 className="h3 fw-bold text-dark mb-2">Quản lý người dùng</h1>
                        <p className="text-muted mb-0">Danh sách và quản lý tất cả người dùng trong hệ thống</p>
                    </div>

                    {/* Search Bar */}
                    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                        <div className="card-body p-2">
                            <div className="row">
                                <div className="col-12 col-md-6 col-lg-5">
                                    <div className="position-relative">
                                        <i className="fas fa-search position-absolute top-50 translate-middle-y ms-3 text-muted"></i>
                                        <input
                                            type="text"
                                            className="form-control form-control-md ps-5 border-2"
                                            placeholder="Tìm kiếm theo tên hoặc email..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            style={{ borderRadius: '10px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Table Card */}
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary mb-3" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="text-muted mb-0">Đang tải dữ liệu...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-5">
                                <i className="fas fa-exclamation-triangle text-danger mb-3" style={{ fontSize: '2rem' }}></i>
                                <p className="text-danger mb-0">{error}</p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table Header */}
                                <div className="bg-light border-bottom d-none d-xl-block">
                                    <div className="row g-0 py-3 px-4 align-items-center fw-semibold text-dark">
                                        <div className="col-1">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                            />
                                        </div>
                                        <div className="col-1">
                                            <span className="small">STT</span>
                                        </div>
                                        <div className="col-1">
                                            <span className="small">Avatar</span>
                                        </div>
                                        <div className="col-2">
                                            <span className="small">Tên người dùng</span>
                                        </div>
                                        <div className="col-3">
                                            <span className="small">Email</span>
                                        </div>
                                        <div className="col-2">
                                            <span className="small">Vai trò</span>
                                        </div>
                                        <div className="col-2">
                                            <span className="small">Thao tác</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Body */}
                                <div className="card-body p-0">
                                    {filteredUsers.map((user, index) => (
                                        <div key={user._id}>
                                            {/* Desktop Row */}
                                            <div className="row g-0 py-3 px-4 align-items-center border-bottom border-light hover-bg-light d-none d-xl-flex"
                                                 style={{ transition: 'background-color 0.2s' }}>
                                                <div className="col-1">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={selectedUsers.includes(user._id)}
                                                        onChange={() => handleSelectUser(user._id)}
                                                    />
                                                </div>
                                                
                                                <div className="col-1">
                                                    <span className="badge bg-light text-dark fw-normal">
                                                        #{String(index + 1).padStart(3, '0')}
                                                    </span>
                                                </div>

                                                <div className="col-1">
                                                    {user.avatar ? (
                                                        <img
                                                            src={user.avatar.startsWith('http') ? user.avatar : `${process.env.REACT_APP_SERVER_URL}/${user.avatar}`}
                                                            alt="avatar"
                                                            className="rounded-circle border"
                                                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                                             style={{ width: '40px', height: '40px' }}>
                                                            <i className="fas fa-user text-muted"></i>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="col-2">
                                                    <span className="fw-semibold text-dark">{user.username}</span>
                                                </div>

                                                <div className="col-3">
                                                    <a href={`mailto:${user.email}`} 
                                                       className="text-primary text-decoration-none small">
                                                        {user.email}
                                                    </a>
                                                </div>

                                                <div className="col-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={editedRoles[user._id] || user.role}
                                                            onChange={(e) => {
                                                                const newRole = e.target.value;
                                                                setEditedRoles(prev => ({ ...prev, [user._id]: newRole }));
                                                            }}
                                                            style={{ borderRadius: '6px' }}
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                        
                                                        <button
                                                            disabled={editedRoles[user._id] === user.role || !editedRoles[user._id]}
                                                            onClick={async () => {
                                                                try {
                                                                    await dispatch(updateUserRole({ userId: user._id, role: editedRoles[user._id] })).unwrap();
                                                                    Swal.fire('Thành công!', 'Vai trò đã được cập nhật.', 'success');
                                                                    dispatch(fetchUsers());
                                                                    setEditedRoles(prev => {
                                                                        const newState = { ...prev };
                                                                        delete newState[user._id];
                                                                        return newState;
                                                                    });
                                                                } catch (err) {
                                                                    Swal.fire('Lỗi!', err || 'Không thể cập nhật vai trò.', 'error');
                                                                }
                                                            }}
                                                            className={`btn btn-sm ${editedRoles[user._id] === user.role || !editedRoles[user._id] ? 'btn-light' : 'btn-success'}`}
                                                            style={{ borderRadius: '6px' }}
                                                        >
                                                            <i className="fas fa-sync-alt"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="col-2">
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="btn btn-outline-danger btn-sm"
                                                        style={{ borderRadius: '8px' }}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Mobile Card */}
                                            <div className="d-xl-none border-bottom border-light">
                                                <div className="p-3">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div className="d-flex align-items-center">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input me-3"
                                                                checked={selectedUsers.includes(user._id)}
                                                                onChange={() => handleSelectUser(user._id)}
                                                            />
                                                            <span className="badge bg-light text-dark fw-normal">
                                                                #{String(index + 1).padStart(3, '0')}
                                                            </span>
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                onClick={() => handleDeleteUser(user._id)}
                                                                className="btn btn-outline-danger btn-sm"
                                                                style={{ borderRadius: '8px' }}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="d-flex align-items-center mb-3">
                                                        {user.avatar ? (
                                                            <img
                                                                src={user.avatar.startsWith('http') ? user.avatar : `${process.env.REACT_APP_SERVER_URL}/${user.avatar}`}
                                                                alt="avatar"
                                                                className="rounded-circle border me-3"
                                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                                                                 style={{ width: '50px', height: '50px' }}>
                                                                <i className="fas fa-user text-muted"></i>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h6 className="mb-1 fw-semibold text-dark">{user.username}</h6>
                                                            <a href={`mailto:${user.email}`} 
                                                               className="text-primary text-decoration-none small">
                                                                {user.email}
                                                            </a>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="d-flex align-items-center gap-2">
                                                        <label className="form-label small text-muted mb-0 me-2">Vai trò:</label>
                                                        <select
                                                            className="form-select form-select-sm flex-grow-1"
                                                            value={editedRoles[user._id] || user.role}
                                                            onChange={(e) => {
                                                                const newRole = e.target.value;
                                                                setEditedRoles(prev => ({ ...prev, [user._id]: newRole }));
                                                            }}
                                                            style={{ borderRadius: '6px' }}
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                        
                                                        <button
                                                            disabled={editedRoles[user._id] === user.role || !editedRoles[user._id]}
                                                            onClick={async () => {
                                                                try {
                                                                    await dispatch(updateUserRole({ userId: user._id, role: editedRoles[user._id] })).unwrap();
                                                                    Swal.fire('Thành công!', 'Vai trò đã được cập nhật.', 'success');
                                                                    dispatch(fetchUsers());
                                                                    setEditedRoles(prev => {
                                                                        const newState = { ...prev };
                                                                        delete newState[user._id];
                                                                        return newState;
                                                                    });
                                                                } catch (err) {
                                                                    Swal.fire('Lỗi!', err || 'Không thể cập nhật vai trò.', 'error');
                                                                }
                                                            }}
                                                            className={`btn btn-sm ${editedRoles[user._id] === user.role || !editedRoles[user._id] ? 'btn-light' : 'btn-success'}`}
                                                            style={{ borderRadius: '6px' }}
                                                        >
                                                            <i className="fas fa-sync-alt"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {filteredUsers.length === 0 && (
                                        <div className="text-center py-5">
                                            <i className="fas fa-users text-muted mb-3" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                                            <h5 className="text-muted mb-2">Không tìm thấy người dùng nào</h5>
                                            <p className="text-muted small mb-0">Thử thay đổi từ khóa tìm kiếm</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer Stats */}
                    {filteredUsers.length > 0 && (
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mt-4 gap-2">
                            <div className="text-muted small">
                                Hiển thị <strong>{filteredUsers.length}</strong> trong tổng số <strong>{users.length}</strong> người dùng
                            </div>
                            {selectedUsers.length > 0 && (
                                <div className="badge bg-primary-subtle text-primary fs-6 px-3 py-2">
                                    Đã chọn {selectedUsers.length} người dùng
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .hover-bg-light:hover {
                    background-color: #f8fafc !important;
                }
                
                .form-control:focus, .form-select:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
                }
                
                .btn {
                    transition: all 0.2s ease;
                }
                
                .btn:hover {
                    transform: translateY(-1px);
                }
                
                .bg-primary-subtle {
                    background-color: #dbeafe !important;
                }
                
                .text-primary {
                    color: #3b82f6 !important;
                }
                
                @media (max-width: 1199.98px) {
                    .card-body .p-3:hover {
                        background-color: #f8fafc;
                    }
                }
            `}</style>
        </div>
    );
};

export default UserList