import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithAuth } from '../../utils/tokenUtils';

const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/users/orders';

// Lấy danh sách đơn hàng của người dùng
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, thunkAPI) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      }, thunkAPI.getState, thunkAPI.dispatch);
      
      const data = await response.json();
      
      
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tải đơn hàng');
      }
      
      // Trả về orders array thay vì toàn bộ response object
      return data.orders || [];
    } catch (error) {
      console.error('Orders API error:', error);
      return thunkAPI.rejectWithValue('Lỗi kết nối server');
    }
  }
);

// Lấy chi tiết đơn hàng theo ID
export const fetchOrderByOrderNumber = createAsyncThunk(
  'orders/fetchOrderByOrderNumber',
  async (orderNumber, thunkAPI) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/${orderNumber}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      }, thunkAPI.getState, thunkAPI.dispatch);
        
      const data = await response.json();
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tải chi tiết đơn hàng');
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Lỗi kết nối server');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    orderDetail: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetOrderDetail: (state) => {
      state.orderDetail = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single order
      .addCase(fetchOrderByOrderNumber.pending, (state) => {
        state.loading = true;
        state.orderDetail = null;
        state.error = null;
      })
      .addCase(fetchOrderByOrderNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload.order; // Lấy order từ response
      })
      .addCase(fetchOrderByOrderNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderDetail } = ordersSlice.actions;
export default ordersSlice.reducer;
