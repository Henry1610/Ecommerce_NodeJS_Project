import Cart from "../pages/User/Cart"
import OrderDetail from "../pages/User/Order/OrderDetail/OrderDetail";
import OrderSuccess from "../pages/User/Order/OrderSuccess/OrderSuccess";
// import OrderHistory from "../pages/User/Order/OrderHistory/OrderHistory";

const userRoutes = [
  { path: "/cart", component: Cart },
  { path: "/order-success", component: OrderSuccess },
  { path: "/order-detail", component: OrderDetail },
  // { path: "/order-history", component: OrderHistory },
];

export default userRoutes;
