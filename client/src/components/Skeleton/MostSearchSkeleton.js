import React from 'react';
import { SKELETON_BLOCK } from './skeletonBlock';
import './MostSearchSkeleton.css';

const PILL_COUNT = 10;
const PILL_WIDTHS_PX = [268, 220, 300, 195, 285, 240, 310, 205, 255, 175];

function MostSearchSkeleton() {
    return (
        <>
            {Array.from({ length: PILL_COUNT }).map((_, i) => (
                <span
                    key={i}
                    className={`most-search-skeleton-pill ${SKELETON_BLOCK} rounded-pill d-inline-block`}
                    style={{
                        width: PILL_WIDTHS_PX[i],
                        maxWidth: '100%',
                        height: 34,
                    }}
                    aria-hidden
                />
            ))}
        </>
    );
}

export default MostSearchSkeleton;
