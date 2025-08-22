import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, clearAuth } from '../../../../redux/auth/authSlice';
import { Link } from 'react-router-dom';
import './Header.css'
import { fetchCart } from '../../../../redux/user/cartSlice';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchProducts, resetSuggestions } from '../../../../redux/public/productsSlice';
import { getProductSuggestions } from '../../../../redux/public/productsSlice';
import useDebounce from '../../../../hooks/useDebounce';
import { fetchUserProfile, clearUserProfile } from '../../../../redux/user/userSlice';
import { clearCompare } from '../../../../redux/public/compareSlice';
function Header() {
    const token = useSelector((state) => state.auth.accessToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { productSuggestions } = useSelector(state => state.public.publicProduct);

    const { cart, error, loading } = useSelector(state => state.user.userCart);
    const { compareList } = useSelector(state => state.public.compare);
    const [keyword, setKeyword] = useState('');
    const debouncedKeyword = useDebounce(keyword, 500);

    const { profile } = useSelector(state => state.user.userProfile);
    const authUser = useSelector(state => state.auth.user);
    const username = profile?.user?.username || authUser?.username || 'Tài khoản';
    const avatar = profile?.user?.avatar || authUser?.avatar || '';

    // Kiểm tra xem user có phải là admin không
    const isAdmin = authUser?.role === 'admin';

    useEffect(() => {
        if (token && !isAdmin) {
            dispatch(fetchUserProfile());
        }
    }, [token, dispatch, isAdmin]);
    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = keyword.trim();
        if (trimmed) {
            setKeyword('');
            navigate(`/product?name=${encodeURIComponent(trimmed)}`);
        }
    };
    const handleChangeKeyword = (e) => {
        setKeyword(e.target.value); // Không gọi dispatch ở đây nữa
    };
    useEffect(() => {
        const trimmed = debouncedKeyword.trim();

        if (trimmed.length > 0) {
            dispatch(getProductSuggestions(trimmed));
        } else {
            dispatch(resetSuggestions());
        }
    }, [debouncedKeyword, dispatch]);



    const isAuthenticated = !!token;

    const handleLogout = () => {
        // Clear state ngay lập tức
        dispatch(clearAuth());
        dispatch(clearUserProfile());
        dispatch(clearCompare());
        // Gọi API logout (không cần đợi)
        dispatch(logout());
        navigate('/login');
    };
    useEffect(() => {
        if (token && !isAdmin) {
            dispatch(fetchCart())
                .unwrap()
                .catch(error => toast.error(`Lỗi khi tải giỏ hàng: ${error}`));
        }
    }, [dispatch, token, isAdmin]);

    const wishlistCount = useSelector(state => state.user.userWishlist.wishlist.length);

    return (
        <>
            <div className="d-none d-md-flex justify-content-between align-items-center text-secondary mt-3" style={{ fontSize: "0.75rem" }}>
                <div className="d-inline-flex border rounded-pill overflow-hidden shadow-sm bg-white" style={{ transition: 'all 0.3s ease' }}>
                    <div
                        className="d-flex align-items-center px-3 py-2 gap-2 border-end"
                        style={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = '#f0f9ff';
                            e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <i className="fas fa-phone-alt" style={{ color: '#06b6d4' }}></i>
                        <span className="fw-bold text-dark">1900.79.7979</span>
                    </div>
                    <div
                        className="d-flex align-items-center px-3 py-2 gap-2"
                        style={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = '#f0f9ff';
                            e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <i className="fas fa-life-ring" style={{ color: '#22c55e' }}></i>
                        <span className="fw-bold text-dark">Hỗ trợ</span>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <div
                        style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.75rem',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <button
                            className="btn btn-link d-flex align-items-center gap-1 p-0 text-decoration-none"
                            type="button"
                            style={{ color: '#6c757d', fontWeight: 500, fontSize: "0.9rem" }}
                        >
                            <i className="fas fa-store-alt small"></i>
                            <Link to="/store-address" className="text-reset text-decoration-none">
                                Địa chỉ cửa hàng
                            </Link>
                        </button>
                    </div>

                    <div
                        style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.75rem',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <button
                            className="btn btn-link d-flex align-items-center gap-1 p-0 text-decoration-none"
                            type="button"
                            style={{ color: '#6c757d', fontWeight: 500, fontSize: "1rem" }}
                        >
                            <i className="far fa-newspaper small"></i>
                            <span>Tin tức</span>
                        </button>
                    </div>
                </div>

            </div>

            <header className="d-flex justify-content-between align-items-center px-4 py-3 ">
                <div className="d-flex align-items-center gap-2">
                    <Link to='/' className=" fw-bold text-decoration-none text-reset" style={{ fontSize: "32px", fontFamily: "'Inter', sans-serif", userSelect: "none" }}>
                        <img src="/assets/logo/Logo.png" alt="logo" style={{ width: '60px', height: 'auto' }} />
                    </Link>
                    <Link to="/product" className="d-flex align-items-center gap-1  text-secondary hover-black fs-5 gap-3 text-decoration-none text-reset">
                        <button className="btn d-lg-none p-0 text-secondary" aria-label="Menu">
                            <i className="fas fa-bars fs-4"></i>
                        </button>
                    </Link>

                    <nav className="d-none d-lg-flex align-items-center gap-4 text-secondary fw-semibold user-select-none" >
                        <Link to="/product" className="d-flex align-items-center gap-1  text-secondary hover-black fs-5 gap-3 text-decoration-none text-reset">
                            <i className="fas fa-bars"></i>
                            <span>Sản phẩm</span>
                        </Link>
                    </nav>
                    <div className="position-relative d-none d-md-block" style={{ width: "320px", maxWidth: "100%" }}>
                        <form
                            className="d-flex align-items-center border border-info bg-white rounded-pill px-3 py-1 shadow-sm"
                            onSubmit={handleSearch}
                        >
                            <i className="fas fa-search text-info fs-5"></i>
                            <input
                                type="search"
                                placeholder="Xin chào, bạn đang tìm gì?"
                                className="form-control border-0 bg-transparent ms-2 p-0 py-2"
                                style={{
                                    color: "#0e7490",
                                    fontSize: "0.875rem",
                                    outline: "none",
                                    boxShadow: "none",
                                }}
                                value={keyword}
                                onChange={handleChangeKeyword}
                            />
                        </form>

                        {productSuggestions.length > 0 && (
                            <ul
                                className="list-group position-absolute z-3 bg-white w-100 shadow rounded mt-1"
                                style={{ top: "100%", left: 0, maxHeight: "300px", overflowY: "auto" }}
                            >
                                {productSuggestions.map(product => (
                                    <li
                                        key={product._id}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => {
                                            navigate(`/product/${product.slug}`);
                                            dispatch(resetSuggestions());
                                        }}
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: "0.875rem"
                                        }}
                                    >
                                        {product.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>



                </div>
                <div className="d-flex align-items-center gap-3 text-secondary fw-semibold user-select-none">
                    {isAuthenticated ? (
                        <>
                            <div className="bg-info d-flex align-items-center gap-4 px-3 py-2 rounded-4 shadow">
                                <button
                                    className="btn p-0 border-0 bg-transparent position-relative"
                                    type="button"
                                    aria-label="Shopping cart"
                                    onClick={() => { navigate('/cart') }}
                                    style={{ color: '#fff' }}
                                >
                                    <i className="fas fa-shopping-bag fs-4"></i>
                                    {cart?.items?.length > 0 && (
                                        <span
                                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                            style={{
                                                transform: 'translate(-50%, -30%)',
                                                padding: '4px 6px',
                                                fontSize: '0.75rem',
                                                minWidth: '20px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {cart?.items?.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    className="btn p-0 border-0 bg-transparent position-relative"
                                    type="button"
                                    aria-label="Wish list"
                                    onClick={() => { navigate('/wishlist') }}
                                    style={{ color: '#fff' }}
                                >
                                    <i className="fas fa-heart fs-4"></i>
                                    {wishlistCount > 0 && (
                                        <span
                                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                            style={{
                                                transform: 'translate(-50%, -30%)',
                                                padding: '4px 6px',
                                                fontSize: '0.75rem',
                                                minWidth: '20px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {wishlistCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    className="btn p-0 border-0 bg-transparent position-relative"
                                    type="button"
                                    aria-label="Compare products"
                                    onClick={() => { navigate('/compare') }}
                                    style={{ color: '#fff' }}
                                >
                                    <i className="fas fa-exchange-alt fs-4"></i>
                                    {compareList.length > 0 && (
                                        <span
                                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
                                            style={{
                                                transform: 'translate(-50%, -30%)',
                                                padding: '4px 6px',
                                                fontSize: '0.75rem',
                                                minWidth: '20px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {compareList.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    className="btn p-0 border-0 bg-transparent"
                                    type="button"
                                    aria-label="Order history"
                                    onClick={() => { navigate('/order-history') }}
                                    style={{ color: '#fff' }}
                                >
                                    <i className="fa-solid fa-clock-rotate-left fs-4"></i>
                                </button>
                            </div>
                            <Link to='/profile' className="text-decoration-none text-reset">
                                <span className="d-flex align-items-center gap-2">
                                    {avatar ? (
                                        <img src={avatar} alt="avatar"
                                            style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <i className="far fa-user-circle fs-4"></i>
                                    )}
                                    <span className="fw-bold fs-5 header-username">{username}</span>
                                </span>
                            </Link>

                            <button
                                className="btn btn-logout d-flex align-items-center gap-2 rounded-pill px-3 py-2 shadow-sm d-none d-md-flex"
                                type="button"
                                onClick={handleLogout}
                            >
                                <i className="fa-solid fa-right-from-bracket"></i>
                                <span className="fw-semibold">Đăng xuất</span>
                            </button>

                        </>
                    ) : (
                        <Link to="/login" className="text-decoration-none">
                            <button
                                className="btn btn-login d-flex align-items-center gap-2 rounded-pill px-3 py-2 shadow-sm"
                                type="button"
                            >
                                <i className="fa-solid fa-right-to-bracket"></i>
                                <span className="fw-semibold">Đăng nhập</span>
                            </button>
                        </Link>

                    )}
                </div>

            </header>
        </>
    );
}

export default Header;