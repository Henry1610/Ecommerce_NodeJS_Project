// src/redux/store.js
import { configureStore,combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import productsReducer from './products/productsSlice'
import productReducer from './product/productsSlice'
import cartReducer from './cart/cartSlice'
import brandReducer from './brand/brandSlice'
import categoryReducer from './category/categoriesSlice'
import userSliceReducer from './user/userSlice'
import discountSliceReducer from './discount/discountSlice'
import shippingZoneReducer from './shippingZone/shippingZoneSlice';
import paymentReducer from './payment/paymentSlice';
import shippingAddressReducer from './shippingAddress/shippingAddressSlice';
import shippingZonesReducer from './public/shippingZoneSlice'
const publicReducer = combineReducers({
  publicShippingZones: shippingZonesReducer,
});
const userReducer = combineReducers({
  publicShippingZones: shippingZonesReducer,
});
const adminReducer = combineReducers({
  publicShippingZones: shippingZonesReducer,
});
const store = configureStore({
  reducer: {
    public:publicReducer,
    products: productsReducer,
    product: productReducer,
    auth: authReducer,
    cart: cartReducer,
    brands: brandReducer,
    categories:categoryReducer,
    users:userSliceReducer,
    discounts:discountSliceReducer,
    shippingZones: shippingZoneReducer,
    payment:paymentReducer,
    shippingAddress:shippingAddressReducer
  },
});

export default store;
