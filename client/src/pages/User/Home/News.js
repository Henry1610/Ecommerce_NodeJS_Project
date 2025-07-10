import { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

function News() {
    const articles = [
        {
            img: "https://m.media-amazon.com/images/I/71-2ed893ZL._AC_SY879_.jpg",
            title: "Lenovo trình làng loạt laptop Xiaoxin 2024 Ryzen Edition tại Trung Quốc, giá ...",
            author: "Nguyễn Công Minh",
        },
        {
            img: "https://m.media-amazon.com/images/I/811mbFDXx7L._AC_SL1500_.jpg",
            title: "Laptop ThinkPad là gì? Tất tần tật về dòng Lenovo ThinkPad",
            author: "Phạm Quốc Toàn",
        },
        {
            img: "https://m.media-amazon.com/images/I/71wva-X3xZL._AC_SX679_.jpg",
            title: "Đánh giá chi tiết Dell Precision 7550: Không dành cho số đông",
            author: "Lương Mạnh Hà",
        },
        {
            img: "https://m.media-amazon.com/images/I/71NeIm6iWHL._AC_SX679_.jpg",
            title: "Lenovo ThinkPad T14 – Lá cờ đầu của ThinkPad T-series chuẩn bị cập bến...",
            author: "Thu Hồng",
        },
        {
            img: "https://m.media-amazon.com/images/I/71Or+U1uzYL._AC_SL1500_.jpg",
            title: "Review Lenovo Yoga: mỏng nhẹ linh động, cấu hình đáp ứng tốt mọi nhu cà...",
            author: "Lương Mạnh Hà",
        },
    ];

    const [activeTabNews, setActiveTabNews] = useState("Mới nhất");
    const news = ["Mới nhất", "Tin tức", "Đánh giá", "Tư vấn", "Thủ thuật"];

    // Dữ liệu cho từng tab
    const tabContent = {
        "Mới nhất": {
            category: "Tin tức",
            title: "Lenovo ra mắt Xiaoxin Pro AI 2024: Chạy chip Core Ultra siêu khỏe",
            author: "Nguyễn Công Minh",
            date: "26/05/2025",
            image: 'https://m.media-amazon.com/images/I/81r8immmQfL._AC_SL1500_.jpg',
            description: "Với sức mạnh mới cùng sự trợ giúp từ AI, con chip mới của đội Xanh hứa hẹn sẽ giúp sản phẩm này có được hiệu năng ấn tượng và thời lượng pin dài lên đến 12 giờ sử dụng liên tục. Xiaoxin Pro AI 2024 không chỉ mang đến trải nghiệm làm việc mượt mà mà còn tích hợp nhiều tính năng AI thông minh giúp tối ưu hóa hiệu suất và tiết kiệm năng lượng. Thiết kế premium với khung nhôm nguyên khối và màn hình 2.5K sắc nét sẽ làm hài lòng cả những người dùng khó tính nhất.",
            backgroundColor: "#E5D7FF",
            watermark: "HOT NEWS"
        },
        "Tin tức": {
            category: "Tin tức",
            title: "Apple MacBook Air M3 2024: Hiệu năng vượt trội với chip M3 mới nhất",
            author: "Trần Văn A",
            date: "25/05/2025",
            image: 'https://m.media-amazon.com/images/I/71Z-hOiOHoL._AC_SL1500_.jpg',
            description: "MacBook Air M3 2024 mang đến hiệu năng vượt trội với chip M3 mới nhất của Apple, cùng thiết kế mỏng nhẹ và thời lượng pin ấn tượng lên đến 18 giờ. Với CPU 8 nhân và GPU 10 nhân, M3 chip mang lại hiệu suất tăng 20% so với thế hệ trước, đặc biệt xuất sắc trong các tác vụ đồ họa và xử lý video 4K. Màn hình Liquid Retina 13.6 inch với độ sáng 500 nits và hỗ trợ 1 tỷ màu mang đến trải nghiệm hình ảnh sống động như thật.",
            backgroundColor: "#FFE5E5",
            watermark: "NEWS"
        },
        "Đánh giá": {
            category: "Đánh giá",
            title: "Đánh giá chi tiết Dell XPS 15: Laptop cao cấp cho dân sáng tạo",
            author: "Phạm Quốc Toàn",
            date: "24/05/2025",
            image: 'https://m.media-amazon.com/images/I/71BdMWKqMAL._AC_SL1500_.jpg',
            description: "Dell XPS 15 là lựa chọn hoàn hảo cho những người làm công việc sáng tạo với màn hình 4K OLED 15.6 inch tuyệt đẹp và hiệu năng mạnh mẽ từ chip Intel Core i7 thế hệ 13. Card đồ họa RTX 4060 đảm bảo xử lý mượt mà các phần mềm thiết kế nặng như Adobe Premiere Pro, Photoshop hay Blender. Bàn phím có đèn nền với hành trình phím 1.3mm mang lại cảm giác gõ thoải mái, cùng với trackpad lớn hỗ trợ đa cử chỉ Windows Precision.",
            backgroundColor: "#E5F7FF",
            watermark: "REVIEW"
        },
        "Tư vấn": {
            category: "Tư vấn",
            title: "Nên chọn laptop nào cho sinh viên năm 2024? Top 5 gợi ý tốt nhất",
            author: "Lương Mạnh Hà",
            date: "23/05/2025",
            image: 'https://m.media-amazon.com/images/I/71gbrvRJI-L._AC_SX679_.jpg',
            description: "Hướng dẫn chi tiết cách chọn laptop phù hợp cho sinh viên với ngân sách từ 10-20 triệu đồng, đáp ứng nhu cầu học tập và giải trí đa dạng. Trong bài viết này, chúng tôi sẽ phân tích từng tiêu chí quan trọng như hiệu năng xử lý, dung lượng RAM, ổ cứng SSD, chất lượng màn hình, thời lượng pin và độ bền. Đặc biệt, chúng tôi cũng đưa ra những gợi ý cụ thể cho từng ngành học khác nhau như Công nghệ thông tin, Thiết kế đồ họa, Kinh tế hay Luật.",
            backgroundColor: "#FFF5E5",
            watermark: "GUIDE"
        },
        "Thủ thuật": {
            category: "Thủ thuật",
            title: "10 thủ thuật tăng tốc Windows 11 mà bạn nên biết",
            author: "Thu Hồng",
            date: "22/05/2025",
            image: 'https://m.media-amazon.com/images/I/51B6AYSgQEL._AC_SX679_.jpg',
            description: "Những mẹo và thủ thuật đơn giản nhưng hiệu quả giúp tăng tốc độ và tối ưu hóa hiệu năng Windows 11 trên laptop của bạn một cách đáng kể. Từ việc tắt các ứng dụng khởi động không cần thiết, dọn dẹp file rác, tối ưu hóa Registry, đến cách sử dụng tính năng Storage Sense và Game Mode. Chúng tôi cũng hướng dẫn cách cập nhật driver, điều chỉnh hiệu ứng hình ảnh và quản lý bộ nhớ ảo để có được hiệu suất tối ưu nhất cho máy tính của bạn.",
            backgroundColor: "#E5FFE5",
            watermark: "TIPS"
        }
    };

    const currentContent = tabContent[activeTabNews];

    return (
        <div className="py-3">
            <h1 className="text-center fw-bold mb-4 d-flex align-items-center justify-content-center gap-2">
                Tin tức công nghệ
            </h1>

            <div className="tab-swiper-container text-center d-flex justify-content-center m-2">
                <Swiper
                    spaceBetween={10}
                    slidesPerView="auto"
                    freeMode={true}
                    className="tab-swiper bg-light rounded-pill p-2"
                >
                    {news.map((cat) => (
                        <SwiperSlide key={cat} className="w-auto">
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
                    <div className="card border-0" style={{ backgroundColor: currentContent.backgroundColor }}>
                        <div className="card-body position-relative">
                            <p className="text-uppercase text-muted small fw-bold mb-2">{currentContent.category}</p>
                            <h2 className="card-title fw-bold fs-4">
                                {currentContent.title}
                            </h2>
                            <div className="d-flex text-muted small mb-3">
                                <span>{currentContent.author}</span>
                                <span className="mx-2">/</span>
                                <time dateTime={currentContent.date}>{currentContent.date}</time>
                            </div>
                            <div style={{ height: '379px', overflow: 'hidden', background: '#f8f9fa' }}>
  <img
    src={currentContent.image}
    alt={currentContent.title}
    className="img-fluid rounded mb-3"
    style={{ objectFit: 'contain', height: '100%', width: '100%', background: '#f8f9fa' }}
  />
</div>

                            <p className="text-muted small mt-2">
                                {currentContent.description}
                            </p>
                            <div
                                className="position-absolute top-0 end-0 bottom-0 text-nowrap overflow-hidden text-center fs-1 fw-bold text-light opacity-25"
                                style={{
                                    writingMode: "vertical-rl",
                                    textOrientation: "mixed",
                                    color: currentContent.backgroundColor === "#E5D7FF" ? "#C9B8F9" :
                                        currentContent.backgroundColor === "#FFE5E5" ? "#FFB8B8" :
                                            currentContent.backgroundColor === "#E5F7FF" ? "#B8E6FF" :
                                                currentContent.backgroundColor === "#FFF5E5" ? "#FFE0B8" : "#B8FFB8",
                                }}
                            >
                                {currentContent.watermark}
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
                    <button className="btn btn-outline-secondary btn-sm align-self-start mt-2 fw-semibold">
                        Xem tất cả <i className="fas fa-sync-alt ms-1"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default News;