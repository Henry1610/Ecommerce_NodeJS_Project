import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/brands';

// Fetch all public brands
export const fetchBrands = createAsyncThunk(
    'brands/fetchBrands', 
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
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tải thương hiệu');
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Fetch single brand by slug
export const fetchBrandBySlug = createAsyncThunk(
    'brands/fetchBrandBySlug', 
    async (slug, thunkAPI) => {
        try {
            const response = await fetch(`${API_BASE}/${slug}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tải thương hiệu');
            }

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

const brandsSlice = createSlice({
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
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all brands
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

            // Fetch single brand by slug
            .addCase(fetchBrandBySlug.pending, (state) => {
                state.loading = true;
                state.brand = null;
                state.error = null;
            })
            .addCase(fetchBrandBySlug.fulfilled, (state, action) => {
                state.loading = false;
                state.brand = action.payload;
            })
            .addCase(fetchBrandBySlug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetBrandDetail } = brandsSlice.actions;
export default brandsSlice.reducer;
