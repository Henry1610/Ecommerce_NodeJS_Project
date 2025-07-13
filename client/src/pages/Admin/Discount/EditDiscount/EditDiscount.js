import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDiscountById, updateDiscount, resetDiscountDetail } from '../../../../redux/admin/discountSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditDiscount = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { discount, loading, error } = useSelector(state => state.admin.adminDiscounts);

    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountPercent: 0,
        maxDiscount: 0,
        validFrom: '',
        validTo: '',
        isActive: true,
    });

    useEffect(() => {
        dispatch(fetchDiscountById(id));

        return () => {
            dispatch(resetDiscountDetail());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (discount) {
            setFormData({
                code: discount.code || '',
                description: discount.description || '',
                discountPercent: discount.discountPercent || 0,
                maxDiscount: discount.maxDiscount || 0,
                validFrom: discount.validFrom?.substring(0, 10) || '',
                validTo: discount.validTo?.substring(0, 10) || '',
                isActive: discount.isActive ?? true,
            });
        }
    }, [discount]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const now = new Date();
        now.setHours(0,0,0,0); // So sánh chỉ theo ngày
        const from = new Date(formData.validFrom);
        const to = new Date(formData.validTo);

        if (from > to) {
            toast.error('Ngày bắt đầu không được sau ngày kết thúc!');
            return;
        }
        if (to < now) {
            toast.error('Ngày kết thúc không được ở quá khứ!');
            return;
        }
        // Cho phép validFrom ở quá khứ khi cập nhật

        try {
            await dispatch(updateDiscount({ id, updatedData: formData })).unwrap();
            toast.success('Cập nhật mã giảm giá thành công!');
            navigate('/admin/discount');
        } catch (err) {
            toast.error('Cập nhật mã giảm giá thất bại!');
        }
    };

    if (loading || !discount) {
        return <div className="text-center p-5"><div className="spinner-border text-primary" /><p>Đang tải thông tin mã giảm giá...</p></div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center">Lỗi: {error}</div>;
    }

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-header">
                    <h4>Chỉnh sửa mã giảm giá</h4>
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
                            <label className="form-label">Phần trăm giảm</label>
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
                            <label className="form-label">Giá trị giảm tối đa (VNĐ)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="maxDiscount"
                                value={formData.maxDiscount}
                                onChange={handleChange}
                                min={0}
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
                        <button type="submit" className="btn btn-success">Cập nhật</button>
                        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>Hủy</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditDiscount;
