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
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Tìm kiếm thương hiệu..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                        <button className="btn btn-searchset btn-primary" type="button">
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item">
                                        <Link to="#" data-bs-toggle="tooltip" title="PDF">
                                            <i className="fas fa-file-pdf"></i>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link to="#" data-bs-toggle="tooltip" title="Excel">
                                            <i className="fas fa-file-excel"></i>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link to="#" data-bs-toggle="tooltip" title="Print">
                                            <i className="fas fa-print"></i>
                                        </Link>
                                    </li>
                                </ul>
                            </div>

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
                                <table className="table align-middle table-hover shadow-sm" style={{ background: '#fff', borderRadius: 16, overflow: 'hidden' }}>
                                    <thead style={{ background: '#f3f6fa', borderBottom: '2px solid #e0e7ef' }}>
                                        <tr style={{ fontSize: 17, fontWeight: 700, color: '#2563eb' }}>
                                            <th style={{ width: 40, border: 'none' }}>
                                                <input
                                                    type="checkbox"
                                                    id="select-all"
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </th>
                                            <th style={{ width: 90, border: 'none' }}>Logo</th>
                                            <th style={{ border: 'none' }}>Tên thương hiệu</th>
                                            <th style={{ border: 'none' }}>Mô tả</th>
                                            <th style={{ width: 120, border: 'none' }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBrands.map(brand => (
                                            <tr key={brand._id} className="align-middle" style={{ transition: 'box-shadow 0.2s, background 0.2s', border: 'none', borderRadius: 12, boxShadow: '0 1px 8px rgba(59,130,246,0.06)', marginBottom: 8, background: '#fff' }}>
                                                <td style={{ border: 'none' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedBrands.includes(brand._id)}
                                                        onChange={() => handleSelectBrand(brand._id)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </td>
                                                <td style={{ border: 'none' }}>
                                                    <div style={{ width: 100, height: 60, borderRadius: '12px', overflow: 'hidden', background: '#e0e7ef', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 2px 8px rgba(59,130,246,0.08)' }}>
                                                        {brand.logo ? (
                                                            <img
                                                                src={brand.logo.startsWith('http') ? brand.logo : `${API_BASE}/${brand.logo}`}
                                                                alt={brand.name}
                                                                style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }}
                                                            />
                                                        ) : (
                                                            <i className="fas fa-image text-muted" style={{ fontSize: 28 }} title="No logo" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 600, fontSize: 16, border: 'none' }}>{brand.name}</td>
                                                <td style={{ color: '#555', fontSize: 15, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: 'none' }}>{brand.description || 'Không có mô tả'}</td>
                                                <td style={{ border: 'none' }}>
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

export default BrandList;