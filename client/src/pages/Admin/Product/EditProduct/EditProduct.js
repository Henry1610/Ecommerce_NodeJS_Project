import React, { useEffect, useState } from 'react';
import './EditProduct.css';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, resetProductDetail, updateProduct } from '../../../../redux/product/productsSlice';
import { toast } from 'react-toastify';
import { fetchBrands } from '../../../../redux/brand/brandSlice';
import { fetchCategories } from '../../../../redux/category/categoriesSlice'
const EditProduct = () => {
    const dispatch = useDispatch()
    const { brands } = useSelector(state => state.brands);
    const { categories } = useSelector(state => state.categories);
    const { product, error, loading } = useSelector(state => state.products)
    const { id: productId } = useParams()
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        brand: '',
        stock: '',
        description: '',
        statusCurrent: '',
        discountPercent: 'Percentage',
        price: '',
        images: null,
        color: ''
    });
    const [imagesFromServer, setImagesFromServer] = useState([]); // ảnh cũ từ DB
    const [imagesPreview, setImagesPreview] = useState([]); // preview ảnh mới
    const [newFiles, setNewFiles] = useState([]);                 // File[] ảnh mới

    useEffect(() => {
        if (!productId) {
            return;
        }
        dispatch(fetchBrands())
            .unwrap()
            .catch((error) => {
                toast.error(`Lỗi khi tải brand: ${error}`);
            });
        dispatch(fetchCategories())
            .unwrap()
            .catch((error) => {
                toast.error(`Lỗi khi tải category: ${error}`);
            });
        dispatch(fetchProductById(productId))
            .unwrap()
            .catch((error) => {
                toast.error(`Lỗi khi tải product: ${error}`);
            });
        return () => {
            dispatch(resetProductDetail());
        };
    }, [dispatch, productId])
    useEffect(() => {
        if (product) {
            const {
                name, category, brand, stock, description,
                statusCurrent, discountPercent, price, images, color
            } = product;

            setFormData({
                name: product.name || '',
                category: product.category._id || '',
                brand: product.brand?._id || '',
                stock: product.stock || '',
                description: product.description || '',
                statusCurrent: product.statusCurrent || '',
                discountPercent: product.discountPercent?.toString() || '',
                price: product.price || '',
                images: product.images || null,
                color: product.color || ''
            });

            setImagesFromServer(images || []);
        }
    }, [product]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagesPreview(prev => [...prev, ...newPreviews]);
        setNewFiles(prev => [...prev, ...files]);
    };


    const handleRemoveImage = (index, isNew = false) => {
        if (isNew) {
            setImagesPreview(prev => prev.filter((_, i) => i !== index));
            setNewFiles(prev => prev.filter((_, i) => i !== index));
        }
        else {
            setImagesFromServer(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = new FormData();
        for (const key in formData) {
            if (key === "images") {
                // console.log('đã vào ');
                console.log('đã vào');
                console.log('newFiles:', newFiles.length);

                // console.log('newFiles.length:',newFiles.length);
                for (let i = 0; i < newFiles.length; i++) {

                    productData.append('newImages', newFiles[i])
                }
            }
            else {
                productData.append(key, formData[key])
            }
        }
        productData.append('oldImages', JSON.stringify(imagesFromServer))
        // console.log('oldImages:',imagesFromServer);

        dispatch(updateProduct({ productId, productData }));
        const data = Object.fromEntries(productData.entries());

        console.log('data:', data);
    };
    const renderImages = (images, isServer = false, isNew = false) =>
        images.map((src, index) => (
            <div
                key={index}
                className="position-relative"
                style={{ width: '120px', height: '120px' }}
            >
                <img
                    src={isServer ? `http://localhost:5000/uploads/products/${product.slug}/${src}` : src}
                    alt={`Preview ${index}`}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                    }}
                />
                <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    style={{
                        transform: 'translate(50%, -50%)',
                        borderRadius: '50%',
                        padding: '4 6px',
                        fontSize: '12px',
                        lineHeight: '1',
                    }}
                    onClick={() => handleRemoveImage(index, isNew)}
                >
                    <div className='fw-bold'>X</div>
                </button>
            </div>
        ));

    return (
        <div className="container-fluid py-4">

            <div className="col-12">
                <div className="mb-4">
                    <h4 className="fw-bold">Product Edit</h4>
                    <h6 className="text-muted">Update your product</h6>
                </div>

                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Product Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Price ($)</label>
                        <input
                            type="number"
                            className="form-control"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Stock</label>
                        <input
                            type="number"
                            className="form-control"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Color</label>
                        <input
                            type="text"
                            className="form-control"
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Category</label>
                        <select
                            className="form-select"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Brand</label>
                        <select
                            className="form-select"
                            name="brand"
                            value={formData.brand}
                            onChange={handleInputChange}
                            required
                        >
                            {
                                brands.map(brand => {
                                    return (<option key={brand._id} value={brand._id}>{brand.name}</option>)
                                })
                            }
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select
                            className="form-select"
                            name="statusCurrent"
                            value={formData.statusCurrent}
                            onChange={handleInputChange}
                        >
                            {
                                categories.map(brand => {
                                    return (<option key={brand._id} value={brand._id}>{brand.name}</option>)
                                })
                            }
                            <option value="unactive">Inactive</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Discount (%)</label>
                        <input
                            type="number"
                            className="form-control"
                            name="discountPercent"
                            value={formData.discountPercent}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                        />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Images</label>
                        <input
                            type="file"
                            multiple
                            className="form-control"
                            accept="image/*"
                            onChange={handleFileChange}

                        />
                        <div className="grid grid-cols-4 gap-5 d-flex mt-4 ">

                            <div className="preview-images d-flex flex-wrap gap-4 mt-2">
                                {imagesFromServer.length > 0 && renderImages(imagesFromServer, true, false)}
                            </div>
                            <div className="preview-images d-flex flex-wrap gap-4 mt-2">
                                {imagesPreview.length > 0 && renderImages(imagesPreview, false, true)}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12 d-flex gap-2">
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                        <Link to="/admin/product" className="btn btn-warning">
                            Cancel
                        </Link>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default EditProduct;