import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux"
import { useParams } from 'react-router-dom';
import { fetchProductBySlug, resetProductDetail } from '../../../redux/public/productsSlice'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { addToCart } from '../../../redux/user/cartSlice';
import { toast } from 'react-toastify';
import { fetchReviewStats } from '../../../redux/public/reviewSlice';
import "./ProductDetail.css";

// Constants
const SERVICES = [
    { icon: <i className="fa-solid fa-folder-closed"></i>, text: "Phục vụ đến 24 giờ" },
    { icon: <i className="fa-solid fa-folder-closed"></i>, text: "Trải nghiệm tận tay" },
    { icon: <i className="fa-solid fa-folder-closed"></i>, text: "Tư vấn tận tâm" },
    { icon: <i className="fa-solid fa-folder-closed"></i>, text: "Trung tâm khác" },
];

const THUMBNAIL_IDS = [
    "538bbcd9-818b-409e-8e16-d05c4a791404",
    "c344cbc7-b03f-4bdb-8b00-86f59755ab25",
    "4fb746a2-b4bd-4779-8648-ea08e1bc58c2",
    "e24b0897-0754-47ba-9f93-209861f42b37",
    "b3411b75-6987-4cac-8629-f96415e10504",
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

    // Computed values
    const averageRating = (product?.ratings || 0).toFixed(1);
    const originalPrice = product?.price ?? 0;
    const discountPercent = product?.discountPercent ?? 0;
    const discountPrice = originalPrice - (originalPrice * discountPercent) / 100;
    const doubled = [...SERVICES, ...SERVICES];

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
    const doubled = [...SERVICES, ...SERVICES];

    return (
        <div className="col-lg-7">
            <MainImageSection />
            <ThumbnailSection />
            <ServiceSlider doubled={doubled} />
            <CommitmentSection />
            <AttributesSection />
        </div>
    );
}

function MainImageSection() {
    return (
        <div className="position-relative border rounded overflow-hidden">
            <img
                src="https://storage.googleapis.com/a1aa/image/419b4c2d-8f17-4dbe-447a-8fe49a18e6ae.jpg"
                alt="Lenovo ThinkBook 14 G6+ laptop front view"
                className="img-fluid"
                style={{ width: '100%', maxWidth: '700px', height: '500px' }}
            />
            <button className="btn btn-dark position-absolute top-50 start-0 translate-middle-y" />
            <button className="btn btn-dark position-absolute top-50 end-0 translate-middle-y" />
        </div>
    );
}

function ThumbnailSection() {
    return (
        <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
            {THUMBNAIL_IDS.map((imgId, idx) => (
                <div key={idx} className="border p-1 rounded cursor-pointer">
                    <img
                        src={`https://storage.googleapis.com/a1aa/image/${imgId}.jpg`}
                        alt={`Thumbnail ${idx}`}
                        className="img-thumbnail"
                        style={{ width: 100, height: 100, objectFit: 'cover' }}
                    />
                </div>
            ))}
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

    return (
        <div className="my-5">
            <h2 className="fw-bold mb-4">Cấu hình & đặc điểm</h2>
            <div className="table-responsive rounded border overflow-hidden">
                <table className="table mb-0 align-middle small">
                    <tbody>
                        {product?.attributes ? (
                            Object.entries(product.attributes).map(([key, value], index) => (
                                <tr key={index} className={index % 2 === 1 ? 'bg-light' : ''}>
                                    <th className="w-50 text-start pe-4">{key}</th>
                                    <td className="text-start ps-4">{value}</td>
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
    onAddToCart 
}) {
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
            />
        </div>
    );
}

function ProductHeader({ product }) {
    return (
        <>
            <h1 className="fw-bold fs-4 mb-1">{product.name}</h1>
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
        <>
            <p className="fw-semibold">Số lượng</p>
            <div className="input-group m-2">
                <button
                    className="btn bg-info fw-bold fs-5"
                    type="button"
                    onClick={onDecrease}
                >
                    -
                </button>
                <input
                    type="number"
                    className="form-control text-center border-info"
                    value={quantity}
                    min="1"
                    onChange={onChange}
                />
                <button
                    className="btn bg-info fw-bold fs-5"
                    type="button"
                    onClick={onIncrease}
                >
                    +
                </button>
            </div>
        </>
    );
}

function PurchaseBox({ originalPrice, discountPrice, discountPercent, onAddToCart }) {
    return (
        <div className="d-flex flex-column flex-md-row shadow rounded-4 overflow-hidden p-4 align-items-center" 
             style={{ maxWidth: '520px', backgroundColor: '#fff' }}>
            <div className="flex-grow-1 w-100">
                <p className="fw-bold fs-5 mb-1">Mua ngay</p>
                <p className="text-muted small mb-3">Trả hết một giá</p>
                <div className="d-flex align-items-center gap-3 mb-3">
                    <span className="fw-bold fs-4" style={{ color: '#e91e63' }}>
                        {discountPrice?.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-muted text-decoration-line-through small">
                        {originalPrice?.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="badge rounded-pill text-white px-2 py-1" 
                          style={{ backgroundColor: '#e91e63' }}>
                        -{discountPercent}%
                    </span>
                </div>
                <div className="d-flex gap-3">
                    <button className="btn fw-bold text-white px-4 py-2" 
                            style={{ backgroundColor: '#00e5ff', borderRadius: '999px' }}>
                        Mua ngay
                    </button>
                    <button 
                        className="btn fw-bold text-white px-4 py-2 d-flex align-items-center gap-2" 
                        style={{ backgroundColor: '#000', borderRadius: '999px' }} 
                        onClick={onAddToCart}
                    >
                        <i className="fas fa-shopping-bag"></i>
                        Thêm vào giỏ
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
    return (
        <article className="py-4">
            <div className="d-flex align-items-start gap-3 mb-2">
                <img
                    src={review.user?.avatar || '/default-avatar.png'}
                    alt="Avatar người dùng"
                    className="rounded-circle border"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
                <div>
                    <p className="mb-1 small fw-medium">
                        {review.user?.username || 'Người dùng'}
                    </p>
                    <div className="star-rating d-flex gap-1 text-sm">
                        {[...Array(5)].map((_, i) => (
                            <i
                                key={i}
                                className={`fas fa-star${i < review.rating ? ' text-warning' : ' text-muted'}`}
                            ></i>
                        ))}
                    </div>
                    <time className="text-muted small d-block mt-1">
                        {new Date(review.createdAt).toLocaleString('vi-VN')}
                    </time>
                </div>
            </div>

            <p className="small mb-3">{review.comment}</p>

            {review.images?.length > 0 && (
                <div className="d-flex gap-2 mb-2">
                    {review.images.slice(0, 3).map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Đánh giá ${idx + 1}`}
                            className="rounded border"
                            style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                            }}
                        />
                    ))}
                </div>
            )}
        </article>
    );
}

function FloatingChatButton() {
    return (
        <button
            className="btn btn-info text-white rounded-circle shadow position-fixed"
            style={{ bottom: '24px', right: '24px', width: '56px', height: '56px' }}
            aria-label="Chat support"
        />
    );
}

export default ProductDetail;