import { Link } from 'react-router-dom';
import './Cart.css';
import { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicShippingZones } from '../../../redux/public/shippingZoneSlice';
import { createShippingAddress } from '../../../redux/shippingAddress/shippingAddressSlice';

import { fetchCart, setCart, applyDiscount, removeDiscount } from '../../../redux/cart/cartSlice';
import { fetchDiscounts } from '../../../redux/discount/discountSlice';
import { createCheckoutSession } from '../../../redux/payment/paymentSlice';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';
import VoucherCard from '../../../components/VourcherCard';
import { Modal } from 'bootstrap';

function Cart() {
    // Redux hooks
    const dispatch = useDispatch();
    const { cart, error, loading, selectedDiscountSlice, discountLoading } = useSelector(state => state.cart);
    const { selectedAddress, AddressSave } = useSelector(state => state.shippingAddress)
    const { discounts } = useSelector(state => state.discounts);
    const zones = useSelector(state => state.public?.publicShippingZones?.zones || []);
    // Local state
    const [showModal, setShowModal] = useState(null);
    const [selectedAds, setSelectedAds] = useState(selectedAddress);
    const [formAddress, setAddress] = useState({
        fullName: '',
        phoneNumber: '',
        city: '',
        address: '',
    });
    const [isPaying, setIsPaying] = useState(false);
    const [localCart, setLocalCart] = useState(null);
    const [discountInput, setDiscountInput] = useState('');
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
    const discountRef = useRef(selectedDiscountSlice);

    // Refs
    const modalRef = useRef(null);

    // Computed values
    const isDiscountProcessing = discountLoading || isApplyingDiscount;

    // Effects
    useEffect(() => {
        dispatch(fetchDiscounts())
            .unwrap()
            .catch(error => toast.error(`Lỗi khi tải mã giảm giá: ${error}`));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchPublicShippingZones())
            .unwrap()
            .catch(error => toast.error(`Lỗi khi tải vị trí: ${error}`));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCart())
            .unwrap()
            .then(data => setLocalCart(data))
            .catch(error => toast.error(`Lỗi khi tải giỏ hàng: ${error}`));
    }, [dispatch]);

    // Memoized values
    const totalAmount = useMemo(() => {
        if (!localCart?.items?.length) return 0;

        return localCart.items.reduce((total, item) => {
            const price = item.product.price || 0;
            const quantity = item.quantity || 0;
            return total + (price * quantity);
        }, 0);
    }, [localCart]);


    useEffect(() => {
        discountRef.current = selectedDiscountSlice;
    }, [selectedDiscountSlice]);
    // Debounced functions
    const debounceSetCart = useCallback(

        debounce(items => {
            // console.log('selectedDiscountSlice:',discountRef.current);

            dispatch(setCart({
                items,
                appliedDiscount: discountRef.current
            }))
        }, 500), [dispatch]
    );

    // Handler functions
    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const newItems = cart.items.map((item) => {
            if (item.product._id === productId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setLocalCart({ ...localCart, items: newItems });

        const itemsForBackend = newItems.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
        }));
        debounceSetCart(itemsForBackend);
    };

    const handleRemoveItemFromCart = (productId) => {
        const updatedItems = cart.items.filter(item => item.product._id !== productId);
        setLocalCart({ ...localCart, items: updatedItems });

        const validateCart = updatedItems.map(item => ({
            product: item.product._id,
            quantity: item.quantity
        }));

        dispatch(setCart({ items: validateCart }));
    };

    const handleSelect = (discount) => {

        setSelectedDiscount(discount);
    };

    const handleRemoveDiscount = useCallback(() => {
        dispatch(removeDiscount());
        setSelectedDiscount(null);
        toast.info('Đã gỡ mã giảm giá');
    }, [dispatch]);

    const forceCloseModal = (modalId) => {
        const modalEl = document.getElementById(modalId);
        if (modalEl) {
            const modalInstance = Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
            }

            modalEl.classList.remove('show');
            modalEl.style.display = 'none';
            modalEl.setAttribute('aria-hidden', 'true');
            modalEl.removeAttribute('aria-modal');
        }

        setTimeout(() => {
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }, 100);
    };

    const handleApplyDiscount = async () => {
        const codeToApply = selectedDiscount?.code || discountInput.trim();

        if (!codeToApply) {
            toast.warning('Vui lòng nhập hoặc chọn mã giảm giá');
            return;
        }

        setIsApplyingDiscount(true);

        try {
            const result = await dispatch(applyDiscount(codeToApply)).unwrap();

            toast.success(`Áp dụng mã ${result.discount.code} thành công`);
            setDiscountInput('');
            setSelectedDiscount(null);
            forceCloseModal('voucherModal');



        } catch (err) {
            toast.error(err || 'Không thể áp dụng mã giảm giá');
        } finally {
            setIsApplyingDiscount(false);
        }
    };
    const handleChangeAddress = (e) => {
        setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmitAds = async (e) => {
        e.preventDefault();

        try {
            await dispatch(createShippingAddress(formAddress)).unwrap();

            toast.success('Địa chỉ giao hàng đã được thêm thành công!');

            setAddress({
                fullName: '',
                city: '',
                phoneNumber: '',
                address: ''
            });
            setShowModal(null);
        } catch (err) {
            toast.error(`Thêm địa chỉ thất bại: ${err?.message || 'Đã xảy ra lỗi'}`);
        }

        console.log(formAddress);
    };

    const handlePay = async (e) => {
        e.preventDefault();

        if (!localCart || localCart.items.length === 0) {
            toast.error("Giỏ hàng trống!");
            return;
        }

        setIsPaying(true);
        const orderData = {
            items: localCart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
            appliedDiscount: selectedDiscountSlice?.code || null,
            shippingAddress: {
                _id: "682342f736f16bce68033e91sssw2",
                user: "6819a2f736f16bce68033e91",
                fullName: "Nguyen Van A",
                address: "123 Đường ABC",
                city: "Cần Thơ",
                postalCode: "700000",
                country: "Vietnam",
                phoneNumber: "0912345678"
            }
        };
        console.log('orderData:', orderData);

        const result = await dispatch(createCheckoutSession(orderData));
        if (createCheckoutSession.fulfilled.match(result)) {
            window.location.href = result.payload.url; // điều hướng đến Stripe Checkout
        }
    };

    const calculateDiscountAmount = useCallback(() => {
        if (!selectedDiscountSlice) return 0;

        const rawDiscount = (totalAmount * selectedDiscountSlice.discountPercent) / 100;
        return selectedDiscountSlice.maxDiscount
            ? Math.min(rawDiscount, selectedDiscountSlice.maxDiscount)
            : rawDiscount;
    }, [selectedDiscountSlice, totalAmount]);

    // Gọi: calculateDiscountAmount()

    // Early returns
    if (loading) {
        return <div className="container py-5 text-center">Đang tải giỏ hàng...</div>;
    }

    if (!localCart || !localCart.items) {
        return (
            <div className="container py-5">
                <div className="alert alert-info">
                    Giỏ hàng trống. <Link to="/products" className="alert-link">Tiếp tục mua sắm</Link>
                </div>
            </div>
        );
    }

    // Main render
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
                    {/* Promotion Section */}
                    <div className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Khuyến mãi</h5>
                            <button
                                className="btn btn-outline-secondary w-100 fw-bold"
                                data-bs-toggle="modal"
                                data-bs-target="#voucherModal"
                                disabled={isDiscountProcessing}
                            >
                                <i className="fa-solid fa-gift"></i>
                                {isDiscountProcessing ? ' Đang xử lý...' : ' Chọn hoặc nhập mã khuyến mãi'}
                            </button>
                        </div>

                        {/* Applied Discount Display */}
                        {selectedDiscountSlice && (
                            <div className="alert alert-success d-flex justify-content-between align-items-center px-3 py-2 mx-3 mb-3">
                                <div>
                                    <strong>{selectedDiscountSlice.code}</strong> - {selectedDiscountSlice.description}
                                    <br />
                                    <small className="text-muted">
                                        Giảm {selectedDiscountSlice.discountPercent}%
                                        {selectedDiscountSlice.maxDiscount && ` (tối đa ${selectedDiscountSlice.maxDiscount.toLocaleString()}đ)`}
                                    </small>
                                </div>
                                <button
                                    className="btn btn-sm btn-danger ms-3"
                                    onClick={handleRemoveDiscount}
                                    disabled={isDiscountProcessing}
                                >
                                    Gỡ
                                </button>
                            </div>
                        )}
                    </div>

                    {/*Adress  */}
                    <div className="d-flex justify-content-center align-items-center mb-3">
                        <div className="w-100" style={{ maxWidth: '600px' }}>
                            <div className="border shadow-sm p-4 bg-white text-secondary small" >
                                <div className="d-flex justify-content-between border-bottom pb-3 mb-3">
                                    <span className="fw-semibold text-dark">Full Name</span>
                                    <span>{formAddress?.fullName}</span>
                                </div>
                                <div className="d-flex justify-content-between border-bottom pb-3 mb-3">
                                    <span className="fw-semibold text-dark">Address</span>
                                    <span>{formAddress?.address}</span>
                                </div>
                                <div className="d-flex justify-content-between border-bottom pb-3 mb-3">
                                    <span className="fw-semibold text-dark">City</span>
                                    <span>{formAddress?.city}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="fw-semibold text-dark">Phone Number</span>
                                    <span>{formAddress?.phoneNumber}</span>
                                </div>
                                <div className="d-flex justify-content-end mt-4">
                                    <button

                                        type="button"
                                        className="btn btn-link text-primary fw-semibold text-decoration-none p-0 d-flex align-items-center"
                                        aria-label="Edit shipping address"
                                        onClick={() => setShowModal('selectAddress')}
                                    >
                                        <i className="fas fa-edit me-2"></i>
                                        <span className="small">Change</span>
                                    </button>
                                </div>


                            </div>
                        </div>
                        {showModal === 'selectAddress' && (

                            <>
                                <div className="modal-backdrop fade show" />
                                <div className="modal show d-block" tabIndex="-1">
                                    <div className="modal-dialog modal-dialog-centered " role="document">
                                        <div className="modal-content">
                                            <div className="modal-header border-bottom">
                                                <h5 className="modal-title">Địa Chỉ Của Tôi</h5>
                                                <button type="button" className="btn-close" ></button>
                                            </div>
                                            <form >
                                                <div className="modal-body">
                                                    {AddressSave.map((addr) => (
                                                        <div
                                                            className="form-check p-3 border-bottom d-flex align-items-start gap-3"
                                                        >
                                                            <input
                                                                className="form-check-input mt-1"
                                                                type="radio"
                                                                name="address"
                                                            />
                                                            <label className="form-check-label w-100">
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <strong className="text-dark text-truncate" style={{ maxWidth: "200px" }}>
                                                                    </strong>
                                                                    <span className="text-muted">|</span>
                                                                    <small className="text-muted">{addr.phone}</small>
                                                                    <span
                                                                        className="ms-auto text-primary small"
                                                                        role="button"
                                                                    >
                                                                        Cập nhật
                                                                    </span>
                                                                </div>
                                                                <p className="text-muted small mb-0 mt-1">{addr.addressLine1}</p>
                                                                <p className="text-muted small mb-1">{addr.addressLine2}</p>
                                                                <div className="d-flex gap-2 mt-1">
                                                                    {addr.isDefault && (
                                                                        <span className="badge text-bg-light border border-warning text-warning small">
                                                                            Mặc định
                                                                        </span>
                                                                    )}
                                                                    {addr.isReturnAddress && (
                                                                        <span className="badge text-bg-light border border-secondary text-muted small">
                                                                            Địa chỉ trả hàng
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </label>
                                                        </div>
                                                    ))}
                                                    <div className="mt-3">
                                                        <button
                                                            onClick={() => setShowModal('addOneAddress')}
                                                            type="button"
                                                            className="btn btn-outline-secondary w-100 d-flex align-items-center gap-2 justify-content-center"
                                                        >
                                                            <i className="fas fa-plus"></i>
                                                            <span>Thêm Địa Chỉ Mới</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-outline-secondary" >
                                                        Huỷ
                                                    </button>
                                                    <button type="submit" className="btn text-white" style={{ backgroundColor: "#ff5722" }}>
                                                        Xác nhận
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </>

                        )}
                        {showModal === 'updataOneAddress' && (

                            <>
                                <div className="modal-backdrop fade show" />

                                <div className="modal show d-block" tabIndex="-1">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Chỉnh sửa địa chỉ</h5>
                                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                                            </div>
                                            <div className="modal-body ">

                                                {/* Form Edit */}
                                                <div className="mb-3 ">
                                                    <label className="form-label fw-semibold">Full Name</label>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        className="form-control text-primary"
                                                        value={formAddress?.fullName}
                                                        onChange={handleChangeAddress}
                                                    />
                                                </div>

                                                <div className="mb-3 ">
                                                    <label className="form-label fw-semibold">Address</label>
                                                    <input
                                                        type="text"
                                                        name="address "
                                                        className="form-control "
                                                        value={formAddress?.address}
                                                        onChange={handleChangeAddress}
                                                    />
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        className="form-control"
                                                        value={formAddress?.city}
                                                        onChange={handleChangeAddress}
                                                    />
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">Phone Number</label>
                                                    <input
                                                        type="text"
                                                        name="phoneNumber"
                                                        className="form-control"
                                                        value={formAddress?.phoneNumber}
                                                        onChange={handleChangeAddress}
                                                    />
                                                </div>

                                            </div>
                                            <div className="modal-footer">
                                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                                                {/* <button className="btn btn-primary" onClick={handleSave}>Lưu</button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div></>

                        )}
                        {showModal === 'addOneAddress' && (
                            <>
                                <div className="modal-backdrop fade show" />
                                <div className="modal show d-block" tabIndex="-1">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content rounded-3 shadow-lg">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Địa chỉ mới</h5>
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    //   onClick={onClose}
                                                    aria-label="Close"
                                                ></button>
                                            </div>

                                            <div className="modal-body">
                                                <form className="needs-validation" onSubmit={handleSubmitAds}>
                                                    {/* Họ tên + SĐT */}
                                                    <div className="row mb-3">
                                                        <div className="col">
                                                            <input
                                                                name='fullName'
                                                                type="text"
                                                                className="form-control text-muted"
                                                                placeholder="Họ và tên"
                                                                value={formAddress.fullName}
                                                                onChange={handleChangeAddress}
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <input
                                                                name="phoneNumber"
                                                                type="number"

                                                                className="form-control text-muted"
                                                                placeholder="Số điện thoại"
                                                                value={formAddress.phoneNumber}
                                                                onChange={handleChangeAddress}

                                                            />
                                                        </div>
                                                    </div>
                                                    {/* Tỉnh thành */}
                                                    <div className="mb-3">
                                                        <select
                                                            name="city"
                                                            className="form-select text-muted"
                                                            onChange={handleChangeAddress}
                                                        >
                                                            <option>Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã</option>
                                                            {
                                                                zones && zones.map((zone, index) => (
                                                                    <option key={index} value={zone._id} >
                                                                        {zone?.city}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                    </div>

                                                    {/* Địa chỉ cụ thể */}
                                                    <div className="mb-3">
                                                        <textarea
                                                            rows="2"
                                                            name="address"
                                                            className="form-control text-muted"
                                                            placeholder="Địa chỉ cụ thể"
                                                            onChange={handleChangeAddress}
                                                            value={formAddress.address}
                                                        ></textarea>
                                                    </div>


                                                    {/* Footer buttons */}
                                                    <div className="d-flex justify-content-between mt-4">
                                                        <button
                                                            type="button"
                                                            className="btn btn-link text-decoration-none"
                                                        //   onClick={onClose}
                                                        >
                                                            Trở Lại
                                                        </button>
                                                        <button type="submit" className="btn btn-info px-4" >
                                                            Hoàn thành
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Tóm tắt đơn hàng</h5>

                            <div className="d-flex justify-content-between">
                                <span>Tạm tính</span>
                                <span>{totalAmount.toLocaleString()}đ</span>
                            </div>

                            {selectedDiscountSlice && (
                                <div className="d-flex justify-content-between text-success">
                                    <span>Giảm giá ({selectedDiscountSlice.code})</span>
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
                                className="btn btn-info w-100 fw-bold mt-3"
                                onClick={handlePay}
                                disabled={isPaying || isDiscountProcessing}
                            >
                                {isPaying ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Đang xử lý
                                    </>
                                ) : (
                                    "Đặt hàng"
                                )}
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            {/* Voucher Modal */}
            <div
                className="modal fade"
                id="voucherModal"
                tabIndex="-1"
                aria-labelledby="voucherModalLabel"
                aria-hidden="true"
                ref={modalRef}
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
                                disabled={isDiscountProcessing}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="d-flex gap-2 mb-2 align-items-center">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập mã khuyến mãi"
                                    value={discountInput}
                                    onChange={(e) => setDiscountInput(e.target.value)}
                                    disabled={isDiscountProcessing}
                                />
                                <button
                                    className="btn btn-dark fw-bold px-3"
                                    style={{ whiteSpace: "nowrap" }}
                                    onClick={handleApplyDiscount}
                                    disabled={isDiscountProcessing || (!discountInput.trim() && !selectedDiscount)}
                                >
                                    {isDiscountProcessing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Đang áp dụng
                                        </>
                                    ) : (
                                        'Áp dụng'
                                    )}
                                </button>
                            </div>

                            {selectedDiscount && discountInput && (
                                <div className="text-muted small mb-3">
                                    * Đang áp dụng mã bạn đã chọn. Mã nhập tay sẽ bị bỏ qua.
                                </div>
                            )}

                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {discounts.length > 0 ? (
                                    discounts.map(discount => (
                                        <VoucherCard
                                            key={discount._id}
                                            discount={discount}
                                            onSelect={handleSelect}
                                            selected={selectedDiscount?._id === discount._id}
                                            disabled={isDiscountProcessing}
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
        </div>
    );
}

export default Cart;