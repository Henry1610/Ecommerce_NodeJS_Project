// src/redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
//---------------------Auth-------------------------
import authReducer from './auth/authSlice';

//---------------------User-------------------------

import userCartReducer from './user/cartSlice'
import userPaymentReducer from './user/paymentSlice';
import userShippingAddressReducer from './user/shippingAddressSlice';
import userOrderReducer from './user/orderSlice'
import userUserReducer from './user/userSlice'
import userReviewReducer from './user/reviewSlice'
import userProfileReducer from './user/userSlice';
import userWishlistReducer from './user/wishlistSlice';
//---------------------public-------------------------
import productsReducer from './public/productsSlice'
import shippingZonesReducer from './public/shippingZoneSlice'
import brandReducer from './public/brandSlice'
import categoryReducer from './public/categorySlice'
import discountReducer from './public/discountSlice'
import reviewReducer from './public/reviewSlice'
import compareReducer from './public/compareSlice';
//---------------------admin-------------------------
import adminBrandReducer from './admin/brandSlice'
import adminCategoryReducer from './admin/categoriesSlice'
import adminUserReducer from './admin/userSlice'
import adminDiscountReducer from './admin/discountSlice'
import adminShippingZoneReducer from './admin/shippingZoneSlice';
import adminProductReducer from './admin/productsSlice'
import adminOrderReducer from './admin/orderSlice'
import adminPaymentReducer from './admin/paymentSlice'
import adminAdminReducer from './admin/adminSlice'
import adminReviewReducer from './admin/reviewSlice'
const publicReducer = combineReducers({
  publicShippingZones: shippingZonesReducer,
  publicProduct: productsReducer,
  publicBrand: brandReducer,
  publicCategory: categoryReducer,
  publicDiscount: discountReducer,
  publicReview: reviewReducer,
  compare: compareReducer,
});
const userReducer = combineReducers({
  userCart: userCartReducer,
  userPayment: userPaymentReducer,
  userShippingAddress: userShippingAddressReducer,
  userOrder:userOrderReducer,
  userUser:userUserReducer,
  userReview:userReviewReducer,
  userProfile: userProfileReducer,
  userWishlist: userWishlistReducer,
});
const adminReducer = combineReducers({
  adminProduct: adminProductReducer,
  adminCategory: adminCategoryReducer,
  adminBrand: adminBrandReducer,
  adminDiscounts: adminDiscountReducer,
  adminShippingZone: adminShippingZoneReducer,
  adminUser: adminUserReducer,
  adminOrder:adminOrderReducer,
  adminPayment:adminPaymentReducer,
  adminAdmin:adminAdminReducer,
  adminReviews: adminReviewReducer
});
const store = configureStore({
  reducer: {
    public: publicReducer,
    admin: adminReducer,
    user: userReducer,
    auth: authReducer,
  },
});

export default store;
