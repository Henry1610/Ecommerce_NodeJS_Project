import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:5000/api/admin';

export const fetchAdminProfile = createAsyncThunk('admin/fetchAdminProfile', async (_, thunkAPI) => {
  try {
    const res = await fetch(`${API_BASE}/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await res.json();
    if (!res.ok) return thunkAPI.rejectWithValue(data.message || 'Lỗi lấy profile admin');
    return data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Không lấy được profile admin');
  }
});

export const updateAdminProfile = createAsyncThunk('admin/updateAdminProfile', async (formData, thunkAPI) => {
  try {
    const res = await fetch(`${API_BASE}/me`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) return thunkAPI.rejectWithValue(data.message || 'Lỗi cập nhật profile admin');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Không cập nhật được profile admin');
  }
});

export const changeAdminPassword = createAsyncThunk('admin/changeAdminPassword', async (passwordData, thunkAPI) => {
  try {
    const res = await fetch(`${API_BASE}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(passwordData),
    });
    const data = await res.json();
    if (!res.ok) return thunkAPI.rejectWithValue(data.message || 'Lỗi đổi mật khẩu admin');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Không đổi được mật khẩu admin');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetAdminProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAdminProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateAdminProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(changeAdminPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeAdminPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(changeAdminPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetAdminProfile } = adminSlice.actions;
export default adminSlice.reducer; 