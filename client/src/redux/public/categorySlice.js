import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all public categories
export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories', 
    async (_, thunkAPI) => {
        try {
            const res = await fetch('http://localhost:5000/api/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('Error fetching categories:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy danh sách category');
            }

            return data;
        } catch (error) {
            console.error('Network error fetching categories:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Fetch single category by slug
export const fetchCategoryBySlug = createAsyncThunk(
    'categories/fetchCategoryBySlug', 
    async (slug, thunkAPI) => {
        try {
            const res = await fetch(`http://localhost:5000/api/categories/public/${slug}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('Error fetching category:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy category');
            }

            return data;
        } catch (error) {
            console.error('Network error fetching category:', error);
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
