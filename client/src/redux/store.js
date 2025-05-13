// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import productsReducer from './products/productsSlice'
import cartReducer from './cart/cartSlice'

const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart:cartReducer
  },
});

export default store;
