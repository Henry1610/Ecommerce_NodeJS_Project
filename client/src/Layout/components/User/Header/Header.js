import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../../redux/auth/authSlice';
import { Link } from 'react-router-dom';
import './Header.css'
import { fetchCart } from '../../../../redux/user/cartSlice';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { fetchProducts, resetSuggestions } from '../../../../redux/public/productsSlice';
import { getProductSuggestions } from '../../../../redux/public/productsSlice';
import useDebounce from '../../../../hooks/useDebounce';
import logo from '../../../../assets/logo/Logo.png'
function Header() {
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { productSuggestions } = useSelector(state => state.public.publicProduct);

    const { cart, error, loading } = useSelector(state => state.user.userCart);
    const [keyword, setKeyword] = useState('');
    const debouncedKeyword = useDebounce(keyword, 500);

    const userProfile = useSelector(state => state.user.userProfile.profile);
    const authUser = useSelector(state => state.auth.user);
    const username = userProfile?.user?.username || authUser?.username || 'Tài khoản';
    const avatar = userProfile?.user?.avatar || authUser?.avatar || '';

    const handleSearch = (e) => {
        e.preventDefault();

        const trimmed = keyword.trim();
        if (trimmed) {
            dispatch(fetchProducts({ name: trimmed }));
            setKeyword('')
            navigate('/product');
        }
    };
    const handleChangeKeyword = (e) => {
        setKeyword(e.target.value); // Không gọi dispatch ở đây nữa
    };
    useEffect(() => {
        const trimmed = debouncedKeyword.trim();

        if (trimmed.length >= 2) {
            dispatch(getProductSuggestions(trimmed));
        } else {
            dispatch(resetSuggestions());
        }
    }, [debouncedKeyword, dispatch]);



    const isAuthenticated = !!token;

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };
    useEffect(() => {
        if (isAuthenticated && authUser?.role === 'user') {
            dispatch(fetchCart())
                .unwrap()
                .catch(error => toast.error(`Lỗi khi tải giỏ hàng: ${error}`));
        }
    }, [dispatch, isAuthenticated, authUser]);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center text-secondary mt-3" style={{ fontSize: "0.75rem" }}>
                <div className="d-inline-flex border rounded-pill overflow-hidden shadow-sm bg-white">
                    <div className="d-flex align-items-center px-3 py-2 gap-2 border-end">
                        <i className="fas fa-phone-alt" style={{ color: '#06b6d4' }}></i>
                        <span className="fw-bold text-dark">1900.63.3579</span>
                    </div>
                    <div className="d-flex align-items-center px-3 py-2 gap-2">
                        <i className="fas fa-life-ring" style={{ color: '#22c55e' }}></i>
                        <span className="fw-bold text-dark">Hỗ trợ</span>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-3"> {/* giảm gap từ 4 → 3 */}
                    <button
                        className="btn btn-link d-flex align-items-center gap-1 p-0 text-decoration-none"
                        type="button"
                        style={{ color: '#6c757d', fontWeight: 500, fontSize: "0.9rem" }} // nhỏ chữ + giảm đậm
                    >
                        <i className="fas fa-store-alt small"></i>
                        <span>Địa chỉ cửa hàng</span>
                    </button>
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

            <header className="d-flex justify-content-between align-items-center px-4 py-3 ">
                <div className="d-flex align-items-center gap-4">
                    <Link to='/' className="text-primary fw-bold" style={{ fontSize: "32px", fontFamily: "'Inter', sans-serif", userSelect: "none" }}>
                    <img src="/assets/logo/Logo.png" alt="logo" style={{ width: '60px', height: 'auto' }} />
                    pro
                    </Link>
                    <button className="btn d-lg-none p-0 text-secondary" aria-label="Menu">
                        <i className="fas fa-bars fs-4"></i>
                    </button>
                    <nav className="d-none d-lg-flex align-items-center gap-4 text-secondary fw-semibold user-select-none" >
                        <Link to="/product" className="d-flex align-items-center gap-1  text-secondary hover-black fs-5 gap-3">
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
                            <Link to='/profile'>
                                <span className="d-flex align-items-center gap-2">
                                    {avatar ? (
                                        <img
                                            src={avatar}
                                            alt="avatar"
                                            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <i className="far fa-user-circle fs-4"></i>
                                    )}
                                    <span className="fw-bold fs-6">{username}</span>
                                </span>
                            </Link>
                            

                            <button
                                className="btn btn-info text-black fw-bold d-flex align-items-center gap-1 rounded-pill position-relative"
                                type="button"
                                aria-label="Shopping cart"
                                onClick={() => { navigate('/cart') }}
                            >
                                <i className="fas fa-shopping-bag fs-4"></i>
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
                            </button>
                            <button
                                className="btn btn-info text-black fw-bold d-flex align-items-center p-2 rounded-pill"
                                type="button"
                                aria-label="Shopping cart"
                                onClick={() => { navigate('/order-history') }}
                            >
                                <i class="fa-solid fa-clock-rotate-left"></i>
                            </button>
                            <button
                                className="btn btn-logout  d-flex align-items-center gap-2 rounded-pill px-3 py-2 shadow-sm"
                                type="button"
                                onClick={handleLogout}
                            >
                                <i class="fa-solid fa-right-from-bracket"></i>  <span className="fw-semibold">Đăng xuất</span>
                            </button>

                        </>
                    ) : (
                        <Link to='/login'>
                            <button
                                className="btn btn-login  d-flex align-items-center gap-2 rounded-pill px-3 py-2 shadow-sm"
                                type="button"

                            >
                                <i class="fa-solid fa-right-to-bracket"></i>  <span className="fw-semibold">Đăng nhập</span>
                            </button>
                        </Link>

                    )}
                </div>

            </header>
        </>
    );
}

export default Header;