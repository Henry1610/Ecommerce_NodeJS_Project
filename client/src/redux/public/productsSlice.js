import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts', async (_, thunkAPI) => {
        try {
            const res = await fetch('http://localhost:5000/api/products'
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

            return data;
        } catch (error) {
            console.error('Network error fetching products:', error);
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
)
export const fetchProductBySlug = createAsyncThunk(
    'products/fetchProductById', async (slug, thunkAPI) => {

        try {
            const res = await fetch(`http://localhost:5000/api/products/${slug}`
                , {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                        , Authorization: `Bearer ${localStorage.getItem('token')}`

                    },

                }
            )
            const data = await res.json();
            console.log('da:',data);
            
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
                state.products = action.payload.data;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch single product by ID
            .addCase(fetchProductBySlug.pending, (state) => {
                state.loading = true;
                state.product = null; // Reset product when starting a new fetch
                state.error = null;
            })
            .addCase(fetchProductBySlug.fulfilled, (state, action) => {
                                   
                  state.product = action.payload.data.product;
                  state.reviews = action.payload.data.reviews;

                  state.loading = false;
               
              })
              
            .addCase(fetchProductBySlug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetProductDetail } = productsSlice.actions;
export default productsSlice.reducer;