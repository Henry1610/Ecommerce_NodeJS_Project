import React from 'react';
import { Link } from 'react-router-dom';
import { SKELETON_BLOCK } from './skeletonBlock';
import PageSectionHeading from '../PageSectionHeading';

const ROW_COUNT = 4;
const b = SKELETON_BLOCK;

function TableRowSkeleton() {
    return (
        <tr>
            <td className="align-middle">
                <div className={`${b} rounded-circle`} style={{ width: 30, height: 30 }} />
            </td>
            <td className="align-middle">
                <div className="d-flex align-items-center">
                    <div className={`${b} rounded me-3 flex-shrink-0`} style={{ width: 80, height: 80 }} />
                    <div className="flex-grow-1 min-w-0">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <div className={`${b} rounded`} style={{ width: 30, height: 30 }} />
                            <div className={`${b}`} style={{ width: 'min(280px, 60vw)', height: '1rem' }} />
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div key={i} className={`${b} rounded`} style={{ width: 10, height: 10 }} />
                            ))}
                            <div className={`${b} ms-1`} style={{ width: 28, height: '0.7rem' }} />
                        </div>
                    </div>
                </div>
            </td>
            <td className="align-middle text-center">
                <div className={`${b} mx-auto mb-1`} style={{ width: 96, height: '1rem' }} />
                <div className={`${b} mx-auto`} style={{ width: 72, height: '0.75rem' }} />
            </td>
            <td className="align-middle text-center">
                <div className={`${b} rounded-pill mx-auto`} style={{ width: 88, height: 28 }} />
            </td>
            <td className="align-middle text-center">
                <div className="d-flex gap-2 justify-content-center">
                    <div className={`${b} rounded-pill`} style={{ width: 72, height: 34 }} />
                    <div className={`${b} rounded-pill`} style={{ width: 44, height: 34 }} />
                </div>
            </td>
        </tr>
    );
}

function MobileCardSkeleton() {
    return (
        <div className="card border-0 shadow-sm mb-3">
            <div className="card-body p-3">
                <div className="row g-3">
                    <div className="col-4">
                        <div className={`${b} rounded w-100`} style={{ height: 100 }} />
                    </div>
                    <div className="col-8">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="flex-grow-1 pe-2">
                                <div className={`${b} mb-2`} style={{ width: 80, height: '0.75rem' }} />
                                <div className={`${b} mb-1`} style={{ width: '100%', height: '1rem' }} />
                                <div className={`${b}`} style={{ width: '70%', height: '1rem' }} />
                            </div>
                            <div className={`${b} rounded-circle flex-shrink-0`} style={{ width: 32, height: 32 }} />
                        </div>
                        <div className="d-flex align-items-center mb-2 gap-1">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div key={i} className={`${b} rounded`} style={{ width: 9, height: 9 }} />
                            ))}
                        </div>
                        <div className={`${b} mb-2`} style={{ width: 120, height: '1rem' }} />
                        <div className={`${b} rounded-pill mb-3`} style={{ width: 72, height: 22 }} />
                    </div>
                    <div className="col-12">
                        <div className="d-flex gap-2">
                            <div className={`${b} rounded flex-grow-1`} style={{ height: 40 }} />
                            <div className={`${b} rounded`} style={{ width: 48, height: 40 }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function WishListSkeleton() {
    return (
        <div className="container py-4 border-top" aria-busy="true" aria-label="Đang tải danh sách yêu thích">
            <nav aria-label="breadcrumb" className="user-page-header__breadcrumb">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-decoration-none">Trang chủ</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">Danh sách yêu thích</li>
                </ol>
            </nav>

            <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <PageSectionHeading
                        title="Danh sách yêu thích"
                        description="Xem và quản lý sản phẩm bạn đã lưu để mua sau"
                    />
                    <div className={`${b} rounded-3 flex-shrink-0`} style={{ width: 120, height: 36 }} aria-hidden />
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm d-none d-lg-block">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="border-0" style={{ width: 50 }} />
                                            <th className="border-0">
                                                <div className={`${b}`} style={{ width: 72, height: '0.85rem' }} />
                                            </th>
                                            <th className="border-0 text-center">
                                                <div className={`${b} mx-auto`} style={{ width: 36, height: '0.85rem' }} />
                                            </th>
                                            <th className="border-0 text-center">
                                                <div className={`${b} mx-auto`} style={{ width: 64, height: '0.85rem' }} />
                                            </th>
                                            <th className="border-0 text-center">
                                                <div className={`${b} mx-auto`} style={{ width: 56, height: '0.85rem' }} />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.from({ length: ROW_COUNT }).map((_, i) => (
                                            <TableRowSkeleton key={i} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="d-lg-none">
                        {Array.from({ length: ROW_COUNT }).map((_, i) => (
                            <MobileCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WishListSkeleton;
