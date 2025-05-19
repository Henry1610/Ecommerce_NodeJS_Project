
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux"
import { useParams } from 'react-router-dom';
import { fetchProductById, resetProductDetail } from '../../../redux/products/productsSlice'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { addToCart } from '../../../redux/cart/cartSlice';
import { toast } from 'react-toastify';

function ProductDetail() {
    const dispatch = useDispatch();
    const { productId } = useParams();
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [quantity, setQuantity] = useState(1);
    const { product, loading, error } = useSelector((state) => state.products);
    
    // Tham chiếu đến các tab
    const tabsRef = useRef(null);

    useEffect(() => {
        // Sửa lỗi useEffect async
        const fetchProduct = () => {
            if (productId) {
                dispatch(fetchProductById(productId))
                    .unwrap()
                    .catch(error => {
                        toast.error(`Lỗi khi tải sản phẩm: ${error}`);
                    });
            }
        };
        
        fetchProduct();
        
        return () => {
            dispatch(resetProductDetail());
        };
    }, [dispatch, productId]);

    // Xử lý khi tab được chọn
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    // Hàm tăng số lượng
    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    // Hàm giảm số lượng
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // Hàm thêm vào giỏ hàng
    const handleAddToCart = (e) => {
        e.preventDefault();
        if (product && quantity > 0) {
            dispatch(addToCart({ productId: product._id, quantity }))
                .unwrap()
                .then(() => {
                    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
                })
                .catch(error => {
                    toast.error(`Lỗi khi thêm vào giỏ hàng: ${error}`);
                });
        }
    };

    if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-warning" role="status"></div></div>;
    if (error) return <div className="container py-5 text-center text-danger">Lỗi: {error}</div>;
    if (!product) return <div className="container py-5 text-center">Sản phẩm không tồn tại</div>;

    const defaultImages = [
        "/images/product/large-size/1.jpg",
        "/images/product/large-size/2.jpg",
        "/images/product/large-size/3.jpg",
        "/images/product/large-size/4.jpg",
        "/images/product/large-size/5.jpg"
    ];

    const defaultThumbs = [
        "/images/product/small-size/1.jpg",
        "/images/product/small-size/2.jpg",
        "/images/product/small-size/3.jpg",
        "/images/product/small-size/4.jpg",
        "/images/product/small-size/5.jpg"
    ];

    const productImages = product.images && Array.isArray(product.images) && product.images.length > 0 
        ? product.images 
        : defaultImages;

    const thumbImages = product.images && Array.isArray(product.images) && product.images.length > 0 
        ? product.images 
        : defaultThumbs;

    // Dữ liệu mẫu cho sản phẩm liên quan
    const relatedProducts = [
        {
            id: 1,
            name: "Accusantium dolorem1",
            image: "/images/product/large-size/1.jpg",
            brand: "Graphic Corner",
            price: 46.80,
            discountPrice: null,
            discountPercent: 0
        },
        {
            id: 2,
            name: "Mug Today is a good day",
            image: "/images/product/large-size/2.jpg",
            brand: "Studio Design",
            price: 77.22,
            discountPrice: 71.80,
            discountPercent: 7
        },
        {
            id: 3,
            name: "Accusantium dolorem1",
            image: "/images/product/large-size/3.jpg",
            brand: "Graphic Corner",
            price: 46.80,
            discountPrice: null,
            discountPercent: 0
        },
        {
            id: 4,
            name: "Mug Today is a good day",
            image: "/images/product/large-size/4.jpg",
            brand: "Studio Design",
            price: 77.22,
            discountPrice: 71.80,
            discountPercent: 7
        }
    ];

    return (
        <div className="product-detail-page py-4">
            {/* Breadcrumb */}
            <div className="bg-light py-2 mb-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Trang chủ</Link></li>
                            <li className="breadcrumb-item"><Link to="/products" className="text-decoration-none">Sản phẩm</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{product?.name || "Chi tiết sản phẩm"}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Product Detail Section */}
            <div className="container">
                <div className="row mb-5">
                    {/* Product Images */}
                    <div className="col-lg-5 col-md-6 mb-4 mb-md-0">
                        <div className="product-images shadow-sm rounded">
                            {product && (
                                <>
                                    <Swiper
                                        modules={[Navigation, Pagination, Thumbs]}
                                        thumbs={{ swiper: thumbsSwiper }}
                                        pagination={{ clickable: true }}
                                        navigation
                                        className="mb-3"
                                    >
                                        {productImages.map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="position-relative">
                                                    <img src={image} alt={`Product ${index + 1}`} className="img-fluid rounded" />
                                                    {product?.discount > 0 && index === 0 && (
                                                        <span className="badge bg-danger position-absolute top-0 start-0 m-2">-{product.discount}%</span>
                                                    )}
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    
                                    <Swiper
                                        modules={[Navigation, Thumbs]}
                                        watchSlidesProgress
                                        onSwiper={setThumbsSwiper}
                                        slidesPerView={4}
                                        spaceBetween={10}
                                        className="thumbs-swiper"
                                    >
                                        {thumbImages.map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <img src={image} alt={`Thumbnail ${index + 1}`} className="img-fluid rounded border" />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="col-lg-7 col-md-6">
                        <div className="product-details p-3">
                            <h2 className="mb-2">{product?.name}</h2>
                            <p className="text-muted small mb-3">Mã sản phẩm: {product?._id || 'demo_15'}</p>
                            
                            <div className="d-flex align-items-center mb-3">
                            <div className="rating-box mx-3">
                            <ul className="list-inline m-0 fs-10">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <li key={index} className="list-inline-item">
                                        {index < product.rating ? (
                                            <i className="fa-solid fa-star text-warning"></i>   // sao đầy
                                        ) : (
                                            <i className="fa-regular fa-star text-muted"></i>   // sao mờ
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                                <Link onClick={(e) => e.preventDefault()} className="text-decoration-none small">Đọc đánh giá ({product?.numReviews || 0})</Link>
                                <span className="mx-2">|</span>
                                <Link onClick={(e) => e.preventDefault()} className="text-decoration-none small">Viết đánh giá</Link>
                            </div>
                            
                            <div className="mb-3">
                                {product?.discount > 0 ? (
                                    <div className="d-flex align-items-center">
                                        <h3 className="text-warning fw-bold mb-0 me-2">
                                            ${product?.discountedPrice || (product?.price * (1 - product?.discount / 100)).toFixed(2)}
                                        </h3>
                                        <span className="text-muted text-decoration-line-through me-2">${product?.price || '0.00'}</span>
                                        <span className="badge bg-success">-{product?.discount}%</span>
                                    </div>
                                ) : (
                                    <h3 className="text-warning fw-bold mb-0">${product?.price || '0.00'}</h3>
                                )}
                            </div>
                            
                            <div className="mb-3">
                                <p className="text-muted">{product?.description || 'Đang tải thông tin sản phẩm...'}</p>
                            </div>
                            
                            <div className="mb-4">
                                <label className="mb-2 fw-bold">Kích thước:</label>
                                <select className="form-select form-select-sm border-warning w-auto">
                                    <option value="1" selected>40x60cm</option>
                                    <option value="2">60x90cm</option>
                                    <option value="3">80x120cm</option>
                                </select>
                            </div>
                            
                            <form className="mb-4" onSubmit={handleAddToCart}>
                                <div className="row align-items-center g-3">
                                    <div className="col-md-4 col-6">
                                        <label className="fw-bold mb-2">Số lượng:</label>
                                        <div className="input-group">
                                            <button className="btn btn-outline-warning" type="button" onClick={decreaseQuantity}>-</button>
                                            <input 
                                                type="number" 
                                                className="form-control text-center border-warning" 
                                                value={quantity} 
                                                min="1" 
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            />
                                            <button className="btn btn-outline-warning" type="button" onClick={increaseQuantity}>+</button>
                                        </div>
                                    </div>
                                    <div className="col-md-8 col-12">
                                        <button type="submit" className="btn btn-warning w-100 mt-md-4 text-dark">
                                            <i className="fas fa-shopping-cart me-2"></i>Thêm vào giỏ hàng
                                        </button>
                                    </div>
                                </div>
                            </form>
                            
                            <div className="mb-4">
                                <Link to="/wishlist" className="btn btn-outline-warning me-2">
                                    <i className="far fa-heart me-1"></i>Thêm vào yêu thích
                                </Link>
                            </div>
                            
                            <div className="mb-4">
                                <h6 className="mb-2 fw-bold">Chia sẻ sản phẩm:</h6>
                                <div className="d-flex gap-2">
                                    <a onClick={(e) => e.preventDefault()} className="btn btn-sm btn-outline-primary"><i className="fab fa-facebook-f me-1"></i>Facebook</a>
                                    <a onClick={(e) => e.preventDefault()} className="btn btn-sm btn-outline-info"><i className="fab fa-twitter me-1"></i>Twitter</a>
                                    <a onClick={(e) => e.preventDefault()} className="btn btn-sm btn-outline-danger"><i className="fab fa-instagram me-1"></i>Instagram</a>
                                </div>
                            </div>
                            
                            <div className="border-top pt-4">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center">
                                            <div className="me-2 text-warning">
                                                <i className="fas fa-check-square fa-2x"></i>
                                            </div>
                                            <div className="small">Bảo đảm chất lượng</div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center">
                                            <div className="me-2 text-warning">
                                                <i className="fas fa-truck fa-2x"></i>
                                            </div>
                                            <div className="small">Giao hàng nhanh chóng</div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center">
                                            <div className="me-2 text-warning">
                                                <i className="fas fa-exchange-alt fa-2x"></i>
                                            </div>
                                            <div className="small">Đổi trả trong 7 ngày</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Product Tabs */}
                <div className="row mb-5">
                    <div className="col-12">
                        <ul className="nav nav-tabs border-0 mb-3" id="productTab" role="tablist" ref={tabsRef}>
                            <li className="nav-item" role="presentation">
                                <button 
                                    className={`nav-link fw-bold text-dark ${activeTab === 'description' ? 'active' : ''}`} 
                                    id="description-tab" 
                                    onClick={() => handleTabClick('description')}
                                    type="button" 
                                    role="tab" 
                                    aria-controls="description" 
                                    aria-selected={activeTab === 'description'}
                                >
                                    Mô tả
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button 
                                    className={`nav-link fw-bold text-dark ${activeTab === 'details' ? 'active' : ''}`} 
                                    id="details-tab" 
                                    onClick={() => handleTabClick('details')}
                                    type="button" 
                                    role="tab" 
                                    aria-controls="details" 
                                    aria-selected={activeTab === 'details'}
                                >
                                    Chi tiết sản phẩm
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button 
                                    className={`nav-link fw-bold text-dark ${activeTab === 'reviews' ? 'active' : ''}`} 
                                    id="reviews-tab" 
                                    onClick={() => handleTabClick('reviews')}
                                    type="button" 
                                    role="tab" 
                                    aria-controls="reviews" 
                                    aria-selected={activeTab === 'reviews'}
                                >
                                    Đánh giá
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content border p-4 rounded shadow-sm" id="productTabContent">
                            <div className={`tab-pane fade ${activeTab === 'description' ? 'show active' : ''}`} id="description" role="tabpanel" aria-labelledby="description-tab">
                                <p>The best is yet to come! Give your walls a voice with a framed poster. This aesthethic, optimistic poster will look great in your desk or in an open-space office. Painted wooden frame with passe-partout for more depth.</p>
                            </div>
                            <div className={`tab-pane fade ${activeTab === 'details' ? 'show active' : ''}`} id="details" role="tabpanel" aria-labelledby="details-tab">
                                <div className="d-flex flex-column">
                                    <img src="/images/product-details/1.jpg" alt="Manufacturer Image" className="img-fluid mb-3" style={{maxWidth: "200px"}} />
                                    <p><strong>Mã sản phẩm:</strong> demo_7</p>
                                    <p><strong>Thương hiệu:</strong> Studio Design</p>
                                </div>
                            </div>
                            <div className={`tab-pane fade ${activeTab === 'reviews' ? 'show active' : ''}`} id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                                <div id="review-section">
                                    <div className="border-bottom mb-4 pb-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="rating me-2">
                                                <i className="fas fa-star text-warning"></i>
                                                <i className="fas fa-star text-warning"></i>
                                                <i className="fas fa-star text-warning"></i>
                                                <i className="far fa-star text-warning"></i>
                                                <i className="far fa-star text-warning"></i>
                                            </div>
                                            <span className="ms-auto text-muted small">01-12-2023</span>
                                        </div>
                                        <h5 className="mb-2">HTML 5</h5>
                                        <p className="text-muted">Sản phẩm tốt, đúng như mô tả và giao hàng nhanh.</p>
                                    </div>
                                </div>
                                
                                <div id="review-form">
                                    <h4 className="mb-3">Viết đánh giá của bạn</h4>
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">Đánh giá của bạn *</label>
                                            <div className="rating-stars mb-2">
                                                <i className="far fa-star text-warning fs-5 me-1" role="button"></i>
                                                <i className="far fa-star text-warning fs-5 me-1" role="button"></i>
                                                <i className="far fa-star text-warning fs-5 me-1" role="button"></i>
                                                <i className="far fa-star text-warning fs-5 me-1" role="button"></i>
                                                <i className="far fa-star text-warning fs-5" role="button"></i>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="review-text" className="form-label">Nội dung đánh giá *</label>
                                            <textarea className="form-control border-warning" id="review-text" rows="4" required></textarea>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="review-name" className="form-label">Tên của bạn *</label>
                                                <input type="text" className="form-control border-warning" id="review-name" required />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="review-email" className="form-label">Email *</label>
                                                <input type="email" className="form-control border-warning" id="review-email" required />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-warning">Gửi đánh giá</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Related Products */}
                <div className="row">
                    <div className="col-12">
                        <h4 className="mb-4 border-bottom pb-2">
                            <span className="border-bottom border-warning border-2 pb-2">Sản phẩm tương tự</span>
                        </h4>
                        
                        {/* Điều kiện kiểm tra trước khi render Swiper */}
                        {product && (
                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={20}
                                slidesPerView={4}
                                navigation
                                breakpoints={{
                                    0: {
                                        slidesPerView: 1,
                                    },
                                    576: {
                                        slidesPerView: 2,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                    },
                                    992: {
                                        slidesPerView: 4,
                                    },
                                }}
                            >
                                {relatedProducts.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="card product-card h-100 shadow-sm border-0">
                                            <div className="position-relative">
                                                <img src={item.image} alt={item.name} className="card-img-top" />
                                                <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-2">Mới</span>
                                            </div>
                                            <div className="card-body">
                                                <h6 className="text-muted mb-1">{item.brand}</h6>
                                                <h5 className="card-title mb-1">
                                                    <Link to={`/product/${item.id}`} className="text-decoration-none text-dark">{item.name}</Link>
                                                </h5>
                                                <div className="rating mb-1 small">
                                                    <i className="fas fa-star text-warning"></i>
                                                    <i className="fas fa-star text-warning"></i>
                                                    <i className="fas fa-star text-warning"></i>
                                                    <i className="far fa-star text-warning"></i>
                                                    <i className="far fa-star text-warning"></i>
                                                </div>
                                                {item.discountPercent > 0 ? (
                                                    <div className="d-flex mb-3 align-items-center">
                                                        <span className="fw-bold text-warning me-2">${item.discountPrice}</span>
                                                        <span className="text-muted text-decoration-line-through me-2">${item.price}</span>
                                                        <span className="badge bg-success">-{item.discountPercent}%</span>
                                                    </div>
                                                ) : (
                                                    <div className="mb-3">
                                                        <span className="fw-bold text-warning">${item.price}</span>
                                                    </div>
                                                )}
                                                <div className="d-flex gap-2">
                                                    <Link to="/cart" className="btn btn-sm btn-warning text-dark flex-grow-1">Thêm vào giỏ</Link>
                                                    <Link to="/wishlist" className="btn btn-sm btn-outline-warning">
                                                        <i className="far fa-heart"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;