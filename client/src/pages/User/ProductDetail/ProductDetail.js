
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux"
import { useParams } from 'react-router-dom';
import { fetchProductBySlug, resetProductDetail } from '../../../redux/public/productsSlice'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { addToCart } from '../../../redux/user/cartSlice';
import { toast } from 'react-toastify';


import "./ProductDetail.css";
function ProductDetail() {
    const services = [
        { icon: <i class="fa-solid fa-folder-closed"></i>, text: "Phục vụ đến 24 giờ" },
        { icon: <i class="fa-solid fa-folder-closed"></i>, text: "Trải nghiệm tận tay" },
        { icon: <i class="fa-solid fa-folder-closed"></i>, text: "Tư vấn tận tâm" },
        { icon: <i class="fa-solid fa-folder-closed"></i>, text: "Trung tâm khác" },
    ];

    const doubled = [...services, ...services];

    const dispatch = useDispatch();
    const { slug }  = useParams();
    
    const [quantity, setQuantity] = useState(1);
    const { product, loading, error } = useSelector((state) => state.public.publicProduct);
    
    const originalPrice = product?.price ?? 0;
    const discountPercent = product?.discountPercent ?? 0;
    const discountPrice = originalPrice - (originalPrice * discountPercent) / 100;


    
    useEffect(() => {
        // Sửa lỗi useEffect async
        const fetchProduct = () => {
            if (slug) {
                dispatch(fetchProductBySlug(slug))
                    .unwrap()
                    
                    .catch(error => {
                        toast.error(`Lỗi khi tải sản phẩm: ${error}`);
                    });
            }
        };

        fetchProduct();

        return () => {
            dispatch(resetProductDetail());
        };
    }, [dispatch, slug]);



    // Hàm tăng số lượng
    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    // Hàm giảm số lượng
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // Hàm thêm vào giỏ hàng
    const handleAddToCart = () => {
        if (product && quantity > 0) {
            dispatch(addToCart({ productId: product._id, quantity }))
                .unwrap()
                .then(() => {
                    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
                })
                .catch(error => {
                    toast.error(`Lỗi khi thêm vào giỏ hàng: ${error}`);
                });
        }
    };

    if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-warning" role="status"></div></div>;
    if (error) return <div className="container py-5 text-center text-danger">Lỗi: {error}</div>;
    if (!product) return <div className="container py-5 text-center">Sản phẩm không tồn tại</div>;



    return (

        <div className="container py-5">
            <div className="row ">
                {/* Left side: Main image and thumbnails */}
                <div className="col-lg-7">
                    <div className="position-relative border rounded overflow-hidden">
                        <img
                            src="https://storage.googleapis.com/a1aa/image/419b4c2d-8f17-4dbe-447a-8fe49a18e6ae.jpg"
                            alt="Lenovo ThinkBook 14 G6+ laptop front view"
                            className="img-fluid"
                            style={{ width: '100%', maxWidth: '700px', height: '500px' }}
                        />

                        <button className="btn btn-dark position-absolute top-50 start-0 translate-middle-y">
                        </button>
                        <button className="btn btn-dark position-absolute top-50 end-0 translate-middle-y">
                        </button>
                    </div>
                    <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
                        {[
                            "538bbcd9-818b-409e-8e16-d05c4a791404",
                            "c344cbc7-b03f-4bdb-8b00-86f59755ab25",
                            "4fb746a2-b4bd-4779-8648-ea08e1bc58c2",
                            "e24b0897-0754-47ba-9f93-209861f42b37",
                            "b3411b75-6987-4cac-8629-f96415e10504",
                        ].map((imgId, idx) => (
                            <div key={idx} className="border p-1 rounded cursor-pointer">
                                <img
                                    src={`https://storage.googleapis.com/a1aa/image/${imgId}.jpg`}
                                    alt={`Thumbnail ${idx}`}
                                    className="img-thumbnail"
                                    style={{ width: 100, height: 100, objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* chính sách */}
                    <div className="slider-container overflow-hidden py-2 px-3  rounded mt-4 shadow-sm">
                        <div className="slider-track d-flex align-items-center">
                            {doubled.map((item, index) => (
                                <div
                                    key={index}
                                    className="d-flex align-items-center gap-2 me-5 flex-shrink-0"
                                >
                                    <div className="icon-circle bg-primary text-white d-flex justify-content-center align-items-center">
                                        {item.icon}
                                    </div>
                                    <span className="fw-semibold">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* cam kết */}
                    <div className="container my-4">
                        <div className="row text-center bg-light rounded shadow-sm py-4">
                            <div className="col-md-4 border-end">
                                <div className="mb-2">
                                    <i class="fa-solid fa-house"></i>
                                </div>
                                <div className="fw-bold">Sẵn hàng và trưng bày</div>
                                <div className="text-muted">Tại 3 chi nhánh &gt;</div>
                            </div>
                            <div className="col-md-4 border-end">
                                <div className="mb-2">
                                    <i class="fa-solid fa-truck"></i>
                                </div>
                                <div className="fw-bold">Vận chuyển miễn phí</div>
                                <div className="text-muted">Nội thành HN & TP.HCM</div>
                            </div>
                            <div className="col-md-4">
                                <div className="mb-2">
                                    <i class="fa-solid fa-shield-halved"></i>
                                </div>
                                <div className="fw-bold">Bảo hành và đổi trả</div>
                            </div>
                        </div>
                    </div>

                    {/*Attributes*/}
                    <div className="my-5">
                        <h2 className="fw-bold mb-4">Cấu hình & đặc điểm</h2>
                        <div className="table-responsive rounded border overflow-hidden">
                            <table className="table mb-0 align-middle small">
                                <tbody>
                                    {product?.attributes ? (
                                        Object.entries(product.attributes).map(([key, value], index) => (
                                            <tr key={index} className={index % 2 === 1 ? 'bg-light' : ''}>
                                                <th className="w-50 text-start pe-4">{key}</th>
                                                <td className="text-start ps-4">{value}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="text-center py-3 text-muted">
                                                Không có thông số kỹ thuật.
                                            </td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* rating */}


                </div>

                {/* Right side: Product details */}
                <div className="col-lg-4 mx-5 ">
                    <h1 className="fw-bold fs-4 mb-1">
                        {product.name}
                    </h1>
                    <span className='fw-bold text-muted m-1' style={{ opacity: 0.7 }}>{product.description}</span>

                    <div className="d-flex align-items-center gap-2 m-2">
                        <div className="d-flex align-items-center gap-1 bg-light px-2 py-1 rounded">
                            <i className="fas fa-star text-warning"></i>
                            <strong className="text-dark">{product.ratings}</strong>
                        </div>
                        <div href="#" className="text-info text-decoration-none small fw-semibold">
                            {product.numReviews} đánh giá
                        </div>
                    </div>
                    {/* Color */}
                    <div className="mb-3">
                        <p className="fw-semibold mb-2">Màu</p>
                        <button className="btn btn-outline-info btn-sm rounded-pill px-3 py-1 fw-semibold shadow-sm">
                            Lunar Gray
                        </button>
                    </div>

                    {/* Product type */}
                    <div className="mb-3">
                        <p className="fw-semibold mb-2">Loại hàng</p>
                        <div className="d-flex flex-wrap gap-2">
                            <button className="btn btn-outline-info btn-sm rounded-pill px-3 py-1 fw-semibold shadow-sm">
                                Mới, Sealed, Nhập khẩu
                            </button>
                            {/* Thêm lựa chọn khác nếu cần */}
                            <button className="btn btn-outline-info btn-sm rounded-pill px-3 py-1 fw-semibold shadow-sm">
                                Mới, Full box, Nhập khẩu
                            </button>
                        </div>



                    </div>
                    <p className="fw-semibold ">Số lượng</p>

                    <div className="input-group m-2 " >

                        <button
                            className="btn bg-info fw-bold fs-5"
                            type="button"
                            onClick={decreaseQuantity}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            className="form-control text-center border-info"
                            value={quantity}
                            min="1"
                            onChange={(e) =>
                                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                            }
                        />
                        <button
                            className="btn bg-info fw-bold fs-5"
                            type="button"
                            onClick={increaseQuantity}
                        >
                            +
                        </button>
                    </div>

                    {/* Purchase box */}
                    <div className="d-flex flex-column flex-md-row shadow rounded-4 overflow-hidden p-4 align-items-center" style={{ maxWidth: '520px', backgroundColor: '#fff' }}>
                        <div className="flex-grow-1 w-100">
                            <p className="fw-bold fs-5 mb-1">Mua ngay</p>
                            <p className="text-muted small mb-3">Trả hết một giá</p>
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <span className="fw-bold fs-4" style={{ color: '#e91e63' }}>{discountPrice?.toLocaleString('vi-VN')}đ</span>
                                <span className="text-muted text-decoration-line-through small">{originalPrice?.toLocaleString('vi-VN')}đ</span>
                                <span className="badge rounded-pill text-white px-2 py-1" style={{ backgroundColor: '#e91e63' }}>-{product.discountPercent}%</span>
                            </div>
                            <div className="d-flex gap-3">
                                <button className="btn fw-bold text-white px-4 py-2" style={{ backgroundColor: '#00e5ff', borderRadius: '999px' }}>
                                    Mua ngay
                                </button>
                                <button className="btn fw-bold text-white px-4 py-2 d-flex align-items-center gap-2" style={{ backgroundColor: '#000', borderRadius: '999px' }} onClick={handleAddToCart}>
                                    <i className="fas fa-shopping-bag"></i>
                                    Thêm vào giỏ
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div className=" py-4">
                <h2 className="fw-bold mb-4">Đánh giá sản phẩm</h2>

                <section className="bg-light p-4 rounded mb-5">
                    <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <span className="fs-3 fw-semibold text-info">4.6</span>
                            <span className="text-info small">trên 5</span>
                        </div>
                        <div className="star-rating d-flex gap-1">
                            <i className="fas fa-star text-warning"></i>
                            <i className="fas fa-star text-warning"></i>
                            <i className="fas fa-star text-warning"></i>
                            <i className="fas fa-star text-warning"></i>
                            <i className="fas fa-star-half-alt text-warning"></i>
                        </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mt-4 ">
                        <button className="btn btn-outline-info btn-sm fw-semibold">Tất Cả</button>
                        <button className="btn btn-outline-secondary btn-sm fw-semibold">5 Sao (8,6k)</button>
                        <button className="btn btn-outline-secondary btn-sm fw-semibold">4 Sao (1,2k)</button>
                        <button className="btn btn-outline-secondary btn-sm fw-semibold">3 Sao (516)</button>
                        <button className="btn btn-outline-secondary btn-sm fw-semibold">2 Sao (211)</button>
                        <button className="btn btn-outline-secondary btn-sm fw-semibold">1 Sao (475)</button>

                    </div>
                </section>

                <section className="border-top border-light-subtle">
                    {/* Review 1 */}
                    <article className="py-4 border-bottom">
                        <div className="d-flex align-items-start gap-3 mb-2">
                            <img
                                src="https://storage.googleapis.com/a1aa/image/e3e5a5be-69a6-40e0-1be6-bbb8db2262a2.jpg"
                                alt="User avatar"
                                className="rounded-circle"
                                width="40"
                                height="40"
                            />
                            <div>
                                <p className="mb-1 small fw-medium">trmanhhoang354</p>
                                <div className="star-rating d-flex gap-1 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className="fas fa-star text-warning"></i>
                                    ))}
                                </div>
                                <time className="text-muted small d-block mt-1">2024-02-03 13:30</time>
                            </div>
                        </div>
                        <p className="small mb-3">
                            Mới nhận hàng, mới gội đầu xong lấy ra test luôn.
                            <br />
                            Máy rẻ mà xịn quá, gió mạnh, cầm nhẹ tay thích lắm, sấy 1 tí là khô tóc luôn.
                        </p>

                        <div className="text-muted small d-flex align-items-center gap-1">
                            <i class="fa-solid fa-thumbs-up"></i>
                            <span>230</span>
                        </div>
                    </article>

                    {/* Review 2 */}
                    <article className="py-4">
                        <div className="d-flex align-items-start gap-3 mb-2">
                            <img
                                src="https://storage.googleapis.com/a1aa/image/9b48464d-88fc-483d-8560-15a612649c7c.jpg"
                                alt="User avatar"
                                className="rounded-circle"
                                width="40"
                                height="40"
                            />
                            <div>
                                <p className="mb-1 small fw-medium">n*****3</p>
                                <div className="star-rating d-flex gap-1 text-sm">
                                    <i className="fas fa-star text-warning"></i>
                                    <i className="fas fa-star text-warning"></i>
                                    <i className="fas fa-star text-warning"></i>
                                    <i className="fas fa-star text-warning"></i>
                                    <i className="fas fa-star-half-alt text-warning"></i>
                                </div>
                                <time className="text-muted small d-block mt-1">2024-02-24 09:28</time>
                            </div>
                        </div>
                        <p className="small mb-2">
                            <strong>Công dụng:</strong> say toc <br />
                            <strong>Bao bì/Mẫu mã:</strong> okk
                        </p>
                        <p className="small">
                            Sản phẩm quá tuyệt vời. Giá rẻ. Nên mua nha các bạn. Đóng gói tuyệt vời, chắc chắn, ship giao hàng tốt,
                            tận tay người tiêu dùng...
                        </p>
                        <div className="text-muted small d-flex align-items-center gap-1">
                            <i class="fa-solid fa-thumbs-up"></i>
                            <span>230</span>
                        </div>
                    </article>
                </section>
            </div>
            {/* Floating Chat Button */}
            <button
                className="btn btn-info text-white rounded-circle shadow position-fixed"
                style={{ bottom: '24px', right: '24px', width: '56px', height: '56px' }}
                aria-label="Chat support"
            >
            </button>
        </div>
    );
}

export default ProductDetail;