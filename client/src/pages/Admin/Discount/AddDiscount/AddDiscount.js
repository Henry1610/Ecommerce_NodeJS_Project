import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createDiscount, fetchDiscounts } from '../../../../redux/admin/discountSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddDiscount = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountPercent: 0,
        validFrom: '',
        validTo: '',
        isActive: true,
        quantity: 1,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createDiscount(formData)).unwrap();
            toast.success('Thêm mã giảm giá thành công!');
            dispatch(fetchDiscounts());
            navigate('/admin/discount');
        } catch (error) {
            toast.error('Thêm mã giảm giá thất bại!');
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-header">
                    <h4>Thêm mã giảm giá</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Mã giảm giá</label>
                            <input
                                type="text"
                                className="form-control"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Mô tả</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Phần trăm giảm (%)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="discountPercent"
                                value={formData.discountPercent}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Từ ngày</label>
                            <input
                                type="date"
                                className="form-control"
                                name="validFrom"
                                value={formData.validFrom}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Đến ngày</label>
                            <input
                                type="date"
                                className="form-control"
                                name="validTo"
                                value={formData.validTo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Số lượng</label>
                            <input
                                type="number"
                                className="form-control"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min={1}
                                required
                            />
                        </div>
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="isActive">
                                Kích hoạt
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary">Thêm</button>
                        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>Hủy</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddDiscount;
