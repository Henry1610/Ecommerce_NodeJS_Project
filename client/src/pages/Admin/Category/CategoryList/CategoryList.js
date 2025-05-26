import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../../../redux/category/categoriesSlice';
import { Link } from 'react-router-dom';
import './CategoryList.css';

import { deleteCategory } from '../../../../redux/category/categoriesSlice';
import Swal from 'sweetalert2';

const CategoryList = () => {
    const dispatch = useDispatch();
    // Lấy categories, loading, error từ redux state
    const { categories, loading, error } = useSelector(state => state.categories);

    const [selectAll, setSelectAll] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

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

                    <div className="card shadow-sm">
                        <div className="card-body">
                            {loading && <p>Loading categories...</p>}
                            {error && <p className="text-danger">{error}</p>}

                            {!loading && !error && (
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
                                                <th>Category Name</th>
                                                <th>Description</th>
                                                <th>Action</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map(category => (
                                                <tr key={category.id}>
                                                    <td>
                                                        <label className="checkboxs">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedCategories.includes(category.id)}
                                                                onChange={() => handleSelectCategory(category.id)}
                                                            />
                                                            <span className="checkmarks"></span>
                                                        </label>
                                                    </td>
                                                    <td>{category.name}</td>
                                                    <td>{category.description}</td>
                                                    <td className="action-icons">
                                                        <Link to={`edit/${category._id}`} className="me-2" title="Edit">
                                                            <i className="fas fa-edit"></i>
                                                        </Link>
                                                        <button href="#" className="confirm-text" title="Delete" onClick={(e) => handleDelete(e, category._id)}>
                                                            <i className="fas fa-trash"></i>
                                                        </button>
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
