import React, { useState } from 'react';
import './Payment.css';

const Payment = () => {
    const [selectAll, setSelectAll] = useState(false);
    const [selectedPayments, setSelectedPayments] = useState([]);
    const [paymentStatuses, setPaymentStatuses] = useState({
        user1: true,
        user2: false,
        user3: true,
    });

    const payments = [
        { id: 'user1', name: 'Cash' },
        { id: 'user2', name: 'Card' },
        { id: 'user3', name: 'Credit' },
    ];

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        setSelectedPayments(!selectAll ? payments.map(p => p.id) : []);
    };

    const handleSelectPayment = (id) => {
        setSelectedPayments(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const handleStatusToggle = (id) => {
        setPaymentStatuses(prev => ({
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
                            <h4 className="fw-bold">Payment Settings</h4>
                            <h6 className="text-muted">Manage Payment Settings</h6>
                        </div>
                        <a
                            href="#"
                            className="btn btn-primary d-flex align-items-center"
                            data-bs-toggle="modal"
                            data-bs-target="#addpayment"
                        >
                            <i className="fas fa-plus me-2"></i>Add Payment Settings
                        </a>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="input-group" style={{ maxWidth: '300px' }}>
                                    <input type="text" className="form-control" placeholder="Search..." />
                                    <button className="btn btn-searchset btn-primary" type="button">
                                        <i className="fas fa-search"></i>
                                    </button>
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
                                            <th>Payment Type Name</th>
                                            <th>Status</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map(payment => (
                                            <tr key={payment.id}>
                                                <td>
                                                    <label className="checkboxs">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPayments.includes(payment.id)}
                                                            onChange={() => handleSelectPayment(payment.id)}
                                                        />
                                                        <span className="checkmarks"></span>
                                                    </label>
                                                </td>
                                                <td>{payment.name}</td>
                                                <td>
                                                    <div className="status-toggle d-flex align-items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={payment.id}
                                                            className="check"
                                                            checked={paymentStatuses[payment.id]}
                                                            onChange={() => handleStatusToggle(payment.id)}
                                                        />
                                                        <label htmlFor={payment.id} className="checktoggle"></label>
                                                    </div>
                                                </td>
                                                <td className="text-end action-icons">
                                                    <a
                                                        href="#"
                                                        className="me-2"
                                                        title="Edit"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#editpayment"
                                                    >
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

export default Payment;