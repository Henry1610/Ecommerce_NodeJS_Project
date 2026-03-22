import React from 'react';
import './PageSectionHeading.css';

/**
 * Tiêu đề + mô tả trang (đồng bộ OrderHistory, Wishlist, Giỏ, So sánh, …)
 */
function PageSectionHeading({ title, description }) {
    return (
        <div>
            <h1 className="fw-bold mb-2 page-section-heading__title">{title}</h1>
            {description != null && description !== '' && (
                <p className="text-muted mb-0 page-section-heading__desc">{description}</p>
            )}
        </div>
    );
}

export default PageSectionHeading;
