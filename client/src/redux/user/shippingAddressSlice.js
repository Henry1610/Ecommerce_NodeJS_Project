import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithAuth } from '../../utils/tokenUtils';

const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/users/shipping-addresses';
// Async thunk
export const getSavedShippingAddresses = createAsyncThunk(
    'shippingAddress/getSavedShippingAddresses',
    async (_, thunkAPI) => {
        try {
            const response = await fetchWithAuth(`${API_BASE}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }, thunkAPI.getState, thunkAPI.dispatch);
            const data = await response.json();
            if (!response.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tải địa chỉ giao hàng');
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

export const getShippingAddressById = createAsyncThunk(
    'shippingAddress/getShippingAddressById',
    async (addressId, thunkAPI) => {
        try {
            const response = await fetchWithAuth(`${API_BASE}/${addressId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }, thunkAPI.getState, thunkAPI.dispatch);
            const data = await response.json();
            if (!response.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tải địa chỉ giao hàng');
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

export const createShippingAddress = createAsyncThunk(
    'shippingAddress/createShippingAddress',
    async (addressData, thunkAPI) => {
        try {
            const response = await fetchWithAuth(`${API_BASE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addressData)
            }, thunkAPI.getState, thunkAPI.dispatch);
            const data = await response.json();
            if (!response.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tạo địa chỉ giao hàng');
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

export const updateShippingAddress = createAsyncThunk(
    'shippingAddress/updateShippingAddress',
    async ({ addressId, updates }, thunkAPI) => {
        try {
            const response = await fetchWithAuth(`${API_BASE}/${addressId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            }, thunkAPI.getState, thunkAPI.dispatch);
            const data = await response.json();
            if (!response.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi cập nhật địa chỉ giao hàng');
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

export const getDefaultShippingAddress = createAsyncThunk(
    'shippingAddress/getDefaultShippingAddress',
    async (_, thunkAPI) => {
        try {
            const response = await fetchWithAuth(`${API_BASE}/default`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }, thunkAPI.getState, thunkAPI.dispatch);
            const data = await response.json();
            if (!response.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tải địa chỉ mặc định');
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

export const setDefaultShippingAddress = createAsyncThunk(
    'shippingAddress/setDefaultShippingAddress',
    async (addressId, thunkAPI) => {
        try {
            const response = await fetchWithAuth(`${API_BASE}/${addressId}/default`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, thunkAPI.getState, thunkAPI.dispatch);
            const data = await response.json();
            if (!response.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi đặt địa chỉ mặc định');
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

export const deleteShippingAddress = createAsyncThunk(
    'shippingAddress/deleteShippingAddress',
    async (addressId, thunkAPI) => {
        try {
            const response = await fetchWithAuth(`${API_BASE}/${addressId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, thunkAPI.getState, thunkAPI.dispatch);
            const data = await response.json();
            if (!response.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi xóa địa chỉ giao hàng');
            }
            return { id: addressId, ...data };
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
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
        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload;
        },
        clearShippingAddresses: (state) => {
            state.AddressSave = [];
            state.defaultAddress = null;
            state.selectedAddress = null;
        }

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
            // set default
            .addCase(setDefaultShippingAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setDefaultShippingAddress.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
            
                // Cập nhật lại danh sách AddressSave: chỉ 1 địa chỉ có isDefault = true
                state.AddressSave = state.AddressSave.map(addr =>
                    addr._id === updated._id
                        ? { ...addr, isDefault: true }
                        : { ...addr, isDefault: false }
                );
            
                state.defaultAddress = updated; // gán vào default
            })
            .addCase(setDefaultShippingAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // delete
            .addCase(deleteShippingAddress.fulfilled, (state, action) => {
                state.AddressSave = state.AddressSave.filter(addr => addr._id !== action.payload.id);
              })
              

    }
});

export const selectShippingFee = (state) => {    
    return state.user.userShippingAddress.defaultAddress?.city?.fee || 0;
};

export const { setSelectedAddress, clearShippingAddresses } = shippingAddressSlice.actions;
export default shippingAddressSlice.reducer;
