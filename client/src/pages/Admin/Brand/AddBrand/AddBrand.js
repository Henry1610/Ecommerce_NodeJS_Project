import React, { useState, useRef, useEffect } from 'react';
import './AddBrand.css';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addBrand } from '../../../../redux/admin/brandSlice';
import { useNavigate } from 'react-router-dom';

const AddBrand = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        logo: null,
    });
    const [previewUrl, setPreviewUrl] = useState(null);

    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        setFormData((prev) => ({ ...prev, logo: file || null }));

        // Clean up previous preview URL
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleRemoveImage = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setFormData((prev) => ({ ...prev, logo: null }));
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name) {
            toast.error('Tên brand không được để trống!');
            return;
        }
        if (!formData.logo) {
            toast.error('Vui lòng chọn ảnh logo!');
            return;
        }

        const brandData = new FormData();
        brandData.append('name', formData.name);
        brandData.append('logo', formData.logo);
        
        try {
            await dispatch(addBrand(brandData)).unwrap();
            toast.success('Thêm brand thành công!');
            setFormData({ name: '', logo: null });
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(null);
            navigate('/admin/brand');
        } catch (error) {
            toast.error('Thêm brand thất bại: ' + error.message);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="mb-4">
                        <h4 className="fw-bold">Brand Add</h4>
                        <h6 className="text-muted">Create new Brand</h6>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-lg-3 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label className="form-label">Brand Name</label>
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
                                            <label className="form-label">Brand Image</label>
                                            <div className="image-upload">
                                                <input
                                                    name="logo"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    ref={fileInputRef}
                                                />
                                                <div className="image-uploads">
                                                    <img src="assets/img/icons/upload.svg" alt="upload" />
                                                    <h4>Drag and drop a file to upload</h4>
                                                </div>
                                            </div>
                                            {previewUrl && (
                                                <div className="mt-3" style={{ position: 'relative', display: 'inline-block' }}>
                                                    <img
                                                        src={previewUrl}
                                                        alt="Brand preview"
                                                        style={{ maxWidth: '240px', height: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage}
                                                        aria-label="Remove image"
                                                        title="Remove image"
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-8px',
                                                            right: '-8px',
                                                            width: '28px',
                                                            height: '28px',
                                                            borderRadius: '50%',
                                                            border: 'none',
                                                            background: '#ef4444',
                                                            color: '#fff',
                                                            cursor: 'pointer',
                                                            lineHeight: '28px',
                                                            textAlign: 'center',
                                                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-lg-12 d-flex gap-2">
                                        <button type="submit" className="btn btn-submit">
                                            Submit
                                        </button>
                                        <a href="brandlist.html" className="btn btn-cancel">
                                            Cancel
                                        </a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBrand;
