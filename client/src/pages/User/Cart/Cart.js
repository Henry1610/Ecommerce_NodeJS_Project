import { Link } from 'react-router-dom';
import './Cart.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart, updateCartItemQuantity } from '../../../redux/cart/cartSlice'
import { toast } from 'react-toastify';
function Cart() {
    const dispatch = useDispatch();
    const { cart, error, loading } = useSelector(state => state.cart)
    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleRemoveItemFromCart = (productId) => {
        dispatch(removeFromCart(productId))
    }
    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        dispatch(updateCartItemQuantity({ productId, quantity: newQuantity })).unwrap()

    };
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
                        {cart && cart.items && cart.items.length > 0 ? (
                            cart.items.map((item) => {
                                const { name, price, image } = item.product;
                                const quantity = item.quantity;
                                const subtotal = (price * quantity);

                                return (
                                    <tr key={item.product._id}>
                                        <td>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleRemoveItemFromCart(item.product._id)}>×</button>
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
                                                onBlur={(e) => handleQuantityChange(item.product._id, Number(e.target.value))}

                                            />
                                        </td>
                                        <td>${subtotal}</td>
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
                <button className="btn custom-btn-outline-yellow">Update Cart</button>
            </div>

            {/* Cart Totals */}
            <div className="row justify-content-end">
                <div className="col-md-5">
                    <div className="bg-light p-4 rounded shadow-sm">
                        <h5 className="mb-3 custom-yellow">Cart Totals</h5>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between">
                                <strong>Subtotal</strong> <span>$130.00</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <strong>Total</strong> <span>$130.00</span>
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
