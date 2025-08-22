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
        handleAddToCart({ productId: product._id, quantity: 1 });
        setTimeout(() => {
            navigate('/cart');
        }, 1000);
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

    return (
        <div
            className="product-card-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                borderRadius: '20px',
                padding: '2px',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: isHovered
                    ? '0 20px 40px rgba(102, 126, 234, 0.3)'
                    : '0 8px 25px rgba(0, 0, 0, 0.1)',
            }}
        >
            <div
                className="card border-0 h-100"
                style={{
                    borderRadius: '18px',
                    overflow: 'hidden',
                    background: 'white',
                    position: 'relative',
                }}
            >
                {/* Discount Badge - Fixed height container */}
                <div
                    className="position-absolute top-0 start-0 m-2"
                    style={{
                        zIndex: 2,
                        height: '24px', // Fixed height
                        minWidth: '40px' // Minimum width to maintain space
                    }}
                >
                    {product.discountPercent > 0 && (
                        <div
                            className="badge text-white fw-bold px-2 py-1"
                            style={{
                                background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
                                borderRadius: '8px',
                                fontSize: '0.7rem',
                                boxShadow: '0 2px 8px rgba(238, 90, 82, 0.3)',
                            }}
                        >
                            -{product.discountPercent}%
                        </div>
                    )}
                </div>

                {/* Heart Icon */}
                <div
                    className="position-absolute top-0 end-0 m-2"
                    style={{ zIndex: 2 }}
                >
                    <button
                        className={`btn btn-sm border-0 rounded-circle ${wishlist.some(item => item._id === product._id) ? 'bg-danger text-white' : 'bg-white'}`}
                        style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s ease',
                        }}
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
                        <i className="fas fa-heart" style={{ fontSize: '0.8rem' }}></i>
                    </button>
                </div>

                {/* Product Image */}
                <div
                    className="position-relative overflow-hidden"
                    style={{ aspectRatio: '1/1', height: 'auto', minHeight: 0, background: '#fff', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => handleShowDetail(product.slug)}
                >
                    <img
                        src={product.images && product.images.length > 0 ? product.images[0] : "https://storage.googleapis.com/a1aa/image/821514f3-0a04-418f-30e9-be563b4f05cb.jpg"}
                        alt={product.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: 200,
                            maxHeight: 200,
                            objectFit: 'contain',
                            background: '#fff',
                            borderRadius: 12,
                            transition: 'transform 0.3s ease',
                            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                            display: 'block',
                            margin: '0 auto'
                        }}
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
                <div className="card-body p-3">
                    {/* Product Name - Fixed height */}
                    <h6
                        className="card-title fw-bold mb-2"
                        style={{
                            fontSize: '0.95rem',
                            color: '#2d3748',
                            cursor: 'pointer',
                            lineHeight: '1.3',
                            height: '2.6rem', // Fixed height for 2 lines
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}
                        onClick={() => handleShowDetail(product.slug)}
                    >
                        {product.name}
                    </h6>

                    {/* Rating - Fixed height */}
                    <div className="d-flex align-items-center justify-content-between mb-2" style={{ height: '20px' }}>
                        <div className="d-flex align-items-center gap-1">
                            <div className="d-flex" style={{ fontSize: '0.75rem' }}>
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
                            <span
                                className="text-muted fw-medium"
                                style={{ fontSize: '0.75rem' }}
                            >
                                ({product.numReviews})
                            </span>
                        </div>

                        {/* Stock indicator */}
                        <div className="d-flex align-items-center">
                            <div
                                className="rounded-circle me-1"
                                style={{
                                    width: '6px',
                                    height: '6px',
                                    backgroundColor: product.stock > 0 ? '#10b981' : '#ef4444',
                                }}
                            />
                            <span
                                className="small"
                                style={{
                                    fontSize: '0.7rem',
                                    color: product.stock > 0 ? '#10b981' : '#ef4444',
                                }}
                            >
                                {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                            </span>
                        </div>
                    </div>

                    {/* Price - Fixed height container */}
                    <div className="mb-3" style={{ minHeight: '45px' }}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6
                                    className="text-danger fw-bold mb-0"
                                    style={{ fontSize: '1.1rem' }}
                                >
                                    {discountPrice?.toLocaleString('vi-VN')}đ
                                </h6>
                                {/* Fixed height container for original price */}
                                <div style={{ height: '16px', marginTop: '2px' }}>
                                    {product.discountPercent > 0 && (
                                        <span
                                            className="text-decoration-line-through text-muted small"
                                            style={{ fontSize: '0.8rem' }}
                                        >
                                            {originalPrice?.toLocaleString('vi-VN')}đ
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Installment badge */}
                            <div
                                className="badge text-white px-2 py-1"
                                style={{
                                    background: 'linear-gradient(45deg, #10b981, #059669)',
                                    borderRadius: '6px',
                                    fontSize: '0.65rem',
                                }}
                            >
                                Trả góp 0%
                            </div>
                        </div>
                    </div>

                    {/* Nút +So sánh */}
                    {compareEnabled && (
                        <button
                            className={`btn btn-outline-info btn-sm w-100 mb-2 ${compareList.length >= 2 && !compareList.find(p => p._id === product._id) ? 'disabled' : ''}`}
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
                    <div className="d-flex gap-2">
                        <button
                            className="btn flex-1 fw-bold btn-add-to-cart"
                            style={{
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                border: 'none',
                                color: 'white',
                                borderRadius: '10px',
                                padding: '8px 16px',
                                fontSize: '0.85rem',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)',
                            }}
                            onClick={() => handleAddToCart({ productId: product._id, quantity: 1 })}
                            disabled={isLoading || product.stock === 0}
                            onMouseEnter={(e) => {
                                if (!isLoading && product.stock > 0) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.3)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.2)';
                            }}
                        >
                            {isLoading ? (
                                <div className="d-flex align-items-center justify-content-center">
                                    <div
                                        className="spinner-border spinner-border-sm me-1"
                                        style={{ width: '12px', height: '12px' }}
                                    />
                                    <span>Thêm...</span>
                                </div>
                            ) : (
                                <>
                                    <i className="fas fa-shopping-cart"></i>
                                    <span className="ms-1">Thêm vào giỏ</span>
                                </>
                            )}
                        </button>

                        <button
                            className="btn btn-outline-primary fw-bold"
                            style={{
                                borderRadius: '10px',
                                padding: '8px 12px',
                                fontSize: '0.85rem',
                                transition: 'all 0.2s ease',
                                minWidth: '44px',
                            }}
                            onClick={handleQuickBuy}
                            disabled={product.stock === 0}
                            onMouseEnter={(e) => {
                                if (product.stock > 0) {
                                    e.target.style.transform = 'translateY(-2px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                            }}
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