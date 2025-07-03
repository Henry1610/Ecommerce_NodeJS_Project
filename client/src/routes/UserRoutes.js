import Cart from "../pages/User/Cart"
import OrderDetail from "../pages/User/Order/OrderDetail/OrderDetail";
import OrderSuccess from "../pages/User/Order/OrderSuccess/OrderSuccess";
import OrderHistory from "../pages/User/Order/OrderHistory/OrderHistory";
import UserProfile from '../pages/User/Profile';

const userRoutes = [
  { path: "/cart", component: Cart },
  { path: "/order-success", component: OrderSuccess },
  { path: "/order-detail/:orderNumber", component: OrderDetail },
  { path: "/order-history", component: OrderHistory },
  { path: "/profile", component: UserProfile },
];

export default userRoutes;
