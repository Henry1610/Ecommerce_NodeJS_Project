import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts', async (_, thunkAPI) => {
        try {
            console.log('Fetching products list...');
            const res = await fetch('http://localhost:5000/api/users/products'
                , {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            const data = await res.json();
            
            if (!res.ok) {
                console.error('Error fetching products:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy danh sách sản phẩm')
            }
            
            console.log('Products fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('Network error fetching products:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
)

export const fetchProductById = createAsyncThunk(
    'products/fetchProductById', async (productId, thunkAPI) => {
        try {
            console.log('Fetching product by ID:', productId);
            const res = await fetch(`http://localhost:5000/api/users/products/${productId}`
                , {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            const data = await res.json();
            console.log('Product data received:', data);

            if (!res.ok) {
                console.error('Error fetching product:', data);
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy sản phẩm');
            }

            return data;
        } catch (error) {
            console.error('Network error fetching product:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
)

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        product: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetProductDetail: (state) => {
            state.product = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all products
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
                state.error = action.payload;
            })

            // Fetch single product by ID
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.product = null; // Reset product when starting a new fetch
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                
                // Nếu có dữ liệu sản phẩm, tính toán thêm các thông tin cần thiết
                if (action.payload) {
                    const product = action.payload;
                    
                    // Nếu sản phẩm có trường discount nhưng không có trường discountedPrice
                    if (product.discount && product.discount > 0 && !product.discountedPrice) {
                        product.discountedPrice = +(product.price * (1 - product.discount / 100)).toFixed(2);
                    }
                    
                    state.product = product;
                } else {
                    state.product = action.payload;
                }
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetProductDetail } = productsSlice.actions;
export default productsSlice.reducer;