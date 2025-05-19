import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ProductDetail.css';

const ProductDetail = () => {
    const product = {
        productName: 'Macbook pro',
        category: 'Computers',
        subCategory: 'None',
        brand: 'None',
        unit: 'Piece',
        sku: 'PT0001',
        minimumQty: '5',
        quantity: '50',
        tax: '0.00 %',
        discountType: 'Percentage',
        price: '1500.00',
        status: 'Active',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,',
    };

    const images = [
        { id: 'img1', src: 'assets/img/product/product69.jpg', name: 'macbookpro.jpg', size: '581kb' },
        { id: 'img2', src: 'assets/img/product/product69.jpg', name: 'macbookpro.jpg', size: '581kb' },
    ];

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="mb-4">
                        <h4 className="fw-bold">Product Details</h4>
                        <h6 className="text-muted">Full details of a product</h6>
                    </div>
                </div>

                <div className="col-lg-8 col-sm-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="bar-code-view position-relative">
                                <img src="assets/img/barcode1.png" alt="barcode" className="barcode-img" />
                                <a href="#" className="printimg">
                                    <i className="fas fa-print"></i>
                                </a>
                            </div>
                            <div className="productdetails">
                                <ul className="product-bar">
                                    <li>
                                        <h4>Product</h4>
                                        <h6>{product.productName}</h6>
                                    </li>
                                    <li>
                                        <h4>Category</h4>
                                        <h6>{product.category}</h6>
                                    </li>
                                    <li>
                                        <h4>Sub Category</h4>
                                        <h6>{product.subCategory}</h6>
                                    </li>
                                    <li>
                                        <h4>Brand</h4>
                                        <h6>{product.brand}</h6>
                                    </li>
                                    <li>
                                        <h4>Unit</h4>
                                        <h6>{product.unit}</h6>
                                    </li>
                                    <li>
                                        <h4>SKU</h4>
                                        <h6>{product.sku}</h6>
                                    </li>
                                    <li>
                                        <h4>Minimum Qty</h4>
                                        <h6>{product.minimumQty}</h6>
                                    </li>
                                    <li>
                                        <h4>Quantity</h4>
                                        <h6>{product.quantity}</h6>
                                    </li>
                                    <li>
                                        <h4>Tax</h4>
                                        <h6>{product.tax}</h6>
                                    </li>
                                    <li>
                                        <h4>Discount Type</h4>
                                        <h6>{product.discountType}</h6>
                                    </li>
                                    <li>
                                        <h4>Price</h4>
                                        <h6>{product.price}</h6>
                                    </li>
                                    <li>
                                        <h4>Status</h4>
                                        <h6>{product.status}</h6>
                                    </li>
                                    <li>
                                        <h4>Description</h4>
                                        <h6>{product.description}</h6>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-sm-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="slider-product-details">
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    loop={true}
                                    slidesPerView={1}
                                    className="product-slide"
                                >
                                    {images.map(image => (
                                        <SwiperSlide key={image.id} className="slider-product">
                                            <img src={image.src} alt="product" className="product-img" />
                                            <h4>{image.name}</h4>
                                            <h6>{image.size}</h6>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;