import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/users';

// Lấy thông tin user
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();
      console.log('data:',data);
      
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Failed to fetch user info');
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Server error');
    }
  }
);

// Cập nhật thông tin user (chỉ tên và avatar)
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (updatedData, thunkAPI) => {
    try {
      let options = {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: updatedData
      };
      if (!(updatedData instanceof FormData)) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(updatedData);
      }
      const res = await fetch(`${API_BASE}/me`, options);
      const data = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Failed to update user');
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Server error');
    }
  }
);

// Đổi mật khẩu user
export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwordData, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(passwordData)
      });
      const data = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Failed to change password');
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Server error');
    }
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetUserProfileError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetUserProfileError } = userProfileSlice.actions;
export default userProfileSlice.reducer;