import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../../redux/auth/authSlice';
import { Link, useLocation } from 'react-router-dom';
    

function Header() {
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = !!token;

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header>
            {/* Header Top */}
            <div className="bg-light py-2">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-4">
                            <div className="d-flex align-items-center">
                                <span className="me-2">Telephone Enquiry:</span>
                                <a href="#" className="text-decoration-none text-warning">(+123) 123 321 345</a>
                            </div>
                        </div>
                        <div className="col-lg-9 col-md-8">
                            <div className="d-flex justify-content-end">
                                {isAuthenticated && (
                                    <button
                                        className="btn btn-warning text-dark border fw-bold"
                                        onClick={handleLogout}
                                    >
                                        Log out
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header Middle */}
            <div className="py-3">
                <div className="container">
                    <div className="row align-items-center">
                        {/* Logo */}
                        <div className="col-lg-3">
                            <div className="logo">
                                <Link to="/">
                                    <img src="/images/menu/logo/1.jpg" alt="Logo" />
                                </Link>
                            </div>
                        </div>

                        {/* Search and Account */}
                        <div className="col-lg-9">
                            {/* Search Box */}
                            <div className="mb-3">
                                <div className="input-group">
                                    <select className="form-select w-25 border-warning">
                                        <option value="0">All</option>
                                        <option value="10">Laptops</option>
                                        <option value="12">Smartphone</option>
                                        <option value="13">Cameras</option>
                                        <option value="14">Headphone</option>
                                        <option value="15">Smartwatch</option>
                                        <option value="16">Accessories</option>
                                    </select>
                                    <input type="text" className="form-control border-warning" placeholder="Enter your search key..." />
                                    <button className="btn btn-warning text-dark" type="submit">
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Account Area */}
                            {isAuthenticated ? (
                                <div className="d-flex justify-content-end">
                                    <ul className="list-unstyled d-flex mb-0">
                                        {/* Wishlist */}
                                        <li className="me-4">
                                            <Link to="/wishlist" className="position-relative d-inline-block">
                                                <i className="far fa-heart fs-4 text-warning"></i>
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                                                    2
                                                </span>
                                            </Link>
                                        </li>

                                        {/* Mini Cart */}
                                        <li className="dropdown">
                                            <button className="btn btn-light dropdown-toggle position-relative" type="button" id="cartDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fas fa-shopping-cart me-2 text-warning"></i>
                                                <span className="text-warning">£80.00</span>
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                                                    2
                                                </span>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end p-3" aria-labelledby="cartDropdown" style={{ minWidth: "300px" }}>
                                                <ul className="list-unstyled mb-3">
                                                    <li className="d-flex align-items-center mb-3">
                                                        <img src="/images/product/small-size/5.jpg" alt="cart product" className="img-fluid me-3" style={{ width: "60px" }} />
                                                        <div className="flex-grow-1">
                                                            <h6 className="mb-0"><a href="#" className="text-decoration-none">Aenean eu tristique</a></h6>
                                                            <span className="text-warning">£40 x 1</span>
                                                        </div>
                                                        <button className="btn btn-sm text-danger">
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </li>
                                                    <li className="d-flex align-items-center">
                                                        <img src="/images/product/small-size/6.jpg" alt="cart product" className="img-fluid me-3" style={{ width: "60px" }} />
                                                        <div className="flex-grow-1">
                                                            <h6 className="mb-0"><a href="#" className="text-decoration-none">Aenean eu tristique</a></h6>
                                                            <span className="text-warning">£40 x 1</span>
                                                        </div>
                                                        <button className="btn btn-sm text-danger">
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </li>
                                                </ul>
                                                <p className="d-flex justify-content-between fw-bold mb-3">
                                                    SUBTOTAL: <span className="text-warning">£80.00</span>
                                                </p>
                                                <div className="d-grid gap-2">
                                                    <Link to="/cart" className="btn btn-outline-warning">View Full Cart</Link>
                                                    <a href="checkout.html" className="btn btn-warning text-dark">Checkout</a>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-end">
                                    <div className="row g-2 w-50">
                                        <div className="col-6">
                                            <Link
                                                to="/login"
                                                className={`btn ${location.pathname === '/login' ? 'btn-warning' : 'btn-outline-warning'} w-100 fw-bold text-dark opacity-75`}
                                            >
                                                Login
                                            </Link>
                                        </div>
                                        <div className="col-6">
                                            <Link
                                                to="/register"
                                                className={`btn ${location.pathname === '/register' ? 'btn-warning' : 'btn-outline-warning'} w-100 fw-bold text-dark opacity-75`}
                                            >
                                                Register
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Header Bottom / Main Menu - Desktop */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light d-none d-lg-block border-top border-bottom">
                <div className="container">
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav">
                            {/* Home */}
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle text-warning" href="/" id="homeDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Home
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="homeDropdown">
                                    <li><a className="dropdown-item active bg-warning text-dark" href="index.html">Home One</a></li>
                                    <li><a className="dropdown-item" href="index-2.html">Home Two</a></li>
                                    <li><a className="dropdown-item" href="index-3.html">Home Three</a></li>
                                    <li><a className="dropdown-item" href="index-4.html">Home Four</a></li>
                                </ul>
                            </li>

                            {/* Shop */}
                            <li className="nav-item dropdown position-static">
                                <a className="nav-link dropdown-toggle text-warning" href="/product" id="shopDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Shop
                                </a>
                                <div className="dropdown-menu w-100" aria-labelledby="shopDropdown">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <h6 className="dropdown-header text-warning">Shop Page Layout</h6>
                                                <a className="dropdown-item" href="shop-3-column.html">Shop 3 Column</a>
                                                <a className="dropdown-item" href="shop-4-column.html">Shop 4 Column</a>
                                                <a className="dropdown-item" href="shop-left-sidebar.html">Shop Left Sidebar</a>
                                                <a className="dropdown-item" href="shop-right-sidebar.html">Shop Right Sidebar</a>
                                                <a className="dropdown-item" href="shop-list.html">Shop List</a>
                                                <a className="dropdown-item" href="shop-list-left-sidebar.html">Shop List Left Sidebar</a>
                                                <a className="dropdown-item" href="shop-list-right-sidebar.html">Shop List Right Sidebar</a>
                                            </div>
                                            <div className="col-md-4">
                                                <h6 className="dropdown-header text-warning">Single Product Style</h6>
                                                <a className="dropdown-item" href="single-product-carousel.html">Single Product Carousel</a>
                                                <a className="dropdown-item" href="single-product-gallery-left.html">Single Product Gallery Left</a>
                                                <a className="dropdown-item" href="single-product-gallery-right.html">Single Product Gallery Right</a>
                                                <a className="dropdown-item" href="single-product-tab-style-top.html">Single Product Tab Style Top</a>
                                                <a className="dropdown-item" href="single-product-tab-style-left.html">Single Product Tab Style Left</a>
                                                <a className="dropdown-item" href="single-product-tab-style-right.html">Single Product Tab Style Right</a>
                                            </div>
                                            <div className="col-md-4">
                                                <h6 className="dropdown-header text-warning">Single Products</h6>
                                                <a className="dropdown-item" href="single-product.html">Single Product</a>
                                                <a className="dropdown-item" href="single-product-sale.html">Single Product Sale</a>
                                                <a className="dropdown-item" href="single-product-group.html">Single Product Group</a>
                                                <a className="dropdown-item" href="single-product-normal.html">Single Product Normal</a>
                                                <a className="dropdown-item" href="single-product-affiliate.html">Single Product Affiliate</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            {/* About Us */}
                            <li className="nav-item">
                                <a className="nav-link text-warning" href="/about-us">About Us</a>
                            </li>

                            {/* Contact */}
                            <li className="nav-item">
                                <a className="nav-link text-warning" href="/contact">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className="d-lg-none">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mobileMenu" aria-controls="mobileMenu" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="mobileMenu">
                            <ul className="navbar-nav">
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle text-warning" href="/" id="mobileHomeDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Home
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="mobileHomeDropdown">
                                        <li><a className="dropdown-item" href="index.html">Home One</a></li>
                                        <li><a className="dropdown-item" href="index-2.html">Home Two</a></li>
                                        <li><a className="dropdown-item" href="index-3.html">Home Three</a></li>
                                        <li><a className="dropdown-item" href="index-4.html">Home Four</a></li>
                                    </ul>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-warning" href="/product">Shop</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-warning" href="/about-us">About Us</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-warning" href="/contact">Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;