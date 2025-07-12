import AboutUs from "../pages/User/AboutUs"
import Contact from "../pages/User/Contact"
import Login from "../pages/Auth/Login/Login"
import Product from "../pages/User/Product"
import Register from "../pages/Auth/Register/Register"
import Home from "../pages/User/Home/Home"
import ProductDetail from "../pages/User/ProductDetail/ProductDetail"
import ResetPassword from '../pages/Auth/ResetPassword'
import NewPassword from '../pages/Auth/ResetPassword/NewPassword'
import AddressStore from '../pages/User/AddressStore';

const publicRoutes = [
    { path: "/about-us", component: AboutUs },
    { path: "/product", component: Product },
    { path: "/product/:slug", component: ProductDetail },
    { path: "/contact", component: Contact },
    { path: "/store-address", component: AddressStore },
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/reset-password", component: ResetPassword },
    { path: "/reset-password/:token", component: NewPassword },
]
export default publicRoutes