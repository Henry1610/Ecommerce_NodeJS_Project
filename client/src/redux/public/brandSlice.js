import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all public brands
export const fetchBrands = createAsyncThunk(
    'brands/fetchBrands', 
    async (_, thunkAPI) => {
        try {
            const res = await fetch('http://localhost:5000/api/brands', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('Error fetching brands:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy danh sách brand');
            }

            return data;
        } catch (error) {
            console.error('Network error fetching brands:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Fetch single brand by slug
export const fetchBrandBySlug = createAsyncThunk(
    'brands/fetchBrandBySlug', 
    async (slug, thunkAPI) => {
        try {
            const res = await fetch(`http://localhost:5000/api/brands/public/${slug}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('Error fetching brand:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy brand');
            }

            return data;
        } catch (error) {
            console.error('Network error fetching brand:', error);
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
