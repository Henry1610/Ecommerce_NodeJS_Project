import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './UserList.css';

const UserList = () => {
    const [selectAll, setSelectAll] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userStatuses, setUserStatuses] = useState({
        user1: false,
        user2: true,
        user3: true,
        user4: true,
        user5: false,
        user6: false,
        user7: false,
        user15: false,
        user9: true,
        user10: true,
        user19: true,
        user18: true,
    });

    const users = [
        { id: 'user1', profile: 'assets/img/customer/customer1.jpg', firstName: 'Thomas', lastName: 'Thomas', username: 'Thomas21', phone: '+12163547758', email: 'thomas@example.com' },
        { id: 'user2', profile: 'assets/img/customer/customer2.jpg', firstName: 'Benjamin', lastName: 'Franklin', username: '504Benjamin', phone: '123-456-888', email: 'benjamin@example.com' },
        { id: 'user3', profile: 'assets/img/customer/customer3.jpg', firstName: 'James', lastName: 'James', username: 'James524', phone: '+12163547758', email: 'james@example.com' },
        { id: 'user4', profile: 'assets/img/customer/customer4.jpg', firstName: 'Bruklin', lastName: 'Bruklin', username: 'Bruklin2022', phone: '123-456-888', email: 'bruklin@example.com' },
        { id: 'user5', profile: 'assets/img/customer/customer5.jpg', firstName: 'Franklin', lastName: 'Jacob', username: 'BeverlyWIN25', phone: '+12163547758', email: 'franklin@example.com' },
        { id: 'user6', profile: 'assets/img/customer/customer6.jpg', firstName: 'B. Huber', lastName: 'Jacob', username: 'BeverlyWIN25', phone: '+12163547758', email: 'huber@example.com' },
        { id: 'user7', profile: 'assets/img/customer/customer7.jpg', firstName: 'Alwin', lastName: 'Alwin', username: 'Alwin243', phone: '+12163547758', email: 'alwin@example.com' },
        { id: 'user15', profile: 'assets/img/customer/customer8.jpg', firstName: 'Fred', lastName: 'John', username: 'FredJ25', phone: '+12163547758', email: 'fred@example.com' },
        { id: 'user9', profile: 'assets/img/customer/customer1.jpg', firstName: 'Rasmussen', lastName: 'Gothic', username: 'Cras56', phone: '+12163547758', email: 'rasmussen@example.com' },
        { id: 'user10', profile: 'assets/img/customer/customer2.jpg', firstName: 'Grace', lastName: 'Halena', username: 'Grace2022', phone: '+12163547758', email: 'grace@example.com' },
        { id: 'user19', profile: 'assets/img/customer/customer3.jpg', firstName: 'Rasmussen', lastName: 'Gothic', username: 'Cras56', phone: '+12163547758', email: 'rasmussen2@example.com' },
        { id: 'user18', profile: 'assets/img/customer/customer4.jpg', firstName: 'Grace', lastName: 'Halena', username: 'Grace2022', phone: '+12163547758', email: 'grace2@example.com' },
    ];

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        setSelectedUsers(!selectAll ? users.map(u => u.id) : []);
    };

    const handleSelectUser = (id) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
        );
    };

    const handleStatusToggle = (id) => {
        setUserStatuses(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
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
                        <a href="adduser.html" className="btn btn-primary d-flex align-items-center">
                            <i className="fas fa-plus me-2"></i>Add User
                        </a>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center">
                                    <button
                                        className="btn btn-filter btn-outline-primary me-2"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#filter_inputs"
                                    >
                                        <i className="fas fa-filter"></i>
                                    </button>
                                    <div className="input-group" style={{ maxWidth: '300px' }}>
                                        <input type="text" className="form-control" placeholder="Search..." />
                                        <button className="btn btn-searchset btn-primary" type="button">
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item">
                                        <a href="#" data-bs-toggle="tooltip" title="PDF">
                                            <i className="fas fa-file-pdf"></i>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href="#" data-bs-toggle="tooltip" title="Excel">
                                            <i className="fas fa-file-excel"></i>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href="#" data-bs-toggle="tooltip" title="Print">
                                            <i className="fas fa-print"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="collapse" id="filter_inputs">
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter User Name"
                                                />
                                            </div>
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Phone"
                                                />
                                            </div>
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Email"
                                                />
                                            </div>
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <select className="form-select">
                                                    <option>Disable</option>
                                                    <option>Enable</option>
                                                </select>
                                            </div>
                                            <div className="col-lg-1 col-sm-6 col-12 ms-auto">
                                                <button className="btn btn-filters btn-primary ms-auto">
                                                    <i className="fas fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>
                                                <label className="checkboxs">
                                                    <input
                                                        type="checkbox"
                                                        id="select-all"
                                                        checked={selectAll}
                                                        onChange={handleSelectAll}
                                                    />
                                                    <span className="checkmarks"></span>
                                                </label>
                                            </th>
                                            <th>Profile</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Username</th>
                                            <th>Phone</th>
                                            <th>Email</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td>
                                                    <label className="checkboxs">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedUsers.includes(user.id)}
                                                            onChange={() => handleSelectUser(user.id)}
                                                        />
                                                        <span className="checkmarks"></span>
                                                    </label>
                                                </td>
                                                <td>
                                                    <a href="#" className="product-img">
                                                        <img src={user.profile} alt="profile" className="user-img" />
                                                    </a>
                                                </td>
                                                <td>{user.firstName}</td>
                                                <td>{user.lastName}</td>
                                                <td>{user.username}</td>
                                                <td>{user.phone}</td>
                                                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                                <td>
                                                    <div className="status-toggle d-flex align-items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={user.id}
                                                            className="check"
                                                            checked={userStatuses[user.id]}
                                                            onChange={() => handleStatusToggle(user.id)}
                                                        />
                                                        <label htmlFor={user.id} className="checktoggle"></label>
                                                    </div>
                                                </td>
                                                <td className="action-icons">
                                                    <a href="edituser.html" className="me-2" title="Edit">
                                                        <i className="fas fa-edit"></i>
                                                    </a>
                                                    <a href="#" className="confirm-text" title="Delete">
                                                        <i className="fas fa-trash"></i>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserList;