import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts', async (_, thunkAPI) => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/products'
                , {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
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
            const res = await fetch(`http://localhost:5000/api/admin/products/${productId}`
                , {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                        , Authorization: `Bearer ${localStorage.getItem('token')}`

                    },

                }
            )
            const data = await res.json();

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
        reviews: [],
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
              
                if (action.payload && action.payload.product) {
                  const product = action.payload.product;
              
                  // Nếu sản phẩm có discount và chưa có discountedPrice thì tính luôn
                  if (product.discountPercent && product.discountPercent > 0 && !product.discountedPrice) {
                    product.discountedPrice = +(product.price * (1 - product.discountPercent / 100)).toFixed(2);
                  }
              
                  state.product = product;
                  state.reviews = action.payload.reviews || [];
                } else {
                  state.product = null;
                  state.reviews = [];
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