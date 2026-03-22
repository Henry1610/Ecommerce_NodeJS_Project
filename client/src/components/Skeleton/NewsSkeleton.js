import React from 'react';
import { SKELETON_BLOCK } from './skeletonBlock';

const LIST_ROW_COUNT = 5;

function NewsSkeleton() {
    const b = SKELETON_BLOCK;
    return (
        <div className="row g-4 mt-1" aria-busy="true" aria-label="Đang tải tin tức">
            <div className="col-md-6">
                <div className="card border-0 bg-light shadow-sm p-3">
                    <div className={`${b} mb-2`} style={{ width: 100, height: '0.75rem' }} />
                    <div className={`${b} mb-2`} style={{ width: '90%', height: '1.35rem' }} />
                    <div className={`${b} mb-3`} style={{ width: '70%', height: '1.35rem' }} />
                    <div className="d-flex align-items-center mb-2 gap-3 justify-content-between">
                        <div className={`${b}`} style={{ width: 120, height: '0.85rem' }} />
                        <div className={`${b}`} style={{ width: 90, height: '0.85rem' }} />
                    </div>
                    <div className={`${b} w-100 rounded mb-3`} style={{ aspectRatio: '16 / 10', minHeight: 180 }} />
                    <div className="card-body p-0 pt-1">
                        <div className={`${b} w-100 mb-2`} style={{ height: '0.9rem' }} />
                        <div className={`${b} w-100 mb-2`} style={{ height: '0.9rem' }} />
                        <div className={`${b} mb-3`} style={{ width: '55%', height: '0.9rem' }} />
                        <div className={`${b} rounded`} style={{ width: 110, height: 32 }} />
                    </div>
                </div>
            </div>
            <div className="col-md-6 d-flex flex-column overflow-auto" style={{ maxHeight: '76vh' }}>
                {Array.from({ length: LIST_ROW_COUNT }).map((_, i) => (
                    <div key={i} className="d-flex border-bottom p-3 gap-3 align-items-start">
                        <div className={`${b} rounded flex-shrink-0`} style={{ width: 120, height: 80 }} />
                        <div className="flex-grow-1">
                            <div className={`${b} mb-2`} style={{ width: '100%', height: '1rem' }} />
                            <div className={`${b} mb-2`} style={{ width: '85%', height: '1rem' }} />
                            <div className="d-flex align-items-center gap-2 mt-1">
                                <div className={`${b}`} style={{ width: 80, height: '0.75rem' }} />
                                <div className={`${b}`} style={{ width: 72, height: '0.75rem' }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NewsSkeleton;
