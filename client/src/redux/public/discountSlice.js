import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/discounts';

// Fetch all valid public discounts
export const fetchDiscounts = createAsyncThunk(
    'discounts/fetchDiscounts', 
    async (_, thunkAPI) => {
        try {
            const response = await fetch(`${API_BASE}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tải mã giảm giá');
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Fetch available discounts for current cart
export const fetchAvailableDiscounts = createAsyncThunk(
    'discounts/fetchAvailableDiscounts',
    async (_, thunkAPI) => {
        try {
            const response = await fetch(`${API_BASE}/api/users/cart/available-discounts`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tải mã giảm giá khả dụng');
            }
            return data;
        } catch (error) {
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
