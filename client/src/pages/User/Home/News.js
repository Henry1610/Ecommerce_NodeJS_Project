import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { fetchNews } from "../../../untils/fetchNews";
import { NewsSection } from "./NewsSection";
import { NewsSkeleton } from "../../../components/Skeleton";
import 'swiper/css';
import './News.css'; // thêm file css riêng cho responsive

function News() {
    const news = [
        { label: "Công nghệ", value: "technology" },
        { label: "Khoa học", value: "science" },
        { label: "Kinh doanh", value: "business" },
        { label: "Thế giới", value: "world" },
        { label: "Hàng đầu", value: "top" }
    ];
    const [activeTabNews, setActiveTabNews] = useState(news[0].value);
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetchNews(activeTabNews)
            .then((data) => {
                if (!cancelled) setNewsData(data?.results || []);
            })
            .catch(() => {
                if (!cancelled) setNewsData([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [activeTabNews]);

    return (
        <div className="py-3">
            <h1 className="text-center fw-bold mb-4 d-flex align-items-center justify-content-center gap-2">
                Tin tức công nghệ
            </h1>

            {/* Swiper Tabs */}
            <div className="tab-swiper-container text-center d-flex justify-content-center m-2">
                <Swiper
                    spaceBetween={10}
                    slidesPerView="auto"
                    freeMode={true}
                    breakpoints={{
                        640: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 5 }
                    }}
                    className="tab-swiper bg-light rounded-pill p-2"
                >
                    {news.map((cat) => (
                        <SwiperSlide key={cat.value} className="w-auto">
                            <button
                                type="button"
                                className={`tab-btn px-4 py-1 rounded-pill fw-bold ${activeTabNews === cat.value ? "active" : ""}`}
                                onClick={() => setActiveTabNews(cat.value)}
                                disabled={loading}
                            >
                                {cat.label}
                            </button>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {loading ? <NewsSkeleton /> : <NewsSection articles={newsData} />}

        </div>
    );
}

export default News;
