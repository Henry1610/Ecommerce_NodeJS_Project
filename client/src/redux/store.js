// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import productsReducer from './products/productsSlice'
const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
  },
});

export default store;
