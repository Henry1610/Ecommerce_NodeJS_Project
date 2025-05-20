
import React, { useEffect, useState } from 'react';
import './EditCategory.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchCategoryById, resetCategoryDetail, updateCategory } from '../../../../redux/category/categoriesSlice';

const EditCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: categoryId } = useParams();
    const { loading, error, category } = useSelector(state => state.categories)
    console.log('categoryId:',categoryId);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    useEffect(() => {
        if (!categoryId) return;

        dispatch(fetchCategoryById(categoryId))
            .unwrap()
            .catch((error) => {
                toast.error(`Lỗi khi tải thương hiệu: ${error}`);
            });

        return () => {
            dispatch(resetCategoryDetail());
        };
    }, [dispatch, categoryId])
    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                description: category.description || '',
            });
        }
    }, [category]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateCategory({ categoryId,formData }))
            .unwrap()
            .then(() => {
                toast.success('Cập nhật category thành công!');
                navigate('/admin/category');
            })
            .catch((err) => {
                toast.error(`Lỗi: ${err}`);
            });
    };


    return (


        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="mb-4">
                        <h4 className="fw-bold">Product Category Edit</h4>
                        <h6 className="text-muted">Edit a product Category</h6>
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

export default EditCategory;