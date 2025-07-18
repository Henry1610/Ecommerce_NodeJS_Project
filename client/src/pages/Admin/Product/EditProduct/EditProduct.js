import React, { useEffect, useState, useRef } from 'react';
import './EditProduct.css';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, resetProductDetail, updateProduct } from '../../../../redux/admin/productsSlice';
import { toast } from 'react-toastify';
import { fetchBrands } from '../../../../redux/admin/brandSlice';
import { fetchCategories } from '../../../../redux/admin/categoriesSlice'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { generateSlug } from '../../../../untils/generateSlug';
const EditProduct = () => {
    const dispatch = useDispatch()
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const { brands } = useSelector(state => state.admin.adminBrand);
    const { categories } = useSelector(state => state.admin.adminCategory);
    const { product, error, loading } = useSelector(state => state.admin.adminProduct)
    const [attributesList, setAttributesList] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef();

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
        color: '',
        attributes: {},
    });
    const [imagesFromServer, setImagesFromServer] = useState([]); // ảnh cũ từ DB
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


            setFormData({
                name: product.name || '',
                category: product.category._id || '',
                brand: product.brand?._id || '',
                stock: product.stock || 0,
                description: product.description || '',
                statusCurrent: product.statusCurrent || 'unactive',
                discountPercent: product.discountPercent?.toString() || 0,
                price: product.price || '',
                images: product.images || [],
                color: product.color || '',
                attributes: product.attributes || {}
            });

            setImagesFromServer(product.images || []);
        }
    }, [product]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setNewFiles(prev => [...prev, ...files]);
    };


    const handleRemoveImage = (index, isNew = false) => {
        if (isNew) {
            setNewFiles(prev => prev.filter((_, i) => i !== index));
        }
        else {
            setImagesFromServer(prev => prev.filter((_, i) => i !== index));
        }
    };
    useEffect(() => {
        const initialAttributes = formData.attributes
            ? Object.entries(formData.attributes)
            : [];
        setAttributesList(initialAttributes);
    }, [formData.attributes]);

    const handleAttributeChange = (index, field, value) => {
        const updatedAttributes = [...attributesList];
        updatedAttributes[index] = [
            field === "key" ? value : updatedAttributes[index][0],
            field === "value" ? value : updatedAttributes[index][1]
        ]
        setAttributesList(updatedAttributes);
        const attributesObject = Object.fromEntries(updatedAttributes);
        setFormData(prev => ({
            ...prev, attributes: attributesObject
        }

        ))
    };

    const handleAddAttribute = () => {
        const updated = [...attributesList, ['', '']];
        setAttributesList(updated);

        // // Cập nhật formData.attributes
        // const attributesObject = Object.fromEntries(updated);
        // setFormData(prev => ({
        //     ...prev,
        //     attributes: attributesObject
        // }));
    };

    const handleRemoveAttribute = (index) => {
        const updated = attributesList.filter((_, i) => i !== index);
        setAttributesList(updated);

        // Cập nhật formData.attributes
        const attributesObject = Object.fromEntries(updated);
        setFormData(prev => ({
            ...prev,
            attributes: attributesObject
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const productData = new FormData();
            const name = formData.name || "";
            const slug = generateSlug(name);
            productData.append("slug", slug);
            // Append từng key
            for (const key in formData) {
                if (key === "images") {
                    newFiles.forEach((file) => productData.append("newImages", file));
                } else if (key === "attributes") {
                    productData.append(key, JSON.stringify(formData[key]));
                } else {
                    productData.append(key, formData[key]);
                }
            }
            imagesFromServer.forEach((img) => productData.append("oldImages", img));

            await dispatch(updateProduct({ productId, productData })).unwrap();
            toast.success("Cập nhật sản phẩm thành công!");
        } catch (err) {
            toast.error("Cập nhật sản phẩm thất bại!");
            console.error("Update error:", err);
        }
    };



    const renderedImages = [
        ...imagesFromServer.map(name => ({
            src: name, // hoặc Cloudinary link
            name,
            isNew: false
        })),
        ...newFiles.map(file => ({
            src: URL.createObjectURL(file),
            name: file.name,
            isNew: true
        }))
    ];

    return (
        <div className="container py-4">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-secondary"><i className="fas fa-home me-1"></i>Trang chủ</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to="/admin/product" className="text-secondary">Sản phẩm</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">Chi tiết sản phẩm</li>
                </ol>
            </nav>

            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                <h2 className="h3 mb-3 mb-md-0 fw-bold text-dark">Chi tiết sản phẩm</h2>
                <div className="d-flex gap-2">
                    <Link to="/admin/product" className="btn btn-outline-secondary">
                        <i className="fas fa-arrow-left"></i> Quay lại
                    </Link>
                    <button
                        type="button"
                        class="btn btn-primary d-inline-flex align-items-center px-4 py-2 shadow-sm rounded text-white"
                        onClick={e => handleSubmit(e)}
                    >
                        <i class="fas fa-save me-2"></i>
                        Lưu thay đổi
                    </button>


                </div>
            </div>

            <div className="row g-4">
                {/* Thông tin cơ bản */}
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Thông tin cơ bản</h5>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Tên sản phẩm</label>
                                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Thương hiệu</label>
                                    <select
                                        className="form-select"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Brand</option>
                                        {brands.map(brand => (
                                            <option key={brand._id} value={brand._id}>{brand.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Giá bán</label>
                                    <div className="input-group">
                                        <input
                                            onChange={handleInputChange}

                                            name="price"
                                            type="text"
                                            className="form-control"
                                            value={formData.price?.toLocaleString('vi-VN')}

                                        />
                                        <span className="input-group-text">VNĐ</span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Giảm giá (%)</label>
                                    <input
                                        name="discountPercent"
                                        type="number"
                                        className="form-control"
                                        value={formData.discountPercent || 0}
                                        onChange={handleInputChange}


                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Số lượng tồn kho</label>
                                    <input
                                        name="stock"

                                        type="number"
                                        className="form-control"
                                        value={formData.stock || 0}
                                        onChange={handleInputChange}


                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Màu sắc</label>
                                    <input
                                        name="color"
                                        type="text"
                                        className="form-control"
                                        value={formData.color || ''}
                                        onChange={handleInputChange}


                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Danh mục</label>
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
                                    <label className="form-label">Trạng thái</label>
                                    <select
                                        className="form-select"
                                        name="statusCurrent"
                                        value={formData.statusCurrent}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Status</option>
                                        <option value="active">Active</option>
                                        <option value="unactive">Unactive</option>

                                    </select>
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Mô tả</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        className="form-control"
                                        value={formData.description || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slide ảnh */}
                <div className="col-lg-4">
                    <div className="card shadow-sm rounded-4 border-0">
                        <div className="card-body">
                            {/* Ảnh chính */}
                            {renderedImages.length > 0 ? (
                                <Swiper
                                    loop
                                    spaceBetween={10}
                                    navigation
                                    pagination={{ clickable: true }}
                                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                    modules={[Pagination, Navigation, Thumbs]}
                                    className="mySwiper2 rounded-4 border"
                                    initialSlide={activeIndex}
                                    onSwiper={swiper => (swiperRef.current = swiper)}
                                    onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
                                >
                                    {renderedImages.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <div
                                                className="position-relative mx-auto bg-white"
                                                style={{
                                                    width: '100%',
                                                    paddingTop: '100%',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    border: '1px solid #eee',
                                                }}
                                            >
                                                <img
                                                    src={img.src}
                                                    alt={product?.slug || 'product'}
                                                    className="position-absolute top-0 start-0 w-100 h-100"
                                                    style={{ objectFit: 'contain', transition: 'transform 0.3s' }}
                                                    loading="lazy"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index, img.isNew)}
                                                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                                    style={{
                                                        transform: 'translate( -20%,20%)',
                                                        borderRadius: '50%',
                                                        width: '26px',
                                                        height: '26px',
                                                        padding: 0,
                                                        fontSize: '16px',
                                                        fontWeight: 'bold',
                                                        zIndex: 10,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        lineHeight: 1,
                                                    }}
                                                    title="Xoá ảnh"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                <div className="text-center py-5 text-muted">Chưa có ảnh sản phẩm</div>
                            )}

                            {/* Thumbnail */}
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                loop={false}
                                spaceBetween={12}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress
                                modules={[Pagination, Navigation, Thumbs]}
                                className="mySwiper mt-3"
                            >
                                {renderedImages?.map((img, index) => (
                                    <SwiperSlide key={index} className="cursor-pointer">
                                        <div
                                            className="mx-auto"
                                            style={{
                                                width: '70px',
                                                height: '70px',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                border: '2px solid #eee',
                                                position: 'relative',
                                            }}
                                        >
                                            <img
                                                src={img.src}
                                                alt={product?.slug || 'thumbnail'}
                                                className="position-absolute top-0 start-0 w-100 h-100"
                                                style={{ objectFit: 'cover' }}
                                                loading="lazy"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Upload ảnh */}
                            <div className="mt-3">
                                <input
                                    type="file"
                                    multiple
                                    className="form-control form-control-sm"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="px-4 pb-4">
                            <h2 className="h6 fw-semibold text-dark mb-3 mt-3">Thông tin sản phẩm</h2>
                            <div className="bg-body p-3 rounded-3 border">
                                <ul className="list-unstyled text-secondary mb-0 small">
                                    {attributesList.map(([key, value], index) => (
                                        <li key={index} className="d-flex align-items-center gap-2 mb-2">
                                            <input
                                                type="text"
                                                className="form-control form-control-sm w-25"
                                                value={key}
                                                onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                                                placeholder="Tên thuộc tính"
                                            />
                                            <span>:</span>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm w-50"
                                                value={value}
                                                onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                                placeholder="Giá trị"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAttribute(index)}
                                                className="btn p-0 border-0 text-danger"
                                                style={{
                                                    fontSize: '1.2rem',
                                                    width: '24px',
                                                    height: '24px',
                                                }}
                                                title="Xoá"
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    type="button"
                                    className="btn btn-sm mt-2 text-primary bg-light-subtle border rounded-2"
                                    onClick={handleAddAttribute}
                                >
                                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>+</span> Thêm thuộc tính
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


            </div>






        </div>
    );
};

export default EditProduct;