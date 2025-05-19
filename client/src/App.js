import './App.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import publicRoutes from './routes/PublicRoutes';
import userRoutes from './routes/UserRoutes';
import adminRoutes from './routes/AdminRoutes';
import UserLayout from './Layout/UserLayout';
import AdminLayout from './Layout/AdminLayout';
import ProtectedRoute from './routes/components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map((route, index) => {
          const Page = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={<UserLayout><Page /></UserLayout>}
            />
          );
        })}

        {/* User Routes */}
        {userRoutes.map((route, index) => {
          const Page = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <ProtectedRoute>
                  <UserLayout><Page /></UserLayout>
                </ProtectedRoute>
              }
            />
          );
        })}

        {/* Admin Routes - Sử dụng cấu trúc nested routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </ProtectedRoute>
          }
        >
          {/* Route mặc định cho /admin */}
          <Route index element={<div>Chào mừng đến với trang quản trị</div>} />

          {/* Các route con của admin */}
          {adminRoutes.map((route, index) => {
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={<Page />}
              />
            );
          })}
        </Route>

        {/* Route bắt lỗi 404 */}
        <Route path="*" element={<UserLayout><div>Không tìm thấy trang</div></UserLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
