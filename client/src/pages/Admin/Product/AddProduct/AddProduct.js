import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { generateSlug } from '../../../../untils/generateSlug';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands } from '../../../../redux/admin/brandSlice';
import { fetchCategories } from '../../../../redux/admin/categoriesSlice'
import { addProduct } from '../../../../redux/admin/productsSlice';
import './AddProduct.css';

const AddProduct = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { brands } = useSelector(state => state.admin.adminBrand);
    const { categories } = useSelector(state => state.admin.adminCategory);
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        dispatch(fetchBrands());
        dispatch(fetchCategories());
    }, [dispatch]);
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
        color: '',
        attributes: {}
    });
    const [attributesList, setAttributesList] = useState([]);

    const status = ['active', 'unactive', 'draft'];
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);

        setFormData(prev => {
            const oldFiles = prev.images || [];
            return {
                ...prev,
                images: [...oldFiles, ...newFiles], // cộng dồn file cũ + file mới
            };
        });

        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviews]);


    };
    const handleRemoveImage = (indexToRemove) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== indexToRemove));
        setFormData(prev => {
            const newImages = [...(prev.images || [])];
            newImages.splice(indexToRemove, 1); // remove image file at index
            return {
                ...prev,
                images: newImages
            };
        });
    };

    const handleAttributeChange = (index, field, value) => {
        const updatedAttributes = [...attributesList];
        updatedAttributes[index] = [
            field === "key" ? value : updatedAttributes[index][0],
            field === "value" ? value : updatedAttributes[index][1]
        ];
        setAttributesList(updatedAttributes);

        const attributesObject = Object.fromEntries(updatedAttributes);
        setFormData(prev => ({
            ...prev,
            attributes: attributesObject
        }));
    };

    const handleAddAttribute = () => {
        const updated = [...attributesList, ['', '']];
        setAttributesList(updated);
    };

    const handleRemoveAttribute = (index) => {
        const updated = attributesList.filter((_, i) => i !== index);
        setAttributesList(updated);

        const attributesObject = Object.fromEntries(updated);
        setFormData(prev => ({
            ...prev,
            attributes: attributesObject
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!validateForm()) return;
      
        const productData = new FormData();
        const slug = generateSlug(formData.name);
        productData.append('slug', slug);
        for (const key in formData) {
          if (key === "images" && formData.images) {
            for (let i = 0; i < formData.images.length; i++) {
              productData.append('images', formData.images[i]);
            }
          } else if (key === "attributes") {
            const validAttributes = attributesList
              .filter(([key, value]) => key && value)
              .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
              }, {});
            productData.append(key, JSON.stringify(validAttributes));
          } else {
            productData.append(key, formData[key]);
          }
        }
        
        
        try {
          // Debug formData nếu cần
        //   console.log('FormData entries:', [...productData.entries()]);
      
          await dispatch(addProduct(productData)).unwrap(); // unwrap giúp bắt lỗi chính xác
          toast.success("Thêm sản phẩm thành công!");
          navigate('/admin/product');
        } catch (error) {
          toast.error(`Thêm sản phẩm thất bại: ${error.message}`);
          console.error('Lỗi thêm sản phẩm:', error);
        }
      };
      
    const validateForm = () => {
        const { name, category, brand, stock, description, statusCurrent, discountPercent, price, color, images } = formData;

        if (!name || !category || !brand || !description || !statusCurrent || !price || !color || !stock) {
            toast.error("Vui lòng điền đầy đủ thông tin sản phẩm.");
            return false;
        }

        if (isNaN(price) || price <= 0) {
            toast.error("Giá sản phẩm phải là một số dương.");
            return false;
        }

        if (isNaN(stock) || stock < 0) {
            toast.error("Tồn kho phải là một số lớn hơn hoặc bằng 0.");
            return false;
        }

        if (isNaN(discountPercent) || discountPercent < 0 || discountPercent > 100) {
            toast.error("Giảm giá phải là số từ 0 đến 100.");
            return false;
        }

        if (!images || images.length === 0) {
            toast.error("Vui lòng tải lên ít nhất một ảnh sản phẩm.");
            return false;
        }

        return true;
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="mb-4">
                        <h4 className="fw-bold">Product Add</h4>
                        <h6 className="text-muted">Create new product</h6>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Product Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <select
                                            className="form-select"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                        >
                                            <option>-- Select Category --</option>
                                            {
                                                categories.map(category => {
                                                    return (<option key={category._id} value={category._id}>{category.name}</option>)
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Brand</label>
                                        <select
                                            className="form-select"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleInputChange}
                                        >
                                            <option>-- Select Brand --</option>
                                            {
                                                brands.map(brand => {
                                                    return (<option key={brand._id} value={brand._id}>{brand.name}</option>)
                                                })
                                            }

                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Color</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="color"
                                            value={formData.color}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Stock</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="stock"
                                            value={formData.stock}
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
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">discountPercent</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="discountPercent"
                                            value={formData.discountPercent}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Price</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-select"
                                            name="statusCurrent"
                                            value={formData.statusCurrent}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">-- Select Status --</option>
                                            {status.map((sts, index) => (
                                                <option key={index} value={sts}>
                                                    {sts.charAt(0).toUpperCase() + sts.slice(1)}
                                                </option>
                                            ))}
                                        </select>

                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="form-label">Product Image</label>
                                        <div className="image-upload">
                                            <input
                                                multiple
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
                                {previewImages.length > 0 && (
                                    <div className="preview-images d-flex flex-wrap gap-2 mt-2">
                                        {previewImages.map((src, index) => (
                                            <div
                                                key={index}
                                                className="position-relative"
                                                style={{ width: '100px', height: '100px' }}
                                            >
                                                <img
                                                    src={src}
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
                                                    onClick={() => handleRemoveImage(index)}
                                                >
                                                    <div className='fw-bold'>
                                                        X
                                                    </div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                )}

                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="form-label">Thông tin sản phẩm</label>
                                        <div className="bg-light p-3 rounded">
                                            <ul className="list-unstyled text-secondary mb-0 small">
                                                {attributesList.map(([key, value], index) => (
                                                    <li key={index} className="d-flex align-items-center gap-2 mb-2">
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm w-25"
                                                            value={key}
                                                            onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                                                            placeholder="Tên thuộc tính"
                                                        />
                                                        <span>:</span>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm w-50"
                                                            value={value}
                                                            onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                                                            placeholder="Giá trị"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAttribute(index)}
                                                            className="btn p-0 border-0 bg-transparent text-dark"
                                                            style={{
                                                                fontSize: '1.2rem',
                                                                lineHeight: 1,
                                                                cursor: 'pointer',
                                                                width: '24px',
                                                                height: '24px',
                                                            }}
                                                            aria-label="Xoá thuộc tính"
                                                        >
                                                            ×
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>

                                            <button
                                                type="button"
                                                className="btn btn-sm mt-2 border-0 border-top d-flex align-items-center gap-1 bg-transparent"
                                                onClick={handleAddAttribute}
                                            >
                                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1 }}>+</span>
                                                Thêm thuộc tính
                                            </button>
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
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
