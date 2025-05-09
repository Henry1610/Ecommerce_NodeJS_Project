import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
export const register = createAsyncThunk(
    'auth/register'
    , async ({ username, password, email }, thunkAPI) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
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
            localStorage.setItem('user',  JSON.stringify(data.user));

            return {token:data.token,user:data.user};
        }
        catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server'); 

        }
    }
)
export const login = createAsyncThunk(
    'auth/login', async ({ email, password }, thunkAPI) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
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
            localStorage.setItem('user', JSON.stringify(data.user));

            return {token:data.token,user:data.user};


        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }

    })

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null

    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token')
            localStorage.removeItem('user')

        }
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
            });
    }
}



)
export const { logout } = authSlice.actions;
export default authSlice.reducer;