import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/users/orders';
// Lấy danh sách đơn hàng của người dùng
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Error fetching orders:', data);
        return thunkAPI.rejectWithValue(data.message || 'Không thể lấy danh sách đơn hàng');
      }

      return data.orders;
    } catch (error) {
      console.error('Network error fetching orders:', error);
      return thunkAPI.rejectWithValue('Lỗi kết nối server');
    }
  }
);

// Lấy chi tiết đơn hàng theo ID
export const fetchOrderByOrderNumber = createAsyncThunk(
  'orders/fetchOrderByOrderNumber',
  async (orderNumber, thunkAPI) => {
    
    try {
      const res = await fetch(`${API_BASE}/${orderNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
        
      const data = await res.json();

      if (!res.ok) {
        console.error('Error fetching order:', data);
        return thunkAPI.rejectWithValue(data.message || 'Không thể lấy đơn hàng');
      }

      return data.order;
    } catch (error) {
      console.error('Network error fetching order:', error);
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
        state.orderDetail = action.payload;
      })
      .addCase(fetchOrderByOrderNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderDetail } = ordersSlice.actions;
export default ordersSlice.reducer;
