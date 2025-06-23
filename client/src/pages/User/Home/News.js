import { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
function News() {
    const articles = [
        {
            img: "https://storage.googleapis.com/a1aa/image/281e9e10-13be-45c3-0300-6b3b765570d2.jpg",
            title: "Lenovo trình làng loạt laptop Xiaoxin 2024 Ryzen Edition tại Trung Quốc, giá ...",
            author: "Nguyễn Công Minh",
        },
        {
            img: "https://storage.googleapis.com/a1aa/image/6ad92b02-1cd3-4e9d-0a4d-7b5b1768bac3.jpg",
            title: "Laptop ThinkPad là gì? Tất tần tật về dòng Lenovo ThinkPad",
            author: "Phạm Quốc Toàn",
        },
        {
            img: "https://storage.googleapis.com/a1aa/image/2d178fd8-2731-4dd5-6d42-17e996639d7c.jpg",
            title: "Đánh giá chi tiết Dell Precision 7550: Không dành cho số đông",
            author: "Lương Mạnh Hà",
        },
        {
            img: "https://storage.googleapis.com/a1aa/image/6fee00d4-32b9-4d6d-bb54-a784aaf2b765.jpg",
            title: "Lenovo ThinkPad T14 – Lá cờ đầu của ThinkPad T-series chuẩn bị cập bến...",
            author: "Thu Hồng",
        },
        {
            img: "https://storage.googleapis.com/a1aa/image/47de56e7-1ee1-4f6c-9b20-8f6e045753ea.jpg",
            title: "Review Lenovo Yoga: mỏng nhẹ linh động, cấu hình đáp ứng tốt mọi nhu cà...",
            author: "Lương Mạnh Hà",
        },
    ];
    const [activeTabNews, setActiveTabNews] = useState("Mới nhất");
 const news = ["Mới nhất", "Tin tức", "Đánh giá", "Tư vấn", "Thủ thuật"];
    return ( <div className=" py-3">
        <h1 className="text-center fw-bold mb-4 d-flex align-items-center justify-content-center gap-2">

            Tin tức công nghệ
        </h1>

        <div className="tab-swiper-container text-center d-flex justify-content-center m-2">
            <Swiper
                spaceBetween={10}
                slidesPerView="auto"
                freeMode={true}
                className="tab-swiper bg-light rounded-pill  p-2  "
            >
                {news.map((cat) => (
                    <SwiperSlide key={cat} className="w-auto ">
                        <button
                            className={`tab-btn px-4 py-1 rounded-pill fw-bold ${activeTabNews === cat ? "active" : ""
                                }`}
                            onClick={() => setActiveTabNews(cat)}
                        >
                            {cat}
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>

        <div className="row g-4">
            <div className="col-md-6">
                <div className="card border-0" style={{ backgroundColor: "#E5D7FF" }}>
                    <div className="card-body position-relative">
                        <p className="text-uppercase text-muted small fw-bold mb-2">Tin tức</p>
                        <h2 className="card-title fw-bold fs-4">
                            Lenovo ra mắt Xiaoxin Pro AI 2024: Chạy chip Core Ultra siêu khỏe
                        </h2>
                        <div className="d-flex text-muted small mb-3">
                            <span>Nguyễn Công Minh</span>
                            <span className="mx-2">/</span>
                            <time dateTime="2025-05-26">26/05/2025</time>
                        </div>
                        <div style={{ height: '379px', overflow: 'hidden' }}>
                            <img
                                src="https://storage.googleapis.com/a1aa/image/f2f0a71d-8fcb-4a0c-af13-672e49ce0cc9.jpg"
                                alt="Lenovo Xiaoxin Pro AI"
                                className="img-fluid rounded mb-3"
                                style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                            />
                        </div>

                        <p className="text-muted small">
                            Với sức mạnh mới cùng sự trợ giúp từ AI, con chip mới của đội Xanh hứa hẹn sẽ giúp
                            sản phẩm này có được hiệu năng ấn tượng và thời lượng pin dài.
                        </p>
                        <div
                            className="position-absolute top-0 end-0 bottom-0 text-nowrap overflow-hidden text-center fs-1 fw-bold text-light opacity-25"
                            style={{
                                writingMode: "vertical-rl",
                                textOrientation: "mixed",
                                color: "#C9B8F9",
                            }}
                        >
                            HOT NEWS
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-6 d-flex flex-column gap-3">
                {articles.map((article, idx) => (
                    <div key={idx} className="d-flex border-bottom pb-3 gap-3">
                        <div style={{ width: '120px', height: '80px', overflow: 'hidden' }}>
                            <img
                                src={article.img}
                                alt={article.title}
                                className="img-fluid rounded"
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            />
                        </div>

                        <div className="flex-grow-1 small">
                            <div className="fw-semibold">{article.title}</div>
                            <div className="d-flex align-items-center mt-1 text-success fw-semibold small">
                                <span>{article.author}</span>
                                <span className="text-secondary mx-1">/</span>
                                <time className="text-muted" dateTime="2025-05-26">
                                    26/05/2025
                                </time>
                            </div>
                        </div>
                    </div>
                ))}
                <button className="btn btn-outline-secondary btn-sm align-self-start mt-2 fw-semibold ">
                    Xem tất cả <i className="fas fa-sync-alt ms-1"></i>
                </button>
            </div>
        </div>
    </div> );
}

export default News;