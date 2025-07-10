import React, { useState, useEffect } from 'react';
import './EditBrand.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrandById, resetBrandDetail, updateBrand } from '../../../../redux/admin/brandSlice'
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const EditBrand = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { loading, error, brand } = useSelector(state => state.admin.adminBrand)
    const { id: brandId } = useParams()
    const [name, setName] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [removeLogo, setRemoveLogo] = useState(false);


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
            setPreview(brand.logo || null);
        }
    }, [brand]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setPreview(URL.createObjectURL(file));
            setRemoveLogo(false);
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const brandData = new FormData();
        brandData.append('name', name);
        if (logoFile) {
            brandData.append('logo', logoFile);
        }
        if (removeLogo) {
            brandData.append('removeLogo', 'true');
        }

        try {
            await dispatch(updateBrand({ brandId, brandData })).unwrap();
            toast.success('Cập nhật brand thành công!');
            navigate('/admin/brand');
        } catch (err) {
            toast.error(`Lỗi: ${err}`);
        }
    };


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
                                        {preview ? (
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
                                                    onClick={() => { setPreview(null); setLogoFile(null); setRemoveLogo(true); }}
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
                                                accept="image/*,.svg"
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
                                    <button
                                        type="button"
                                        className="btn btn-cancel"
                                        onClick={() => navigate('/admin/brand')}
                                    >
                                        Cancel
                                    </button>
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