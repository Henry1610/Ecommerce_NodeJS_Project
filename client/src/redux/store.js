// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import productsReducer from './products/productsSlice'
import cartReducer from './cart/cartSlice'
import brandReducer from './brand/brandSlice'
import categoryReducer from './category/categoriesSlice'
import userSliceReducer from './user/userSlice'
import discountSliceReducer from './discount/discountSlice'
import shippingZoneReducer from './shippingZone/shippingZoneSlice';
import paymentReducer from './payment/paymentSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
    brands: brandReducer,
    categories:categoryReducer,
    users:userSliceReducer,
    discounts:discountSliceReducer,
    shippingZones: shippingZoneReducer,
    payment:paymentReducer

  },
});

export default store;
