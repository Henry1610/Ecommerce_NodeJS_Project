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
    
    // { path: 'discount', component: Discount },
    // { path: 'discount/add', component: AddDiscount },
    // { path: 'discount/edit/:id', component: EditDiscount },

    
    // { path: 'order', component: OrderList },
    // { path: 'order/:id', component: OrderDetail },


    { path: 'payment', component: Payment },
    // { path: 'userlist', component: UserList },
    // { path: 'review', component: ReviewList },


];

export default adminRoutes;
