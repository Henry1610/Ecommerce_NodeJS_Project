import AddProduct from "../pages/Admin/Product/AddProduct/AddProduct";
import CategoryList from "../pages/Admin/Category/CategoryList/CategoryList";
import Dashboard from "../pages/Admin/Dashboard";
import ProductList from "../pages/Admin/Product/ProductList";
import AddBrand from "../pages/Admin/Brand/AddBrand";
import EditBrand from "../pages/Admin/Brand/EditBrand";
import AddCategory from "../pages/Admin/Category/AddCategory";
import EditProduct from "../pages/Admin/Product/EditProduct";
import EditCategory from "../pages/Admin/Category/EditCategory";
import Payment from "../pages/Admin/Payment";
import ProductDetail from "../pages/Admin/Product/ProductDetail";
import BrandList from "../pages/Admin/Brand/BrandList";
import UserList from "../pages/Admin/UserList/UserList";
import DiscountList from "../pages/Admin/Discount/DiscountList/Discount";
import AddDiscount from "../pages/Admin/Discount/AddDiscount/AddDiscount";
import EditDiscount from "../pages/Admin/Discount/EditDiscount/EditDiscount";
import ShippingZoneList from "../pages/Admin/ShippingZone/ShippingZoneList";
import OrderList from "../pages/Admin/Order/OrderList/OrderList";
import OrderDetail from "../pages/Admin/Order/OrderDetail";
import RefundOrder from "../pages/Admin/Order/RefundOrder";
import AdminProfile from '../pages/Admin/Profile/AdminProfile';
import ReviewList from "../pages/Admin/ReviewList/ReviewList";
const adminRoutes = [
    { path: 'dashboard', component: Dashboard },

    { path: 'product', component: ProductList },
    { path: 'product/:id', component: ProductDetail },
    { path: 'product/add', component: AddProduct },
    { path: 'product/edit/:id', component: EditProduct },

    { path: 'brand', component:BrandList  },
    { path: 'brand/add', component: AddBrand },
    { path: 'brand/edit/:id', component: EditBrand },

    { path: 'category/edit/:id', component:EditCategory  },
    { path: 'category', component: CategoryList },
    { path: 'category/add', component: AddCategory },
    
    { path: 'discount', component: DiscountList },
    { path: 'discount/add', component: AddDiscount },
    { path: 'discount/edit/:id', component: EditDiscount },

    
    { path: 'order', component: OrderList },
    { path: 'order/:orderNumber', component: OrderDetail },
    { path: 'order/refund-request', component: RefundOrder },


    { path: 'payment', component: Payment },
    { path: 'user', component: UserList },

    { path: 'shipping-zones', component: ShippingZoneList },
    { path: 'reviews', component: ReviewList },

    { path: 'profile', component: AdminProfile },
];

export default adminRoutes;
