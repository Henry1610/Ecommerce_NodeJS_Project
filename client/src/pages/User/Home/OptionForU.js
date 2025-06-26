import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { fetchProducts } from '../../../redux/public/productsSlice';
import { fetchCategories } from '../../../redux/public/categorySlice';

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

function OptionForU() {
    const dispatch = useDispatch();

    // Redux selectors
    const { products, loading: productsLoading } = useSelector((state) => state.public.publicProduct);
    const { categories, loading: categoriesLoading } = useSelector((state) => state.public.publicCategory);

    const [activeTabCategories, setActiveTabCategories] = useState(null);
    const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

    // Memoized values
    const hasCategories = useMemo(() => categories?.length > 0, [categories]);
    const hasProducts = useMemo(() => products?.length > 0, [products]);
    const displayedProducts = useMemo(() => products?.slice(0, displayCount) || [], [products, displayCount]);
    const hasMoreProducts = useMemo(() => products?.length > displayCount, [products, displayCount]);

    // Fetch products when category changes
    useEffect(() => {
        if (activeTabCategories) {
            dispatch(fetchProducts({ category: activeTabCategories }));
        }
    }, [dispatch, activeTabCategories]);

    // Fetch categories on component mount
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Set default category when categories are loaded
    useEffect(() => {
        if (hasCategories && !activeTabCategories) {
            setActiveTabCategories(categories[0]._id);
        }
    }, [categories, activeTabCategories, hasCategories]);

    // Reset display count when category changes
    useEffect(() => {
        setDisplayCount(INITIAL_DISPLAY_COUNT);
    }, [activeTabCategories]);

    // Memoized handlers
    const handleCategoryChange = useCallback((categoryId) => {
        setActiveTabCategories(categoryId);
    }, []);

    const handleLoadMore = useCallback(() => {
        setDisplayCount(prevCount => prevCount + LOAD_MORE_COUNT);
    }, []);

    // Render category tabs
    const renderCategoryTabs = () => (
        <div className="tab-swiper-container text-center d-flex justify-content-center m-3">
            <Swiper
                {...SWIPER_CONFIG}
                className="tab-swiper bg-light rounded-pill p-2"
            >
                {categories.map((category) => (
                    <SwiperSlide key={category._id} className="w-auto">
                        <button
                            type="button"
                            className={`tab-btn px-4 py-1 rounded-pill fw-bold ${activeTabCategories === category._id ? 'active' : ''
                                }`}
                            onClick={() => handleCategoryChange(category._id)}
                            disabled={productsLoading}
                        >
                            {category.name}
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );

    // Render product grid
    const renderProductGrid = () => {
        if (productsLoading) {
            return (
                <div className="col-12">
                    <div className="text-center py-4">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    </div>
                </div>
            );
        }

        if (!hasProducts) {
            return (
                <div className="col-12">
                    <div className="text-center py-4">
                        <p className="text-muted mb-0">Không tìm thấy sản phẩm phù hợp</p>
                    </div>
                </div>
            );
        }

        return displayedProducts.map((product) => (
            <div className="col-6 col-md-4 col-lg-3 col-xxl-3" key={product._id}>
                <ProductCard product={product} />
            </div>
        ));
    };

    // Render load more button
    const renderLoadMoreButton = () => {
        if (!hasProducts || !hasMoreProducts || productsLoading) {
            return null;
        }

        return (
            <div className="col-12">
                <div className="d-flex justify-content-center mt-4">
                    <button
                        type="button"
                        className="btn btn-outline-info rounded-pill d-flex align-items-center gap-2 px-4 py-2"
                        onClick={handleLoadMore}
                    >
                        <strong>Xem thêm</strong>
                        <i className="fa-solid fa-circle-down"></i>
                    </button>
                </div>
            </div>

        );
    };

    // Show loading state for categories
    if (categoriesLoading || !hasCategories) {
        return (
            <div className="py-3">
                <h1 className="text-center fw-bold mb-4 d-flex align-items-center justify-content-center gap-2">
                    Gợi ý cho bạn
                </h1>
                <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Đang tải danh mục...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-3">
            <h1 className="text-center fw-bold mb-4 d-flex align-items-center justify-content-center gap-2">
                Gợi ý cho bạn
            </h1>

            {renderCategoryTabs()}

            <div className="row g-3">
                {renderProductGrid()}
                {renderLoadMoreButton()}
            </div>
        </div>
    );
}

export default OptionForU;