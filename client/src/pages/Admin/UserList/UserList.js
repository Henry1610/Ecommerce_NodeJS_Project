import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser ,updateUserRole } from '../../../redux/user/userSlice';
import Swal from 'sweetalert2';

const UserList = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector(state => state.users);

    const [selectAll, setSelectAll] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [editedRoles, setEditedRoles] = useState({});

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
                        <a href="adduser.html" className="btn btn-primary">
                            <i className="fas fa-plus me-2"></i> Add User
                        </a>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            {loading ? (
                                <p>Loading users...</p>
                            ) : error ? (
                                <p className="text-danger">{error}</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <label className="checkboxs">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectAll}
                                                            onChange={handleSelectAll}
                                                        />
                                                        <span className="checkmarks"></span>
                                                    </label>
                                                </th>
                                                <th>#</th>
                                                <th>Profile</th>
                                                <th>Username</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user, index) => (
                                                <tr key={user._id}>
                                                    <td>
                                                        <label className="checkboxs">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedUsers.includes(user._id)}
                                                                onChange={() => handleSelectUser(user._id)}
                                                            />
                                                            <span className="checkmarks"></span>
                                                        </label>
                                                    </td>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <img
                                                            src={user.profile || 'assets/img/customer/default.jpg'}
                                                            alt="profile"
                                                            className="user-img"
                                                        />
                                                    </td>
                                                    <td>{user.username}</td>
                                                    <td>
                                                        <a href={`mailto:${user.email}`}>{user.email}</a>
                                                    </td>
                                                    <td>
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

                                                    <td>
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
