import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../../redux/products/productsSlice';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Home() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    
    useEffect(() => {
        dispatch(fetchProducts()); // Lấy danh sách sản phẩm khi component được render
    }, [dispatch]);

    return (
        <div>
            <div className="slider-with-banner py-2">
                <div className="container">
                    <div className="row">
                        {/* Categories Menu */}
                        <div className="col-lg-3">
                            <div className="card shadow-sm">
                                <div className="card-header bg-warning text-dark py-2">
                                    <h6 className="mb-0 text-uppercase fw-bold">Danh mục sản phẩm</h6>
                                </div>
                                <div className="card-body p-0">
                                    <ul className="list-group list-group-flush small">
                                        <li className="list-group-item py-2 d-flex justify-content-between align-items-center">
                                            <a href="#" className="text-decoration-none text-dark">Laptops</a>
                                            <i className="fas fa-chevron-right small"></i>
                                        </li>
                                        <li className="list-group-item py-2 d-flex justify-content-between align-items-center">
                                            <a href="#" className="text-decoration-none text-dark">TV & Audio</a>
                                            <i className="fas fa-chevron-right small"></i>
                                        </li>
                                        <li className="list-group-item py-2 d-flex justify-content-between align-items-center">
                                            <a href="#" className="text-decoration-none text-dark">Smartphone</a>
                                            <i className="fas fa-chevron-right small"></i>
                                        </li>
                                        <li className="list-group-item py-2 d-flex justify-content-between align-items-center">
                                            <a href="#" className="text-decoration-none text-dark">Cameras</a>
                                        </li>
                                        <li className="list-group-item py-2 d-flex justify-content-between align-items-center">
                                            <a href="#" className="text-decoration-none text-dark">Headphone</a>
                                        </li>
                                        <li className="list-group-item py-2 d-flex justify-content-between align-items-center">
                                            <a href="#" className="text-decoration-none text-dark">Smartwatch</a>
                                        </li>
                                        <li className="list-group-item py-2 d-flex justify-content-between align-items-center">
                                            <a href="#" className="text-decoration-none text-dark">Accessories</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Main Slider */}
                        <div className="col-lg-9">
                            <div className="slider-area shadow-sm">
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay]}
                                    spaceBetween={0}
                                    slidesPerView={1}
                                    
                                    autoplay={{ delay: 5000 }}
                                    loop={true}
                                >
                                    <SwiperSlide>
                                        <div className="single-slide bg-4" style={{backgroundImage: "url('images/slider/1.jpg')", height: "450px", }}>
                                            
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="single-slide bg-5" style={{backgroundImage: "url('images/slider/2.jpg')", height: "450px"}}>
                                            
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="single-slide bg-6" style={{backgroundImage: "url('images/slider/3.jpg')", height: "450px"}}>
                                            
                                        </div>
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Banner Section */}
            <div className="py-3">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-4 mb-3 mb-lg-0">
                            <div className="card border-0 shadow-sm h-100">
                                <a href="#">
                                    <img src="images/banner/1_3.jpg" alt="Banner" className="card-img-top img-fluid" />
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 mb-3 mb-lg-0">
                            <div className="card border-0 shadow-sm h-100">
                                <a href="#">
                                    <img src="images/banner/1_4.jpg" alt="Banner" className="card-img-top img-fluid" />
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <a href="#">
                                    <img src="images/banner/1_5.jpg" alt="Banner" className="card-img-top img-fluid" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hot Deals Products Section */}
            <section className="py-3 bg-light">
                <div className="container">
                    <div className="row mb-3">
                        <div className="col-12">
                            <h5 className="border-bottom pb-2 mb-0">
                                <span className="border-bottom border-warning border-2 pb-2">Hot Deals Products</span>
                            </h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Swiper
                                modules={[Navigation, Autoplay]}
                                spaceBetween={15}
                                slidesPerView={4}
                                navigation
                                loop={true}
                                autoplay={{ delay: 2500 }}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 1,
                                    },
                                    576: {
                                        slidesPerView: 2,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                    },
                                    992: {
                                        slidesPerView: 4,
                                    },
                                }}
                            >
                                {products && products.map((product) => (
                                    <SwiperSlide key={product.id}>
                                        <ProductCard product={product}/>
                                    </SwiperSlide>
                                ))}
                                {(!products || products.length === 0) && loading && (
                                    <SwiperSlide>
                                        <div className="card shadow-sm">
                                            <div className="card-body text-center p-4">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                )}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>

            {/* Laptops Section */}
            <section className="py-3">
                <div className="container">
                    <div className="row mb-3">
                        <div className="col-12 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <span className="border-bottom border-warning border-2 pb-1">Laptops</span>
                            </h5>
                            <ul className="nav nav-pills nav-sm">
                                <li className="nav-item">
                                    <a className="nav-link active py-1 px-2 small bg-warning text-dark" href="#">Prime Video</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link py-1 px-2 small" href="#">Computers</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link py-1 px-2 small" href="#">Electronics</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-lg-6 mb-3 mb-lg-0">
                            <div className="card border-0 shadow-sm h-100">
                                <a href="#">
                                    <img src="images/banner/2_1.jpg" alt="Banner" className="card-img-top img-fluid" />
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100">
                                <a href="#">
                                    <img src="images/banner/2_2.jpg" alt="Banner" className="card-img-top img-fluid" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Swiper
                                modules={[Navigation, Autoplay]}
                                spaceBetween={15}
                                slidesPerView={4}
                                navigation
                                loop={true}
                                autoplay={{ delay: 3000 }}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 1,
                                    },
                                    576: {
                                        slidesPerView: 2,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                    },
                                    992: {
                                        slidesPerView: 4,
                                    },
                                }}
                            >
                                {products && products.map((product) => (
                                    <SwiperSlide key={`laptop-${product.id}`}>
                                        <ProductCard product={product} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>

            {/* TV & Audio Section */}
            <section className="py-3 bg-light">
                <div className="container">
                    <div className="row mb-3">
                        <div className="col-12 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <span className="border-bottom border-warning border-2 pb-1">TV & Audio</span>
                            </h5>
                            <ul className="nav nav-pills nav-sm">
                                <li className="nav-item">
                                    <a className="nav-link active py-1 px-2 small bg-warning text-dark" href="#">Chamcham</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link py-1 px-2 small" href="#">Meito</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link py-1 px-2 small" href="#">Sony Bravia</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-lg-6 mb-3 mb-lg-0">
                            <div className="card border-0 shadow-sm h-100">
                                <a href="#">
                                    <img src="images/banner/2_3.jpg" alt="Banner" className="card-img-top img-fluid" />
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100">
                                <a href="#">
                                    <img src="images/banner/2_4.jpg" alt="Banner" className="card-img-top img-fluid" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Swiper
                                modules={[Navigation, Autoplay]}
                                spaceBetween={15}
                                slidesPerView={4}
                                navigation
                                loop={true}
                                autoplay={{ delay: 3500 }}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 1,
                                    },
                                    576: {
                                        slidesPerView: 2,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                    },
                                    992: {
                                        slidesPerView: 4,
                                    },
                                }}
                            >
                                {products && products.map((product) => (
                                    <SwiperSlide key={`tv-${product.id}`}>
                                        <ProductCard product={product} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>

            {/* Smartphone Section */}
            <section className="py-3">
                <div className="container">
                    <div className="row mb-3">
                        <div className="col-12 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <span className="border-bottom border-warning border-2 pb-1">Smartphone</span>
                            </h5>
                            <ul className="nav nav-pills nav-sm">
                                <li className="nav-item">
                                    <a className="nav-link active py-1 px-2 small bg-warning text-dark" href="#">Camera Accessories</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link py-1 px-2 small" href="#">XailStation</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-lg-6 mb-3 mb-lg-0">
                            <div className="card border-0 shadow-sm h-100">
                                <a href="#">
                                    <img src="images/banner/2_5.jpg" alt="Banner" className="card-img-top img-fluid" />
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100">
                                <a href="#">
                                    <img src="images/banner/2_6.jpg" alt="Banner" className="card-img-top img-fluid" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Swiper
                                modules={[Navigation, Autoplay]}
                                spaceBetween={15}
                                slidesPerView={4}
                                navigation
                                loop={true}
                                autoplay={{ delay: 4000 }}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 1,
                                    },
                                    576: {
                                        slidesPerView: 2,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                    },
                                    992: {
                                        slidesPerView: 4,
                                    },
                                }}
                            >
                                {products && products.map((product) => (
                                    <SwiperSlide key={`smartphone-${product.id}`}>
                                        <ProductCard product={product} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Product Banner */}
            <div className="py-4 bg-dark text-white" style={{backgroundImage: "url('images/banner/full-width.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundBlendMode: "overlay"}}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 mx-auto text-center py-3">
                            <p className="small mb-1">Sale Offer <span className="badge bg-warning text-dark">-20% Off</span> This Week</p>
                            <h2 className="fs-3 fw-bold mb-1">Featured Product</h2>
                            <h5 className="mb-2">Meito Accessories 2023</h5>
                            <p className="small mb-2">
                                Starting at
                                <span className="text-warning fs-5 ms-1">$1209.00</span>
                            </p>
                            <a href="shop-left-sidebar.html" className="btn btn-sm btn-warning px-3">Shop Now</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trending Products Section */}
            <section className="py-3">
                <div className="container">
                    <div className="row mb-3">
                        <div className="col-12">
                            <h5 className="text-center mb-2">
                                <span className="border-bottom border-warning border-2 pb-1">Trending Products</span>
                            </h5>
                            <ul className="nav nav-pills justify-content-center mb-3 small">
                                <li className="nav-item">
                                    <a className="nav-link active py-1 px-2 bg-warning text-dark" data-bs-toggle="pill" href="#meito">Meito</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link py-1 px-2" data-bs-toggle="pill" href="#camera">Camera</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link py-1 px-2" data-bs-toggle="pill" href="#xail">XailStation</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="tab-content">
                        <div id="meito" className="tab-pane fade show active">
                            <div className="row">
                                <div className="col-12">
                                    <Swiper
                                        modules={[Navigation, Autoplay]}
                                        spaceBetween={15}
                                        slidesPerView={4}
                                        navigation
                                        loop={true}
                                        autoplay={{ delay: 4500 }}
                                        breakpoints={{
                                            0: {
                                                slidesPerView: 1,
                                            },
                                            576: {
                                                slidesPerView: 2,
                                            },
                                            768: {
                                                slidesPerView: 3,
                                            },
                                            992: {
                                                slidesPerView: 4,
                                            },
                                        }}
                                    >
                                        {products && products.map((product) => (
                                            <SwiperSlide key={`trending-${product.id}`}>
                                                <ProductCard product={product} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                        <div id="camera" className="tab-pane fade">
                            <div className="row">
                                <div className="col-12">
                                    <Swiper
                                        modules={[Navigation, Autoplay]}
                                        spaceBetween={15}
                                        slidesPerView={4}
                                        navigation
                                        loop={true}
                                        autoplay={{ delay: 4500 }}
                                        breakpoints={{
                                            0: {
                                                slidesPerView: 1,
                                            },
                                            576: {
                                                slidesPerView: 2,
                                            },
                                            768: {
                                                slidesPerView: 3,
                                            },
                                            992: {
                                                slidesPerView: 4,
                                            },
                                        }}
                                    >
                                        {products && products.map((product) => (
                                            <SwiperSlide key={`camera-${product.id}`}>
                                                <ProductCard product={product} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                        <div id="xail" className="tab-pane fade">
                            <div className="row">
                                <div className="col-12">
                                    <Swiper
                                        modules={[Navigation, Autoplay]}
                                        spaceBetween={15}
                                        slidesPerView={4}
                                        navigation
                                        loop={true}
                                        autoplay={{ delay: 4500 }}
                                        breakpoints={{
                                            0: {
                                                slidesPerView: 1,
                                            },
                                            576: {
                                                slidesPerView: 2,
                                            },
                                            768: {
                                                slidesPerView: 3,
                                            },
                                            992: {
                                                slidesPerView: 4,
                                            },
                                        }}
                                    >
                                        {products && products.map((product) => (
                                            <SwiperSlide key={`xail-${product.id}`}>
                                                <ProductCard product={product} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home