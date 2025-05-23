import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const res = await fetch('http://localhost:5000/api/admin/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`

            }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể lấy danh sách sản phẩm');
        return data;
    }
);

export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (productId, thunkAPI) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/products/${productId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            const data = await res.json();
            if (!res.ok) {
                console.error('Error fetching category:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy danh mục');
            }
            return data;
        }catch (error) {
            console.error('Network error fetching category:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

export const addProduct = createAsyncThunk(
    'products/addProduct',
    async (productData) => {
        const res = await fetch('http://localhost:5000/api/admin/products', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: productData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể thêm sản phẩm');
        return data;
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ productId, productData }) => {
        console.log('productIdSlice:',productId);
        
        const res = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: productData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể cập nhật sản phẩm');
        return data;
    }
);

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id) => {
        const res = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể xóa sản phẩm');
        return id; // trả về id đã xóa để cập nhật state
    }
);


const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        product: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetProductDetail(state) {
            state.product = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchProducts
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Lỗi khi tải danh sách sản phẩm';
            })
            // fetchProductById
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.productDetail = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Lỗi khi tải chi tiết sản phẩm';
            })
            // addProduct
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Lỗi khi thêm sản phẩm';
            })
            // updateProduct
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
                // Nếu chi tiết sản phẩm đang mở là cái được update thì cập nhật luôn
                if (state.productDetail && state.productDetail.product._id === action.payload._id) {
                    state.productDetail.product = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Lỗi khi cập nhật sản phẩm';
            })
            // deleteProduct
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(p => p._id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Lỗi khi xóa sản phẩm';
            });
    },
});

export const { resetProductDetail } = productsSlice.actions;
export default productsSlice.reducer;
