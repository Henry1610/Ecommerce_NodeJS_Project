import { Link } from 'react-router-dom';
import './Cart.css';
import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, setCart } from '../../../redux/cart/cartSlice';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';

function Cart() {
    const dispatch = useDispatch();
    const { cart, error, loading } = useSelector(state => state.cart);

    const [localCart, setLocalCart] = useState(null);

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
        console.log('updatedItems:', updatedItems);
        setLocalCart({ ...localCart, items: updatedItems });

        //console.log('productId:',productId);
        const validateCart = updatedItems.map(item => ({
            product: item.product._id,
            quantity: item.quantity
        }))
        console.log('validateCart_Fe:', validateCart);

        dispatch(setCart({ items: validateCart }))
    };

    const calculateTotal = () => {
        if (!localCart?.items?.length) return 0;

        return localCart.items.reduce((total, item) => {
            const price = item.product.price || 0;
            const quantity = item.quantity || 0;
            return total + (price * quantity);
        }, 0);
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

    return (
        <div className="container py-5">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb bg-light p-3 rounded">
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-decoration-none custom-yellow">Home</Link>
                    </li>
                    <li className="breadcrumb-item active text-dark" aria-current="page">Shopping Cart</li>
                </ol>
            </nav>

            {/* Cart Table */}
            <div className="table-responsive">
                <table className="table table-bordered align-middle text-center">
                    <thead style={{ backgroundColor: '#ffc017' }}>
                        <tr>
                            <th>Remove</th>
                            <th>Image</th>
                            <th>Product</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {localCart.items.length > 0 ? (
                            localCart.items.map((item) => {
                                const { name, price, image } = item.product;
                                const quantity = item.quantity;
                                const subtotal = (price * quantity);

                                return (
                                    <tr key={item.product._id}>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleRemoveItemFromCart(item.product._id)}
                                            >
                                                ×
                                            </button>
                                        </td>
                                        <td>
                                            <img src={image} alt={name} width="70" />
                                        </td>
                                        <td>{name}</td>
                                        <td>${price}</td>
                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                className="form-control w-50 mx-auto"
                                                value={quantity}
                                                onChange={(e) => handleQuantityChange(item.product._id, Number(e.target.value))}
                                            />
                                        </td>
                                        <td>${subtotal.toFixed(2)}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-muted">
                                    Giỏ hàng trống
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Coupon and Update */}
            <div className="d-flex justify-content-between my-4 flex-wrap gap-3">
                <div className="d-flex gap-2 flex-wrap">
                    <input type="text" className="form-control" placeholder="Coupon code" />
                    <button className="btn custom-btn-yellow text-white">Apply Coupon</button>
                </div>
            </div>

            {/* Cart Totals */}
            <div className="row justify-content-end">
                <div className="col-md-5">
                    <div className="bg-light p-4 rounded shadow-sm">
                        <h5 className="mb-3 custom-yellow">Cart Totals</h5>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between">
                                <strong>Subtotal</strong> <span>${calculateTotal().toFixed(2)}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <strong>Total</strong> <span>${calculateTotal().toFixed(2)}</span>
                            </li>
                        </ul>
                        <Link to="/checkout" className="btn custom-btn-yellow w-100 mt-3 text-white">Proceed to Checkout</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
