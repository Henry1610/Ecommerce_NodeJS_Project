import './NewsSection.css';
export const NewsSection = ({ articles }) => {
    if (!articles || articles.length === 0) return null;

    // Tách bài đầu tiên và các bài còn lại
    const [firstArticle, ...otherArticles] = articles;

    return (
        <div className="row g-4 mt-1">
            {/* Bài đầu tiên bên trái */}
            <div className="col-md-6">
                <div className="card border-0 bg-light shadow-sm p-3">

                    <p className="text-uppercase text-muted small fw-bold">
                        {firstArticle.category}
                    </p>
                    <h4 className="fw-bold">{firstArticle.title}</h4>
                    <div className="d-flex align-items-center mb-2 gap-3 justify-content-between">
                    <p className="text-muted small mb-1">By {firstArticle.creator}</p>
                    <time className="text-muted small" dateTime={firstArticle.pubDate}>
                        {new Date(firstArticle.pubDate).toLocaleDateString("vi-VN")}
                    </time>
                    </div>
                    
                    <img
                        src={firstArticle.image_url}
                        alt={firstArticle.title}
                        className="card-img-top rounded"
                    />
                    <div className="card-body">

                        <p >{firstArticle.description}</p>
                        <a
                            href={firstArticle.link}
                            className="btn btn-info btn-sm   text-white fw-bold" 
                        >
                            Xem chi tiết
                        </a>
                    </div>
                </div>
            </div>

            {/* Các bài còn lại bên phải */}
            <div className="col-md-6 d-flex flex-column overflow-auto overflow-auto" style={{ maxHeight: "76vh" }}>
                {otherArticles.map((article) => (
                    <div
                        key={article.article_id}
                        className="d-flex border-bottom p-3 gap-3 align-items-start hover-shadow rounded cursor-pointer"
                        onClick={() => window.open(article.link, '_blank', 'noopener,noreferrer')}//bảo mật, tránh trang mới truy cập window.opener và không gửi referrer.
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                window.open(article.link, '_blank', 'noopener,noreferrer');//Cho phép mở link bằng bàn phím khi nhấn Enter hoặc Space.
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="img-fluid rounded"
                            style={{ width: "120px", height: "80px", objectFit: "cover" }}
                        />
                        <div className="flex-grow-1 small">
                            <div className="fw-semibold d-block text-dark text-decoration-none">
                                {article.title}
                            </div>
                            <div className="d-flex align-items-center mt-1 text-muted small">
                                <span>{article.creator}</span>
                                <span className="mx-1">/</span>
                                <time dateTime={article.pubDate}>
                                    {new Date(article.pubDate).toLocaleDateString("vi-VN")}
                                </time>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
