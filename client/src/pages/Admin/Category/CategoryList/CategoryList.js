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
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold">Product Category List</h4>
                            <h6 className="text-muted">View/Search product Category</h6>
                        </div>
                        <Link  to="/admin/category/add" className="btn btn-primary d-flex align-items-center">
                            <i className="fas fa-plus me-2"></i>Add Category
                        </Link>
                    </div>
                    <div className="row mb-3">
                        <div className="col-lg-4 col-md-6 col-12">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm kiếm danh mục..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                <button className="btn btn-searchset btn-primary" type="button">
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            {loading && <p>Loading categories...</p>}
                            {error && <p className="text-danger">{error}</p>}

                            {!loading && !error && (
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
                                                <th style={{ border: 'none' }}>Tên danh mục</th>
                                                <th style={{ border: 'none' }}>Mô tả</th>
                                                <th style={{ width: 120, border: 'none' }}>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCategories.map(category => (
                                                <tr key={category._id} className="align-middle" style={{ transition: 'box-shadow 0.2s, background 0.2s', border: 'none', borderRadius: 12, boxShadow: '0 1px 8px rgba(59,130,246,0.06)', marginBottom: 8, background: '#fff' }}>
                                                    <td style={{ border: 'none' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCategories.includes(category._id)}
                                                            onChange={() => handleSelectCategory(category._id)}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    </td>
                                                    <td style={{ fontWeight: 600, fontSize: 16, border: 'none' }}>{category.name}</td>
                                                    <td style={{ color: '#555', fontSize: 15, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: 'none' }}>{category.description || 'Không có mô tả'}</td>
                                                    <td style={{ border: 'none' }}>
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
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryList;
