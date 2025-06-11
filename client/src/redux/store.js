// src/redux/store.js
import { configureStore,combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import productsReducer from './public/productsSlice'
import cartReducer from './user/cartSlice'

import paymentReducer from './user/paymentSlice';
import shippingAddressReducer from './user/shippingAddressSlice';
import shippingZonesReducer from './public/shippingZoneSlice'



import adminBrandReducer from './admin/brandSlice'
import adminCategoryReducer from './admin/categoriesSlice'
import adminUserReducer from './admin/userSlice'
import adminDiscountReducer from './admin/discountSlice'
import adminShippingZoneReducer from './admin/shippingZoneSlice';
import adminProductReducer from './admin/productsSlice'

const publicReducer = combineReducers({
  publicShippingZones: shippingZonesReducer,
  publicProduct: productsReducer,

});
const userReducer = combineReducers({
  userCart: cartReducer,
  userPayment:paymentReducer,
  userShippingAddress:shippingAddressReducer

});
const adminReducer = combineReducers({
  adminProduct: adminProductReducer,
    adminCategory: adminCategoryReducer,
    adminBrand: adminBrandReducer,
    adminDiscounts: adminDiscountReducer,
    adminShippingZone: adminShippingZoneReducer,
    adminUser: adminUserReducer


});
const store = configureStore({
  reducer: {
    public:publicReducer,
    admin:adminReducer,
    user:userReducer,
    auth: authReducer,
  },
});

export default store;
