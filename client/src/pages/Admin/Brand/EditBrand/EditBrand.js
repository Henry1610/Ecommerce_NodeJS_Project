import React, { useState, useEffect } from 'react';
import './EditBrand.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrandById, resetBrandDetail, updateBrand } from '../../../../redux/brand/brandSlice'
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const EditBrand = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { loading, error, brand } = useSelector(state => state.brands)
    const { id: brandId } = useParams()
    const [name, setName] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [preview, setPreview] = useState(null);


    useEffect(() => {
        if (!brandId) return;

        dispatch(fetchBrandById(brandId))
            .unwrap()
            .catch((error) => {
                toast.error(`Lỗi khi tải thương hiệu: ${error}`);
            });

        return () => {
            dispatch(resetBrandDetail());
        };
    }, [dispatch, brandId])

    
    useEffect(() => {
        if (brand) {
            setName(brand.name || '');
            setPreview(`http://localhost:5000/uploads/brands/${brand.logo}`);

        }
    }, [brand]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);

            // Tạo ảnh preview từ file tạm (blob URL)
            setPreview(URL.createObjectURL(file));
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('name', name);
        if (logoFile) {
            formData.append('logo', logoFile);
        }

        const brandData = new FormData();
        brandData.append('name', name);
        brandData.append('logo', logoFile);


        dispatch(updateBrand({ brandId, brandData }))
            .unwrap()
            .then(() => {

                toast.success('Cập nhật brand thành công!')
                navigate('/admin/brand');
            })
            .catch((err) => {
                toast.error(`Lỗi: ${err}`);
            });
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="mb-4">
                        <h4 className="fw-bold">Brand Edit</h4>
                        <h6 className="text-muted">Update your Brand</h6>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Brand Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Brand Logo</label>
                                        {(preview) ? (
                                            <div className="position-relative d-inline-block border rounded" style={{ width: '100%' }}>
                                                <img
                                                    src={preview}
                                                    alt={name}
                                                    className="img-fluid rounded"
                                                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded"
                                                    onClick={() => setPreview(null)}
                                                    style={{ lineHeight: '01', padding: '0 0.45rem', fontSize: '30px' }}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-muted">No logo available</div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="form-label">Brand Image</label>
                                        <div className="image-upload">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />

                                            <div className="image-uploads">
                                                <img src="assets/img/icons/upload.svg" alt="upload" />
                                                <h4>Drag and drop a file to upload</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-12 d-flex gap-2">
                                    <button
                                        className="btn btn-submit"
                                        onClick={(e) => { handleSubmit(e) }}
                                    >
                                        Submit
                                    </button>
                                    <a href="brandlist.html" className="btn btn-cancel">
                                        Cancel
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditBrand;