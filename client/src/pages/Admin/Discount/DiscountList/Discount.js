import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDiscounts, deleteDiscount } from '../../../../redux/admin/discountSlice';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const DiscountList = () => {
    const dispatch = useDispatch();
    const { discounts, loading, error } = useSelector(state => state.admin.adminDiscounts);
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

    const getStatusBadge = (isActive) => {
        return isActive ? 
            { class: 'bg-success', text: 'Hoạt động' } : 
            { class: 'bg-secondary', text: 'Tạm dừng' };
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    {/* Header */}
                    <div className="mb-4">
                        <h1 className="h3 fw-bold text-dark mb-2">Quản lý mã giảm giá</h1>
                        <p className="text-muted mb-0">Danh sách và quản lý các mã giảm giá trong hệ thống</p>
                    </div>

                    {loading ? (
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary mb-3" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="text-muted mb-0">Đang tải danh sách mã giảm giá...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                            <div className="text-center py-5">
                                <i className="fas fa-exclamation-triangle text-danger mb-3" style={{ fontSize: '2rem' }}></i>
                                <p className="text-danger mb-0">Lỗi khi tải danh sách: {error}</p>
                            </div>
                        </div>
                    ) : !discounts || discounts.length === 0 ? (
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                            <div className="text-center py-5">
                                <i className="fas fa-tags text-muted mb-3" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                                <h5 className="text-muted mb-2">Chưa có mã giảm giá nào</h5>
                                <p className="text-muted small mb-3">Tạo mã giảm giá đầu tiên để bắt đầu</p>
                                <Link to="/admin/discount/add" className="btn btn-primary btn-lg shadow-sm" style={{ borderRadius: '12px' }}>
                                    <i className="fas fa-plus me-2"></i>Thêm mã giảm giá
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Action Bar */}
                            <div className="card border-0 shadow-sm mb-4 bg-primary" style={{ 
                               
                                borderRadius: '16px'
                            }}>
                                <div className="card-body p-4">
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                                        <div className="text-white">
                                            <h5 className="mb-1 fw-semibold">
                                                <i className="fas fa-percentage me-2"></i>
                                                Tổng số mã: {discounts.length}
                                            </h5>
                                            <p className="mb-0 opacity-75 small">
                                                Hoạt động: {discounts.filter(d => d.isActive).length} | 
                                                Tạm dừng: {discounts.filter(d => !d.isActive).length}
                                            </p>
                                        </div>
                                        <Link to="/admin/discount/add" className="btn btn-light btn-md shadow-sm fw-semibold" style={{ borderRadius: '12px' }}>
                                            <i className="fas fa-plus me-2"></i>Thêm mã giảm giá
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Main Table Card */}
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                {/* Desktop Table Header */}
                                <div className="bg-light border-bottom d-none d-lg-block">
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
                                        <div className="col-2">
                                            <span className="small">Mã giảm giá</span>
                                        </div>
                                        <div className="col-2">
                                            <span className="small">% Giảm</span>
                                        </div>
                                        <div className="col-2">
                                            <span className="small">Từ ngày</span>
                                        </div>
                                        <div className="col-2">
                                            <span className="small">Đến ngày</span>
                                        </div>
                                        <div className="col-1">
                                            <span className="small">Trạng thái</span>
                                        </div>
                                        <div className="col-1">
                                            <span className="small">Thao tác</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Body */}
                                <div className="card-body p-0">
                                    {discounts.map((discount, index) => {
                                        const statusBadge = getStatusBadge(discount.isActive);
                                        return (
                                            <div key={discount._id}>
                                                {/* Desktop Row */}
                                                <div className="row g-0 py-3 px-4 align-items-center border-bottom border-light hover-bg-light d-none d-lg-flex"
                                                     style={{ transition: 'background-color 0.2s' }}>
                                                    <div className="col-1">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={selectedDiscounts.includes(discount._id)}
                                                            onChange={() => handleSelectDiscount(discount._id)}
                                                        />
                                                    </div>
                                                    
                                                    <div className="col-1">
                                                        <span className="badge bg-light text-dark fw-normal">
                                                            #{String(index + 1).padStart(3, '0')}
                                                        </span>
                                                    </div>

                                                    <div className="col-2">
                                                        <div className="d-flex align-items-center">
                                                            <i className="fas fa-tag text-primary me-2"></i>
                                                            <span className="fw-semibold text-dark font-monospace">{discount.code}</span>
                                                        </div>
                                                    </div>

                                                    <div className="col-2">
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 fw-semibold">
                                                                {discount.discountPercent}%
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-2">
                                                        <span className="small text-muted">
                                                            {new Date(discount.validFrom).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    </div>

                                                    <div className="col-2">
                                                        <span className="small text-muted">
                                                            {new Date(discount.validTo).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    </div>

                                                    <div className="col-1">
                                                        <span className={`badge ${statusBadge.class} px-2 py-1`}>
                                                            {statusBadge.text}
                                                        </span>
                                                    </div>

                                                    <div className="col-1">
                                                        <div className="d-flex gap-2">
                                                            <Link 
                                                                to={`/admin/discount/edit/${discount._id}`} 
                                                                className="btn btn-outline-primary btn-sm"
                                                                style={{ borderRadius: '8px' }}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </Link>
                                                            <button 
                                                                onClick={(e) => handleRemove(e, discount._id)} 
                                                                className="btn btn-outline-danger btn-sm"
                                                                style={{ borderRadius: '8px' }}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Mobile Card */}
                                                <div className="d-lg-none border-bottom border-light">
                                                    <div className="p-3">
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <div className="d-flex align-items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input me-3"
                                                                    checked={selectedDiscounts.includes(discount._id)}
                                                                    onChange={() => handleSelectDiscount(discount._id)}
                                                                />
                                                                <span className="badge bg-light text-dark fw-normal">
                                                                    #{String(index + 1).padStart(3, '0')}
                                                                </span>
                                                            </div>
                                                            <div className="d-flex gap-2">
                                                                <Link 
                                                                    to={`/admin/discount/edit/${discount._id}`} 
                                                                    className="btn btn-outline-primary btn-sm"
                                                                    style={{ borderRadius: '8px' }}
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </Link>
                                                                <button 
                                                                    onClick={(e) => handleRemove(e, discount._id)} 
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    style={{ borderRadius: '8px' }}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="mb-3">
                                                            <label className="form-label small text-muted mb-1">Mã giảm giá</label>
                                                            <div className="d-flex align-items-center">
                                                                <i className="fas fa-tag text-primary me-2"></i>
                                                                <span className="fw-semibold text-dark font-monospace">{discount.code}</span>
                                                            </div>
                                                        </div>

                                                        <div className="row mb-3">
                                                            <div className="col-6">
                                                                <label className="form-label small text-muted mb-1">% Giảm giá</label>
                                                                <div className="bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 fw-semibold text-center">
                                                                    {discount.discountPercent}%
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <label className="form-label small text-muted mb-1">Trạng thái</label>
                                                                <div>
                                                                    <span className={`badge ${statusBadge.class} px-2 py-1`}>
                                                                        {statusBadge.text}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <label className="form-label small text-muted mb-1">Từ ngày</label>
                                                                <div className="small text-dark">
                                                                    {new Date(discount.validFrom).toLocaleDateString('vi-VN')}
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <label className="form-label small text-muted mb-1">Đến ngày</label>
                                                                <div className="small text-dark">
                                                                    {new Date(discount.validTo).toLocaleDateString('vi-VN')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Footer Stats */}
                            {discounts.length > 0 && (
                                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mt-4 gap-2">
                                    <div className="text-muted small">
                                        Tổng cộng <strong>{discounts.length}</strong> mã giảm giá
                                    </div>
                                    {selectedDiscounts.length > 0 && (
                                        <div className="badge bg-primary-subtle text-primary fs-6 px-3 py-2">
                                            Đã chọn {selectedDiscounts.length} mã
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
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
                
                .font-monospace {
                    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
                }
                
                @media (max-width: 991.98px) {
                    .card-body .p-3:hover {
                        background-color: #f8fafc;
                    }
                }
            `}</style>
        </div>
    );
};

export default DiscountList;