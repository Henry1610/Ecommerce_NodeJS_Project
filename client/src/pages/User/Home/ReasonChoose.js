import { useState, useRef, useEffect } from "react";
import './ReasonChoose.css'
const slides = [
    {
        title: "Trải nghiệm tận tay",
        text: "ThinkPro tiên phong trưng bày số lượng lớn sản phẩm. Khách hàng có thể trực tiếp trải nghiệm tận tay hàng trăm mẫu sản phẩm công nghệ hiện đại nhất cùng với các phần mềm, công cụ đã được cài đặt sẵn trên máy.",
        icon: "fas fa-hand-point-up",
        img: "https://thinkpro.vn/usp-1.png",
        bg: "#202FE2"
    },
    {
        title: "Tư vấn tận tâm",
        text: "Được đào tạo bài bản, chuyên nghiệp về tác phong nghề nghiệp lẫn nghiệp vụ, kèm theo đó là kỹ năng giao tiếp và xử lý tình huống nhạy bén, đội ngũ tư vấn của ThinkPro đặt lợi ích của khách hàng lên hàng đầu, đề cao trách nhiệm giúp khách hàng chọn được sản phẩm phù hợp nhất với nhu cầu.",
        icon: "fas fa-heart",
        img: "https://thinkpro.vn/usp-2.png",
        bg: "#C026D3"
    },
    {
        title: "Trung tâm khách hàng",
        text: "Chuyên trang “Trung tâm bảo vệ quyền lợi khách hàng” ra đời với sứ mệnh thấu hiểu và hành động kịp thời để khách hàng luôn có cảm giác thoải mái. Mỗi đóng góp quý báu từ Quý khách hàng đều mang lại giá trị to lớn, chuyển hoá thành động lực để đội ngũ ThinkPro nỗ lực hoàn thiện, tiến gần hơn đến sứ mệnh cao cả phục vụ cộng đồng.",
        icon: "fas fa-shield-alt",
        img: "https://thinkpro.vn/usp-3.png",
        bg: "#449F11"
    },
    {
        title: "Phục vụ 24 giờ",
        text: "Hệ thống hỗ trợ trực tuyến 24/7...",
        icon: "fas fa-clock",
        img: "https://thinkpro.vn/usp-4.png",
        bg: "#B45309"
    },
    {
        title: "Onward Together",
        text: "Tập đoàn bán lẻ từ 2013 với nguyên tắc hoạt động: Khách hàng là trung tâm.",
        icon: "fas fa-rocket",
        img: "https://thinkpro.vn/usp-5.png",
        bg: "#131953"
    }
];


export default function ReasonChoose() {
    const [active, setActive] = useState(0);
    const markerRef = useRef(null);
    const btnRefs = useRef([]);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Move marker when active changes
    useEffect(() => {
        const btn = btnRefs.current[active];
        if (btn && markerRef.current) {
            markerRef.current.style.top = btn.offsetTop + "px";
            markerRef.current.style.height = btn.offsetHeight + "px";
        }
    }, [active]);

    // Swipe handlers for mobile
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        
        const distance = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50; // Minimum distance for a swipe

        if (distance > minSwipeDistance) {
            // Swipe left - next slide
            setActive((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
        } else if (distance < -minSwipeDistance) {
            // Swipe right - previous slide
            setActive((prev) => (prev > 0 ? prev - 1 : 0));
        }

        // Reset
        touchStartX.current = 0;
        touchEndX.current = 0;
    };


    return (
        <section className="my-5">
            {/* TITLE */}
            <div className="d-flex justify-content-center gap-2 mb-4">
                <h2 className="fw-bold text-info">Chọn ThinkPro</h2>
                <h2 className="fw-bold -5">Chọn sự yên tâm</h2>
            </div>

            <div
                className="p-4 rounded-4 text-white d-flex flex-column flex-xl-row"
                style={{ background: slides[active].bg, transition: "background 0.5s ease" }}
            >

                {/* ================= SIDEBAR ================= */}
                <div className="d-flex flex-column justify-content-center me-xl-4 mb-4 mb-xl-0 d-none d-xl-flex"
                    style={{ width: "280px", minWidth: "280px" }}>

                    <div className="position-relative">
                        {/* Marker */}
                        <div
                            ref={markerRef}
                            className="position-absolute bg-white rounded-pill"
                            style={{
                                width: "100%",
                                left: "0",
                                top: "0",
                                height: "50px",
                                transition: "all 0.35s ease"
                            }}
                        ></div>

                        {/* Button List */}
                        <div className="d-flex flex-column position-relative">
                            {slides.map((item, i) => (
                                <button
                                    key={i}
                                    ref={(el) => (btnRefs.current[i] = el)}
                                    onClick={() => setActive(i)}
                                    className={`btn text-start rounded-pill py-3 px-3 d-flex align-items-center gap-2 fw-bold ${active === i ? "text-dark" : "text-white"
                                        }`}
                                    style={{ zIndex: 2 }}
                                >
                                    <i className={`${item.icon} fs-5`}></i>
                                    {item.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>


                {/* ================= CONTENT ================= */}
                <div className="flex-grow-1 position-relative overflow-hidden">
                    {/* Mobile Slide Container */}
                    <div 
                        className="mobile-slide-wrapper d-md-none"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div 
                            className="mobile-slide-container"
                            style={{
                                transform: `translateX(-${active * 100}%)`,
                                transition: 'transform 0.5s ease-in-out'
                            }}
                        >
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className="mobile-slide"
                                >
                                    <div className="d-flex flex-column align-items-center px-2">
                                        {/* TEXT */}
                                        <div className="w-100 text-white mb-3 text-center">
                                            <h3 className="fw-bold title-slide">
                                                {slide.title}
                                            </h3>
                                            <p className="fw-light">{slide.text}</p>
                                        </div>

                                        {/* IMAGE */}
                                        <div className="w-100 text-center align-items-center d-flex justify-content-center">
                                            <img
                                                src={slide.img}
                                                alt={slide.title}
                                                className="img-fluid"
                                                style={{
                                                    maxWidth: "380px",
                                                    height: "auto",
                                                    objectFit: "contain"
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop View */}
                    <div className="d-none d-md-flex flex-column flex-md-row align-items-center px-2">
                        {/* TEXT */}
                        <div className="w-100 w-md-50 text-white mb-md-0 pe-md-4">
                            <h3 className="fw-bold title-slide">
                                {slides[active].title}
                            </h3>
                            <p className="fw-light">{slides[active].text}</p>
                        </div>

                        {/* IMAGE */}
                        <div className="w-100 w-md-50 text-center align-items-center d-flex justify-content-center">
                            <img
                                src={slides[active].img}
                                alt={slides[active].title}
                                className="img-fluid"
                                style={{
                                    maxWidth: "380px",
                                    height: "auto",
                                    objectFit: "contain"
                                }}
                            />
                        </div>
                    </div>

                    {/* Mobile Slide Indicators */}
                    <div className="d-md-none d-flex justify-content-center gap-2 mt-3">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActive(index)}
                                className={`slide-indicator ${index === active ? 'active' : ''}`}
                                aria-label={`Slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
