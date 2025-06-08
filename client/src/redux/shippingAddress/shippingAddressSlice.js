import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk
export const getSavedShippingAddresses = createAsyncThunk(
    'shippingAddress/getSavedShippingAddresses',
    async (_, thunkAPI) => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/shipping-addresses`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi lấy danh sách địa chỉ giao hàng');
            }

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối đến server');
        }
    }
);
export const getShippingAddressById = createAsyncThunk(
    'shippingAddress/getShippingAddressById',
    async (addressId, thunkAPI) => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/shipping-addresses/${addressId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi lấy địa chỉ');
            }

            return data; // Trả về 1 address object
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối đến server');
        }
    }
);

// shippingAddressSlice.js
export const updateShippingAddress = createAsyncThunk(
    'shippingAddress/updateShippingAddress',
    async ({ addressId, updates }, thunkAPI) => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/shipping-addresses/${addressId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updates),
            });

            const data = await res.json();

            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi cập nhật địa chỉ');
            }

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối đến server');
        }
    }
);
export const createShippingAddress = createAsyncThunk(
    'shippingAddress/createShippingAddress',
    async (newAddress, thunkAPI) => {
        try {
            const res = await fetch('http://localhost:5000/api/users/shipping-addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newAddress),
            });

            const data = await res.json();

            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tạo địa chỉ');
            }

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối đến server');
        }
    }
);
export const getDefaultShippingAddress = createAsyncThunk(
    'shippingAddress/getDefaultShippingAddress',
    async (_, thunkAPI) => {
        try {
            const res = await fetch('http://localhost:5000/api/users/shipping-addresses/default', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Không tìm thấy địa chỉ mặc định');
            }

            return data; // Trả về object địa chỉ mặc định
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối đến server');
        }
    }
);

// Slice
const shippingAddressSlice = createSlice({
    name: 'shippingAddress',
    initialState: {
        defaultAddress: null,
        AddressSave: [],
        loading: false,
        error: null,
    },
    reducers: {


    },
    extraReducers: (builder) => {
        builder
            //GetAll
            .addCase(getSavedShippingAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSavedShippingAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.AddressSave = action.payload;
            })
            .addCase(getSavedShippingAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateShippingAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateShippingAddress.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.AddressSave.findIndex((addr) => addr._id === updated._id);
                if (index !== -1) {
                    state.AddressSave[index] = updated;
                }
            })
            .addCase(updateShippingAddress.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Create
            .addCase(createShippingAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createShippingAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.AddressSave.push(action.payload);
            })
            .addCase(createShippingAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get by Id
            .addCase(getShippingAddressById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getShippingAddressById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedAddress = action.payload; // Lưu địa chỉ lấy được vào selectedAddress
            })
            .addCase(getShippingAddressById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get default address
            .addCase(getDefaultShippingAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDefaultShippingAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.defaultAddress = action.payload; 
            })
            .addCase(getDefaultShippingAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
});
export const selectShippingFee = (state) => {    
    return state.shippingAddress.defaultAddress?.city.fee || 0;
};

export const { setSelectedAddress, clearShippingAddresses } = shippingAddressSlice.actions;
export default shippingAddressSlice.reducer;
