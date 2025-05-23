import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ProductDetail.css';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, resetProductDetail } from '../../../../redux/product/productsSlice';
import { toast } from 'react-toastify';
const ProductDetail = () => {
    const dispatch = useDispatch();
    const { product, error, loading, reviews } = useSelector(state => state.products)

    const { id: productId } = useParams();

    useEffect(() => {
        if (!productId) {
            return
        }

        dispatch(fetchProductById(productId))
            .unwrap()
            .catch((error) => {
                toast.error(`Lỗi khi tải sản phẩm: ${error}`);
            });
        return () => {
            dispatch(resetProductDetail());
        };
    }, [dispatch, productId])

    if (loading) {
        return <div className="text-center py-5">Đang tải sản phẩm...</div>;
    }
    if (!product) {
        return <div className="text-center py-5 text-warning">Không tìm thấy sản phẩm</div>;
    }
    return (

        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12 mb-4">
                    <h4 className="fw-bold">Product Details</h4>
                    <h6 className="text-muted">Full details of a product</h6>
                </div>

                {/* LEFT COLUMN */}
                <div className="col-lg-8 col-sm-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <ul className="product-bar">
                                <li><h4>Product</h4><h6>{product.name}</h6></li>
                                <li><h4>Description</h4><h6>{product.description}</h6></li>
                                <li><h4>Category</h4><h6>{product.category?.name}</h6></li>
                                <li><h4>Brand</h4><h6>{product.brand?.name}</h6></li>
                                <li><h4>Color</h4><h6>{product.color}</h6></li>
                                <li><h4>Quantity</h4><h6>{product.stock}</h6></li>
                                <li><h4>Status</h4><h6>{product.statusCurrent}</h6></li>
                                <li><h4>Price</h4><h6>${product.price}</h6></li>
                                <li><h4>Discount (%)</h4><h6>{product.discountPercent}%</h6></li>
                                <li><h4>Ratings</h4><h6>{product.ratings} ⭐</h6></li>
                                <li><h4>Reviews</h4><h6>{product.numReviews}</h6></li>
                                {product.attributes && Object.entries(product.attributes).map(([key, value]) => (
                                    <li key={key}>
                                        <h4>{key}</h4>
                                        <h6>{String(value)}</h6>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Images */}
                <div className="col-lg-4 col-sm-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="slider-product-details d-flex justify-content-center align-items-center">
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    loop={true}
                                    slidesPerView={1}
                                    className="product-slide"
                                    style={{ width: '100%', maxWidth: '320px' }}
                                >
                                    {product.images?.map((imgFileName, index) => (
                                        <SwiperSlide key={index} className="d-flex justify-content-center">
                                            <img
                                                src={`http://localhost:5000/uploads/products/${product.slug}/${imgFileName}`}
                                                alt={`product-${index}`}
                                                className="img-fluid rounded shadow-sm"
                                                style={{
                                                    width: '100%',
                                                    maxHeight: '300px',
                                                    objectFit: 'contain',
                                                }}
                                            />
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