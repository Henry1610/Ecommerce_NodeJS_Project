import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProductBySlug, resetProductDetail } from '../../../redux/public/productsSlice'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { addToCart } from '../../../redux/user/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../../redux/user/wishlistSlice';
import { toast } from 'react-toastify';
import { fetchReviewStats } from '../../../redux/public/reviewSlice';
import "./ProductDetail.css";
import axios from 'axios';
import RelatedProductItem from '../../../components/RelatedProductItem';
import { likeOrUnlikeReview } from '../../../redux/public/productsSlice';

// Constants
const SERVICES = [
    { icon: <i className="fa-solid fa-folder-closed"></i>, text: "Phục vụ đến 24 giờ" },
    { icon: <i className="fa-solid fa-folder-closed"></i>, text: "Trải nghiệm tận tay" },
    { icon: <i className="fa-solid fa-folder-closed"></i>, text: "Tư vấn tận tâm" },
    { icon: <i className="fa-solid fa-folder-closed"></i>, text: "Trung tâm khác" },
];

function ProductDetail() {
    // State
    const [quantity, setQuantity] = useState(1);
    const [selectedRating, setSelectedRating] = useState(null);

    // Hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { slug } = useParams();

    // Selectors
    const { reviews, product, loading, error } = useSelector((state) => state.public.publicProduct);
    const { stats, total } = useSelector(state => state.public.publicReview);
    const { wishlist } = useSelector(state => state.user.userWishlist);
    const token = useSelector((state) => state.auth.accessToken);

    // Computed values
    const averageRating = (product?.ratings || 0).toFixed(1);
    const originalPrice = product?.price ?? 0;
    const discountPercent = product?.discountPercent ?? 0;
    const discountPrice = originalPrice - (originalPrice * discountPercent) / 100;

    const filteredReviews = selectedRating 
        ? reviews.filter(review => review.rating === selectedRating)
        : reviews;
    // Effects
    useEffect(() => {
        const fetchProduct = () => {
            if (slug) {
                dispatch(fetchProductBySlug(slug))
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
    }, [dispatch, slug]);

    useEffect(() => {
        if (slug) dispatch(fetchReviewStats(slug));
    }, [slug, dispatch]);

    // Event Handlers
    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleQuantityChange = (e) => {
        setQuantity(Math.max(1, parseInt(e.target.value) || 1));
    };

    const handleAddToCart = () => {
        // Kiểm tra đăng nhập trước
        if (!token) {
            toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
            navigate('/login');
            return;
        }

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

    const handleWishlistToggle = () => {
        if (!token) {
            toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
            navigate('/login');
            return;
        }

        const isInWishlist = wishlist.some(item => item._id === product._id);

        if (isInWishlist) {
            dispatch(removeFromWishlist(product._id))
                .unwrap()
                .then(() => {
                    toast.success('Đã xóa khỏi danh sách yêu thích');
                })
                .catch(error => {
                    toast.error(`Lỗi khi xóa khỏi danh sách yêu thích: ${error}`);
                });
        } else {
            dispatch(addToWishlist(product._id))
                .unwrap()
                .then(() => {
                    toast.success('Đã thêm vào danh sách yêu thích');
                })
                .catch(error => {
                    toast.error(`Lỗi khi thêm vào danh sách yêu thích: ${error}`);
                });
        }
    };

    const handleRatingFilter = (rating) => {
        setSelectedRating(rating);
    };

    // Loading and error states
    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-warning" role="status"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5 text-center text-danger">
                Lỗi: {error}
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container py-5 text-center">
                Sản phẩm không tồn tại
            </div>
        );
    }

    return (
        <div className="container-fluid px-3 px-lg-5 pb-5">
            <div className="row g-4">
                {/* Header mobile only */}
                <div className="col-12 d-lg-none order-1">
                    <ProductHeader product={product} />
                </div>

                {/* Cột hình ảnh */}
                <div className="col-12 col-lg-7 order-2 order-lg-1">
                    <ProductImages />
                </div>

                {/* Cột thông tin sản phẩm */}
                <div className="col-12 col-lg-5 order-3 order-lg-2">
                    <ProductInfo
                        product={product}
                        quantity={quantity}
                        originalPrice={originalPrice}
                        discountPrice={discountPrice}
                        onIncreaseQuantity={increaseQuantity}
                        onDecreaseQuantity={decreaseQuantity}
                        onQuantityChange={handleQuantityChange}
                        onAddToCart={handleAddToCart}
                        onWishlistToggle={handleWishlistToggle}
                        isInWishlist={wishlist.some(item => item._id === product._id)}
                    />
                </div>
            </div>

            <ProductReviews
                reviews={filteredReviews}
                averageRating={averageRating}
                stats={stats}
                selectedRating={selectedRating}
                onRatingFilter={handleRatingFilter}
            />

            <FloatingChatButton />
        </div>
    );
}

// Sub-components
function ProductImages() {
    const { product } = useSelector((state) => state.public.publicProduct);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const images = product?.images && product.images.length > 0 ? product.images : [
        '/default-product.jpg'
    ];
    return (
        <div >
            <Swiper
                style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 16,
                    marginBottom: 16,
                    background: '#f8f9fa',
                }}
                modules={[Navigation, Thumbs]}
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                spaceBetween={10}
                slidesPerView={1}
            >
                {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                        <img
                            src={img?.startsWith('http') ? img : `${process.env.REACT_APP_SERVER_URL}/${img}`}
                            alt={`Ảnh sản phẩm ${idx + 1}`}
                            className="img-fluid"
                            style={{
                                width: '100%',
                                maxHeight: 440,
                                objectFit: 'contain',
                                background: '#f8f9fa',
                                borderRadius: 16,
                            }}
                            onError={(e) => {
                                e.target.src = '/default-product.jpg';
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
                spaceBetween={4}
                centerInsufficientSlides={true}
                breakpoints={{
                    320: { slidesPerView: 3 },
                    480: { slidesPerView: 4 },
                    768: { slidesPerView: 5 },
                    1024: { slidesPerView: 7 },
                }}
                style={{ marginTop: 4, width: '100%' }}
            >
                {images.map((img, idx) => (
                    <SwiperSlide
                        key={idx}
                        style={{
                            width: 48,
                            height: 48,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="img-thumbnail"
                            style={{
                                width: 48,
                                height: 48,
                                objectFit: 'cover',
                                borderRadius: 8,
                                padding: 0,
                                background: '#fff',
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <ServiceSlider doubled={[...SERVICES, ...SERVICES]} />
            <div className='d-none d-lg-block'>
                <CommitmentSection />
                <AttributesSection />
            </div>
        </div>
    );
}


function ServiceSlider({ doubled }) {
    return (
        <div className="slider-container overflow-hidden py-2 px-3 rounded mt-4 shadow-sm">
            <div className="slider-track d-flex align-items-center">
                {doubled.map((item, index) => (
                    <div
                        key={index}
                        className="d-flex align-items-center gap-2 me-5 flex-shrink-0"
                    >
                        <div className="icon-circle bg-primary text-white d-flex justify-content-center align-items-center">
                            {item.icon}
                        </div>
                        <span className="fw-semibold">{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CommitmentSection() {
    const commitments = [
        {
            icon: <i className="fa-solid fa-house"></i>,
            title: "Sẵn hàng và trưng bày",
            subtitle: "Tại 3 chi nhánh >"
        },
        {
            icon: <i className="fa-solid fa-truck"></i>,
            title: "Vận chuyển miễn phí",
            subtitle: "Nội thành HN & TP.HCM"
        },
        {
            icon: <i className="fa-solid fa-shield-halved"></i>,
            title: "Bảo hành và đổi trả",
            subtitle: ""
        }
    ];

    return (
        <div className="container my-4">
            <div className="row text-center bg-light rounded shadow-sm py-4">
                {commitments.map((commitment, index) => (
                    <div key={index} className={`col-md-4 ${index < 2 ? 'border-end' : ''}`}>
                        <div className="mb-2">{commitment.icon}</div>
                        <div className="fw-bold">{commitment.title}</div>
                        {commitment.subtitle && (
                            <div className="text-muted">{commitment.subtitle}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function AttributesSection() {
    const { product } = useSelector((state) => state.public.publicProduct);
    const [relatedProducts, setRelatedProducts] = useState([]);
    useEffect(() => {
        if (product?.category?._id) {
            axios.get(`${process.env.REACT_APP_SERVER_URL}/api/products/filter?category=${product.category._id}&limit=8`)
                .then(res => {
                    // Loại bỏ sản phẩm hiện tại khỏi danh sách
                    const filtered = res.data.products.filter(p => p._id !== product._id);
                    setRelatedProducts(filtered);
                })
                .catch(() => setRelatedProducts([]));
        }
    }, [product]);
    return (
        <div className="my-5">
            <h2 className="fw-bold mb-4">Cấu hình & đặc điểm</h2>
            <div className="table-responsive rounded border overflow-hidden">
                <table className="table mb-0 align-middle small">
                    <tbody>
                        {product?.attributes ? (
                            Object.entries(product.attributes).map(([key, value], index) => (
                                <tr key={index} className={index % 2 === 1 ? 'bg-light' : ''}>
                                    <td className="w-50 text-start pe-4 fw-light text-muted">{key}</td>
                                    <td className="text-muted fw-lighter text-start">{value}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-center py-3 text-muted">
                                    Không có thông số kỹ thuật.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

function ProductInfo({
    product,
    quantity,
    originalPrice,
    discountPrice,
    onIncreaseQuantity,
    onDecreaseQuantity,
    onQuantityChange,
    onAddToCart,
    onWishlistToggle,
    isInWishlist
}) {
    // Lấy sản phẩm cùng danh mục
    const [relatedProducts, setRelatedProducts] = useState([]);
    useEffect(() => {
        if (product?.category?._id) {
            axios.get(`${process.env.REACT_APP_SERVER_URL}/api/products/filter?category=${product.category._id}&limit=8`)
                .then(res => {
                    const filtered = res.data.products.filter(p => p._id !== product._id);
                    setRelatedProducts(filtered);
                })
                .catch(() => setRelatedProducts([]));
        }
    }, [product]);

    return (
        <div className=" px-lg-5">

            {/* Header desktop only (ẩn trên mobile để tránh trùng với header phía trên ảnh) */}
            <div className="d-none d-lg-block">
                <ProductHeader product={product} />
            </div>

            <div>
                {/* PurchaseBox mobile: đặt lên đầu phần thông tin, ngay dưới ảnh */}
                <div className="d-block d-lg-none mb-3 d-flex justify-content-center">
                    <PurchaseBox
                        product={product}
                        originalPrice={originalPrice}
                        discountPrice={discountPrice}
                        discountPercent={product.discountPercent}
                        onAddToCart={onAddToCart}
                        onWishlistToggle={onWishlistToggle}
                        isInWishlist={isInWishlist}
                        quantity={quantity}
                        onIncreaseQuantity={onIncreaseQuantity}
                        onDecreaseQuantity={onDecreaseQuantity}
                        onQuantityChange={onQuantityChange}
                    />
                </div>

                <div className="d-block d-lg-none">
                    <CommitmentSection />
                    <AttributesSection />
                </div>

                {/* PurchaseBox desktop only (giữ nguyên thiết kế desktop) */}
                <div className="d-none d-lg-block">
                    <PurchaseBox
                        product={product}
                        originalPrice={originalPrice}
                        discountPrice={discountPrice}
                        discountPercent={product.discountPercent}
                        onAddToCart={onAddToCart}
                        onWishlistToggle={onWishlistToggle}
                        isInWishlist={isInWishlist}
                        quantity={quantity}
                        onIncreaseQuantity={onIncreaseQuantity}
                        onDecreaseQuantity={onDecreaseQuantity}
                        onQuantityChange={onQuantityChange}
                    />
                </div>
            </div>

            {/* Sản phẩm cùng danh mục */}
            {relatedProducts.length > 0 && (
                <div className="mt-5">
                    <h3 className="fw-bold mb-3">Sản phẩm cùng danh mục</h3>
                    <div className="row g-3">
                        {relatedProducts.map(product => (
                            <div key={product._id} className="col-12 related-product-item">
                                <RelatedProductItem product={product} />
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
}

function ProductHeader({ product }) {
    return (
        <>
            <div className="d-flex align-items-center gap-3 mb-2">
                {product.brand && product.brand.logo && (
                    <div style={{ width: 95, height: 59, borderRadius: '12px', overflow: 'hidden', background: '#e0e7ef', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(59,130,246,0.08)' }}>
                        <img
                            src={product.brand.logo.startsWith('http') ? product.brand.logo : `${process.env.REACT_APP_SERVER_URL}/${product.brand.logo}`}
                            alt={product.brand.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }}
                        />
                    </div>
                )}
                <h1 className="fw-bold fs-4 mb-1 mb-0" style={{ marginBottom: 0 }}>{product.name}</h1>
            </div>
            <span className='fw-bold text-muted m-1' style={{ opacity: 0.7 }}>
                {product.description}
            </span>
            <div className="d-flex align-items-center gap-2 m-2">
                <div className="d-flex align-items-center gap-1 bg-light px-2 py-1 rounded">
                    <i className="fas fa-star text-warning"></i>
                    <strong className="text-dark">{product.ratings}</strong>
                </div>
                <div className="text-info text-decoration-none small fw-semibold">
                    {product.numReviews} đánh giá
                </div>
            </div>
        </>
    );
}

function QuantitySelector({ quantity, onIncrease, onDecrease, onChange }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', height: 36, width: 150, overflow: 'hidden', gap: 1 }}>
            <button
                className="btn btn-outline-info rounded-0 border-0 p-0 d-flex align-items-center justify-content-center"
                type="button"
                style={{ width: 25, height: 25, fontSize: 18, borderRadius: 12, background: 'transparent', transition: 'background 0.2s' }}
                onClick={onDecrease}
                onMouseEnter={e => e.currentTarget.style.background = '#e0f7fa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
                <i className="fas fa-minus"></i>
            </button>
            <input
                type="number"
                className="form-control text-center border-0"
                value={quantity}
                min="1"
                onChange={onChange}
                style={{ width: 54, height: 32, fontSize: 16, padding: 0, border: 'none', boxShadow: 'none', outline: 'none' }}
            />
            <button
                className="btn btn-outline-info rounded-0 border-0 p-0 d-flex align-items-center justify-content-center"
                type="button"
                style={{ width: 25, height: 25, fontSize: 18, borderRadius: 12, background: 'transparent', transition: 'background 0.2s' }}
                onClick={onIncrease}
                onMouseEnter={e => e.currentTarget.style.background = '#e0f7fa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
                <i className="fas fa-plus"></i>
            </button>
        </div>
    );
}

function PurchaseBox({
    product,
    originalPrice,
    discountPrice,
    discountPercent,
    onAddToCart,
    onWishlistToggle,
    isInWishlist,
    quantity,
    onIncreaseQuantity,
    onDecreaseQuantity,
    onQuantityChange
}) {
    const stockLabel = product?.stock > 0 ? 'Còn hàng tại kho' : 'Tạm hết hàng';
    const stockColor = product?.stock > 0 ? '#dark' : '#ef4444';

    const infoHighlights = [
        { icon: 'fa-truck-fast', label: 'Giao nhanh 2h nội thành' },
        { icon: 'fa-shield-heart', label: 'Bảo hành chính hãng 12T' },
        { icon: 'fa-rotate-left', label: 'Đổi trả trong 7 ngày' },
    ];

    return (
        <div className="w-100" style={{ maxWidth: 360 }}>
            <div
                className="rounded-4 p-3 text-white text-center"
                style={{
                    background: 'linear-gradient(120deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)',
                    boxShadow: '0 15px 30px rgba(26,42,108,0.25)'
                }}
            >
                <div className="d-flex flex-column">
                    <span className="text-uppercase small fw-semibold opacity-75">Giá ưu đãi</span>
                    <span className="fw-bold display-6 mb-1">{discountPrice?.toLocaleString('vi-VN')}đ</span>
                    {discountPercent > 0 && (
                        <div className="d-flex flex-wrap gap-2 justify-content-center align-items-center">
                            <span className="text-white-50 text-decoration-line-through">
                                {originalPrice?.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="badge bg-white text-danger rounded-pill px-3 py-2">
                                -{discountPercent}%
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-4 shadow-sm p-3 mt-n3 position-relative" style={{ zIndex: 1 }}>
                <div className="d-flex align-items-center justify-content-between border rounded-4 px-3 py-2 mb-3">
                    <div className="d-flex flex-column text-start">
                        <span className="fw-semibold" style={{ color: stockColor }}>{stockLabel}</span>
                        <small className="text-muted">
                            {product?.stock > 0 ? 'Sẵn sàng giao ngay' : 'Liên hệ để nhận thông báo'}
                        </small>
                    </div>
                    <div className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: 42, height: 42, backgroundColor: '#f0fdf4', color: stockColor }}>
                        <i className="fas fa-box-open"></i>
                    </div>
                </div>

                <div className="rounded-4 border mb-3 p-2 bg-light">
                    <div className="d-flex flex-column flex-sm-row align-items-center gap-2">
                        <QuantitySelector
                            quantity={quantity}
                            onIncrease={onIncreaseQuantity}
                            onDecrease={onDecreaseQuantity}
                            onChange={onQuantityChange}
                        />
                        <button
                            className="btn btn-info text-white fw-bold w-100 w-sm-auto py-2 d-flex align-items-center justify-content-center gap-2"
                            style={{ borderRadius: 12, fontSize: '0.95rem' }}
                            onClick={onAddToCart}
                        >
                            <i className="fas fa-cart-plus"></i>
                            Thêm vào giỏ
                        </button>
                    </div>
                </div>

                <div className="d-flex gap-2 flex-wrap mb-3">
                    {infoHighlights.map((item, index) => (
                        <div key={index} className="d-flex align-items-center gap-2 px-2 py-1 rounded-3 bg-light flex-grow-1">
                            <i className={`fas ${item.icon} text-info`}></i>
                            <span className="small text-muted">{item.label}</span>
                        </div>
                    ))}
                </div>

                <button
                    className={`btn w-100 fw-semibold py-3 d-flex align-items-center justify-content-center gap-2 ${isInWishlist ? 'btn-outline-danger' : 'btn-outline-secondary'}`}
                    style={{ borderRadius: 14 }}
                    onClick={onWishlistToggle}
                >
                    <i className={`fas fa-heart ${isInWishlist ? 'text-danger' : ''}`}></i>
                    {isInWishlist ? 'Đã trong danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
                </button>
            </div>
        </div>
    );
}

function ProductReviews({ reviews, averageRating, stats, selectedRating, onRatingFilter }) {
    return (
        <div className="">
            <h2 className="fw-bold">Đánh giá sản phẩm</h2>
            <ReviewStats
                averageRating={averageRating}
                stats={stats}
                selectedRating={selectedRating}
                onRatingFilter={onRatingFilter}
            />
            <ReviewList reviews={reviews} />
        </div>
    );
}

function ReviewStats({ averageRating, stats = {}, selectedRating, onRatingFilter }) {
    const totalReviews = Object.values(stats).reduce((sum, count) => sum + (count || 0), 0);
    const ratingBars = [5, 4, 3, 2, 1];

    const renderProgressWidth = (star) => {
        if (!totalReviews) return 0;
        return Math.round(((stats[star] || 0) / totalReviews) * 100);
    };

    return (
        <section className="bg-white border rounded-4 p-4 p-lg-5 shadow-sm">
            <div className="row g-4 align-items-center text-center">
                <div className="col-12 col-lg-4 d-flex flex-column align-items-center align-items-lg-start text-center text-lg-start gap-2">
                    <span className="fw-semibold text-muted text-uppercase small">Điểm đánh giá</span>
                    <div className="d-flex align-items-baseline gap-1">
                        <span className="display-5 fw-bold text-dark">{averageRating}</span>
                        <span className="fs-4 text-secondary">/5</span>
                    </div>
                    <p className="text-muted mb-1">{totalReviews} lượt đánh giá</p>
                    <div className="d-flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <i
                                key={i}
                                className={`fas ${i <= Math.floor(averageRating)
                                    ? 'fa-star'
                                    : i - averageRating <= 0.5
                                        ? 'fa-star-half-alt'
                                        : 'fa-star'
                                    } ${i - averageRating > 0.5 ? 'text-secondary' : 'text-warning'}`}
                            ></i>
                        ))}
                    </div>
                    <div className="d-flex flex-column flex-sm-row gap-2 w-100 mt-2">
                        <button className="btn btn-info fw-semibold rounded-pill flex-fill text-white">
                            Đánh giá sản phẩm
                        </button>

                    </div>
                </div>

                <div className="col-12 col-lg-8">
                    {ratingBars.map((star) => (
                        <div key={star} className="d-flex align-items-center gap-3 mb-2">
                            <div className="d-flex align-items-center gap-1" style={{ width: 32 }}>
                                <span className="fw-semibold">{star}</span>
                                <i className="fas fa-star text-warning small"></i>
                            </div>
                            <div className="flex-grow-1 bg-light rounded-pill overflow-hidden" style={{ height: 12 }}>
                                <div
                                    className="h-100 bg-info rounded-pill"
                                    style={{ width: `${renderProgressWidth(star)}%`, transition: 'width 0.3s ease' }}
                                ></div>
                            </div>
                            <span className="text-muted" style={{ width: 24, textAlign: 'right' }}>
                                {stats[star] || 0}
                            </span>
                        </div>
                    ))}

                    <div className="d-flex flex-wrap gap-2 mt-4">
                        <button
                            className={`btn btn-sm fw-semibold ${selectedRating === null ? 'btn-info text-white' : 'btn-outline-info'}`}
                            onClick={() => onRatingFilter(null)}
                        >
                            Tất Cả
                        </button>
                        {ratingBars.map((star) => (
                            <button
                                key={`filter-${star}`}
                                className={`btn btn-sm fw-semibold ${selectedRating === star ? 'btn-info text-white' : 'btn-outline-secondary'}`}
                                onClick={() => onRatingFilter(star)}
                            >
                                {star} Sao ({stats[star] || 0})
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ReviewList({ reviews }) {
    return (
        <section className=" border-light-subtle">
            {reviews.map((review) => (
                <ReviewItem key={review._id} review={review} />
            ))}
        </section>
    );
}

function ReviewItem({ review }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const currentUserId = user?.id;
    const hasLiked = review.likes?.includes(currentUserId);
    const likeCount = review.likes?.length || 0;


    const handleLike = () => {
        if (!currentUserId) {
            toast.info('Bạn cần đăng nhập để thích bình luận này!');
            navigate('/login');
            return;
        }

        dispatch(likeOrUnlikeReview(review._id))
            .unwrap()
            .then(() => {
                toast.success('Đã cập nhật lượt thích!');
            })
            .catch((error) => {
                toast.error(`${error || 'Có lỗi xảy ra khi thích bình luận'}`);
            });
    };


    return (
        <div className="position-relative ps-4 mt-3">
            {review.adminResponse?.responseContent && (
                <>
                    {/* Đường thẳng dọc */}
                    <div
                        className="position-absolute bg-secondary-subtle"
                        style={{
                            left: '42px',
                            top: '50px',
                            bottom: '100px',
                            width: '2px',
                        }}
                    ></div>

                    {/* Đường cong */}
                    <div
                        className="position-absolute"
                        style={{
                            left: '42px',
                            top: 'calc(100% - 110px)',
                            width: '20px',
                            height: '20px',
                            borderBottom: '2px solid #dee2e6',
                            borderLeft: '2px solid #dee2e6',
                            borderBottomLeftRadius: '8px',
                        }}
                    ></div>
                </>
            )}

            {/* --- Review người dùng --- */}
            <div className="d-flex align-items-start gap-2">
                <img
                    src={review.user?.avatar || '/default-avatar.png'}
                    alt="Avatar"
                    className="rounded-circle"
                    style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                />
                <div className="bg-light rounded-4 px-3 py-2" style={{ maxWidth: '600px', width: '100%' }}>
                    <div className="d-flex justify-content-between align-items-start">
                        <strong className="me-2">{review.user?.username || 'Người dùng'}</strong>
                        <div
                            className="d-flex align-items-center gap-1 text-muted small"
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={handleLike}
                            title={hasLiked ? 'Bỏ thích' : 'Thích bình luận này'}
                        >
                            <i className={`fas fa-thumbs-up${hasLiked ? ' text-primary' : ''}`}></i>
                            <span>{likeCount}</span>
                        </div>
                    </div>

                    <div className="small mt-1">{review.comment}</div>

                    {/* Hình ảnh */}
                    {review.images?.length > 0 && (
                        <div className="d-flex gap-2 mt-2">
                            {review.images.slice(0, 3).map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Ảnh đánh giá ${idx + 1}`}
                                    className="rounded border"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                            ))}
                        </div>
                    )}

                    <div className="d-flex align-items-center gap-2 mt-2 small text-muted">
                        <span>{new Date(review.createdAt).toLocaleString('vi-VN')}</span>
                        <span>•</span>
                        <span><i className="fas fa-star text-warning me-1"></i>{review.rating} sao</span>
                    </div>
                </div>
            </div>

            {/* --- Phản hồi Admin --- */}
            {review.adminResponse?.responseContent && (
                <div className="d-flex align-items-start gap-2 mt-3 ms-5">
                    <img
                        src={
                            review.adminResponse.admin?.avatar ||
                            "https://static.tuoitre.vn/tto/r/2015/08/02/a-1438493457.jpg"
                        }
                        alt={review.adminResponse.admin?.username || "Admin"}
                        className="rounded-circle"
                        style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                    />
                    <div className="bg-body-tertiary rounded-4 px-3 py-2">
                        <strong className="text-primary d-block">
                            {review.adminResponse.admin?.username || "Admin"}
                            {review.adminResponse.admin?.email ? (
                                <span className="text-muted small ms-2">({review.adminResponse.admin.email})</span>
                            ) : null}
                        </strong>
                        <div className="small">{review.adminResponse.responseContent}</div>
                        <small className="text-muted d-block mt-1">
                            {new Date(review.adminResponse.createdAt).toLocaleString('vi-VN')}
                        </small>
                    </div>
                </div>
            )}
        </div>
    );
}





function FloatingChatButton() {
    return (
        <button
            className="btn btn-info text-white rounded-circle shadow position-fixed"
            style={{ bottom: '24px', right: '24px', width: '56px', height: '56px' }}
            aria-label="Chat support"
        ><i class="fa-solid fa-phone"></i></button>
    );
}

export default ProductDetail;