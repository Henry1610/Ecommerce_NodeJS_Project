import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/auth';

export const register = createAsyncThunk(
    'auth/register'
    , async ({ username, password, email }, thunkAPI) => {
        try {
            const res = await fetch(`${API_BASE}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    
                }
                ,
                body: JSON.stringify({ username, email, password }),
            })
            const data = await res.json();
            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Đăng ký thất bại');

            }
            localStorage.setItem('token', data.token);
            const { _id: regId, ...regUserWithRole } = data.user || {};
            localStorage.setItem('user',  JSON.stringify(regUserWithRole));

            return {token:data.token,user:regUserWithRole};
        }
        catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server'); 

        }
    }
)
export const login = createAsyncThunk(
    'auth/login', async ({ email, password }, thunkAPI) => {
        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'

                }
                , body: JSON.stringify({ email, password })
            })
            const data = await res.json();

            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Đăng nhập thất bại');
            }
            localStorage.setItem('token', data.token);
            const { _id, ...userWithRole } = data.user || {};
            localStorage.setItem('user', JSON.stringify(userWithRole));

            return {token:data.token,user:userWithRole};


        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }

    })

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
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,
        resetSuccess: false,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token')
            localStorage.removeItem('user')

        },
        clearResetState: (state) => {
            state.resetSuccess = false;
            state.error = null;
        },
    }
    , extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user=action.payload.user
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user=action.payload.user

            })
            .addCase(login.rejected, (state, action) => {
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
}



)
export const { logout, clearResetState } = authSlice.actions;
export default authSlice.reducer;