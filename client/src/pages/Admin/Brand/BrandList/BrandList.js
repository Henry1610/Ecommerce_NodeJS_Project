import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './BrandList.css';
import { Link } from 'react-router-dom';
import { fetchBrands, removeBrand } from '../../../../redux/admin/brandSlice'
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
const API_BASE = process.env.REACT_APP_SERVER_URL;

const BrandList = () => {
    const dispatch = useDispatch();
    const { brands, error, loading } = useSelector(state => state.admin.adminBrand);


    useEffect(() => {
        dispatch(fetchBrands())
            .unwrap()
          
            .catch(error => {
                console.error('Lỗi khi tải brands:', error);
                toast.error(`Lỗi khi tải brands: ${error}`);
            });
    }, [dispatch]);

    const [selectAll, setSelectAll] = useState(false);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

   
    const handleRemove = (e, brandId) => {
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
        }).then(async(result) => {
              if (result.isConfirmed) {
                try {
                  await dispatch(removeBrand(brandId)).unwrap(); 
                  toast.success('Xoá brand thành công!');
                  dispatch(fetchBrands()); 
                } catch (error) {
                  toast.error('Xoá brand thất bại!');
                }
              }
            });
      };
    const handleSelectAll = () => {
        if (!brands || brands.length === 0) return;
        setSelectAll(!selectAll);
        setSelectedBrands(!selectAll ? brands.map(b => b.id) : []);
    };

    const handleSelectBrand = (id) => {
        setSelectedBrands(prev =>
            prev.includes(id) ? prev.filter(bid => bid !== id) : [...prev, id]
        );
    };

    // Lọc brands theo searchTerm
    const filteredBrands = brands.filter(brand =>
      brand?.name?.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-body text-center p-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Đang tải...</span>
                                </div>
                                <p className="mt-3">Đang tải danh sách thương hiệu...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

  
    if (!brands || brands.length === 0) {
        return (
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h4 className="fw-bold">Brand List</h4>
                                <h6 className="text-muted">Manage your Brand</h6>
                            </div>
                            <Link to="/admin/brand/add" className="btn btn-primary d-flex align-items-center">
                                <i className="fas fa-plus me-2"></i>Add Brand
                            </Link>
                        </div>
                        <div className="card shadow-sm">
                            <div className="card-body text-center p-5">
                                <div className="text-muted mb-3">
                                    <i className="fas fa-box-open fa-3x"></i>
                                </div>
                                <h5>Chưa có thương hiệu nào</h5>
                                <p>Hãy thêm thương hiệu mới để bắt đầu</p>
                                <Link to="/admin/brand/add" className="btn btn-primary mt-3">
                                    <i className="fas fa-plus me-2"></i>Thêm thương hiệu mới
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-12">
                    {/* Header */}
                    <div className="mb-4">
                        <h1 className="h3 fw-bold text-dark mb-2">Quản lý thương hiệu</h1>
                        <p className="text-muted mb-0">Danh sách và quản lý tất cả thương hiệu trong hệ thống</p>
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
                                            placeholder="Tìm kiếm thương hiệu..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            style={{ borderRadius: '10px' }}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-7 d-flex justify-content-end align-items-center mt-2 mt-md-0">
                                    <Link to="/admin/brand/add" className="btn btn-primary d-flex align-items-center">
                                        <i className="fas fa-plus me-2"></i>Thêm thương hiệu
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Table Card */}
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                        <div className="card-body">

                            <div className="collapse" id="filter_inputs">
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Brand Name"
                                                />
                                            </div>
                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Brand Description"
                                                />
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
                                <table className="table align-middle mb-0">
                                    <thead style={{ background: '#f3f6fa', borderBottom: '2px solid #e0e7ef' }}>
                                        <tr>
                                            <th style={{ width: 40, border: 'none', padding: '12px 16px', fontWeight: 600 }}>
                                                <input
                                                    type="checkbox"
                                                    id="select-all"
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </th>
                                            <th style={{ width: 90, border: 'none', padding: '12px 16px', fontWeight: 600 }}>Logo</th>
                                            <th style={{ border: 'none', padding: '12px 16px', fontWeight: 600 }}>Tên thương hiệu</th>
                                            <th style={{ border: 'none', padding: '12px 16px', fontWeight: 600 }}>Mô tả</th>
                                            <th style={{ width: 120, border: 'none', padding: '12px 16px', fontWeight: 600 }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBrands && filteredBrands.length > 0 ? filteredBrands.map(brand => (
                                            <tr key={brand._id} className="align-middle border-bottom border-light hover-bg-light">
                                                <td style={{ border: 'none', padding: '12px 16px' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedBrands.includes(brand._id)}
                                                        onChange={() => handleSelectBrand(brand._id)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </td>
                                                <td style={{ border: 'none', padding: '12px 16px' }}>
                                                    <div style={{ width: 80, height: 50, borderRadius: '8px', overflow: 'hidden', background: '#e0e7ef', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 2px 8px rgba(59,130,246,0.08)' }}>
                                                        {brand.logo ? (
                                                            <img
                                                                src={brand.logo.startsWith('http') ? brand.logo : `${API_BASE}/${brand.logo}`}
                                                                alt={brand.name}
                                                                style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }}
                                                            />
                                                        ) : (
                                                            <i className="fas fa-image text-muted" style={{ fontSize: 24 }} title="No logo" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 600, fontSize: 15, border: 'none', padding: '12px 16px' }}>{brand.name}</td>
                                                <td style={{ color: '#555', fontSize: 14, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: 'none', padding: '12px 16px' }}>{brand.description || 'Không có mô tả'}</td>
                                                <td style={{ border: 'none', padding: '12px 16px' }}>
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <Link to={`/admin/brand/edit/${brand._id}`} className="btn btn-sm" style={{ background: '#f3f6fa', color: '#2563eb', borderRadius: 8, border: 'none', boxShadow: '0 1px 4px rgba(59,130,246,0.06)' }} title="Sửa">
                                                            <i className="fas fa-edit"></i>
                                                        </Link>
                                                        <button className="btn btn-sm" style={{ background: '#fef2f2', color: '#dc2626', borderRadius: 8, border: 'none', boxShadow: '0 1px 4px rgba(245,62,94,0.06)' }} title="Xoá" onClick={(e) => handleRemove(e, brand._id)}>
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5">
                                                    <i className="fas fa-tag text-muted mb-3" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                                                    <p className="text-muted mb-0">Không có thương hiệu nào.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .hover-bg-light:hover {
                    background-color: #f8fafc !important;
                }
            `}</style>
        </div>
    );
};

export default BrandList;