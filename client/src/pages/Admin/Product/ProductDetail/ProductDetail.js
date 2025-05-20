import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ProductDetail.css';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById,resetProductDetail } from '../../../../redux/product/productsSlice';
import { toast } from 'react-toastify';
const ProductDetail = () => {
    const dispatch = useDispatch();
    const {product,error,loading}=useSelector(state=>state.products)

    const { id: productId } = useParams();
    
    useEffect(() => {
        if (!productId) {
            return
        }
        dispatch(fetchProductById(productId))
            .unwrap()
            .catch((error) => {
                toast.error(`Lỗi khi tải thương hiệu: ${error}`);
            });
        return () => {
            dispatch(resetProductDetail());
        };
    }, [dispatch, productId])
   
    if (loading) {
        return <div className="text-center py-5">Đang tải sản phẩm...</div>;
    }
if (!product || !product.name) {
        return <div className="text-center py-5 text-warning">Không tìm thấy sản phẩm</div>;
    }
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
                                        <h6>{product.name}</h6>
                                    </li>
                                    <li>
                                        <h4>Category</h4>
                                        <h6>{product.category.name}</h6>
                                    </li>
                                    
                                    <li>
                                        <h4>Brand</h4>
                                        <h6>{product.brand.name}</h6>
                                    </li>
                                    <li>
                                        <h4>Quantity</h4>
                                        <h6>{product.stock}</h6>
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
                                    
                                   
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-sm-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="slider-product-details">
                                {/* <Swiper
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
                                </Swiper> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;