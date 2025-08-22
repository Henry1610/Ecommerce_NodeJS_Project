import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithAuth } from '../../utils/tokenUtils';

// Định nghĩa API_BASE một lần
const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/admin/reviews';

// Async Thunks
export const getAllReviewsAdmin = createAsyncThunk(
  'reviews/getAllReviewsAdmin',
  async (_, thunkAPI) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      }, thunkAPI.getState, thunkAPI.dispatch);
      
      const data = await response.json();
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tải reviews');
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Lỗi kết nối server');
    }
  }
);

export const createAdminReviewResponse = createAsyncThunk(
  'reviews/createAdminReviewResponse',
  async ({ reviewId, responseContent }, thunkAPI) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId, responseContent })
      }, thunkAPI.getState, thunkAPI.dispatch);
      
      const data = await response.json();
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tạo phản hồi');
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Lỗi kết nối server');
    }
  }
);

export const updateAdminReviewResponse = createAsyncThunk(
  'reviews/updateAdminReviewResponse',
  async ({ responseId, responseContent }, thunkAPI) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/response/${responseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responseContent })
      }, thunkAPI.getState, thunkAPI.dispatch);
      
      const data = await response.json();
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Lỗi khi cập nhật phản hồi');
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Lỗi kết nối server');
    }
  }
);

export const getAdminReviewResponseByReviewId = createAsyncThunk(
  'reviews/getAdminReviewResponseByReviewId',
  async (reviewId, thunkAPI) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/${reviewId}/response`, {
        headers: {
          'Content-Type': 'application/json',
        }
      }, thunkAPI.getState, thunkAPI.dispatch);
      
      const data = await response.json();
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tải phản hồi');
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Lỗi kết nối server');
    }
  }
);

const reviewSlice = createSlice({
  name: 'adminReviews',
  initialState: {
    reviews: [],
    reviewResponses: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllReviewsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllReviewsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
      })
      .addCase(getAllReviewsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAdminReviewResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminReviewResponse.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific review with the new response
        const { review: reviewId, responseContent, _id } = action.payload.response;
        state.reviewResponses[reviewId] = { responseContent, _id };
      })
      .addCase(createAdminReviewResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAdminReviewResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminReviewResponse.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific review's response
        const { review: reviewId, responseContent, _id } = action.payload.response;
        state.reviewResponses[reviewId] = { responseContent, _id };
      })
      .addCase(updateAdminReviewResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAdminReviewResponseByReviewId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminReviewResponseByReviewId.fulfilled, (state, action) => {
        state.loading = false;
        const { review: reviewId, responseContent, _id } = action.payload.response;
        state.reviewResponses[reviewId] = { responseContent, _id };
      })
      .addCase(getAdminReviewResponseByReviewId.rejected, (state, action) => {
        state.loading = false;
      
        const errorMsg = action.payload?.message || '';
        
        if (errorMsg.includes('Không tìm thấy phản hồi')) {
          // Không set lỗi nếu chỉ là không có phản hồi
          return;
        }
      
        state.error = action.payload;
      });
      
  },
});

export default reviewSlice.reducer; 