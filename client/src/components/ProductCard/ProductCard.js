import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { addToCart } from "../../redux/cart/cartSlice";
import { toast } from 'react-toastify';

function ProductCard({ product }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const originalPrice = product.price;
    const discountPrice = originalPrice - ((originalPrice * product.discountPercent) / 100);
    const handleShowDetail = (productId) => {
        navigate(`/product/${productId}`);

    };
    const handleAddToCart = ({ productId, quantity }) => {
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
        <div className="col">
            <div className="card single-product-wrap position-relative overflow-hidden border-0 shadow-sm">
                {/* Product Image */}
                <div className="position-relative">
                    <a href="single-product.html">
                        <img src={product.images} alt="Product" className="card-img-top img-fluid" />
                    </a>
                    <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-2">New</span>


                </div>

                <div className="card-body product_desc ">


                    {/* Product Name */}
                    <h5 className="card-title mb-2">
                        <a href="single-product.html" className="text-dark text-decoration-none">
                            {product.name}
                        </a>
                    </h5>

                    {/* Price */}
                    {!product.discountPercent ? (
                        <div className="price-box mt-2">
                            <span className="fw-bold text-dark">${originalPrice}</span>
                        </div>
                    ) : (
                        <div className="price-box mt-2 d-flex">
                            <span className="text-warning fw-bold">${discountPrice.toFixed(2)}</span>
                            <span className="text-muted text-decoration-line-through ms-2">${originalPrice}</span>
                        </div>
                    )}
                </div>
                <div className="add-actions bottom-0 start-0 end-0 text-center bg-white py-2">

                    <ul className="list-inline m-0">
                        <li className="list-inline-item mx-1">
                            <button className="btn btn-md btn-warning text-dark fw-bold px-4" onClick={() => handleAddToCart({ productId: product._id, quantity: 1 })}>Add to cart</button>
                        </li>
                        <li className="list-inline-item mx-1">
                            <Link to="/wishlist" className="btn btn-sm btn-outline-warning">
                                <i className="far fa-heart"></i>
                            </Link>
                        </li>
                        <li className="list-inline-item mx-1">
                            <div title="Quick view" onClick={() => handleShowDetail(product._id)} className="btn btn-sm btn-outline-warning" >
                                <i className="fas fa-eye"></i>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>


        </div>
    );
}

export default ProductCard;
