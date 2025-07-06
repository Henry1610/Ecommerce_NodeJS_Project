import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser ,updateUserRole } from '../../../redux/admin/userSlice';
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
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold">User List</h4>
                            <h6 className="text-muted">Manage your User</h6>
                        </div>
                       
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-lg-4 col-md-6 col-12">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Tìm kiếm người dùng..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                        <button className="btn btn-searchset btn-primary" type="button">
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {loading ? (
                                <p>Loading users...</p>
                            ) : error ? (
                                <p className="text-danger">{error}</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table align-middle table-hover shadow-sm" style={{ background: '#fff', borderRadius: 16, overflow: 'hidden' }}>
                                        <thead style={{ background: '#f3f6fa', borderBottom: '2px solid #e0e7ef' }}>
                                            <tr style={{ fontSize: 17, fontWeight: 700, color: '#2563eb' }}>
                                                <th style={{ width: 40, border: 'none' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectAll}
                                                        onChange={handleSelectAll}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </th>
                                                <th style={{ border: 'none' }}>#</th>
                                                <th style={{ border: 'none' }}>Avatar</th>
                                                <th style={{ border: 'none' }}>Username</th>
                                                <th style={{ border: 'none' }}>Email</th>
                                                <th style={{ border: 'none' }}>Role</th>
                                                <th style={{ border: 'none' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map((user, index) => (
                                                <tr key={user._id} style={{ border: 'none', borderRadius: 12, boxShadow: '0 1px 8px rgba(59,130,246,0.06)', marginBottom: 8, background: '#fff' }}>
                                                    <td style={{ border: 'none' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedUsers.includes(user._id)}
                                                            onChange={() => handleSelectUser(user._id)}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    </td>
                                                    <td style={{ border: 'none' }}>{index + 1}</td>
                                                    <td style={{ border: 'none' }}>
                                                        <img
                                                            src={user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000/${user.avatar}`) : '/assets/img/customer/default.jpg'}
                                                            alt="avatar"
                                                            className="user-img"
                                                            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                                                        />
                                                    </td>
                                                    <td style={{ border: 'none' }}>{user.username}</td>
                                                    <td style={{ border: 'none' }}>
                                                        <a href={`mailto:${user.email}`}>{user.email}</a>
                                                    </td>
                                                    <td style={{ border: 'none' }}>
                                                        <div className="d-flex align-items-center">
                                                            <select
                                                                className="form-select"
                                                                value={editedRoles[user._id] || user.role}
                                                                onChange={(e) => {
                                                                    const newRole = e.target.value;
                                                                    setEditedRoles(prev => ({ ...prev, [user._id]: newRole }));
                                                                }}
                                                            >
                                                                <option value="user">User</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                            <button
                                                                className="btn btn-sm btn-success ms-2"
                                                                disabled={editedRoles[user._id] === user.role || !editedRoles[user._id]}
                                                                onClick={async () => {
                                                                    try {
                                                                        await dispatch(updateUserRole({ userId: user._id, role: editedRoles[user._id] })).unwrap();
                                                                        Swal.fire('Thành công!', 'Vai trò đã được cập nhật.', 'success');
                                                                        dispatch(fetchUsers());
                                                                    } catch (err) {
                                                                        Swal.fire('Lỗi!', err || 'Không thể cập nhật vai trò.', 'error');
                                                                    }
                                                                }}
                                                            >
                                                                Update
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td style={{ border: 'none' }}>
                                                        <a
                                                            href="#"
                                                            title="Delete"
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className="confirm-text"
                                                        >
                                                            <i className="fas fa-trash text-danger"></i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserList;
