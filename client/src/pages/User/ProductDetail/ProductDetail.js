import { Link } from 'react-router-dom';
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
    const { slug } = useParams();

    // Selectors
    const { reviews, product, loading, error } = useSelector((state) => state.public.publicProduct);
    const { stats, total } = useSelector(state => state.public.publicReview);
    const { wishlist } = useSelector(state => state.user.userWishlist);
    const { token } = useSelector(state => state.auth);

    // Computed values
    const averageRating = (product?.ratings || 0).toFixed(1);
    const originalPrice = product?.price ?? 0;
    const discountPercent = product?.discountPercent ?? 0;
    const discountPrice = originalPrice - (originalPrice * discountPercent) / 100;

    // Effects
    useEffect(() => {
        const fetchProduct = () => {
            if (slug) {
                dispatch(fetchProductBySlug({ slug, rating: selectedRating }))
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
    }, [dispatch, slug, selectedRating]);

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
        <div className="container py-5">
            <div className="row">
                <ProductImages />
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

            <ProductReviews
                reviews={reviews}
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
        <div className="col-lg-7">
            <Swiper
                style={{ width: 540, height: 440, borderRadius: 16, marginBottom: 16, background: '#f8f9fa', maxWidth: '100%' }}
                modules={[Navigation, Thumbs]}
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                spaceBetween={10}
                slidesPerView={1}
            >
                {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                        <img
                            src={img}
                            alt={`Ảnh sản phẩm ${idx + 1}`}
                            className="img-fluid"
                            style={{ width: '100%', height: 440, objectFit: 'contain', background: '#f8f9fa', borderRadius: 16, maxWidth: 540, maxHeight: 440 }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
                spaceBetween={4}
                slidesPerView={Math.min(images.length, 7)}
                style={{ marginTop: 4, maxWidth: 360 }}
            >
                {images.map((img, idx) => (
                    <SwiperSlide key={idx} style={{ width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="img-thumbnail"
                            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, padding: 0, background: '#fff' }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <ServiceSlider doubled={[...SERVICES, ...SERVICES]} />
            <CommitmentSection />
            <AttributesSection />
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
            axios.get(`http://localhost:5000/api/products/filter?category=${product.category._id}&limit=8`)
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
            axios.get(`http://localhost:5000/api/products/filter?category=${product.category._id}&limit=8`)
                .then(res => {
                    const filtered = res.data.products.filter(p => p._id !== product._id);
                    setRelatedProducts(filtered);
                })
                .catch(() => setRelatedProducts([]));
        }
    }, [product]);
    return (
        <div className="col-lg-4 mx-5">
            <ProductHeader product={product} />
            <ProductOptions />
            <QuantitySelector
                quantity={quantity}
                onIncrease={onIncreaseQuantity}
                onDecrease={onDecreaseQuantity}
                onChange={onQuantityChange}
            />
            <PurchaseBox
                originalPrice={originalPrice}
                discountPrice={discountPrice}
                discountPercent={product.discountPercent}
                onAddToCart={onAddToCart}
                onWishlistToggle={onWishlistToggle}
                isInWishlist={isInWishlist}
            />
            {/* Sản phẩm cùng danh mục */}
            {relatedProducts.length > 0 && (
                <div className="mt-5">
                    <h3 className="fw-bold mb-3">Sản phẩm cùng danh mục</h3>
                    {relatedProducts.map(product => (
                        <RelatedProductItem product={product} key={product._id} />
                    ))}
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
                            src={product.brand.logo.startsWith('http') ? product.brand.logo : `http://localhost:5000/${product.brand.logo}`}
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

function ProductOptions() {
    return (
        <>
            <div className="mb-3">
                <p className="fw-semibold mb-2">Màu</p>
                <button className="btn btn-outline-info btn-sm rounded-pill px-3 py-1 fw-semibold shadow-sm">
                    Lunar Gray
                </button>
            </div>
            <div className="mb-3">
                <p className="fw-semibold mb-2">Loại hàng</p>
                <div className="d-flex flex-wrap gap-2">
                    <button className="btn btn-outline-info btn-sm rounded-pill px-3 py-1 fw-semibold shadow-sm">
                        Mới, Sealed, Nhập khẩu
                    </button>
                    <button className="btn btn-outline-info btn-sm rounded-pill px-3 py-1 fw-semibold shadow-sm">
                        Mới, Full box, Nhập khẩu
                    </button>
                </div>
            </div>
        </>
    );
}

function QuantitySelector({ quantity, onIncrease, onDecrease, onChange }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e7ef', borderRadius: 20, background: '#fff', height: 36, width: 120, overflow: 'hidden' }}>
            <button
                className="btn btn-outline-info rounded-0 border-0 p-0 d-flex align-items-center justify-content-center"
                type="button"
                style={{ width: 36, height: 36, fontSize: 18, borderRadius: 0, background: 'transparent', transition: 'background 0.2s' }}
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
                style={{ width: 48, height: 36, fontSize: 16, padding: 0, border: 'none', boxShadow: 'none', outline: 'none' }}
            />
            <button
                className="btn btn-outline-info rounded-0 border-0 p-0 d-flex align-items-center justify-content-center"
                type="button"
                style={{ width: 36, height: 36, fontSize: 18, borderRadius: 0, background: 'transparent', transition: 'background 0.2s' }}
                onClick={onIncrease}
                onMouseEnter={e => e.currentTarget.style.background = '#e0f7fa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
                <i className="fas fa-plus"></i>
            </button>
        </div>
    );
}

function PurchaseBox({ originalPrice, discountPrice, discountPercent, onAddToCart, onWishlistToggle, isInWishlist }) {
    return (
        <div className="d-flex flex-column align-items-center shadow rounded-4 overflow-hidden p-2"
            style={{ maxWidth: '320px', backgroundColor: '#fff', marginTop: 16 }}>
            <div className="flex-grow-1 w-100 text-center">
                <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                    <span className="fw-bold fs-3" style={{ color: '#e91e63' }}>
                        {discountPrice?.toLocaleString('vi-VN')}đ
                    </span>
                    {discountPercent > 0 && (
                        <span className="text-muted text-decoration-line-through small" style={{ fontSize: '1rem' }}>
                            {originalPrice?.toLocaleString('vi-VN')}đ
                        </span>
                    )}
                    {discountPercent > 0 && (
                        <span className="badge rounded-pill text-white px-2 py-1"
                            style={{ backgroundColor: '#e91e63', fontSize: 12 }}>
                            -{discountPercent}%
                        </span>
                    )}
                </div>
                <div className="d-flex gap-2 justify-content-center">
                    <button
                        className="btn fw-bold text-white d-flex align-items-center justify-content-center gap-2"
                        style={{ background: 'linear-gradient(90deg, #00e5ff 0%, #2563eb 100%)', borderRadius: '22px', minWidth: 90, height: 44, fontSize: 15, boxShadow: '0 2px 8px rgba(0,229,255,0.10)', transition: 'all 0.2s', padding: '0 10px' }}
                        onClick={onAddToCart}
                        title="Thêm vào giỏ"
                        onMouseEnter={e => e.target.style.filter = 'brightness(1.08)'}
                        onMouseLeave={e => e.target.style.filter = 'none'}
                    >
                        <i className="fas fa-shopping-bag"></i>
                        Thêm vào giỏ
                    </button>
                    <button
                        className={`btn d-flex align-items-center justify-content-center ${isInWishlist ? 'btn-danger' : 'btn-outline-danger'}`}
                        style={{ borderRadius: '22px', width: 44, height: 44, fontSize: 15, transition: 'all 0.2s' }}
                        onClick={onWishlistToggle}
                        title={isInWishlist ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
                    >
                        <i className={`fas fa-heart ${isInWishlist ? 'text-white' : ''}`}></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

function ProductReviews({ reviews, averageRating, stats, selectedRating, onRatingFilter }) {
    return (
        <div className="py-4">
            <h2 className="fw-bold mb-4">Đánh giá sản phẩm</h2>
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

function ReviewStats({ averageRating, stats, selectedRating, onRatingFilter }) {
    return (
        <section className="bg-light p-4 rounded mb-5">
            <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
                <div className="d-flex align-items-center gap-2">
                    <span className="fs-3 fw-semibold text-info">{averageRating}</span>
                    <span className="text-info small">trên 5</span>
                </div>
                <div className="star-rating d-flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <i
                            key={i}
                            className={`fas ${i <= Math.floor(averageRating)
                                ? 'fa-star'
                                : i - averageRating <= 0.5
                                    ? 'fa-star-half-alt'
                                    : 'fa-star text-muted'
                                } text-warning`}
                        ></i>
                    ))}
                </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-4">
                <button
                    className={`btn btn-sm fw-semibold ${selectedRating === null ? 'btn-info' : 'btn-outline-info'}`}
                    onClick={() => onRatingFilter(null)}
                >
                    Tất Cả
                </button>
                {[5, 4, 3, 2, 1].map((star) => (
                    <button
                        key={star}
                        className={`btn btn-sm fw-semibold ${selectedRating === star ? 'btn-info' : 'btn-outline-secondary'}`}
                        onClick={() => onRatingFilter(star)}
                    >
                        {star} Sao ({stats[star]})
                    </button>
                ))}
            </div>
        </section>
    );
}

function ReviewList({ reviews }) {
    return (
        <section className="border-top border-light-subtle">
            {reviews.map((review) => (
                <ReviewItem key={review._id} review={review} />
            ))}
        </section>
    );
}

function ReviewItem({ review }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const currentUserId = user?.id;
    const hasLiked = review.likes?.includes(currentUserId);
    const likeCount = review.likes?.length || 0;


    const handleLike = () => {
        if (!currentUserId) {
            toast.info(' Bạn cần đăng nhập để thích bình luận này!');
            return;
        }

        dispatch(likeOrUnlikeReview(review._id))
            .unwrap()
            .then(() => {
                toast.success(' Đã cập nhật lượt thích!');
            })
            .catch((error) => {
                toast.error(` ${error || 'Có lỗi xảy ra khi thích bình luận'}`);
            });
    };


    return (
        <div className="position-relative ps-4 pb-4 mt-3">
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
                        src="/admin-avatar.png"
                        alt="Admin"
                        className="rounded-circle"
                        style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                    />
                    <div className="bg-body-tertiary rounded-4 px-3 py-2">
                        <strong className="text-primary d-block">Admin</strong>
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