import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../../../redux/admin/categoriesSlice';
import { Link } from 'react-router-dom';
import './CategoryList.css';

import { deleteCategory } from '../../../../redux/admin/categoriesSlice';
import Swal from 'sweetalert2';

const CategoryList = () => {
    const dispatch = useDispatch();
    // Lấy categories, loading, error từ redux state
    const { categories, loading, error } = useSelector(state => state.admin.adminCategory);

    const [selectAll, setSelectAll] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        setSelectedCategories(!selectAll ? categories.map(c => c.id) : []);
    };

    const handleSelectCategory = (id) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
        );
    };
    const handleDelete = async (e, categoryId) => {
        e.preventDefault();
      
        const result = await Swal.fire({
          title: 'Bạn có chắc chắn muốn xóa?',
          text: 'Hành động này không thể hoàn tác!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Hủy',
        });
      
        if (result.isConfirmed) {
          try {
            await dispatch(deleteCategory(categoryId)).unwrap();
            await Swal.fire('Đã xóa!', 'Category đã được xóa thành công.', 'success');
          } catch (err) {
            await Swal.fire('Lỗi!', `Không thể xóa: ${err}`, 'error');
          }
        }
      };
      
    // Lọc categories theo searchTerm
    const filteredCategories = categories.filter(category =>
      category?.name?.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    return (
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-12">
                    {/* Header */}
                    <div className="mb-4">
                        <h1 className="h3 fw-bold text-dark mb-2">Quản lý danh mục</h1>
                        <p className="text-muted mb-0">Danh sách và quản lý tất cả danh mục sản phẩm trong hệ thống</p>
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
                                            placeholder="Tìm kiếm danh mục..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            style={{ borderRadius: '10px' }}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-7 d-flex justify-content-end align-items-center mt-2 mt-md-0">
                                    <Link to="/admin/category/add" className="btn btn-primary d-flex align-items-center text-white">
                                        <i className="fas fa-plus me-2"></i>Thêm danh mục
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Table Card */}
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary mb-3" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="text-muted mb-0">Đang tải dữ liệu...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-5">
                                <i className="fas fa-exclamation-triangle text-danger mb-3" style={{ fontSize: '2rem' }}></i>
                                <p className="text-danger mb-0">{error}</p>
                            </div>
                        ) : (
                            <div className="card-body">
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
                                                <th style={{ border: 'none', padding: '12px 16px', fontWeight: 600 }}>Tên danh mục</th>
                                                <th style={{ border: 'none', padding: '12px 16px', fontWeight: 600 }}>Mô tả</th>
                                                <th style={{ width: 120, border: 'none', padding: '12px 16px', fontWeight: 600 }}>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCategories && filteredCategories.length > 0 ? filteredCategories.map(category => (
                                                <tr key={category._id} className="align-middle border-bottom border-light hover-bg-light">
                                                    <td style={{ border: 'none', padding: '12px 16px' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCategories.includes(category._id)}
                                                            onChange={() => handleSelectCategory(category._id)}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    </td>
                                                    <td style={{ fontWeight: 600, fontSize: 15, border: 'none', padding: '12px 16px' }}>{category.name}</td>
                                                    <td style={{ color: '#555', fontSize: 14, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: 'none', padding: '12px 16px' }}>{category.description || 'Không có mô tả'}</td>
                                                    <td style={{ border: 'none', padding: '12px 16px' }}>
                                                        <div className="d-flex gap-2 justify-content-center">
                                                            <Link to={`edit/${category._id}`} className="btn btn-sm" style={{ background: '#f3f6fa', color: '#2563eb', borderRadius: 8, border: 'none', boxShadow: '0 1px 4px rgba(59,130,246,0.06)' }} title="Sửa">
                                                                <i className="fas fa-edit"></i>
                                                            </Link>
                                                            <button className="btn btn-sm" style={{ background: '#fef2f2', color: '#dc2626', borderRadius: 8, border: 'none', boxShadow: '0 1px 4px rgba(245,62,94,0.06)' }} title="Xoá" onClick={(e) => handleDelete(e, category._id)}>
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-5">
                                                        <i className="fas fa-folder-open text-muted mb-3" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                                                        <p className="text-muted mb-0">Không có danh mục nào.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
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

export default CategoryList;
