import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function MostSearch() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`${SERVER_URL}/api/products/filter?random=true&limit=10`)
            .then(res => {
                setProducts(res.data.products);
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="py-5 text-center">
            <h1 className="h3 fw-bold mb-4 d-flex justify-content-center align-items-center gap-2">
                <span>Tìm kiếm nhiều nhất</span>
            </h1>
            <div className="d-flex flex-wrap justify-content-center gap-3">
                {loading ? (
                    <span>Đang tải...</span>
                ) : products.length > 0 ? (
                    products.map((product, index) => (
                        <Link
                            key={index}
                            to={`/product/${product.slug}`}
                            className="btn btn-sm rounded-pill px-3 py-2 fw-semibold text-decoration-none"
                            style={{
                                backgroundColor: '#f3f4f6',
                                color: '#1f2937',
                                border: '1px solid #d1d5db',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        >
                            {product.name}
                        </Link>
                    ))
                ) : (
                    <span>Không có dữ liệu</span>
                )}
            </div>
        </div>
    );
}

export default MostSearch;