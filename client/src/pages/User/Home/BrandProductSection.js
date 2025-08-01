import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { fetchBrands } from '../../../redux/public/brandSlice';
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

function BrandProductSection() {
    const dispatch = useDispatch();
    const SERVER_URL = process.env.REACT_APP_SERVER_URL;
    const { brands, loading: brandsLoading } = useSelector((state) => state.public.publicBrand || { brands: [], loading: false });
    const [activeTabBrands, setActiveTabBrands] = useState(null);
    const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const hasBrands = useMemo(() => brands?.length > 0, [brands]);
    const hasProducts = useMemo(() => products?.length > 0, [products]);
    const displayedProducts = useMemo(() => products?.slice(0, displayCount) || [], [products, displayCount]);
    const hasMoreProducts = useMemo(() => products?.length > displayCount, [products, displayCount]);

    useEffect(() => { dispatch(fetchBrands()); }, [dispatch]);
    useEffect(() => { if (hasBrands && !activeTabBrands) setActiveTabBrands(brands[0]._id); }, [brands, activeTabBrands, hasBrands]);
    useEffect(() => {
        if (activeTabBrands) {
            setLoading(true);
            axios.get(`${SERVER_URL}/api/products/filter?brand=${activeTabBrands}`)
                .then(res => setProducts(res.data.products))
                .catch(() => setProducts([]))
                .finally(() => setLoading(false));
        }
    }, [activeTabBrands]);
    useEffect(() => { setDisplayCount(INITIAL_DISPLAY_COUNT); }, [activeTabBrands]);
    const handleBrandChange = useCallback((brandId) => { setActiveTabBrands(brandId); }, []);
    const handleLoadMore = useCallback(() => { setDisplayCount(prevCount => prevCount + LOAD_MORE_COUNT); }, []);

    if (brandsLoading || !hasBrands) {
        return <div className="py-3"><h2 className="fw-bold mb-3">Sản phẩm theo thương hiệu</h2><div className="text-center py-4"><div className="spinner-border" role="status"><span className="visually-hidden">Đang tải thương hiệu...</span></div></div></div>;
    }
    return (
        <div className="py-3">
            <h2 className="fw-bold mb-3">Sản phẩm theo thương hiệu</h2>
            <div className="tab-swiper-container text-center d-flex justify-content-center m-3">
                <Swiper {...SWIPER_CONFIG} className="tab-swiper bg-light rounded-pill p-2">
                    {brands.map((brand) => (
                        <SwiperSlide key={brand._id} className="w-auto">
                            <button type="button" className={`tab-btn px-4 py-1 rounded-pill fw-bold ${activeTabBrands === brand._id ? 'active' : ''}`} onClick={() => handleBrandChange(brand._id)} disabled={loading}>{brand.name}</button>
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
export default BrandProductSection; 