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
            <div className="row justify-content-center">
                <div className="col-12 ">
                    <div className="mb-4">
                        <h4 className="fw-bold mb-1 text-white" style={{ fontSize: 24 }}>Thêm sản phẩm mới</h4>
                        <h6 className="text-muted mb-0">Tạo sản phẩm cho cửa hàng</h6>
                    </div>
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-2">
                                    <div className="col-md-6 col-lg-4">
                                        <label className="form-label mb-1 small">Tên sản phẩm</label>
                                        <input type="text" className="form-control form-control-sm rounded-3" name="name" value={formData.name} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <label className="form-label mb-1 small">Danh mục</label>
                                        <select className="form-select form-select-sm rounded-3" name="category" value={formData.category} onChange={handleInputChange}>
                                            <option value="">-- Chọn danh mục --</option>
                                            {categories.map(category => <option key={category._id} value={category._id}>{category.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <label className="form-label mb-1 small">Thương hiệu</label>
                                        <select className="form-select form-select-sm rounded-3" name="brand" value={formData.brand} onChange={handleInputChange}>
                                            <option value="">-- Chọn thương hiệu --</option>
                                            {brands.map(brand => <option key={brand._id} value={brand._id}>{brand.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <label className="form-label mb-1 small">Màu sắc</label>
                                        <input type="text" className="form-control form-control-sm rounded-3" name="color" value={formData.color} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <label className="form-label mb-1 small">Tồn kho</label>
                                        <input type="number" className="form-control form-control-sm rounded-3" name="stock" value={formData.stock} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <label className="form-label mb-1 small">Giá bán (VNĐ)</label>
                                        <input type="number" className="form-control form-control-sm rounded-3" name="price" value={formData.price} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <label className="form-label mb-1 small">Giảm giá (%)</label>
                                        <input type="number" className="form-control form-control-sm rounded-3" name="discountPercent" value={formData.discountPercent} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <label className="form-label mb-1 small">Trạng thái</label>
                                        <select className="form-select form-select-sm rounded-3" name="statusCurrent" value={formData.statusCurrent} onChange={handleInputChange}>
                                            <option value="">-- Chọn trạng thái --</option>
                                            {status.map((sts, idx) => <option key={idx} value={sts}>{sts.charAt(0).toUpperCase() + sts.slice(1)}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label mb-1 small">Mô tả sản phẩm</label>
                                        <textarea className="form-control form-control-sm rounded-3" name="description" rows={2} value={formData.description} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label mb-1 small">Ảnh sản phẩm</label>
                                        <div className="image-upload border rounded-3 p-2 bg-light d-flex align-items-center gap-3 flex-wrap">
                                            <input multiple type="file" accept="image/*" onChange={handleFileChange} style={{ width: 120 }} />
                                            {previewImages.length > 0 && (
                                                <div className="d-flex flex-wrap gap-2">
                                                    {previewImages.map((src, index) => (
                                                        <div key={index} className="position-relative" style={{ width: 72, height: 72 }}>
                                                            <img src={src} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                                                            <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0" style={{ transform: 'translate(50%, -50%)', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', lineHeight: '1' }} onClick={() => handleRemoveImage(index)}>
                                                                <span className='fw-bold'>×</span>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label mb-1 small">Thuộc tính sản phẩm</label>
                                        <div className="bg-light p-2 rounded-3">
                                            {attributesList.map(([key, value], index) => (
                                                <div key={index} className="d-flex align-items-center gap-2 mb-2">
                                                    <input type="text" className="form-control form-control-sm w-25 rounded-3" value={key} onChange={e => handleAttributeChange(index, 'key', e.target.value)} placeholder="Tên thuộc tính" />
                                                    <span>:</span>
                                                    <input type="text" className="form-control form-control-sm w-50 rounded-3" value={value} onChange={e => handleAttributeChange(index, 'value', e.target.value)} placeholder="Giá trị" />
                                                    <button type="button" onClick={() => handleRemoveAttribute(index)} className="btn btn-sm btn-outline-danger px-2 py-0 ms-1" style={{ fontSize: 16, lineHeight: 1 }} title="Xoá"><i className="fas fa-times"></i></button>
                                                </div>
                                            ))}
                                            <button type="button" className="btn btn-sm btn-outline-primary mt-1" onClick={handleAddAttribute}><i className="fas fa-plus me-1"></i>Thêm thuộc tính</button>
                                        </div>
                                    </div>
                                    <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                                        <button type="submit" className="btn btn-primary px-4">Thêm sản phẩm</button>
                                        <Link to="/admin/product" className="btn btn-secondary px-4">Huỷ</Link>
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

export default AddProduct;
