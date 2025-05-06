import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component, role = "user" }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) return <Navigate to="/login" />;

  if (role === "admin" && user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default ProtectedRoute;
