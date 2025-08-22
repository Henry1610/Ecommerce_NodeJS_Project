import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/auth';

// Gửi OTP
export const sendOTP = createAsyncThunk(
    'auth/sendOTP',
    async ({ username, email }, thunkAPI) => {
        try {
            const res = await fetch(`${API_BASE}/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email }),
            });
            const data = await res.json();
            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Gửi OTP thất bại');
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Đăng ký với OTP
export const registerWithOTP = createAsyncThunk(
    'auth/registerWithOTP',
    async ({ username, email, password, otp }, thunkAPI) => {
        try {
            const res = await fetch(`${API_BASE}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, otp }),
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Đăng ký thất bại');
            }
            const { id: regId, ...regUserWithRole } = data.user || {};
            return { accessToken: data.accessToken, user: regUserWithRole };
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

export const login = createAsyncThunk(
    'auth/login', async ({ email, password, rememberMe }, thunkAPI) => {
        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'

                }
                , body: JSON.stringify({ email, password, rememberMe }),
                credentials: 'include'
            })
            const data = await res.json();

            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Đăng nhập thất bại');
            }
            const { id, ...userWithRole } = data.user || {};
            return {accessToken:data.accessToken,user:userWithRole};


        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }

    })

// Refresh token
export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, thunkAPI) => {
        try {
            const res = await fetch(`${API_BASE}/refresh-token`, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Refresh token thất bại');
            }
            const { id, ...userWithRole } = data.user || {};
            return { accessToken: data.accessToken, user: userWithRole };
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Logout
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, thunkAPI) => {
        try {
            const res = await fetch(`${API_BASE}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Đăng xuất thất bại');
            }
            return data.message;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email }, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Gửi email thất bại');
      }
      return data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue('Lỗi kết nối server');
    }
  }
);

export const resetPasswordConfirm = createAsyncThunk(
  'auth/resetPasswordConfirm',
  async ({ token, newPassword }, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Đặt lại mật khẩu thất bại');
      }
      return data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue('Lỗi kết nối server');
    }
  }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        accessToken: null,
        loading: false,
        error: null,
        resetSuccess: false,
        otpSent: false,
    },
    reducers: {
        clearAuth: (state) => {
            state.user = null;
            state.accessToken = null;
        },
        clearResetState: (state) => {
            state.resetSuccess = false;
            state.error = null;
        },
        clearOTPState: (state) => {
            state.otpSent = false;
            state.error = null;
        },
        setAuth: (state, action) => {
            state.accessToken = action.payload?.accessToken || null;
            state.user = action.payload?.user || null;
        }
    }
    , extraReducers: (builder) => {
        builder
            // Send OTP cases
            .addCase(sendOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.otpSent = true;
            })
            .addCase(sendOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Register with OTP cases
            .addCase(registerWithOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerWithOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.otpSent = false;
            })
            .addCase(registerWithOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload.accessToken;
                state.user=action.payload.user

            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(refreshToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload.accessToken;
                state.user = action.payload.user;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.accessToken = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.resetSuccess = false;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.resetSuccess = true;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.resetSuccess = false;
            })
            .addCase(resetPasswordConfirm.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.resetSuccess = false;
            })
            .addCase(resetPasswordConfirm.fulfilled, (state, action) => {
                state.loading = false;
                state.resetSuccess = true;
            })
            .addCase(resetPasswordConfirm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.resetSuccess = false;
            });
    }
})

export const { clearAuth, clearResetState, clearOTPState, setAuth } = authSlice.actions;
export default authSlice.reducer;