import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Thumbs } from 'swiper/modules';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../../../redux/admin/productsSlice';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
const API_BASE = process.env.REACT_APP_SERVER_URL|| 'http://localhost:5000';

const ProductDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    // Lấy dữ liệu từ store
    const { product, loading, error } = useSelector((state) => state.admin.adminProduct);
    

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [dispatch, id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>Không tìm thấy sản phẩm</div>;
    }

  

    return (
        <div className="container py-4">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/admin/dashboard" className="text-secondary"><i className="fas fa-home me-1"></i>Trang chủ</Link>
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
                        <i className="fas fa-arrow-left me-2"></i>Quay lại
                    </Link>
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
                                    <input type="text" className="form-control" value={product.name} readOnly />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Thương hiệu</label>
                                    <input type="text" className="form-control" value={product.brand.name || ''} readOnly />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Giá bán</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={product.price?.toLocaleString('vi-VN')}
                                            readOnly
                                        />
                                        <span className="input-group-text">VNĐ</span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Giảm giá (%)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={product.discountPercent || 0}
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Số lượng tồn kho</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={product.stock || 0}
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Màu sắc</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={product.color || ''}
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Danh mục</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={product?.category.name || ''}
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Trạng thái</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={product.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                        readOnly
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Mô tả</label>
                                    <textarea
                                        rows={3}
                                        className="form-control"
                                        value={product.description || ''}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slide ảnh */}
                <div className="col-lg-4">
                    <div className="card shadow">
                        <div className="card-body">
                            <Swiper
                                loop
                                spaceBetween={10}
                                navigation
                                pagination={{ clickable: true }}
                                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                modules={[Pagination, Navigation, Thumbs]}
                                className="mySwiper2 rounded"
                            >
                                {product.images?.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={`${API_BASE}/uploads/products/${product._id}/${img}`}
                                            alt={`${product.name} - Ảnh ${index + 1}`}
                                            className="img-fluid rounded mb-2"
                                            loading="lazy"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <Swiper
                                onSwiper={setThumbsSwiper}
                                loop
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode
                                watchSlidesProgress
                                modules={[Pagination, Navigation, Thumbs]}
                                className="mySwiper mt-3"
                            >
                                {product.images?.map((img, index) => (
                                    <SwiperSlide key={index} className="cursor-pointer">
                                        <img
                                            src={`http://localhost:5000/uploads/products/${product._id}/${img}`}
                                            alt={`${product.name} - Ảnh ${index + 1}`}
                                            className="img-fluid rounded"
                                            loading="lazy"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        <div className="m-4">
                            <h2 className="h6 fw-semibold text-dark mb-3">Thông tin sản phẩm</h2> {/* h6 nhỏ hơn h5 */}
                            <div className="bg-light p-3 rounded">
                                <ul className="list-unstyled text-secondary mb-0 small"> {/* small cho chữ nhỏ */}
                                    {Object.entries(product.attributes).map(([key, value], index) => (
                                        <li className="d-flex justify-content-between mb-2" key={index}>
                                            <span className="fw-medium">{key}:</span>
                                            <span>{value}</span>
                                        </li>
                                    ))}

                                </ul>
                            </div>
                        </div>


                    </div>

                </div>
            </div>


            {/* )} */}
        </div>
    );
};

export default ProductDetail;
