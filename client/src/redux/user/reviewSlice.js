import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thêm review mới
export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData, thunkAPI) => {
    try {
      const res = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reviewData)
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || "Không thể tạo review");
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Lỗi kết nối server");
    }
  }
);

// Lấy tất cả review của người dùng
export const fetchMyReviews = createAsyncThunk(
  'reviews/fetchMyReviews',
  async (_, thunkAPI) => {
    try {
      const res = await fetch('http://localhost:5000/api/reviews/my', {
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

// Cập nhật review
export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || "Không thể cập nhật review");
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Lỗi kết nối server");
    }
  }
);

// Xóa review
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || "Không thể xóa review");
      }

      return { id };
    } catch (error) {
      return thunkAPI.rejectWithValue("Lỗi kết nối server");
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    myReviews: [],
    loading: false,
    error: null,
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

      // Update review
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const updatedReview = action.payload.review;
        const index = state.myReviews.findIndex(r => r._id === updatedReview._id);
        if (index !== -1) {
          state.myReviews[index] = updatedReview;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.myReviews = state.myReviews.filter(r => r._id !== action.payload.id);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
