import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { fetchCategories } from '../../../redux/public/categorySlice';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SWIPER_CONFIG = {
    spaceBetween: 10,
    slidesPerView: 'auto',
    freeMode: true,
};
const INITIAL_DISPLAY_COUNT = 4;
const LOAD_MORE_COUNT = 4;

function CategoryProductSection() {
    const dispatch = useDispatch();
    const { categories, loading: categoriesLoading } = useSelector((state) => state.public.publicCategory);
    const [activeTabCategories, setActiveTabCategories] = useState(null);
    const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const hasCategories = useMemo(() => categories?.length > 0, [categories]);
    const hasProducts = useMemo(() => products?.length > 0, [products]);
    const displayedProducts = useMemo(() => products?.slice(0, displayCount) || [], [products, displayCount]);
    const hasMoreProducts = useMemo(() => products?.length > displayCount, [products, displayCount]);

    useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);
    useEffect(() => { if (hasCategories && !activeTabCategories) setActiveTabCategories(categories[0]._id); }, [categories, activeTabCategories, hasCategories]);
    useEffect(() => {
        if (activeTabCategories) {
            setLoading(true);
            axios.get(`http://localhost:5000/api/products/filter?category=${activeTabCategories}`)
                .then(res => setProducts(res.data.products))
                .catch(() => setProducts([]))
                .finally(() => setLoading(false));
        }
    }, [activeTabCategories]);
    useEffect(() => { setDisplayCount(INITIAL_DISPLAY_COUNT); }, [activeTabCategories]);
    const handleCategoryChange = useCallback((categoryId) => { setActiveTabCategories(categoryId); }, []);
    const handleLoadMore = useCallback(() => { setDisplayCount(prevCount => prevCount + LOAD_MORE_COUNT); }, []);

    if (categoriesLoading || !hasCategories) {
        return <div className="py-3"><h2 className="fw-bold mb-3">Sản phẩm theo danh mục</h2><div className="text-center py-4"><div className="spinner-border" role="status"><span className="visually-hidden">Đang tải danh mục...</span></div></div></div>;
    }
    return (
        <div className="py-3">
            <h2 className="fw-bold mb-3">Sản phẩm theo danh mục</h2>
            <div className="tab-swiper-container text-center d-flex justify-content-center m-3">
                <Swiper {...SWIPER_CONFIG} className="tab-swiper bg-light rounded-pill p-2">
                    {categories.map((category) => (
                        <SwiperSlide key={category._id} className="w-auto">
                            <button type="button" className={`tab-btn px-4 py-1 rounded-pill fw-bold ${activeTabCategories === category._id ? 'active' : ''}`} onClick={() => handleCategoryChange(category._id)} disabled={loading}>{category.name}</button>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="row g-3">
                {loading ? <div className="col-12"><div className="text-center py-4"><div className="spinner-border" role="status"><span className="visually-hidden">Đang tải...</span></div></div></div> :
                    !hasProducts ? <div className="col-12"><div className="text-center py-4"><p className="text-muted mb-0">Không tìm thấy sản phẩm phù hợp</p></div></div> :
                        displayedProducts.map((product) => (<div className="col-6 col-md-4 col-lg-3 col-xxl-3" key={product._id}><ProductCard product={product} /></div>))}
                {hasProducts && hasMoreProducts && !loading && <div className="col-12"><div className="d-flex justify-content-center mt-4"><button type="button" className="btn btn-outline-info rounded-pill d-flex align-items-center gap-2 px-4 py-2" onClick={handleLoadMore}><strong>Xem thêm</strong><i className="fa-solid fa-circle-down"></i></button></div></div>}
            </div>
        </div>
    );
}
export default CategoryProductSection; 