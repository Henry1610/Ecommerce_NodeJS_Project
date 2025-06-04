import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// THUNK: Gọi API tạo Stripe Checkout Session
export const createCheckoutSession = createAsyncThunk(
  'payment/createCheckoutSession',
  async (orderData, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/payments/checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Không thể tạo phiên thanh toán');
      }

      return data; // data.url (Stripe Checkout URL)
    } catch (error) {
      return thunkAPI.rejectWithValue('Lỗi kết nối máy chủ');
    }
  }
);

// Initial state
const initialState = {
  loading: false,
  error: null,
  sessionUrl: null,
  status: 'idle', // idle | loading | succeeded | failed
};

// Slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;
      state.error = null;
      state.sessionUrl = null;
      state.status = 'idle';
    },
    clearPaymentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.sessionUrl = action.payload.url;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || 'Lỗi không xác định';
        state.sessionUrl = null;
      });
  }
});

// Export actions
export const { resetPaymentState, clearPaymentError } = paymentSlice.actions;

// Selectors
export const selectPaymentState = (state) => state.payment;
export const selectSessionUrl = (state) => state.payment.sessionUrl;
export const selectPaymentLoading = (state) => state.payment.loading;
export const selectPaymentError = (state) => state.payment.error;
export const selectPaymentStatus = (state) => state.payment.status;

// Export reducer
export default paymentSlice.reducer;
