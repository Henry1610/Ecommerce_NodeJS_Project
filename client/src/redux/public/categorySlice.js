import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/categories';

// Fetch all public categories
export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
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
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tải danh mục');
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Fetch single category by slug
export const fetchCategoryBySlug = createAsyncThunk(
    'categories/fetchCategoryBySlug', 
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
                return thunkAPI.rejectWithValue(data.message || 'Lỗi khi tải danh mục');
            }

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        category: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetCategoryDetail: (state) => {
            state.category = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all categories
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch single category by slug
            .addCase(fetchCategoryBySlug.pending, (state) => {
                state.loading = true;
                state.category = null;
                state.error = null;
            })
            .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
                state.loading = false;
                state.category = action.payload;
            })
            .addCase(fetchCategoryBySlug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetCategoryDetail } = categoriesSlice.actions;
export default categoriesSlice.reducer;
