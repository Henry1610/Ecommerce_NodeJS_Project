import { Link } from 'react-router-dom';
import './Cart.css';
import { useEffect, useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, setCart } from '../../../redux/cart/cartSlice';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';
import VoucherCard from '../../../components/VourcherCard';
import { fetchDiscounts, } from '../../../redux/discount/discountSlice';
import { setSelectedDiscountSlice, clearSelectedDiscountSlice } from '../../../redux/cart/cartSlice';
import { createPaymentIntent } from '../../../redux/payment/paymentSlice';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';


function Cart() {
    const dispatch = useDispatch();
    const { cart, error, loading, selectedDiscountSlice } = useSelector(state => state.cart);
    const { discounts } = useSelector(state => state.discounts);
    const [localCart, setLocalCart] = useState(null);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const { clientSecret } = useSelector((state) => state.payment||{});
    const stripe = useStripe();
    const elements = useElements();
    
    useEffect(() => {
        dispatch(fetchDiscounts())
            .unwrap()
            .catch(error => toast.error(`Lỗi khi tải giỏ hàng: ${error}`));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCart())
            .unwrap()
            .then(data => setLocalCart(data))
            .catch(error => toast.error(`Lỗi khi tải giỏ hàng: ${error}`));
    }, [dispatch]);
    
    
      
    const debounceSetCart = useCallback(
        debounce(items => {
            dispatch(setCart({ items }))
        }, 500), [dispatch]
    )

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const newItems = cart.items.map((item) => {
            if (item.product._id === productId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setLocalCart({ ...localCart, items: newItems });

        // Chuẩn bị dữ liệu để gửi lên server
        const itemsForBackend = newItems.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
        }));
        debounceSetCart(itemsForBackend);
    };

    const handleRemoveItemFromCart = (productId) => {
        const updatedItems = cart.items.filter(item => item.product._id !== productId);
        setLocalCart({ ...localCart, items: updatedItems });

        //console.log('productId:',productId);
        const validateCart = updatedItems.map(item => ({
            product: item.product._id,
            quantity: item.quantity
        }))

        dispatch(setCart({ items: validateCart }))
    };

    const handleApplyDiscount = (discount) => {
        dispatch(setSelectedDiscountSlice(discount));

        document.querySelector('#voucherModal .btn-close')?.click();
        console.log('selectedDiscountSlice:', selectedDiscountSlice);


    }
    const handleRemoveDiscount = useCallback(() => {
        dispatch(clearSelectedDiscountSlice()); // 👉 Chính là gọi reducer đó
        setSelectedDiscount(null);             // Reset lại trạng thái modal
        toast.info('Đã gỡ mã giảm giá');
    }, [dispatch]);

    const totalAmount = useMemo(() => {
        if (!localCart?.items?.length) return 0;

        return localCart.items.reduce((total, item) => {
            const price = item.product.price || 0;
            const quantity = item.quantity || 0;
            return total + (price * quantity);
        }, 0);
    }, [localCart]);
    const calculateDiscountAmount = () => {
        if (!selectedDiscountSlice) return 0;


        const rawDiscount = (totalAmount * selectedDiscountSlice.discountPercent) / 100;
        return selectedDiscountSlice.maxDiscount
            ? Math.min(rawDiscount, selectedDiscountSlice.maxDiscount)
            : rawDiscount;


    };
   
    useEffect(() => {
        if (totalAmount) {
            const amountToCharge = totalAmount - calculateDiscountAmount();
            dispatch(createPaymentIntent({ totalAmount: amountToCharge }));
        }
    }, [dispatch, totalAmount]);
    const handleSelect = (discount) => {
        setSelectedDiscount(discount);
    };
    if (loading) {
        return <div className="container py-5 text-center">Đang tải giỏ hàng...</div>;
    }

    // Sử dụng localCart thay vì cart từ redux để UI phản hồi nhanh hơn
    if (!localCart || !localCart.items) {
        return (
            <div className="container py-5">
                <div className="alert alert-info">
                    Giỏ hàng trống. <Link to="/products" className="alert-link">Tiếp tục mua sắm</Link>
                </div>
            </div>
        );
    }
    const handlePay = async (e) => {
        e.preventDefault();
    
        if (!stripe || !elements || !clientSecret) {
            toast.error('Stripe chưa sẵn sàng hoặc thiếu thông tin thanh toán');
            return;
        }
    
        const cardElement = elements.getElement(CardElement);
    
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });
    
        if (error) {
            toast.error(`Lỗi thanh toán: ${error.message}`);
        } else if (paymentIntent.status === 'succeeded') {
            toast.success('Thanh toán thành công!');
            // TODO: gọi API tạo đơn hàng, xóa giỏ hàng, điều hướng v.v...
        }
    };
    
    return (

        <div className="container py-5">
            <div className="row gy-4">
                {/* Left - Cart Items */}
                <div className="col-md-8">


                    {localCart.items.length > 0 ? localCart.items.map(item => {
                        const { name, price, image, description, _id } = item.product;
                        const quantity = item.quantity;

                        return (
                            <div key={_id} className="card mb-3 shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex">
                                            <img src={image} alt={name} width="60" height="40" className="me-3 rounded" />
                                            <div>
                                                <h6 className="mb-1 fw-semibold">{name}</h6>
                                                <p className="small text-muted mb-0">{description}</p>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            {item.originalPrice && (
                                                <div className="text-muted text-decoration-line-through small">
                                                    {item.originalPrice.toLocaleString()}₫
                                                </div>
                                            )}
                                            <div className="fw-bold">
                                                {price.toLocaleString()}₫
                                            </div>
                                        </div>
                                    </div>

                                    <div className="my-2 d-flex justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(_id, quantity - 1)}>−</button>
                                            <input
                                                type="text"
                                                readOnly
                                                value={quantity}
                                                className="form-control form-control-sm text-center mx-2"
                                                style={{ width: "40px" }}
                                            />
                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(_id, quantity + 1)}>+</button>
                                        </div>

                                        <div>
                                            <button className='border-0 bg-white' onClick={() => handleRemoveItemFromCart(_id)}>
                                                <i className="fa-solid fa-trash cursor-pointer"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="border rounded-4 text-center p-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                            <i className="fa-solid fa-cart-shopping fs-3"></i>
                            <h4 className="fw-bold mb-2">Giỏ hàng trống</h4>
                            <p className="text-muted mb-4">Hãy thoải mái lựa chọn sản phẩm bạn nhé</p>
                            <button className="text-dark px-4 py-2 rounded fw-bold bg-info border-0">
                                Khám phá ngay
                            </button>
                        </div>
                    )}

                </div>

                {/* Right - Summary */}
                <div className="col-md-4">
                    <div className="card mb-3">
                        <div className="card-body ">
                            <h5 className="card-title">Khuyến mãi</h5>
                            <button className="btn btn-outline-secondary w-100 fw-bold " data-bs-toggle="modal"
                                data-bs-target="#voucherModal"
                            >
                                <i class="fa-solid fa-gift"></i> Chọn hoặc nhập mã khuyến mãi
                            </button>
                        </div>
                        {selectedDiscountSlice && (
                            <div className="alert alert-success d-flex justify-content-between align-items-center px-3 py-2">
                                <div>
                                    <strong>{selectedDiscountSlice?.code}</strong> - {selectedDiscountSlice?.description}
                                </div>
                                <button
                                    className="btn btn-sm btn-danger ms-3"
                                    onClick={() => handleRemoveDiscount()} // hoặc 
                                >
                                    Gỡ
                                </button>
                            </div>
                        )}
                    </div>

                    {/* input voucher */}
                    <div
                        className="modal fade "
                        id="voucherModal"
                        tabIndex="-1"
                        aria-labelledby="voucherModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content rounded-4">
                                <div className="modal-header border-0">
                                    <h5 className="modal-title fw-bold" id="voucherModalLabel">
                                        Chọn hoặc nhập mã khuyến mãi
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="d-flex gap-2 mb-2 align-items-center">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nhập mã khuyến mãi"
                                        />
                                        <button
                                            className="btn btn-dark fw-bold px-3"
                                            style={{ whiteSpace: "nowrap" }}
                                            onClick={() => handleApplyDiscount(selectedDiscount)}
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {discounts.length > 0 ? (
                                            discounts.map(discount => (
                                                <VoucherCard
                                                    key={discount._id}
                                                    discount={discount}
                                                    onSelect={handleSelect}
                                                    selected={selectedDiscount?._id === discount._id}

                                                />
                                            ))
                                        ) : (
                                            <p className="text-muted">Không có mã khuyến mãi nào</p>
                                        )}
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>


                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Tóm tắt đơn hàng</h5>

                            <div className="d-flex justify-content-between">
                                <span>Tạm tính</span>
                                <span>{totalAmount.toLocaleString()}đ</span>
                            </div>

                            {selectedDiscountSlice && (
                                <div className="d-flex justify-content-between text-success">
                                    <span>Giảm giá</span>
                                    <span>-{calculateDiscountAmount().toLocaleString()}đ</span>
                                </div>
                            )}

                            <hr />

                            <div className="d-flex justify-content-between fw-bold">
                                <span>Tổng cộng</span>
                                <span>
                                    {(totalAmount - calculateDiscountAmount()).toLocaleString()}đ
                                </span>
                            </div>

                            <button 
                            className="btn btn-info w-100 fw-bold"
                            onClick={handlePay}
                            disabled={!stripe || !clientSecret}
                            >Đặt hàng</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
