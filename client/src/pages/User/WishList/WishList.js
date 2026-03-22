import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchWishlist, removeFromWishlist } from '../../../redux/user/wishlistSlice';
import { addToCart } from '../../../redux/user/cartSlice';
import { WishListSkeleton } from '../../../components/Skeleton';
import EmptyProductsState from '../../../components/EmptyProductsState';
import PageSectionHeading from '../../../components/PageSectionHeading';

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
        return <WishListSkeleton />;
    }

    if (error) {
        return (
            <div className="container py-4 border-top">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4 border-top">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="user-page-header__breadcrumb">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-decoration-none">Trang chủ</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">Danh sách yêu thích</li>
                </ol>
            </nav>

            {/* Page Header */}
            <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <PageSectionHeading
                        title="Danh sách yêu thích"
                        description="Xem và quản lý sản phẩm bạn đã lưu để mua sau"
                    />
                    {wishlist && wishlist.length > 0 && (
                        <div className="badge bg-light text-dark fs-6 px-3 py-2 rounded-3">
                            <i className="fa-solid fa-heart me-2" aria-hidden />
                            {wishlist.length} sản phẩm
                        </div>
                    )}
                </div>
            </div>

            {/* Wishlist Content */}
            {wishlist && wishlist.length > 0 ? (
                <div className="row">
                    <div className="col-12">
                        {/* Desktop View - Table */}
                        <div className="card border-0 shadow-sm d-none d-lg-block">
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
                                                                        width: '80px',
                                                                        height: '80px',
                                                                        objectFit: 'contain',
                                                                        border: '1px solid #e5e7eb'
                                                                    }}
                                                                />
                                                                {item.discountPercent > 0 && (
                                                                    <span className="position-absolute top-0 start-0 badge bg-danger rounded-pill small">
                                                                        -{item.discountPercent}%
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                                    {item.brand && item.brand.logo && (
                                                                        <div style={{ width: '30px', height: '30px' }}>
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
                                                                className="btn btn-sm px-3 py-2 bg-info text-white"
                                                                onClick={() => handleAddToCart(item)}
                                                                disabled={item.stock <= 0}
                                                                title={item.stock <= 0 ? 'Sản phẩm hết hàng' : 'Thêm vào giỏ hàng'}
                                                                style={{ borderRadius: '20px' }}
                                                            >
                                                                <i className="fas fa-shopping-cart me-1"></i>
                                                                Thêm
                                                            </button>
                                                            <Link
                                                                to={`/product/${item.slug}`}
                                                                className="btn btn-sm px-3 py-2 btn-secondary text-white"
                                                                title="Xem chi tiết"
                                                                style={{ borderRadius: '20px' }}
                                                            >
                                                                <i className="fas fa-eye"></i>
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

                        {/* Mobile View - Cards */}
                        <div className="d-lg-none">
                            {wishlist.map((item) => (
                                <div key={item._id} className="card border-0 shadow-sm mb-3">
                                    <div className="card-body p-3">
                                        <div className="row g-3">
                                            {/* Product Image */}
                                            <div className="col-4">
                                                <div className="position-relative">
                                                    <img
                                                        src={item.images?.[0] || '/placeholder-image.jpg'}
                                                        alt={item.name}
                                                        className="rounded w-100"
                                                        style={{
                                                            height: '100px',
                                                            objectFit: 'contain',
                                                            border: '1px solid #e5e7eb'
                                                        }}
                                                    />
                                                    {item.discountPercent > 0 && (
                                                        <span className="position-absolute top-0 start-0 badge bg-danger rounded-pill small">
                                                            -{item.discountPercent}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="col-8">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="flex-grow-1">
                                                        {item.brand && item.brand.logo && (
                                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                                <img
                                                                    src={item.brand.logo}
                                                                    alt={item.brand.name}
                                                                    style={{
                                                                        width: '20px',
                                                                        height: '20px',
                                                                        objectFit: 'contain'
                                                                    }}
                                                                />
                                                                <small className="text-muted">{item.brand.name}</small>
                                                            </div>
                                                        )}
                                                        <h6 className="mb-1 fw-semibold">
                                                            <Link
                                                                to={`/product/${item.slug}`}
                                                                className="text-decoration-none text-dark"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        </h6>
                                                    </div>
                                                    <button
    className="btn btn-outline-danger rounded-circle ms-2 d-flex align-items-center justify-content-center"
    onClick={() => handleRemoveFromWishlist(item._id)}
    title="Xóa khỏi danh sách yêu thích"
    style={{
        width: '2rem',      // thay vì px cố định
        height: '2rem',
        minWidth: '32px',
        minHeight: '32px',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
    }}
    onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#dc2626';
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.transform = 'scale(1.1)';
    }}
    onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#dc2626';
        e.currentTarget.style.transform = 'scale(1)';
    }}
>
    <i className="fas fa-times small"></i>
</button>

                                                </div>

                                                {/* Rating */}
                                                <div className="d-flex align-items-center mb-2">
                                                    <div className="d-flex me-2">
                                                        {[...Array(5)].map((_, index) => (
                                                            <i
                                                                key={index}
                                                                className={`fas fa-star ${index < Math.floor(item.ratings || 0) ? 'text-warning' : 'text-muted'}`}
                                                                style={{ fontSize: '0.7rem' }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <small className="text-muted">({item.numReviews || 0})</small>
                                                </div>

                                                {/* Price */}
                                                <div className="mb-2">
                                                    <span className="fw-bold fs-6">
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(item.price)}
                                                    </span>
                                                    {item.discountPercent > 0 && (
                                                        <small className="text-muted text-decoration-line-through ms-2">
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            }).format(item.price * (1 + item.discountPercent / 100))}
                                                        </small>
                                                    )}
                                                </div>

                                                {/* Status */}
                                                <div className="mb-3">
                                                    {item.stock > 0 ? (
                                                        <span className="badge bg-success">
                                                            <i className="fas fa-check-circle me-1"></i>
                                                            Còn hàng
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-danger">
                                                            <i className="fas fa-times-circle me-1"></i>
                                                            Hết hàng
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="col-12">
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-info text-white flex-grow-1"
                                                        onClick={() => handleAddToCart(item)}
                                                        disabled={item.stock <= 0}
                                                        title={item.stock <= 0 ? 'Sản phẩm hết hàng' : 'Thêm vào giỏ hàng'}
                                                    >
                                                        <i className="fas fa-shopping-cart me-2"></i>
                                                        Thêm vào giỏ
                                                    </button>
                                                    <Link
                                                        to={`/product/${item.slug}`}
                                                        className="btn btn-outline-secondary"
                                                        title="Xem chi tiết"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyProductsState
                    icon={<i className="fas fa-heart" aria-hidden />}
                    title="Danh sách yêu thích trống"
                    description={
                        <>
                            Bạn chưa có sản phẩm nào trong danh sách yêu thích.
                            <br className="d-none d-md-block" /> Hãy khám phá và thêm những sản phẩm bạn yêu thích!
                        </>
                    }
                    to="/product"
                    actionLabel="Mua sắm ngay"
                    actionIconClass="fas fa-shopping-bag"
                />
            )}
        </div>
    );
}

export default WishList;