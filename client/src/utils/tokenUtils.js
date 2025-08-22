// Không import store trực tiếp để tránh circular dependency
// import store from '../redux/store';
import { setAuth, clearAuth } from '../redux/auth/authSlice';

// Kiểm tra token có hết hạn không (có thể vẫn hữu ích nếu cần)
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

// Tạo headers với authorization từ Redux state
export const createAuthHeaders = (state, body) => {
  const token = state.auth?.accessToken;
  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Chỉ thêm JSON khi body không phải FormData
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};


// Interceptor cho fetch requests sử dụng Access Token trong Redux và refresh khi 401
export const fetchWithAuth = async (url, options = {}, getState, dispatch) => {
  const headers = createAuthHeaders(getState(),options.body);

  const doFetch = async (hdrs) => fetch(url, {
    ...options,
    headers: {
      ...hdrs,
      ...options.headers
    },
    credentials: 'include'
  });

  let response = await doFetch(headers);

  if (response.status === 401) {
    try {
      console.log('401 received, attempting to refresh token...');
      const refreshResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include'
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        // Cập nhật Redux auth state
        dispatch(setAuth({ accessToken: data.accessToken, user: data.user }));
        const newHeaders = createAuthHeaders(getState());
        response = await doFetch(newHeaders);
      } else {
        console.log('Refresh token failed, logging out...');
        dispatch(clearAuth());
        throw new Error('Token expired');
      }
    } catch (error) {
      console.error('Error during token refresh:', error);
      dispatch(clearAuth());
      throw error;
    }
  }

  return response;
};
