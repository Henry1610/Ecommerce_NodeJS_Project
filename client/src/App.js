import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
              element={<UserLayout><Page /></UserLayout>}
            />
          );
        })}

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {adminRoutes.map((route, index) => {
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}  
                element={
                  <ProtectedRoute role="admin">
                    <AdminLayout>
                      <Page />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
            );
          })}
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
