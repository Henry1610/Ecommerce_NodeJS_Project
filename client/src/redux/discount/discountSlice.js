import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all discounts
export const fetchDiscounts = createAsyncThunk(
    'discounts/fetchDiscounts',
    async (_, thunkAPI) => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/discounts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('Error fetching discounts:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy danh sách mã giảm giá');
            }

            console.log('Discounts fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('Network error fetching discounts:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);
export const createDiscount = createAsyncThunk(
    'discounts/createDiscount',
    async (discountData, thunkAPI) => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/discounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(discountData),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('Error creating discount:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể tạo mã giảm giá');
            }

            console.log('Discount created successfully:', data);
            return data.discount; // giả định response là { message, discount }
        } catch (error) {
            console.error('Network error creating discount:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);
// Fetch a single discount by ID
export const fetchDiscountById = createAsyncThunk(
    'discounts/fetchDiscountById',
    async (discountId, thunkAPI) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/discounts/${discountId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('Error fetching discount:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy mã giảm giá');
            }

            return data;
        } catch (error) {
            console.error('Network error fetching discount:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);
export const deleteDiscount = createAsyncThunk(
    'discounts/deleteDiscount',
    async (discountId, thunkAPI) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/discounts/${discountId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('Error deleting discount:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể xoá mã giảm giá');
            }

            return discountId; // Trả về ID để xoá trong state
        } catch (error) {
            console.error('Network error deleting discount:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);
export const updateDiscount = createAsyncThunk(
    'discounts/updateDiscount',
    async ({ id, updatedData }, thunkAPI) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/discounts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updatedData),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('Error updating discount:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể cập nhật mã giảm giá');
            }

            return data;
        } catch (error) {
            console.error('Network error updating discount:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

const discountSlice = createSlice({
    name: 'discounts',
    initialState: {
        discounts: [],
        discount: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetDiscountDetail: (state) => {
            state.discount = null;
            state.error = null;
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

            // Fetch single discount by ID
            .addCase(fetchDiscountById.pending, (state) => {
                state.loading = true;
                state.discount = null;
                state.error = null;
            })
            .addCase(fetchDiscountById.fulfilled, (state, action) => {
                state.loading = false;
                state.discount = action.payload;
            })
            .addCase(fetchDiscountById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteDiscount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDiscount.fulfilled, (state, action) => {
                state.loading = false;
                state.discounts = state.discounts.filter(d => d._id !== action.payload);
            })
            .addCase(deleteDiscount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateDiscount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDiscount.fulfilled, (state, action) => {
                state.loading = false;
                state.discounts = state.discounts.map(discount =>
                    discount._id === action.payload._id ? action.payload : discount
                );
            })
            .addCase(updateDiscount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

export const { resetDiscountDetail } = discountSlice.actions;
export default discountSlice.reducer;
