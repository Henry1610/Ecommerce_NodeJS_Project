import React from 'react';
import { Link } from 'react-router-dom';
import './EmptyProductsState.css';

/**
 * Khung căn giữa dùng chung (đặt {@link EmptyProductsState} bên trong — tránh lặp row/col ở từng trang).
 */
export function EmptyStateSection({
    children,
    className = '',
    columnClassName = 'col-12 col-md-10 col-lg-8',
}) {
    return (
        <div className={`row justify-content-center g-0 ${className}`.trim()}>
            <div className={columnClassName}>{children}</div>
        </div>
    );
}

/**
 * UI trống thống nhất — cùng kích thước / typography / nút; chỉ đổi icon, title, description, link, label.
 *
 * @param {React.ReactNode} icon
 * @param {string} title
 * @param {React.ReactNode} [description]
 * @param {string} [to='/products']
 * @param {string} [actionLabel='Mua sắm ngay']
 * @param {string} [actionIconClass]
 * @param {boolean} [embedded] — trong cột (vd. giỏ): card + min-height, không bọc py-5 ngoài
 * @param {boolean} [plain] — không bọc .card (dùng trong panel đã có nền — vd. Profile); thường bọc bởi {@link EmptyStateSection}
 * @param {string} [containerClass] — bọc ngoài cùng (vd. container py-5)
 */
function EmptyProductsState({
    icon,
    title,
    description,
    to = '/products',
    actionLabel = 'Mua sắm ngay',
    actionIconClass,
    embedded = false,
    plain = false,
    containerClass,
}) {
    const core = (
        <>
            {icon && (
                <div className="empty-products-state__icon-wrap" aria-hidden>
                    {icon}
                </div>
            )}
            <h3 className="empty-products-state__title">{title}</h3>
            {description != null && <div className="empty-products-state__desc">{description}</div>}
            <Link
                to={to}
                className="btn btn-info text-white btn-lg empty-products-state__action"
            >
                {actionIconClass && <i className={`${actionIconClass} me-2`} aria-hidden />}
                {actionLabel}
            </Link>
        </>
    );

    const block = plain ? (
        <div className="empty-products-state__plain text-center w-100">{core}</div>
    ) : (
        <div
            className={`card border-0 shadow-sm text-dark w-100 empty-products-state__card ${
                embedded ? 'empty-products-state__card--embedded' : ''
            }`}
        >
            <div className="card-body text-center">{core}</div>
        </div>
    );

    const inner = embedded || plain ? (
        block
    ) : (
        <div className="text-center py-5">
            {block}
        </div>
    );

    if (containerClass) {
        return <div className={containerClass}>{inner}</div>;
    }

    return inner;
}

export default EmptyProductsState;
