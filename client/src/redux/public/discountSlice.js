import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all valid public discounts
export const fetchDiscounts = createAsyncThunk(
    'discounts/fetchDiscounts', 
    async (_, thunkAPI) => {
        try {
            const res = await fetch('http://localhost:5000/api/discounts', {
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

const discountsSlice = createSlice({
    name: 'discounts',
    initialState: {
        discounts: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
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
            });
    }
});

export default discountsSlice.reducer;
