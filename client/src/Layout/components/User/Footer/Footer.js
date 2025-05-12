import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Footer() {
    return (
        <footer className="bg-light pt-5">
            {/* Footer Top - Shipping Benefits */}
            <div className="container">
                <div className="row mb-5">
                    <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
                        <div className="d-flex">
                            <div className="me-3">
                                <img src="/images/shipping-icon/1.png" alt="Free Delivery" className="img-fluid" style={{maxWidth: "60px"}} />
                            </div>
                            <div>
                                <h5 className="fw-bold">Free Delivery</h5>
                                <p className="text-muted">And free returns. See checkout for delivery dates.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
                        <div className="d-flex">
                            <div className="me-3">
                                <img src="/images/shipping-icon/2.png" alt="Safe Payment" className="img-fluid" style={{maxWidth: "60px"}} />
                            </div>
                            <div>
                                <h5 className="fw-bold">Safe Payment</h5>
                                <p className="text-muted">Pay with the world's most popular and secure payment methods.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                        <div className="d-flex">
                            <div className="me-3">
                                <img src="/images/shipping-icon/3.png" alt="Shop with Confidence" className="img-fluid" style={{maxWidth: "60px"}} />
                            </div>
                            <div>
                                <h5 className="fw-bold">Shop with Confidence</h5>
                                <p className="text-muted">Our Buyer Protection covers your purchase from click to delivery.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="d-flex">
                            <div className="me-3">
                                <img src="/images/shipping-icon/4.png" alt="24/7 Help Center" className="img-fluid" style={{maxWidth: "60px"}} />
                            </div>
                            <div>
                                <h5 className="fw-bold">24/7 Help Center</h5>
                                <p className="text-muted">Have a question? Call a Specialist or chat online.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Middle - Company Info & Links */}
            <div className="container py-5 border-top border-bottom">
                <div className="row">
                    {/* Company Info */}
                    <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                        <div className="mb-4">
                            <img src="/images/menu/logo/1.jpg" alt="Footer Logo" className="img-fluid mb-3" style={{maxHeight: "50px"}} />
                            <p className="text-muted">
                                We are a team of designers and developers that create high quality HTML Template & Woocommerce, Shopify Theme.
                            </p>
                        </div>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <strong>Address: </strong>
                                <span className="text-muted">6688 Princess Road, London, Greater London BAS 23JK, UK</span>
                            </li>
                            <li className="mb-2">
                                <strong>Phone: </strong>
                                <a href="tel:+1231233213345" className="text-decoration-none text-muted">(+123) 123 321 345</a>
                            </li>
                            <li className="mb-2">
                                <strong>Email: </strong>
                                <a href="mailto:info@yourdomain.com" className="text-decoration-none text-muted">info@yourdomain.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Product Links */}
                    <div className="col-lg-2 col-md-3 col-sm-6 mb-4 mb-lg-0">
                        <h5 className="fw-bold mb-4">Product</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Prices drop</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-muted">New products</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Best sales</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Contact us</a></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="col-lg-2 col-md-3 col-sm-6 mb-4 mb-lg-0">
                        <h5 className="fw-bold mb-4">Our company</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Delivery</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Legal Notice</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-muted">About us</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Contact us</a></li>
                        </ul>
                    </div>

                    {/* Social Media and Newsletter */}
                    <div className="col-lg-4 col-md-6">
                        <h5 className="fw-bold mb-4">Follow Us</h5>
                        <ul className="list-unstyled d-flex mb-4">
                            <li className="me-3">
                                <a href="https://twitter.com/" className="btn btn-outline-secondary" target="_blank" title="Twitter">
                                    <i className="fab fa-twitter"></i>
                                </a>
                            </li>
                            <li className="me-3">
                                <a href="https://rss.com/" className="btn btn-outline-secondary" target="_blank" title="RSS">
                                    <i className="fas fa-rss"></i>
                                </a>
                            </li>
                            <li className="me-3">
                                <a href="https://www.plus.google.com/discover" className="btn btn-outline-secondary" target="_blank" title="Google Plus">
                                    <i className="fab fa-google-plus-g"></i>
                                </a>
                            </li>
                            <li className="me-3">
                                <a href="https://www.facebook.com/" className="btn btn-outline-secondary" target="_blank" title="Facebook">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                            </li>
                            <li className="me-3">
                                <a href="https://www.youtube.com/" className="btn btn-outline-secondary" target="_blank" title="Youtube">
                                    <i className="fab fa-youtube"></i>
                                </a>
                            </li>
                            <li className="me-3">
                                <a href="https://www.instagram.com/" className="btn btn-outline-secondary" target="_blank" title="Instagram">
                                    <i className="fab fa-instagram"></i>
                                </a>
                            </li>
                        </ul>

                        <div className="mb-4">
                            <h5 className="fw-bold mb-3">Sign up to newsletter</h5>
                            <form action="#" method="post" className="needs-validation" noValidate>
                                <div className="input-group">
                                    <input type="email" className="form-control" placeholder="Enter your email" required />
                                    <button className="btn btn-primary" type="submit">Subscribe</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom - Links & Copyright */}
            <div className="container py-4">
                <div className="row">
                    <div className="col-12">
                        {/* Footer Links */}
                        <div className="text-center mb-4">
                            <ul className="list-inline">
                                <li className="list-inline-item"><a href="#" className="text-decoration-none text-muted small mx-2">Online Shopping</a></li>
                                <li className="list-inline-item"><a href="#" className="text-decoration-none text-muted small mx-2">Promotions</a></li>
                                <li className="list-inline-item"><a href="#" className="text-decoration-none text-muted small mx-2">My Orders</a></li>
                                <li className="list-inline-item"><a href="#" className="text-decoration-none text-muted small mx-2">Help</a></li>
                                <li className="list-inline-item"><a href="#" className="text-decoration-none text-muted small mx-2">Customer Service</a></li>
                                <li className="list-inline-item"><a href="#" className="text-decoration-none text-muted small mx-2">Support</a></li>
                                <li className="list-inline-item"><a href="#" className="text-decoration-none text-muted small mx-2">Most Populars</a></li>
                                <li className="list-inline-item"><a href="#" className="text-decoration-none text-muted small mx-2">New Arrivals</a></li>
                                <li className="list-inline-item"><a href="#" className="text-decoration-none text-muted small mx-2">Special Products</a></li>
                                <li className="list-inline-item"><a href="#" className="text-decoration-none text-muted small mx-2">Manufacturers</a></li>
                            </ul>
                        </div>

                        {/* Payment Methods */}
                        <div className="text-center mb-3">
                            <img src="/images/payment/1.png" alt="Payment Methods" className="img-fluid" />
                        </div>

                        {/* Copyright */}
                        <div className="text-center text-muted small">
                            <p>&copy; 2023. All Rights Reserved. <a href="https://www.templateshub.net" className="text-decoration-none" target="_blank">Templates Hub</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;