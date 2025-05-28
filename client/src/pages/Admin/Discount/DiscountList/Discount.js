import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDiscounts,deleteDiscount } from '../../../../redux/discount/discountSlice';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const DiscountList = () => {
    const dispatch = useDispatch();
    const { discounts, loading, error } = useSelector(state => state.discounts);
    const [selectedDiscounts, setSelectedDiscounts] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        dispatch(fetchDiscounts());
    }, [dispatch]);

    const handleRemove = (e, id) => {
        e.preventDefault();

        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await dispatch(deleteDiscount(id)).unwrap();
                    toast.success('Xoá mã giảm giá thành công!');
                    dispatch(fetchDiscounts());
                } catch (err) {
                    toast.error('Xoá mã giảm giá thất bại!');
                }
            }
        });
    };

    const handleSelectAll = () => {
        if (!discounts || discounts.length === 0) return;
        setSelectAll(!selectAll);
        setSelectedDiscounts(!selectAll ? discounts.map(d => d._id) : []);
    };

    const handleSelectDiscount = (id) => {
        setSelectedDiscounts(prev =>
            prev.includes(id) ? prev.filter(did => did !== id) : [...prev, id]
        );
    };

    if (loading) {
        return <div className="text-center p-5"><div className="spinner-border text-primary" /><p>Đang tải danh sách mã giảm giá...</p></div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center p-5">Lỗi khi tải danh sách: {error}</div>;
    }

    if (!discounts || discounts.length === 0) {
        return (
            <div className="text-center p-5">
                <i className="fas fa-tags fa-3x text-muted mb-3" />
                <h5>Chưa có mã giảm giá nào</h5>
                <Link to="/admin/discount/add" className="btn btn-primary mt-3">
                    <i className="fas fa-plus me-2" />Thêm mã giảm giá
                </Link>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold">Discount List</h4>
                            <h6 className="text-muted">Manage your Discounts</h6>
                        </div>
                        <Link to="/admin/discount/add" className="btn btn-primary">
                            <i className="fas fa-plus me-2" />Thêm mã giảm giá
                        </Link>
                    </div>

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
                                    <th>Code</th>
                                    <th>Discount (%)</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {discounts.map(discount => (
                                    <tr key={discount._id}>
                                        <td>
                                            <label className="checkboxs">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDiscounts.includes(discount._id)}
                                                    onChange={() => handleSelectDiscount(discount._id)}
                                                />
                                                <span className="checkmarks"></span>
                                            </label>
                                        </td>
                                        <td>{discount.code}</td>
                                        <td>{discount.discountPercent}%</td>
                                        <td>{new Date(discount.validFrom).toLocaleDateString()}</td>
                                        <td>{new Date(discount.validTo).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${discount.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                                {discount.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <Link to={`/admin/discount/edit/${discount._id}`} className="me-2">
                                                <i className="fas fa-edit" />
                                            </Link>
                                            <button onClick={(e) => handleRemove(e, discount._id)} className="btn btn-link p-0 text-danger">
                                                <i className="fas fa-trash" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscountList;
