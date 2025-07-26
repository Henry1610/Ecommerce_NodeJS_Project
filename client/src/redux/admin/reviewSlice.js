import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Định nghĩa API_BASE một lần
const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/admin/reviews';

// Async Thunks
export const getAllReviewsAdmin = createAsyncThunk(
  'reviews/getAllReviewsAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_BASE}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createAdminReviewResponse = createAsyncThunk(
  'reviews/createAdminReviewResponse',
  async ({ reviewId, responseContent }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post(`${API_BASE}/response`, { reviewId, responseContent }, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateAdminReviewResponse = createAsyncThunk(
  'reviews/updateAdminReviewResponse',
  async ({ responseId, responseContent }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.put(`${API_BASE}/response/${responseId}`, { responseContent }, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAdminReviewResponseByReviewId = createAsyncThunk(
  'reviews/getAdminReviewResponseByReviewId',
  async (reviewId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_BASE}/${reviewId}/response`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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