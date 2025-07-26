import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/admin/payments';

// Approve refund
export const approveRefund = createAsyncThunk(
  'orders/approveRefund',
  async (orderId, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE}/approve-refund/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Không thể duyệt refund');
      }

      return { orderId, message: data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue('Lỗi kết nối server');
    }
  }
);

// Reject refund
export const rejectRefund = createAsyncThunk(
  'orders/rejectRefund',
  async (orderId, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE}/reject-refund/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Không thể từ chối refund');
      }

      return { orderId, message: data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue('Lỗi kết nối server');
    }
  }
);

const orderRefundSlice = createSlice({
  name: 'orderRefund',
  initialState: {
    loading: false,
    error: null,
    successMessage: null,
    refundedOrders: [],  // lưu danh sách orderId đã được xử lý refund nếu cần
    rejectedOrders: [],  // lưu danh sách orderId đã bị từ chối
  },
  reducers: {
    clearRefundState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Approve refund
      .addCase(approveRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(approveRefund.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.refundedOrders.push(action.payload.orderId);
      })
      .addCase(approveRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi duyệt refund';
      })

      // Reject refund
      .addCase(rejectRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(rejectRefund.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.rejectedOrders.push(action.payload.orderId);
      })
      .addCase(rejectRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi từ chối refund';
      });
  }
});

export const { clearRefundState } = orderRefundSlice.actions;

export default orderRefundSlice.reducer;
