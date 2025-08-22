import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithAuth } from '../../utils/tokenUtils';

const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/admin/users';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, thunkAPI) => {
  try {
    const res = await fetchWithAuth(`${API_BASE}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }, thunkAPI.getState, thunkAPI.dispatch);
    const data = await res.json();
    if (!res.ok) return thunkAPI.rejectWithValue(data.message || 'Lỗi lấy users');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Không lấy được users');
  }
});

export const getUserById = createAsyncThunk('users/getUserById', async (userId, thunkAPI) => {
  try {
    const res = await fetchWithAuth(`${API_BASE}/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }, thunkAPI.getState, thunkAPI.dispatch);
    const data = await res.json();
    if (!res.ok) return thunkAPI.rejectWithValue(data.message || 'Lỗi lấy user');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Không lấy được user');
  }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId, thunkAPI) => {
  try {
    const res = await fetchWithAuth(`${API_BASE}/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }, thunkAPI.getState, thunkAPI.dispatch);
    const data = await res.json();
    if (!res.ok) return thunkAPI.rejectWithValue(data.message || 'Xóa user thất bại');
    return { id: userId };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Lỗi khi xóa user');
  }
});

export const updateUserRole = createAsyncThunk('users/updateUserRole', async ({ userId, role }, thunkAPI) => {
  try {
    const res = await fetchWithAuth(`${API_BASE}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    }, thunkAPI.getState, thunkAPI.dispatch);
    const data = await res.json();
    if (!res.ok) return thunkAPI.rejectWithValue(data.message || 'Cập nhật vai trò thất bại');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Lỗi khi cập nhật vai trò');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],       
    currentUser: null, 
    loading: false,
    error: null,
  },
  reducers: {
    resetCurrentUser: (state) => {
      state.currentUser = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Get user by ID
      .addCase(getUserById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload.id);
      })

      // Update user role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updated = action.payload.user;
        state.users = state.users.map(user =>
          user._id === updated._id ? updated : user
        );
      });
  },
});

export const { resetCurrentUser } = userSlice.actions;
export default userSlice.reducer;
