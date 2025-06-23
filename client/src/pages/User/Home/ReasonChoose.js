import { useState } from "react";

function ReasonChoose() {
    const slides = [
        {
            title: "Trải nghiệm tận tay",
            text: "ThinkPro tiên phong xây dựng không gian trưng bày công nghệ mở, cho phép khách hàng tự do khám phá và trải nghiệm trực tiếp hàng trăm sản phẩm thực tế, từ các mẫu laptop mới nhất đến phụ kiện cao cấp. Chúng tôi luôn chuẩn bị sẵn phần mềm, công cụ để bạn dễ dàng kiểm tra hiệu năng và tiện ích sản phẩm ngay tại chỗ.",
            icon: "far fa-thumbs-up",
        },
        {
            title: "Tư vấn tận tâm",
            text: "Đội ngũ tư vấn viên chuyên nghiệp, được đào tạo bài bản về sản phẩm và kỹ năng giao tiếp luôn sẵn sàng lắng nghe, phân tích nhu cầu cá nhân của từng khách hàng. Chúng tôi cam kết mang đến giải pháp phù hợp nhất cả về tính năng lẫn ngân sách, thay vì chỉ tập trung vào việc bán hàng.",
            icon: "far fa-heart",
        },
        {
            title: "Chăm sóc toàn diện",
            text: "Trung tâm chăm sóc khách hàng của ThinkPro hoạt động liên tục, hỗ trợ kỹ thuật kịp thời và giải quyết mọi vấn đề sau bán hàng. Dù là cập nhật phần mềm, bảo hành hay hỗ trợ sử dụng, bạn luôn có thể tin tưởng vào sự đồng hành của chúng tôi trên suốt hành trình sử dụng sản phẩm.",
            icon: "far fa-shield-alt",
        },
        {
            title: "Phục vụ 24/7",
            text: "Hiểu rằng nhu cầu công nghệ có thể phát sinh bất kỳ lúc nào, ThinkPro luôn duy trì các kênh hỗ trợ trực tuyến 24/7. Bạn có thể dễ dàng liên hệ để được tư vấn nhanh chóng, đặt hàng, kiểm tra tình trạng đơn hàng hay nhận hướng dẫn kỹ thuật ngay cả ngoài giờ hành chính.",
            icon: "far fa-clock",
        },
        {
            title: "Đồng hành phát triển",
            text: "ThinkPro không chỉ là nơi bán thiết bị công nghệ, mà còn là người bạn đồng hành cùng khách hàng trên con đường phát triển bền vững. Chúng tôi liên tục nâng cấp dịch vụ, mở rộng hệ sinh thái sản phẩm và tạo ra các giá trị lâu dài, để mỗi khách hàng đều cảm thấy hài lòng và được trân trọng.",
            icon: "fas fa-link",
        },
    ];
    const [activeIndex, setActiveIndex] = useState(0);
    const current = slides[activeIndex];

    return (
        <div className="py-5">
            <h1 className="text-center mb-5 fw-bold">
                Chọn ThinkPro - Chọn sự yên tâm
            </h1>

            <div className="card shadow border-0 rounded-4 overflow-hidden">
                <div className="row g-0">
                    {/* Sidebar Buttons */}
                    <div className="col-md-4 bg-white p-4 d-flex flex-column justify-content-center">
                        <div className="d-flex flex-column gap-2">
                            {slides.map((item, idx) => (
                                <button
                                    key={idx}
                                    className={`list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 px-4 rounded-3 border-0 ${activeIndex === idx ? "bg-primary text-white shadow-sm fw-semibold" : "bg-light text-dark"}`}
                                    onClick={() => setActiveIndex(idx)}
                                    style={{ transition: "all 0.3s ease" }}
                                >
                                    <i className={`${item.icon} fs-5`}></i>
                                    <span className="fs-6 text-start">{item.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Slide Content */}
                    <div className="col-md-8 bg-white p-5 d-flex flex-column justify-content-center">
                        <div className="fade-in">
                            <h5 className="card-title mb-3 fs-4 text-primary">
                                <i className={`${current.icon} me-2`}></i>
                                {current.title}
                            </h5>
                            <p className="card-text text-muted fs-6">{current.text}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReasonChoose;
