import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useTokenManager from '../../hooks/useTokenManager';

const AppInitializer = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const { isInitialized: tokenInitialized, isRefreshing } = useTokenManager();
    const { loading: authLoading } = useSelector(state => state.auth);

    // Chỉ đợi token được khởi tạo xong
    useEffect(() => {
        if (tokenInitialized && !isRefreshing) {
            setIsInitialized(true);
        }
    }, [tokenInitialized, isRefreshing]);

    // Hiển thị loading khi đang khởi tạo
    if (!isInitialized || authLoading || isRefreshing) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Render app khi đã khởi tạo xong
    return children;
};

export default AppInitializer; 