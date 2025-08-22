import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/reviews';
export const fetchReviewStats = createAsyncThunk(
    'reviews/fetchReviewStats',
    async (slug, thunkAPI) => {
        try {
            const response = await fetch(`${API_BASE}/${slug}/stats`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tải thống kê đánh giá');
            }
            return data;
        } catch (error) {
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
  