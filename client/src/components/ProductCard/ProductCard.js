import { useSelector } from 'react-redux'; // THÊM DÒNG NÀY
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { addToCart } from "../../redux/user/cartSlice";
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchCart } from '../../redux/user/cartSlice';
import { MAX_STRIPE_AMOUNT } from '../../config/constants';
import { selectCartTotalPrice } from '../../redux/user/cartSlice';
function ProductCard({ product }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const totalPrice=useSelector(selectCartTotalPrice)
    useEffect(() => {
          dispatch(fetchCart());
        
      }, [dispatch]);

    const originalPrice = product.price;
    const discountPrice = originalPrice - ((originalPrice * product.discountPercent) / 100);
    const handleShowDetail = (slug) => {
        navigate(`/product/${slug}`);

    };
    const handleAddToCart = ({ productId, quantity }) => {
     
        const newTotal = totalPrice + discountPrice * quantity;
        
        if (newTotal >  MAX_STRIPE_AMOUNT) {
            toast.warning('Tổng giá trị đơn hàng không được vượt quá 100 triệu!');
            return;
        }
        dispatch(addToCart({ productId, quantity }))
            .unwrap()
            .then(() => {
                toast.success('Sản phẩm đã được thêm vào giỏ hàng!');
            })
            .catch((error) => {
                toast.error(error || 'Thêm vào giỏ hàng thất bại!');
            });
    };


    return (

        <div className="card shadow-sm rounded-4 overflow-hidden mx-auto " style={{ width: "100%" }} >
            <img
                src="https://storage.googleapis.com/a1aa/image/821514f3-0a04-418f-30e9-be563b4f05cb.jpg"
                className="card-img-top px-3"
                alt="Laptop mỏng"
                style={{ height: "200px", objectFit: "cover" }}
                onClick={() => handleShowDetail(product.slug)}
            />
            <div className="card-body text-center p-2">
                <h6 className="card-title fw-semibold text-truncate mb-2" style={{ fontSize: "0.9rem" }}  onClick={() => handleShowDetail(product.slug)}>
                    {product.name}
                </h6>

                <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                    <div className="text-warning star-shadow" style={{ fontSize: "0.75rem" }}>
                        {[...Array(5)].map((_, index) => {
                            const full = index + 1 <= product.ratings;
                            const half = !full && index + 0.5 <= product.ratings;

                            return full ? (
                                <i key={index} className="fas fa-star text-warning" />
                            ) : half ? (
                                <i key={index} className="fas fa-star-half-alt text-warning" />
                            ) : (
                                <i key={index} className="far fa-star text-warning" />
                            );
                        })}
                    </div>
                    <span className="text-muted fw-medium" style={{ fontSize: "0.75rem" }}>
                        {product.ratings}
                    </span>
                    <span className="text-muted small" style={{ fontSize: "0.7rem" }}>
                        | Còn lại <strong className="text-dark">{product.numReviews}</strong>
                    </span>
                </div>


                <div className="mb-2">
                    <h6 className="text-danger fw-bold mb-1" style={{ fontSize: "1rem" }}>{discountPrice?.toLocaleString('vi-VN')}đ</h6>
                    {product.discountPercent && (
                        <div className="d-flex justify-content-center align-items-center gap-1">
                            <span className="text-decoration-line-through text-secondary" style={{ fontSize: "0.75rem" }}>
                                {originalPrice?.toLocaleString('vi-VN')}₫
                            </span>
                            <span className="badge bg-danger-subtle text-danger rounded-pill fw-semibold" style={{ fontSize: "0.65rem" }}>
                                -{product.discountPercent}%
                            </span>
                        </div>
                    )}



                </div>

                <div className="text-success fw-semibold d-flex justify-content-center align-items-center gap-1 mb-3" style={{ fontSize: "0.75rem" }}>
                    <i className="fas fa-credit-card fs-6"></i>
                    <span>Trả góp 0%</span>
                </div>

                {/* Nút hành động với màu info */}
                <div className="d-flex justify-content-center gap-2 ">
                    <button className="btn btn-outline-info btn-sm px-3 fw-bold rounded-4" onClick={() => handleAddToCart({ productId: product._id, quantity: 1 })}>Thêm vào giỏ</button>
                    <button className="btn btn-info btn-sm text-white px-3 fw-bold rounded-4">Mua ngay</button>
                </div>
            </div>
        </div>


    );
}

export default ProductCard;
