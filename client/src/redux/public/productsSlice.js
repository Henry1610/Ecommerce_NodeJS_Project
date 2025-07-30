import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (params = {}, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            console.log(query);

            const url = `${process.env.REACT_APP_SERVER_URL}/api/products/filter?${query}`;

            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Không thể lấy danh sách sản phẩm');
            }

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);

export const fetchProductBySlug = createAsyncThunk(
    'products/fetchProductBySlug', async ({ slug, rating }, thunkAPI) => {

        try {

            const queryParams = new URLSearchParams();
            if (rating) queryParams.append('rating', rating);
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/products/${slug}?${queryParams.toString()}`
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
export const getProductSuggestions = createAsyncThunk(
    'products/getProductSuggestions',
    async (keyword, thunkAPI) => {
        try {
            const query = new URLSearchParams({ keyword, limit: 10 }).toString();
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/products/suggestions?${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Không thể gợi ý sản phẩm');
            }

            return data.suggestions;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);
// Like hoặc Unlike review
export const likeOrUnlikeReview = createAsyncThunk(
    'reviews/likeOrUnlikeReview',
    async (reviewId, thunkAPI) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/reviews/like/${reviewId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Không thể like review');
            }
            return { reviewId, likes: data.likes, likeCount: data.likeCount };
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi kết nối server');
        }
    }
);
const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        productSuggestions: [],
        reviews: [],
        product: null,
        total: 0,
        totalPages: 1,
        currentPage: 1,
        loading: false,
        error: null,
    },
    reducers: {
        resetProductDetail: (state) => {
            state.product = null;
            state.error = null;
        },
        resetSuggestions: (state) => {
            state.productSuggestions = [];
        },
    }
    ,
    extraReducers: (builder) => {
        builder
            // Fetch all products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.total = action.payload.total;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })

            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch single product by ID
            .addCase(fetchProductBySlug.pending, (state) => {
                state.loading = true;
                state.product = null;
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
            })
            .addCase(getProductSuggestions.pending, (state) => {
                state.productSuggestions = [];
                state.error = null;
            })
            .addCase(getProductSuggestions.fulfilled, (state, action) => {
                state.loading = false;
                state.productSuggestions = action.payload;
            })
            .addCase(getProductSuggestions.rejected, (state, action) => {
                state.productSuggestions = [];
                state.error = action.payload;
            })
            .addCase(likeOrUnlikeReview.fulfilled, (state, action) => {
                const { reviewId, likes, likeCount } = action.payload;

                const review = state.reviews.find(r => r._id === reviewId);
                if (review) {
                    review.likes = likes;         // server đã xử lý like/unlike chuẩn rồi
                    review.likeCount = likeCount; // cập nhật lại tổng số like
                }
            })


    },
});

export const { resetProductDetail, resetSuggestions } = productsSlice.actions;
export default productsSlice.reducer;