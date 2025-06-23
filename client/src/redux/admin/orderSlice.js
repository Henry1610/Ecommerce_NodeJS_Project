import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all orders
export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, thunkAPI) => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/orders', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy danh sách đơn hàng');
            }

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Fetch order by ID
export const fetchOrderByOrderNumber = createAsyncThunk(
    'orders/fetchOrderByOrderNumber',
    async (orderNumber, thunkAPI) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/orders/${orderNumber}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Không tìm thấy đơn hàng');
            }

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Fetch refund requests
export const fetchRefundRequests = createAsyncThunk(
    'orders/fetchRefundRequests',
    async (_, thunkAPI) => {
        try {
            const res = await fetch('http://localhost:5000/api/orders/admin/refund-requests', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy danh sách hoàn tiền');
            }

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Update order status (shipping/delivery)
export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ orderNumber, statusData }, thunkAPI) => {

        try {
            const res = await fetch(`http://localhost:5000/api/admin/orders/${orderNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ statusData })
            });

            const data = await res.json();

            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Không thể cập nhật trạng thái đơn hàng');
            }

            return data.order;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);
const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        refundOrders: [],
        selectedOrder: null,
        loading: false,
        error: null
    },
    reducers: {
        resetSelectedOrder: (state) => {
            state.selectedOrder = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // All Orders
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Single Order
            .addCase(fetchOrderByOrderNumber.pending, (state) => {
                state.loading = true;
                state.selectedOrder = null;
                state.error = null;
            })
            .addCase(fetchOrderByOrderNumber.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedOrder = action.payload;
            })
            .addCase(fetchOrderByOrderNumber.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Refund Requests
            .addCase(fetchRefundRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRefundRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.refundOrders = action.payload;
            })
            .addCase(fetchRefundRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Order Status
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.map(order =>
                    order._id === action.payload._id ? action.payload : order
                );
                if (state.selectedOrder && state.selectedOrder._id === action.payload._id) {
                    state.selectedOrder = action.payload;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
