import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/users/payments';
// THUNK: Gọi API tạo Stripe Checkout Session
export const createCheckoutSession = createAsyncThunk(
  'payment/createCheckoutSession',
  async (orderData, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE}/checkout-session`, {
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
export const requestRefund = createAsyncThunk(
  'payment/requestRefund',
  async ( orderNumber , thunkAPI) => {
    try {
      console.log('rss:',orderNumber);
      
      const res = await fetch(`${API_BASE}/refund/${orderNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Không thể gửi yêu cầu hoàn tiền');
      }

      return data; 
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
    },
    clearPaymentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ;
      })

      .addCase(requestRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestRefund.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Yêu cầu hoàn tiền thành công';
      })
      .addCase(requestRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const { resetPaymentState, clearPaymentError } = paymentSlice.actions;


// Export reducer
export default paymentSlice.reducer;
