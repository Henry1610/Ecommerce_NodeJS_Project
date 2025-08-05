import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/discounts';

// Fetch all valid public discounts
export const fetchDiscounts = createAsyncThunk(
    'discounts/fetchDiscounts', 
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
                console.error('Error fetching discounts:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy danh sách giảm giá');
            }

            return data;
        } catch (error) {
            console.error('Network error fetching discounts:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Fetch available discounts for current cart
export const fetchAvailableDiscounts = createAsyncThunk(
    'discounts/fetchAvailableDiscounts',
    async (_, thunkAPI) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/cart/available-discounts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('Error fetching available discounts:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy danh sách mã giảm giá phù hợp');
            }

            return data;
        } catch (error) {
            console.error('Network error fetching available discounts:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

const discountsSlice = createSlice({
    name: 'discounts',
    initialState: {
        discounts: [],
        availableDiscounts: [],
        loading: false,
        availableLoading: false,
        error: null,
        availableError: null,
    },
    reducers: {
        clearAvailableDiscounts: (state) => {
            state.availableDiscounts = [];
            state.availableError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all discounts
            .addCase(fetchDiscounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDiscounts.fulfilled, (state, action) => {
                state.loading = false;
                state.discounts = action.payload;
            })
            .addCase(fetchDiscounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch available discounts
            .addCase(fetchAvailableDiscounts.pending, (state) => {
                state.availableLoading = true;
                state.availableError = null;
            })
            .addCase(fetchAvailableDiscounts.fulfilled, (state, action) => {
                state.availableLoading = false;
                state.availableDiscounts = action.payload.discounts || [];
            })
            .addCase(fetchAvailableDiscounts.rejected, (state, action) => {
                state.availableLoading = false;
                state.availableError = action.payload;
            });
    }
});

export const { clearAvailableDiscounts } = discountsSlice.actions;
export default discountsSlice.reducer;
