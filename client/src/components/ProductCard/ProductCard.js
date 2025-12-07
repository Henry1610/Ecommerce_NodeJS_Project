
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { addToCart } from "../../redux/user/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../redux/user/wishlistSlice";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchCart } from '../../redux/user/cartSlice';
import { MAX_STRIPE_AMOUNT } from '../../config/constants';
import { selectCartTotalPrice } from '../../redux/user/cartSlice';
import { addToCompare, removeFromCompare } from '../../redux/public/compareSlice';
import { fetchWishlist } from '../../redux/user/wishlistSlice';
import './ProductCard.css';

function ProductCard({ product, compareEnabled }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const totalPrice = useSelector(selectCartTotalPrice);
    const { wishlist } = useSelector(state => state.user.userWishlist);
    const token = useSelector((state) => state.auth.accessToken);
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const compareList = useSelector(state => state.public.compare.compareList);

    useEffect(() => {
        if (token) {
            dispatch(fetchCart());
            dispatch(fetchWishlist());
        }
    }, [dispatch, token]);

    const originalPrice = product.price;
    const discountPrice = originalPrice - ((originalPrice * product.discountPercent) / 100);

    const handleShowDetail = (slug) => {
        navigate(`/product/${slug}`);
    };

    const handleAddToCart = async ({ productId, quantity }) => {
        // Kiểm tra đăng nhập trước
        if (!token) {
            toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
            navigate('/login');
            return;
        }

        setIsLoading(true);
        const newTotal = totalPrice + discountPrice * quantity;

        if (newTotal > MAX_STRIPE_AMOUNT) {
            toast.warning('Tổng giá trị đơn hàng không được vượt quá 100 triệu!');
            setIsLoading(false);
            return;
        }

        try {
            await dispatch(addToCart({ productId, quantity })).unwrap();
            toast.success('Sản phẩm đã được thêm vào giỏ hàng!');
        } catch (error) {
            toast.error(error || 'Thêm vào giỏ hàng thất bại!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickBuy = () => {
        // Kiểm tra đăng nhập trước
        if (!token) {
            toast.error('Vui lòng đăng nhập để mua hàng!');
            navigate('/login');
            return;
        }
        
        handleAddToCart({ productId: product._id, quantity: 1 });
        setTimeout(() => {
            navigate('/cart');
        }, 1000);
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

    return (
        <div
            className="product-card-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: isHovered
                    ? '0 20px 40px rgba(102, 126, 234, 0.3)'
                    : '0 8px 25px rgba(0, 0, 0, 0.1)',
            }}
        >
            <div className="card border-0 h-100 product-card">
                {/* Discount Badge - Fixed height container */}
                <div className="position-absolute top-0 start-0 m-2 discount-badge-container">
                    {product.discountPercent > 0 && (
                        <div className="badge text-white fw-bold px-2 px-md-3 py-1 small discount-badge">
                            -{product.discountPercent}%
                        </div>
                    )}
                </div>

                {/* Heart Icon */}
                <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 2 }}>
                    <button
                        className={`btn btn-sm border-0 rounded-circle heart-button ${wishlist.some(item => item._id === product._id) ? 'bg-danger text-white' : 'bg-white'}`}
                        onClick={handleWishlistToggle}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.1)';
                            if (!wishlist.some(item => item._id === product._id)) {
                                e.target.style.color = '#ff6b6b';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            if (!wishlist.some(item => item._id === product._id)) {
                                e.target.style.color = '#6c757d';
                            }
                        }}
                    >
                        <i className="fas fa-heart small"></i>
                    </button>
                </div>

                {/* Product Image */}
                <div
                    className="position-relative overflow-hidden image-container"
                    onClick={() => handleShowDetail(product.slug)}
                >
                    <img
                        src={product.images && product.images.length > 0 ? product.images[0] : "https://storage.googleapis.com/a1aa/image/821514f3-0a04-418f-30e9-be563b4f05cb.jpg"}
                        alt={product.name}
                        className="product-image"
                    />

                    {/* Overlay gradient on hover */}
                    <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                            background: isHovered
                                ? 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%)'
                                : 'transparent',
                            transition: 'background 0.3s ease',
                        }}
                    />
                </div>

                {/* Card Body */}
                <div className="card-body p-2 p-md-3">
                    {/* Product Name - Fixed height */}
                    <h6
                        className="card-title fw-bold mb-1 mb-md-2 fs-6 product-name"
                        onClick={() => handleShowDetail(product.slug)}
                    >
                        {product.name}
                    </h6>

                    {/* Rating - Fixed height */}
                    <div className="d-flex align-items-center justify-content-between mb-1 mb-md-2" style={{ height: '20px' }}>
                        <div className="d-flex align-items-center gap-1">
                            <div className="d-flex small">
                                {[...Array(5)].map((_, index) => {
                                    const full = index + 1 <= product.ratings;
                                    const half = !full && index + 0.5 <= product.ratings;
                                    return (
                                        <i
                                            key={index}
                                            className={`fas ${full ? 'fa-star' : half ? 'fa-star-half-alt' : 'far fa-star'}`}
                                            style={{ color: '#fbbf24' }}
                                        />
                                    );
                                })}
                            </div>
                            <span className="text-muted fw-medium small">
                                ({product.numReviews})
                            </span>
                        </div>

                        {/* Stock indicator */}
                        <div className="d-none d-sm-flex align-items-center">
                            <div
                                className="rounded-circle me-1 stock-dot"
                                style={{
                                    backgroundColor: product.stock > 0 ? '#10b981' : '#ef4444',
                                }}
                            />
                            <span
                                className="small"
                                style={{
                                    color: product.stock > 0 ? '#10b981' : '#ef4444',
                                }}
                            >
                                {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                            </span>
                        </div>
                    </div>

                    {/* Price - Fixed height container */}
                    <div className="mb-2 mb-md-3 price-container">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-danger fw-bold mb-0 fs-6">
                                    {discountPrice?.toLocaleString('vi-VN')}đ
                                </h6>
                                {/* Fixed height container for original price */}
                                <div className="original-price-container">
                                    {product.discountPercent > 0 && (
                                        <span className="text-decoration-line-through text-muted small">
                                            {originalPrice?.toLocaleString('vi-VN')}đ
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Installment badge */}
                            <div className="badge text-white px-2 py-1 d-none d-sm-inline-flex align-items-center installment-badge small">
                                Trả góp 0%
                            </div>
                        </div>
                    </div>

                    {/* Nút +So sánh */}
                    {compareEnabled && (
                        <button
                            className={`btn btn-outline-info btn-sm w-100 mb-1 mb-md-2 small ${compareList.length >= 2 && !compareList.find(p => p._id === product._id) ? 'disabled' : ''}`}
                            disabled={compareList.length >= 2 && !compareList.find(p => p._id === product._id)}
                            onClick={() => {
                                if (compareList.find(p => p._id === product._id)) {
                                    dispatch(removeFromCompare(product._id));
                                } else {
                                    dispatch(addToCompare(product));
                                }
                            }}
                        >
                            {compareList.find(p => p._id === product._id) ? 'Bỏ so sánh' : '+ So sánh'}
                        </button>
                    )}
                    {/* Action Buttons */}
                    <div className="d-flex gap-1 gap-md-2">
                        <button
                            className="btn flex-1 fw-bold btn-add-to-cart btn-sm small"
                            onClick={() => handleAddToCart({ productId: product._id, quantity: 1 })}
                            disabled={isLoading || product.stock === 0}
                        >
                            {isLoading ? (
                                <div className="d-flex align-items-center justify-content-center">
                                    <div className="spinner-border spinner-border-sm me-1" />
                                    <span className="d-none d-sm-inline">Thêm...</span>
                                </div>
                            ) : (
                                <>
                                    <i className="fas fa-shopping-cart text-white"></i>
                                    <span className="ms-1 d-none d-sm-inline text-white">Thêm vào giỏ</span>
                                </>
                            )}
                        </button>

                        <button
                            className="btn btn-outline-info fw-bold btn-sm btn-quick-buy"
                            onClick={handleQuickBuy}
                            disabled={product.stock === 0}
                        >
                            <i className="fas fa-bolt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;