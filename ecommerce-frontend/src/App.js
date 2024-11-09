import React from 'react';
import { 
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
  Link
} from 'react-router-dom';

// Layouts
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/layout/AdminLayout';

// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import ProductManager from './pages/admin/ProductManager';
import UserManager from './pages/admin/UserManager';
import OrderManager from './pages/admin/OrderManager';
import AdminSettings from './pages/admin/Settings'; // Renamed to avoid conflict
import NotFound from './pages/NotFound';
import Login from './pages/Login';

// Icons
import { Package, Users, ShoppingBag, Settings } from 'lucide-react';

// Context Providers
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Auth Guard Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Dashboard Card Component
const DashboardCard = ({ title, icon: Icon, link, color }) => {
  return (
    <Link
      to={link}
      className={`${color} p-6 rounded-lg shadow-md text-white hover:opacity-90 transition-opacity`}
    >
      <div className="flex items-center space-x-4">
        <Icon className="w-8 h-8" />
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm opacity-90">Manage {title.toLowerCase()}</p>
        </div>
      </div>
    </Link>
  );
};

// Router Configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products">
          <Route index element={<ProductList />} />
          <Route path=":id" element={<ProductDetail />} />
        </Route>
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route 
          index 
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard
                  title="Products"
                  icon={Package}
                  link="/admin/products"
                  color="bg-blue-500"
                />
                <DashboardCard
                  title="Users"
                  icon={Users}
                  link="/admin/users"
                  color="bg-green-500"
                />
                <DashboardCard
                  title="Orders"
                  icon={ShoppingBag}
                  link="/admin/orders"
                  color="bg-purple-500"
                />
                <DashboardCard
                  title="Settings"
                  icon={Settings}
                  link="/admin/settings"
                  color="bg-gray-500"
                />
              </div>
            </div>
          }
        />
        <Route path="products" element={<ProductManager />} />
        <Route path="users" element={<UserManager />} />
        <Route path="orders" element={<OrderManager />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

// Toast Notification Component
const Toaster = () => {
  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {/* Toast messages will be rendered here */}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;