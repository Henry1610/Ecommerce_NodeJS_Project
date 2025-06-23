import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../../redux/public/productsSlice';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { useState } from "react";
import Banner from '../../../components/Banner/Banner';
import './Home.css'
import ReasonChoose from './ReasonChoose';
import MostSearch from './MostSearch';
import News from './News';
function Home() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.public.publicProduct);

    useEffect(() => {
        dispatch(fetchProducts()); // Lấy danh sách sản phẩm khi component được render
    }, [dispatch]);
    
    const [activeTabCategories, setActiveTabCategories] = useState("Laptop");

   
    const categories = ["Laptop", "Bàn phím", "Tai nghe", "Chuột"];

    
    
    
    

    const filteredProducts = activeTabCategories ? products.filter(p => p.category.name === activeTabCategories) : products;
    return (
        <>
            <Banner />

            {/* Hot News  */}
            <News/>

            {/* Option For You  */}
            <div className=" py-3">
                <h1 className="text-center fw-bold mb-4 d-flex align-items-center justify-content-center gap-2">

                    Gợi ý cho bạn
                </h1>

                <div className="tab-swiper-container text-center d-flex justify-content-center m-3">
                    <Swiper
                        spaceBetween={10}
                        slidesPerView="auto"
                        freeMode={true}
                        className="tab-swiper bg-light rounded-pill  p-2  "
                    >
                        {categories.map((cat) => (
                            <SwiperSlide key={cat} className="w-auto ">
                                <button
                                    className={`tab-btn px-4 py-1 rounded-pill fw-bold ${activeTabCategories === cat ? "active" : ""
                                        }`}
                                    onClick={() => setActiveTabCategories(cat)}
                                >
                                    {cat}
                                </button>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="row g-3">
                    {products.length > 0 ? (
                        products.map(pro => (
                            <div className="col-6 col-md-4 col-lg-3 col-xxl-3" key={pro._id}>
                                <ProductCard product={pro} />
                            </div>
                        ))
                    ) : (
                        <div>Không tìm thấy sản phẩm phù hợp</div>
                    )}
                </div>
            </div>
            {/* Reason */}
            <ReasonChoose/>
            {/* Most Search */}
            <MostSearch/>
        </>
    )
}

export default Home