import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshToken, clearAuth } from '../redux/auth/authSlice';

const useTokenManager = () => {
    const dispatch = useDispatch();
    const { accessToken, user } = useSelector(state => state.auth);
    const refreshTimeoutRef = useRef(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);

    // Kiểm tra token có hết hạn không
    const isTokenExpired = useCallback((token) => {
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch (error) {
            return true;
        }
    }, []);

    // Tính thời gian còn lại của token (milliseconds)
    const getTokenTimeLeft = useCallback((token) => {
        if (!token) return 0;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 - Date.now();
        } catch (error) {
            return 0;
        }
    }, []);

    // Refresh token với protection tránh infinite loop
    const refreshTokenAction = useCallback(async () => {
        // Nếu đang refresh hoặc đã thất bại trước đó, không làm gì
        if (isRefreshing) {
            return null;
        }

        setIsRefreshing(true);
        try {
            const result = await dispatch(refreshToken()).unwrap();
            return result;
        } catch (error) {
            // Chỉ log lỗi, không hiển thị toast cho lỗi "refresh token not found" 
            // khi người dùng chưa đăng nhập (đây là hành vi bình thường)
            if (error && error.includes('Refresh token not found')) {
                console.log('No refresh token found - user not logged in');
            } else {
                console.error('Refresh token failed:', error);
            }
            // Chỉ logout nếu đã có accessToken trước đó
            if (accessToken) {
                dispatch(clearAuth());
            }
            return null;
        } finally {
            setIsRefreshing(false);
        }
    }, [dispatch, isRefreshing, accessToken]);

    // Lên lịch refresh token trước khi hết hạn 5 phút
    const scheduleTokenRefresh = useCallback((token) => {
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }

        if (!token) return;

        const timeLeft = getTokenTimeLeft(token);
        const refreshTime = Math.max(timeLeft - 5 * 60 * 1000, 0); // 5 phút trước khi hết hạn

        if (refreshTime > 0) {
            refreshTimeoutRef.current = setTimeout(() => {
                refreshTokenAction();
            }, refreshTime);
        }
    }, [getTokenTimeLeft, refreshTokenAction]);

    // Xử lý khi tab được focus (user quay lại tab)
    const handleTabFocus = useCallback(() => {
        if (accessToken && isTokenExpired(accessToken) && !isRefreshing) {
            console.log('Token expired when tab focused, refreshing...');
            refreshTokenAction();
        }
    }, [accessToken, isTokenExpired, refreshTokenAction, isRefreshing]);

    // Khởi tạo token khi app start (chỉ 1 lần)
    const initializeToken = useCallback(async () => {
        if (hasInitialized) {
            return;
        }

        try {
            // Nếu đã có token và chưa hết hạn, chỉ cần lên lịch refresh
            if (accessToken && !isTokenExpired(accessToken)) {
                scheduleTokenRefresh(accessToken);
                setHasInitialized(true);
                return;
            }

            // Nếu có token nhưng đã hết hạn, refresh ngay
            if (accessToken && isTokenExpired(accessToken)) {
                const result = await refreshTokenAction();
                if (result) {
                    scheduleTokenRefresh(result.accessToken);
                }
                setHasInitialized(true);
                return;
            }

            // Nếu không có accessToken (reload trang), vẫn thử refresh từ cookie
            // Nếu có refresh token cookie, sẽ lấy được accessToken mới
            // Nếu không có, refreshTokenAction sẽ fail nhưng không hiển thị lỗi
            if (!accessToken) {
                const result = await refreshTokenAction();
                if (result) {
                    scheduleTokenRefresh(result.accessToken);
                }
            }
        } catch (error) {
            console.error('Token initialization failed:', error);
        } finally {
            setHasInitialized(true);
        }
    }, [accessToken, isTokenExpired, refreshTokenAction, scheduleTokenRefresh, hasInitialized]);

    // Effect: Khởi tạo token khi component mount (chỉ 1 lần)
    useEffect(() => {
        if (!hasInitialized) {
            initializeToken();
        }
    }, [initializeToken, hasInitialized]);

    // Effect: Lên lịch refresh khi token thay đổi (chỉ khi đã khởi tạo)
    useEffect(() => {
        if (hasInitialized && accessToken && !isRefreshing) {
            scheduleTokenRefresh(accessToken);
        }
    }, [accessToken, scheduleTokenRefresh, hasInitialized, isRefreshing]);

    // Effect: Xử lý tab visibility
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                handleTabFocus();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [handleTabFocus]);

    // Cleanup timeout khi unmount
    useEffect(() => {
        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, []);

    return {
        accessToken,
        user,
        isTokenExpired: () => isTokenExpired(accessToken),
        refreshToken: refreshTokenAction,
        isInitialized: hasInitialized,
        isRefreshing
    };
};

export default useTokenManager; 