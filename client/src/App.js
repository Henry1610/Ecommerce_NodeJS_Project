import './App.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import publicRoutes from './routes/PublicRoutes';
import userRoutes from './routes/UserRoutes';
import adminRoutes from './routes/AdminRoutes';
import UserLayout from './Layout/UserLayout';
import AdminLayout from './Layout/AdminLayout';
import ProtectedRoute from './routes/components/ProtectedRoute';
import ErrorPage from './components/ErrorPage';
import ForbiddenPage from './components/ForbiddenPage';

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
                <ProtectedRoute role="user">
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
        <Route path="*" element={<UserLayout><ErrorPage/></UserLayout>} />

        {/* Route cấm truy cập 403 */}
        <Route path="/forbidden" element={<UserLayout><ForbiddenPage/></UserLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
