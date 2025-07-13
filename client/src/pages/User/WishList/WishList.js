import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchWishlist, removeFromWishlist } from '../../../redux/user/wishlistSlice';
import { addToCart } from '../../../redux/user/cartSlice';

function WishList() {
    const dispatch = useDispatch();
    const { wishlist, loading, error } = useSelector(state => state.user.userWishlist);

    useEffect(() => {
        dispatch(fetchWishlist())
            .unwrap()
            .catch(error => {
                toast.error('Lỗi khi tải danh sách yêu thích');
            });
    }, [dispatch]);

    const handleRemoveFromWishlist = (productId) => {
        dispatch(removeFromWishlist(productId))
            .unwrap()
            .then(() => {
                toast.success('Đã xóa khỏi danh sách yêu thích');
            })
            .catch(error => {
                toast.error('Lỗi khi xóa khỏi danh sách yêu thích');
            });
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart({
            productId: product._id,
            quantity: 1,
            price: product.price
        }))
            .unwrap()
            .then(() => {
                toast.success('Đã thêm vào giỏ hàng');
            })
            .catch(error => {
                toast.error('Lỗi khi thêm vào giỏ hàng');
            });
    };

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5  border-top">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-decoration-none">Trang chủ</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">Danh sách yêu thích</li>
                </ol>
            </nav>

            {/* Page Header */}
            <div className="row mb-5">
                <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <p className="mb-0 fw-semibold text-secondary fs-5">
                                {wishlist?.length || 0} sản phẩm trong danh sách yêu thích
                            </p>
                        </div>

                        {wishlist && wishlist.length > 0 && (
                            <div className="text-end">
                                <span className="badge bg-info fs-6 px-3 ">
                                    {wishlist.length} sản phẩm
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Wishlist Content */}
            {wishlist && wishlist.length > 0 ? (
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="border-0" style={{ width: '50px' }}></th>
                                                <th className="border-0">Sản phẩm</th>
                                                <th className="border-0 text-center">Giá</th>
                                                <th className="border-0 text-center">Trạng thái</th>
                                                <th className="border-0 text-center">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {wishlist.map((item) => (
                                                <tr key={item._id}>
                                                    <td className="align-middle">
                                                        <button
                                                            className="btn btn-sm btn-outline-danger rounded-circle"
                                                            onClick={() => handleRemoveFromWishlist(item._id)}
                                                            title="Xóa khỏi danh sách yêu thích"
                                                            style={{ width: '30px', height: '30px' }}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </td>
                                                    <td className="align-middle">
                                                        <div className="d-flex align-items-center">
                                                            <div className="position-relative me-3">
                                                                <img
                                                                    src={item.images?.[0] || '/placeholder-image.jpg'}
                                                                    alt={item.name}
                                                                    className="rounded"
                                                                    style={{
                                                                        width: '100px',
                                                                        height: '100px',
                                                                        objectFit: 'contain',
                                                                        border: '1px solid #e5e7eb'
                                                                    }}
                                                                />

                                                                {item.discountPercent > 0 && (
                                                                    <span className="position-absolute top-0 start-0 badge bg-danger rounded-pill">
                                                                        -{item.discountPercent}%
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                                    {item.brand && item.brand.logo && (
                                                                        <div
                                                                            className="flex-shrink-0"
                                                                            style={{ width: '40px', height: '40px' }}
                                                                        >
                                                                            <img
                                                                                src={item.brand.logo}
                                                                                alt={item.brand.name}
                                                                                className="rounded"
                                                                                style={{
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    objectFit: 'contain',
                                                                                    backgroundColor: '#f8f9fa',
                                                                                    padding: '4px',
                                                                                    border: '1px solid #dee2e6'
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <h6 className="mb-0 fw-semibold">
                                                                        <Link
                                                                            to={`/product/${item.slug}`}
                                                                            className="text-decoration-none text-dark"
                                                                        >
                                                                            {item.name}
                                                                        </Link>
                                                                    </h6>
                                                                </div>

                                                                <div className="d-flex align-items-center">
                                                                    <div className="d-flex me-2">
                                                                        {[...Array(5)].map((_, index) => (
                                                                            <i
                                                                                key={index}
                                                                                className={`fas fa-star ${index < Math.floor(item.ratings || 0) ? 'text-warning' : 'text-muted'}`}
                                                                                style={{ fontSize: '0.75rem' }}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <small className="text-muted">
                                                                        ({item.numReviews || 0})
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="align-middle text-center">
                                                        <div className="d-flex flex-column align-items-center">
                                                            <span className="fw-bold fs-6" style={{ color: '#1f2937' }}>
                                                                {new Intl.NumberFormat('vi-VN', {
                                                                    style: 'currency',
                                                                    currency: 'VND'
                                                                }).format(item.price)}
                                                            </span>
                                                            {item.discountPercent > 0 && (
                                                                <small className="text-muted text-decoration-line-through">
                                                                    {new Intl.NumberFormat('vi-VN', {
                                                                        style: 'currency',
                                                                        currency: 'VND'
                                                                    }).format(item.price * (1 + item.discountPercent / 100))}
                                                                </small>
                                                            )}

                                                        </div>
                                                    </td>
                                                    <td className="align-middle text-center">
                                                        {item.stock > 0 ? (
                                                            <span className="badge px-3 py-2" style={{ backgroundColor: '#16a34a', color: '#fff' }}>
                                                                <i className="fas fa-check-circle me-1"></i>
                                                                Còn hàng
                                                            </span>
                                                        ) : (
                                                            <span className="badge px-3 py-2" style={{ backgroundColor: '#dc2626', color: '#fff' }}>
                                                                <i className="fas fa-times-circle me-1"></i>
                                                                Hết hàng
                                                            </span>
                                                        )}

                                                    </td>
                                                    <td className="align-middle text-center">
                                                        <div className="d-flex gap-2 justify-content-center">
                                                            <button
                                                                className="btn btn-sm px-3 py-2 bg-info"
                                                                style={{
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    borderRadius: '9999px',
                                                                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                                                    transition: 'background-color 0.3s ease'
                                                                }}
                                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e40af'}
                                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                                                                onClick={() => handleAddToCart(item)}
                                                                disabled={item.stock <= 0}
                                                                title={item.stock <= 0 ? 'Sản phẩm hết hàng' : 'Thêm vào giỏ hàng'}
                                                            >
                                                                <i className="fas fa-shopping-cart me-1"></i>
                                                                Thêm vào giỏ
                                                            </button>

                                                            <Link
                                                                to={`/product/${item.slug}`}
                                                                className="btn btn-sm px-3 py-2"
                                                                style={{
                                                                    backgroundColor: '#4b5563',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    borderRadius: '9999px',
                                                                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                                                    transition: 'background-color 0.3s ease'
                                                                }}
                                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#374151'}
                                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4b5563'}
                                                                title="Xem chi tiết"
                                                            >
                                                                <i className="fas fa-eye text-white"></i>
                                                            </Link>
                                                        </div>
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-5">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body py-5">
                            <div className="mb-4">
                                <i className="fas fa-heart text-muted" style={{ fontSize: '5rem' }}></i>
                            </div>
                            <h3 className="text-muted mb-3">Danh sách yêu thích trống</h3>
                            <p className="text-muted mb-4 fs-5">
                                Bạn chưa có sản phẩm nào trong danh sách yêu thích.
                                <br />
                                Hãy khám phá và thêm những sản phẩm bạn yêu thích!
                            </p>
                            <Link to="/product" className="btn btn-primary btn-lg">
                                <i className="fas fa-shopping-bag me-2"></i>
                                Mua sắm ngay
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WishList;