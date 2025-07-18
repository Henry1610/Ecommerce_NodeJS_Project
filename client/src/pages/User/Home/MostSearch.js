
function MostSearch() {
    const tags = [
            "attack shark x3",
            "attack shark x6",
            "dell inspiron 5445",
            "Lenovo 21MR006XVN",
            "satechi x1 slim",
            "thinkbook 14 g5+",
            "thinkpad p14s",
            "UM5606",
            "dell latitude 14 9440",
            "manson hbada e3 pro",
            "lenovo yoga slim 7",
            "Lenovo IdeaPad Pro 5 16IMH9",
            "lenovo legion r7000p",
            "dell precision 7550",
            "thinkpad p14s gen 4",
        ];
    return (  <div className=" py-5 text-center">
        <h1 className="h3 fw-bold mb-4 d-flex justify-content-center align-items-center gap-2">
            <img
                src="https://storage.googleapis.com/a1aa/image/b4ebc3d2-cd21-4ea5-536a-6aac49c984a1.jpg"
                alt="Island emoji"
                width="24"
                height="24"
            />
            <span>Tìm kiếm nhiều nhất</span>
        </h1>

        <div className="d-flex flex-wrap justify-content-center gap-3">
            {tags.map((tag, index) => (
                <button
                key={index}
                className="btn btn-sm rounded-pill px-3 py-2 fw-semibold"
                style={{
                    backgroundColor: '#f3f4f6', // màu nền xám nhạt
                    color: '#1f2937',           // text màu xám đậm
                    border: '1px solid #d1d5db',// viền nhẹ
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
            >
                {tag}
            </button>
            
            ))}
        </div>
    </div>);
}

export default MostSearch;