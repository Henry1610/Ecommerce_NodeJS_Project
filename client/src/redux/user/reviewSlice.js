import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/users/reviews';

// Thêm review mới
export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ slug, formData }, thunkAPI) => {
    try {
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const res = await fetch(`${API_BASE}/${slug}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData // Dạng multipart/form-data, không set Content-Type
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Không thể tạo đánh giá');
      }

      return data;
    } catch (error) {
      console.error('Lỗi kết nối server khi tạo đánh giá:', error);
      return thunkAPI.rejectWithValue('Lỗi kết nối server');
    }
  }
);

// Lấy tất cả review của người dùng
export const fetchMyReviews = createAsyncThunk(
  'reviews/fetchMyReviews',
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || "Không thể lấy review");
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Lỗi kết nối server");
    }
  }
);

// Async thunk: Lấy review theo orderNumber và productId
export const getReviewByOrderNumberAndProduct = createAsyncThunk(
  'reviews/getReviewByOrderNumberAndProduct',
  async ({ orderNumber, productId }, thunkAPI) => {
    try {


      const res = await fetch(`${API_BASE}/${orderNumber}/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Không thể lấy đánh giá');
      }

      return data;

    } catch (error) {
      console.error('Lỗi lấy đánh giá theo đơn hàng và sản phẩm:', error);
      return thunkAPI.rejectWithValue('Lỗi kết nối server');
    }
  }
);


// Cập nhật review
export const updateReviewByOrderNumberAndProduct = createAsyncThunk(
  'reviews/updateReview',
  async ({ orderNumber, productId, formData }, thunkAPI) => {
    try {
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const res = await fetch(`${API_BASE}/${orderNumber}/${productId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
          // Không set Content-Type cho FormData
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Không thể cập nhật đánh giá');
      }

      return data;
    } catch (error) {
      console.error('Lỗi kết nối server khi cập nhật đánh giá:', error);
      return thunkAPI.rejectWithValue('Lỗi kết nối server');
    }
  }
);




const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    review: null,
    myReviews: [],
    loading: false,
    error: null,
    productReviews: [],
  },
  reducers: {
    resetReviewError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder

      // Fetch my reviews
      .addCase(fetchMyReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.myReviews = action.payload;
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.myReviews.unshift(action.payload.review);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(getReviewByOrderNumberAndProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.review = null;
      })
      .addCase(getReviewByOrderNumberAndProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.review = action.payload.review;

      })
      .addCase(getReviewByOrderNumberAndProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update review
      .addCase(updateReviewByOrderNumberAndProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReviewByOrderNumberAndProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedReview = action.payload.review;
        const index = state.myReviews.findIndex(r => r._id === updatedReview._id);
        if (index !== -1) {
          state.myReviews[index] = updatedReview;
        }
      })
      .addCase(updateReviewByOrderNumberAndProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      
  }
});

export const { resetReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
