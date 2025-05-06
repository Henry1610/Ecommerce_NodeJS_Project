import AboutUs from "../pages/User/AboutUs"
import Contact from "../pages/User/Contact"
import Login from "../pages/Auth/Login/Login"
import Product from "../pages/User/Product"
import Register from "../pages/Auth/Register/Register"
import Home from "../pages/User/Home/Home"
const publicRoutes = [
    { path: "/about-us", component: AboutUs },
    { path: "/product", component: Product },
    { path: "/contact", component: Contact },
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    
 
 
 ]
 export default publicRoutes