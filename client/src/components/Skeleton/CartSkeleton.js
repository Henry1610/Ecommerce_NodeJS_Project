import React from 'react';
import { Link } from 'react-router-dom';
import { SKELETON_BLOCK } from './skeletonBlock';
import PageSectionHeading from '../PageSectionHeading';

const ITEM_ROWS = 3;
const b = SKELETON_BLOCK;

function CartItemRowSkeleton() {
    return (
        <div className="card mb-3 shadow-sm">
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <div className="d-flex flex-grow-1 min-w-0">
                        <div className={`${b} rounded flex-shrink-0`} style={{ width: 60, height: 40 }} />
                        <div className="ms-3 flex-grow-1 min-w-0">
                            <div className={`${b} mb-2`} style={{ width: '75%', maxWidth: 280, height: '1rem' }} />
                            <div className={`${b}`} style={{ width: '55%', height: '0.8rem' }} />
                        </div>
                    </div>
                    <div className="text-end flex-shrink-0 ps-2">
                        <div className={`${b} ms-auto mb-1`} style={{ width: 72, height: '0.75rem' }} />
                        <div className={`${b} ms-auto`} style={{ width: 88, height: '1rem' }} />
                    </div>
                </div>
                <div className="my-2 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <div className={`${b} rounded`} style={{ width: 32, height: 32 }} />
                        <div className={`${b} rounded`} style={{ width: 40, height: 32 }} />
                        <div className={`${b} rounded`} style={{ width: 32, height: 32 }} />
                    </div>
                    <div className={`${b} rounded`} style={{ width: 22, height: 22 }} />
                </div>
            </div>
        </div>
    );
}

function CartSkeleton() {
    return (
        <div className="container py-4 border-top" aria-busy="true" aria-label="Đang tải giỏ hàng">
            <nav aria-label="breadcrumb" className="user-page-header__breadcrumb">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-decoration-none">Trang chủ</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">Giỏ hàng</li>
                </ol>
            </nav>
            <div className="mb-4">
                <PageSectionHeading
                    title="Giỏ hàng"
                    description="Xem sản phẩm, áp dụng khuyến mãi và hoàn tất đơn hàng"
                />
            </div>
            <div className="row gy-4">
                <div className="col-md-8">
                    {Array.from({ length: ITEM_ROWS }).map((_, i) => (
                        <CartItemRowSkeleton key={i} />
                    ))}
                </div>
                <div className="col-md-4">
                    <div className="card mb-3">
                        <div className="card-body">
                            <div className={`${b} mb-3`} style={{ width: 140, height: '1.25rem' }} />
                            <div className={`${b} w-100 rounded`} style={{ height: 42 }} />
                        </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center mb-3">
                        <div className="w-100" style={{ maxWidth: '600px' }}>
                            <div className="border shadow-sm p-4 bg-white rounded">
                                {[1, 2, 3, 4].map((line) => (
                                    <div
                                        key={line}
                                        className={`d-flex justify-content-between ${line < 4 ? 'border-bottom pb-3 mb-3' : ''}`}
                                    >
                                        <div className={`${b}`} style={{ width: 72, height: '0.9rem' }} />
                                        <div className={`${b}`} style={{ width: line % 2 ? 160 : 120, height: '0.9rem' }} />
                                    </div>
                                ))}
                                <div className="d-flex justify-content-end mt-4">
                                    <div className={`${b}`} style={{ width: 72, height: '1rem' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body shadow">
                            <div className={`${b} mb-3`} style={{ width: 160, height: '1.25rem' }} />
                            <div className="d-flex justify-content-between mb-2">
                                <div className={`${b}`} style={{ width: 56, height: '0.85rem' }} />
                                <div className={`${b}`} style={{ width: 88, height: '0.85rem' }} />
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <div className={`${b}`} style={{ width: 48, height: '0.85rem' }} />
                                <div className={`${b}`} style={{ width: 72, height: '0.85rem' }} />
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-3">
                                <div className={`${b}`} style={{ width: 72, height: '1.1rem' }} />
                                <div className={`${b}`} style={{ width: 100, height: '1.1rem' }} />
                            </div>
                            <div className={`${b} w-100 rounded`} style={{ height: 42 }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartSkeleton;
