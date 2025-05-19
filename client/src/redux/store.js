// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import productsReducer from './products/productsSlice'
import cartReducer from './cart/cartSlice'
import brandReducer from './brand/brandSlice'
import categoryReducer from './category/categoriesSlice'
const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
    brands: brandReducer,
    categories:categoryReducer
  },
});

export default store;
