import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = process.env.REACT_APP_SERVER_URL + '/api/admin/categories';

// Fetch all categories
export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, thunkAPI) => {
        try {
            const res = await fetch(API_BASE, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`

                }
            });
            const data = await res.json();
            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy danh sách danh mục');
            }
            return data;
        } catch (error) {
            console.error('Network error fetching categories:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Fetch category by ID
export const fetchCategoryById = createAsyncThunk(
    'categories/fetchCategoryById',
    async (id, thunkAPI) => {
        try {
            const res = await fetch(`${API_BASE}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`

                }
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('Error fetching category:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy danh mục');
            }
            return data;
        } catch (error) {
            console.error('Network error fetching category:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Add new category
export const addCategory = createAsyncThunk(
    'categories/addCategory',
    async ({ name, description }, thunkAPI) => {
        try {
            const res = await fetch(API_BASE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`

                },
                body: JSON.stringify({ name, description })
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('Error adding category:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể thêm danh mục');
            }
            return data;
        } catch (error) {
            console.error('Network error adding category:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

// Update category
    export const updateCategory = createAsyncThunk(
        'categories/updateCategory',
        async ({ categoryId, formData }, thunkAPI) => {
            
            try {
                const res = await fetch(`${API_BASE}/${categoryId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`

                    },
                    body: JSON.stringify(formData )
                });
                const data = await res.json();
                if (!res.ok) {
                    console.error('Error updating category:', data);
                    return thunkAPI.rejectWithValue(data.message || 'Không thể cập nhật danh mục');
                }
                return data;
            } catch (error) {
                console.error('Network error updating category:', error);
                return thunkAPI.rejectWithValue('Lỗi kết nối server');
            }
        }
    );

// Delete category
export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (id, thunkAPI) => {
        
        try {
            const res = await fetch(`${API_BASE}/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('Error deleting category:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể xóa danh mục');
            }
            return {  message: data.message,id };
        } catch (error) {
            console.error('Network error deleting category:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

const categorySlice = createSlice({
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
            state.loading = false;

        }
    },
    extraReducers: (builder) => {
        builder
            // fetchCategories
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

            // fetchCategoryById
            .addCase(fetchCategoryById.pending, (state) => {
                state.loading = true;
                state.category = null;
                state.error = null;
            })
            .addCase(fetchCategoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.category = action.payload;
            })
            .addCase(fetchCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.category = null;
            })

            // addCategory
            .addCase(addCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // updateCategory
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex(cat => cat._id === action.payload._id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
                if (state.category && state.category._id === action.payload._id) {
                    state.category = action.payload;
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // deleteCategory
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter(cat => cat._id !== action.payload.id);
                if (state.category && state.category._id === action.payload.id) {
                    state.category = null;
                }
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { resetCategoryDetail } = categorySlice.actions;
export default categorySlice.reducer;
