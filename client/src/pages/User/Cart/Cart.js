import { Link, useLocation } from 'react-router-dom';
import './Cart.css';
import { useEffect, useCallback, useState, useRef,useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicShippingZones } from '../../../redux/public/shippingZoneSlice';
import { createShippingAddress, getSavedShippingAddresses, getShippingAddressById, getDefaultShippingAddress } from '../../../redux/user/shippingAddressSlice';
import { fetchCart, setCart, applyDiscount, removeDiscount, selectCartSubtotalAfterProductDiscount, selectCartTotalPrice, selectCartDiscountAmount } from '../../../redux/user/cartSlice';
import { fetchDiscounts } from '../../../redux/public/discountSlice';
import { createCheckoutSession } from '../../../redux/user/paymentSlice';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';
import VoucherCard from '../../../components/VourcherCard';
import { Modal } from 'bootstrap';
import { MAX_STRIPE_AMOUNT } from '../../../config/constants';
function Cart() {
    // Redux hooks
    const location = useLocation();
    const modalRef = useRef(null);
    const dispatch = useDispatch();
    const { cart, error, loading, selectedDiscountSlice, discountLoading } = useSelector(state => state.user.userCart);
    const { AddressSave, defaultAddress } = useSelector(state => state.user.userShippingAddress)
    const { discounts } = useSelector(state => state.public.publicDiscount);
    console.log('ds:',discounts);
    
    const zones = useSelector(state => state.public?.publicShippingZones?.zones || []);
    const CartSubtotalAfterProductDiscount = useSelector(selectCartSubtotalAfterProductDiscount)
    const CartDiscountAmount = useSelector(selectCartDiscountAmount)
    const CartTotalPrice = useSelector(selectCartTotalPrice)

    const [selectedAdsId, setSelectedAdsId] = useState('')
    const [defaultAddressId, setDefaultAddressId] = useState('');

    const [showModal, setShowModal] = useState(null);
    const [formAddress, setAddress] = useState({
        fullName: '',
        phoneNumber: '',
        city: '',
        address: '',
        isDefault: false
    });


    const [isPaying, setIsPaying] = useState(false);
    const [localCart, setLocalCart] = useState(null);
    const [discountInput, setDiscountInput] = useState('');
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
    const discountRef = useRef(selectedDiscountSlice);

    // Refs

    // Computed values
    const isDiscountProcessing = discountLoading || isApplyingDiscount;

    // Effects
    useEffect(() => {
        const initializeData = async () => {
            try {
                await Promise.allSettled([
                    dispatch(fetchDiscounts()).unwrap(),
                    dispatch(getSavedShippingAddresses()).unwrap(),
                    dispatch(fetchPublicShippingZones()).unwrap(),
                    dispatch(getDefaultShippingAddress()).unwrap(),
                    dispatch(fetchCart()).unwrap().then(data => setLocalCart(data))
                ]);
            } catch (error) {
                toast.error(`Lỗi khi tải dữ liệu: ${error}`);
            }
        };
    
        initializeData();
    }, [dispatch]); 
    useEffect(() => {
        const savedSelectedId = sessionStorage.getItem('selectedAdsId');
        if (savedSelectedId && savedSelectedId !== 'undefined') {
            setSelectedAdsId(savedSelectedId)
            setDefaultAddressId(savedSelectedId)
        }
        else {
            setSelectedAdsId(defaultAddress?._id)
            setDefaultAddressId(defaultAddress?._id)
            sessionStorage.setItem('selectedAdsId', defaultAddress?._id);

        }
    }, [defaultAddress?._id]);

    //  Cleanup sessionStorage
    useEffect(() => {
        return () => {
            sessionStorage.removeItem('selectedAdsId');
        };
    }, []);

    const defaultAddressObj = useMemo(() => {
        if (!defaultAddressId || !AddressSave.length) {
            return null;
        }
        return AddressSave.find(addr => addr._id === defaultAddressId) || null;
    }, [defaultAddressId, AddressSave]);

    const handleCheckAds = (id) => {
        setSelectedAdsId(id)
    }
    const handleSelectAds = () => {
        setShowModal(null)
        setDefaultAddressId(selectedAdsId)
        sessionStorage.setItem('selectedAdsId', selectedAdsId);
    }
    




    useEffect(() => {
        discountRef.current = selectedDiscountSlice;
    }, [selectedDiscountSlice]);

    const debounceSetCart = useCallback(
        debounce(async (items) => {
          try {
            await dispatch(setCart({
              items,
              appliedDiscount: discountRef.current,
              shippingFee: defaultAddressObj?.city.fee
            })).unwrap(); 
          } catch (error) {
            toast.error(`Lỗi khi cập nhật giỏ hàng: ${error}`);
            console.error('Lỗi khi cập nhật giỏ hàng:', error);
          }
        }, 500),
        [dispatch, defaultAddressObj?.city.fee]
      );
      

    // Handler functions
    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const itemInCart = cart.items.find(item => item.product._id === productId);
        if (newQuantity > itemInCart.product.stock) {
            toast.warning(`Chỉ còn ${itemInCart.product.stock} sản phẩm trong kho`);
            return;
        }
        const discountPrice = itemInCart.product.price - ((itemInCart.product.price * itemInCart.product.discountPercent) / 100);//sp vừa thêm
        const newTotal = CartTotalPrice + discountPrice * (newQuantity - itemInCart.quantity);

        if (newTotal > MAX_STRIPE_AMOUNT) {
            toast.warning('Tổng giá trị đơn hàng không được vượt quá 100 triệu!');
            return;
        }
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



    const handleOpenModelUpdate = async (modalName, addressId) => {
        setShowModal(modalName);

        try {
            const addressData = await dispatch(getShippingAddressById(addressId)).unwrap();

            setAddress({
                fullName: addressData.fullName,
                phoneNumber: addressData.phoneNumber,
                city: addressData.city._id,
                address: addressData.address,
                isDefault: addressData.isDefault || false,
            });
        } catch (err) {
            toast.error(`Lấy địa chỉ thất bại: ${err?.message || 'Đã xảy ra lỗi'}`);
        }
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
            appliedDiscount: selectedDiscountSlice?._id || null,
            shippingAddress: defaultAddressObj
        };

        const result = await dispatch(createCheckoutSession(orderData));
        if (createCheckoutSession.fulfilled.match(result)) {
            window.location.href = result.payload.url; // điều hướng đến Stripe Checkout
        }
    };



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

                        const { name, price, image, description, _id, discountPercent } = item.product;
                        const quantity = item.quantity;
                        const discountedPrice = Math.round(price * (1 - (discountPercent || 0) / 100));

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
                                            {price && (
                                                <div className=" text-decoration-line-through small text-danger">
                                                    {price.toLocaleString()}₫
                                                </div>
                                            )}
                                            <div className="fw-bold">
                                                {discountedPrice.toLocaleString()}₫
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
                                    <span>{defaultAddressObj?.fullName}</span>
                                </div>
                                <div className="d-flex justify-content-between border-bottom pb-3 mb-3">
                                    <span className="fw-semibold text-dark">Address</span>
                                    <span>{defaultAddressObj?.address}</span>
                                </div>
                                <div className="d-flex justify-content-between border-bottom pb-3 mb-3">
                                    <span className="fw-semibold text-dark">City</span>
                                    <span>{defaultAddressObj?.city.city}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="fw-semibold text-dark">Phone Number</span>
                                    <span>{defaultAddressObj?.phoneNumber}</span>
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
                                                <button type="button" className="btn-close" onClick={() => {
                                                    setShowModal('null')
                                                }
                                                }></button>
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
                                                                value={addr._id}
                                                                checked={selectedAdsId === addr._id}
                                                                onChange={(e) => handleCheckAds(e.target.value)}
                                                            />
                                                            <label className="form-check-label w-100">
                                                                <div className="d-flex align-items-center gap-1">
                                                                    <strong className="text-dark text-truncate" style={{ maxWidth: "200px" }}>
                                                                    </strong>
                                                                    <small className="fw-semibold">{addr.fullName}</small>

                                                                    <span className="text-muted">|</span>
                                                                    <small className="text-muted">{addr.phoneNumber}</small>
                                                                    <span
                                                                        className="ms-auto text-primary small"
                                                                        role="button"
                                                                        onClick={() => handleOpenModelUpdate('updataOneAddress', addr._id)}
                                                                    >
                                                                        Cập nhật
                                                                    </span>
                                                                </div>
                                                                <div className='d-flex gap-2'>
                                                                    <p className="text-muted small mb-0 mt-1">{addr.address}</p>
                                                                    <p className="text-muted small mb-0 mt-1">{addr.city.city}</p>
                                                                </div>

                                                                <div className="d-flex gap-2 mt-1">
                                                                    {addr.isDefault && (
                                                                        <span className="badge text-bg-light border border-warning text-warning small">
                                                                            Mặc định
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
                                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(null)} >
                                                        Huỷ
                                                    </button>
                                                    <button type="button" className="btn text-white" style={{ backgroundColor: "#ff5722" }} onClick={ handleSelectAds}>
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
                                        <div className="modal-content rounded-3 shadow-lg">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Cập nhật địa chỉ</h5>
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    onClick={() => setShowModal(null)}
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
                                                                value={formAddress?.fullName}
                                                                onChange={handleChangeAddress}
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <input
                                                                name="phoneNumber"
                                                                type="number"

                                                                className="form-control text-muted"
                                                                placeholder="Số điện thoại"
                                                                value={formAddress?.phoneNumber}
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
                                                            value={formAddress?.city}
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
                                                            onClick={() => setShowModal('selectAddress')}
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
                                                    onClick={() => setShowModal(null)}
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
                                                            value={formAddress.city._id}
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
                                                            onClick={() => setShowModal('selectAddress')}
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
                                <span>{CartSubtotalAfterProductDiscount.toLocaleString()}đ</span>
                            </div>

                            {selectedDiscountSlice && (
                                <div className="d-flex justify-content-between text-success">
                                    <span>Giảm giá ({selectedDiscountSlice.code})</span>
                                    <span>-{CartDiscountAmount.toLocaleString()}đ</span>
                                </div>
                            )}
                            {
                                defaultAddressObj && cart.items.length > 0 && (
                                    <div className="d-flex justify-content-between text-success">
                                        <span>Phí ship </span>
                                        <span>{(defaultAddressObj.city.fee).toLocaleString()}đ</span>
                                    </div>
                                )
                            }
                            <hr />

                            <div className="d-flex justify-content-between fw-bold">
                                <span>Tổng cộng</span>
                                <span>
                                    {CartTotalPrice.toLocaleString()}đ
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