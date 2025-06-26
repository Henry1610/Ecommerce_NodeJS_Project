import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import './AddCategory.css';
import { addCategory } from '../../../../redux/admin/categoriesSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
const AddCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.description.trim()) {
            toast.error('Vui lòng điền đầy đủ tên và mô tả.');
            return;
          }
          
        try {
            await dispatch(addCategory(formData)).unwrap();
            toast.success('Thêm category thành công!');
            navigate('/admin/category');
        } catch (error) {
            toast.error(`Thêm category thất bại: ${error}`);
        }
    };


    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="mb-4">
                        <h4 className="fw-bold">Product Category Add</h4>
                        <h6 className="text-muted">Create new product Category</h6>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-lg-6 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Category Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="col-lg-12 d-flex gap-2">
                                    <button
                                        className="btn btn-submit"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </button>
                                    <Link to="/admin/category" className="btn btn-cancel">
                                        Cancel
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCategory;