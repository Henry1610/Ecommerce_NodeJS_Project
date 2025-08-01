import { useState } from "react";

function ReasonChoose() {
    const slides = [
        {
            title: "Trải nghiệm tận tay",
            text: "ThinkPro tiên phong xây dựng không gian trưng bày công nghệ mở, cho phép khách hàng tự do khám phá và trải nghiệm trực tiếp hàng trăm sản phẩm thực tế, từ các mẫu laptop mới nhất đến phụ kiện cao cấp...",
            icon: "fas fa-vr-cardboard", // hoặc fas fa-laptop-code
            img: "https://cdn.nguyenkimmall.com/images/companies/_1/dell-vostro-5568-thiet-ke-dep.jpg"
        },
        {
            title: "Tư vấn tận tâm",
            text: "Đội ngũ tư vấn viên chuyên nghiệp, được đào tạo bài bản về sản phẩm và kỹ năng giao tiếp luôn sẵn sàng lắng nghe...",
            icon: "fas fa-user-headset",
            img: "https://glints.com/vn/blog/wp-content/uploads/2022/12/Tu%CC%9B-va%CC%82%CC%81n-vie%CC%82n-la%CC%80-gi%CC%80-1-1024x700.jpg"
        },
        {
            title: "Chăm sóc toàn diện",
            text: "Trung tâm chăm sóc khách hàng của ThinkPro hoạt động liên tục, hỗ trợ kỹ thuật kịp thời và giải quyết mọi vấn đề sau bán hàng...",
            icon: "fas fa-hands-helping",
            img: "https://kinhtevadubao.vn/stores/news_dataimages/kinhtevadubaovn/072020/16/09/vi-sao-nganh-tu-van-ngay-cang-duoc-ua-chuong-06-.4067.jpg"
        },
        {
            title: "Phục vụ 24/7",
            text: "Hiểu rằng nhu cầu công nghệ có thể phát sinh bất kỳ lúc nào, ThinkPro luôn duy trì các kênh hỗ trợ trực tuyến 24/7...",
            icon: "fas fa-clock",
            img: "https://cdn.vjshop.vn/tin-tuc/25-phan-mem-chinh-sua-anh-tren-may-tinh/top-phan-mem-chinh-sua-anh-tot-nhat-0.jpg"
        },
        {
            title: "Đồng hành phát triển",
            text: "ThinkPro không chỉ là nơi bán thiết bị công nghệ, mà còn là người bạn đồng hành cùng khách hàng trên con đường phát triển bền vững...",
            icon: "fas fa-rocket",
            img: "https://suno.vn/blog/wp-content/uploads/2017/11/5-ph%E1%BA%A9m-ch%E1%BA%A5t-h%C3%A0ng-%C4%91%E1%BA%A7u-c%E1%BB%A7a-nh%C3%A0-t%C6%B0-v%E1%BA%A5n-b%C3%A1n-h%C3%A0ng-chuy%C3%AAn-nghi%E1%BB%87p-1-e1510728761788.jpg"
        }
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const current = slides[activeIndex];

    return (
        <div className="py-5">
            <h1 className="text-center mb-5 fw-bold">
                Chọn Pro - Chọn sự yên tâm
            </h1>

            <div className="card shadow border-0 rounded-4 overflow-hidden">
                <div className="row g-0">
                    {/* Sidebar Buttons */}
                    <div className="col-12 col-md-4 bg-white p-4 d-flex flex-column justify-content-center mb-3 mb-md-0">
                        <div className="d-flex flex-column gap-2">
                            {slides.map((item, idx) => (
                                <button
                                    key={idx}
                                    className={`list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 px-4 rounded-3 border-0 ${activeIndex === idx ? "bg-info text-white shadow-sm fw-semibold" : "bg-light text-dark"}`}
                                    onClick={() => setActiveIndex(idx)}
                                    style={{ transition: "all 0.3s ease" }}
                                >
                                    <i className={`${item.icon} fs-5`}></i>
                                    <span className="fs-6 text-start fw-bold">{item.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Slide Content */}
                    <div className="col-12 col-md-8 bg-white p-3 p-md-5 d-flex align-items-center">
                        <div className="row w-100">
                            {/* Left - Image */}
                            <div className="col-12 col-md-6 d-flex justify-content-center align-items-center mb-4 mb-md-0">
                                <img
                                    src={current.img}
                                    alt={current.title}
                                    className="img-fluid rounded-3"
                                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                                />
                            </div>

                            {/* Right - Text */}
                            <div className="col-12 col-md-6">
                                <h5 className="card-title mb-3 fs-3 text-dark fw-bold">
                                    {current.title}
                                </h5>
                                <p className="card-text text-muted fs-6">{current.text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReasonChoose;
