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
        now.setHours(0, 0, 0, 0);
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

        try {
            await dispatch(updateDiscount({ id, updatedData: formData })).unwrap();
            toast.success('Cập nhật mã giảm giá thành công!');
            navigate('/admin/discount');
        } catch (err) {
            toast.error('Cập nhật mã giảm giá thất bại!');
        }
    };

    if (loading || !discount) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" />
                <p>Đang tải thông tin mã giảm giá...</p>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger text-center">Lỗi: {error}</div>;
    }

    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0" style={{ borderRadius: 16 }}>
                <div className="card-header d-flex align-items-center" style={{ background: '#f3f6fa', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                    <i className="fa-solid fa-ticket-alt text-primary me-2" style={{ fontSize: 20 }}></i>
                    <h5 className="mb-0 fw-bold text-primary">Chỉnh sửa mã giảm giá</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Mã giảm giá</label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Mô tả</label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Phần trăm giảm</label>
                            <input
                                type="number"
                                className="form-control rounded-3"
                                name="discountPercent"
                                value={formData.discountPercent}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Giảm tối đa (VNĐ)</label>
                            <input
                                type="number"
                                className="form-control rounded-3"
                                name="maxDiscount"
                                value={formData.maxDiscount}
                                onChange={handleChange}
                                min={0}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Từ ngày</label>
                            <input
                                type="date"
                                className="form-control rounded-3"
                                name="validFrom"
                                value={formData.validFrom}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Đến ngày</label>
                            <input
                                type="date"
                                className="form-control rounded-3"
                                name="validTo"
                                value={formData.validTo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-12">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label fw-semibold" htmlFor="isActive">
                                    Kích hoạt
                                </label>
                            </div>
                        </div>
                        <div className="col-12 d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary px-4 me-2">
                                <i className="fa-solid fa-save me-1"></i> Cập nhật
                            </button>
                            <button type="button" className="btn btn-secondary px-4" onClick={() => navigate(-1)}>
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditDiscount;
