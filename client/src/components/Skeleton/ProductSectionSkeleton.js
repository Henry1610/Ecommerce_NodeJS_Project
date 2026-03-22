import React from 'react';
import { SKELETON_BLOCK } from './skeletonBlock';

const TAB_PLACEHOLDER_COUNT = 6;
const GRID_PLACEHOLDER_COUNT = 4;

const skeletonBlock = SKELETON_BLOCK;

function ProductCardPlaceholder() {
    return (
        <div className="card border-0 shadow-sm h-100 overflow-hidden">
            <div className="m-3">
                <div className={`${skeletonBlock} w-100`} style={{ aspectRatio: '1 / 1', minHeight: 140 }} />
            </div>
            <div className="card-body p-3">
                <div className={`${skeletonBlock} w-100 mb-2`} style={{ height: '1rem' }} />
                <div className={`${skeletonBlock} w-50 mb-2`} style={{ height: '0.85rem' }} />
                <div className="d-flex gap-2 align-items-end">
                    <div className={`${skeletonBlock} w-25`} style={{ height: '1.25rem' }} />
                    <div className={`${skeletonBlock} w-25`} style={{ height: '0.9rem' }} />
                </div>
            </div>
        </div>
    );
}

/**
 * @param {'full' | 'grid'} mode — full: tiêu đề + tab + lưới; grid: chỉ lưới sản phẩm (đổi tab)
 * @param {string} [title] — khi full: hiển thị tiêu đề thật; không truyền thì dùng thanh placeholder
 * @param {number} [gridCount] — số ô skeleton (mặc định 4)
 * @param {string} [gridColumnClass] — class cột Bootstrap cho từng thẻ
 * @param {boolean} [fullWidthGrid] — true: bọc `col-12` (dùng trong `.row` ở Home); false: trang /product
 * @param {boolean} [showResultBar] — thanh placeholder “số SP / trang” (chỉ mode grid)
 */
export function ProductSectionSkeleton({
    mode = 'full',
    title,
    gridCount = GRID_PLACEHOLDER_COUNT,
    gridColumnClass = 'col-6 col-md-4 col-lg-3 col-xxl-3',
    fullWidthGrid = true,
    showResultBar = false,
}) {
    const grid = (
        <div className="row g-3" aria-hidden="true">
            {Array.from({ length: gridCount }).map((_, i) => (
                <div className={gridColumnClass} key={i}>
                    <ProductCardPlaceholder />
                </div>
            ))}
        </div>
    );

    if (mode === 'grid') {
        const body = (
            <>
                {showResultBar && (
                    <div className="d-flex justify-content-between align-items-center mb-3" aria-hidden="true">
                        <div className={`${skeletonBlock}`} style={{ width: 'min(220px, 55vw)', height: '1.25rem' }} />
                        <div className={`${skeletonBlock}`} style={{ width: 96, height: '0.85rem' }} />
                    </div>
                )}
                {grid}
            </>
        );
        return fullWidthGrid ? (
            <div className="col-12" aria-busy="true" aria-label="Đang tải sản phẩm">
                {body}
            </div>
        ) : (
            <div aria-busy="true" aria-label="Đang tải sản phẩm">
                {body}
            </div>
        );
    }

    return (
        <div className="py-3" aria-busy="true" aria-label="Đang tải">
            {title ? (
                <h2 className="fw-bold mb-3">{title}</h2>
            ) : (
                <div className={`${skeletonBlock} mb-3`} style={{ height: '2rem', width: 'min(60%, 320px)' }} />
            )}
            <div className="tab-swiper-container text-center d-flex justify-content-center m-3 flex-wrap gap-2">
                {Array.from({ length: TAB_PLACEHOLDER_COUNT }).map((_, i) => (
                    <span key={i} className={`${skeletonBlock} rounded-pill d-inline-block`} style={{ width: 88, height: 36 }} />
                ))}
            </div>
            {grid}
        </div>
    );
}

export default ProductSectionSkeleton;
