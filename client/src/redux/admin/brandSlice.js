import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from '../../utils/tokenUtils';

const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/admin/brands';

// Fetch all brands
export const fetchBrands = createAsyncThunk(
    'brands/fetchBrands',
    async (_, thunkAPI) => {
        try {
            const res = await fetchWithAuth(API_BASE, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, thunkAPI.getState, thunkAPI.dispatch);
            const data = await res.json();
            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy danh sách thương hiệu');
            }
            return data;
        } catch (error) {
            console.error('Network error fetching brands:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Fetch brand by ID
export const fetchBrandById = createAsyncThunk(
    'brands/fetchBrandById',
    async (brandId, thunkAPI) => {
        try {
            const res = await fetchWithAuth(`${API_BASE}/${brandId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, thunkAPI.getState, thunkAPI.dispatch);
            const data = await res.json();
            if (!res.ok) {
                console.error('Error fetching brand:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy thương hiệu');
            }
            return data;
        } catch (error) {
            console.error('Network error fetching brand:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Add new brand
export const addBrand = createAsyncThunk(
    'brands/addBrand',
    async ({ name, description }, thunkAPI) => {
        try {
            const res = await fetchWithAuth(API_BASE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, description })
            }, thunkAPI.getState, thunkAPI.dispatch);
            const data = await res.json();
            if (!res.ok) {
                console.error('Error adding brand:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể thêm thương hiệu');
            }
            return data;
        } catch (error) {
            console.error('Network error adding brand:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Update brand
export const updateBrand = createAsyncThunk(
    'brands/updateBrand',
    async ({ brandId, formData }, thunkAPI) => {
        try {
            const res = await fetchWithAuth(`${API_BASE}/${brandId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }, thunkAPI.getState, thunkAPI.dispatch);
            const data = await res.json();
            if (!res.ok) {
                console.error('Error updating brand:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể cập nhật thương hiệu');
            }
            return data;
        } catch (error) {
            console.error('Network error updating brand:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Delete brand
export const removeBrand = createAsyncThunk(
    'brands/removeBrand',
    async (brandId, thunkAPI) => {
        try {
            const res = await fetchWithAuth(`${API_BASE}/${brandId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, thunkAPI.getState, thunkAPI.dispatch);
            const data = await res.json();
            if (!res.ok) {
                console.error('Error removing brand:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể xóa thương hiệu');
            }
            return { message: data.message, brandId };
        } catch (error) {
            console.error('Network error deleting brand:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);


const brandSlice = createSlice({
    name: 'brands',
    initialState: {
        brands: [],
        brand: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetBrandDetail: (state) => {
            state.brand = null;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchBrands
            .addCase(fetchBrands.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.loading = false;
                state.brands = action.payload;
            })
            .addCase(fetchBrands.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetchBrandById
            .addCase(fetchBrandById.pending, (state) => {
                state.loading = true;
                state.brand = null;
                state.error = null;
            })
            .addCase(fetchBrandById.fulfilled, (state, action) => {
                state.loading = false;
                state.brand = action.payload;
            })
            .addCase(fetchBrandById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.brand = null;
            })

            // addBrand
            .addCase(addBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBrand.fulfilled, (state, action) => {
                state.loading = false;
                state.brands.push(action.payload);
            })
            .addCase(addBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // updateBrand
            .addCase(updateBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBrand.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.brands.findIndex(brand => brand._id === action.payload._id);
                if (index !== -1) {
                    state.brands[index] = action.payload;
                }
                if (state.brand && state.brand._id === action.payload._id) {
                    state.brand = action.payload;
                }
            })
            .addCase(updateBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // deleteBrand
            .addCase(removeBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeBrand.fulfilled, (state, action) => {
                state.loading = false;
                state.brands = state.brands.filter(brand => brand._id !== action.payload.id);
                if (state.brand && state.brand._id === action.payload.id) {
                    state.brand = null;
                }
            })
            .addCase(removeBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { resetBrandDetail } = brandSlice.actions;
export default brandSlice.reducer;