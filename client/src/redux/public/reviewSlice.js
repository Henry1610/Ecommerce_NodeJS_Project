import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/reviews';
export const fetchReviewStats = createAsyncThunk(
    'reviews/getReviewStats',
    async (slug, thunkAPI) => {
      try {
        const res = await fetch(`${API_BASE}/${slug}/stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          console.error('Error fetching stats:', data);
          return thunkAPI.rejectWithValue(data.message || 'Không thể lấy thống kê');
        }
  
        return data; // { stats: { 1: x, 2: y, ... }, total: z }
      } catch (error) {
        console.error('Network error fetching stats:', error);
        return thunkAPI.rejectWithValue('Lỗi kết nối server');
      }
    }
  );
  const reviewStatsSlice = createSlice({
    name: 'reviewStats',
    initialState: {
      stats: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      total: 0,
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchReviewStats.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchReviewStats.fulfilled, (state, action) => {
          state.stats = action.payload.stats;
          state.total = action.payload.total;
          state.loading = false;
        })
        .addCase(fetchReviewStats.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Có lỗi khi lấy thống kê đánh giá';
        });
    },
  });
  
  export default reviewStatsSlice.reducer;
  