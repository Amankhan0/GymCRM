import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'sonner';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Products from './pages/Products';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

export default function App() {
  const theme = useSelector((s) => s.ui.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <>
      <Toaster position="top-right" richColors theme={theme} />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Phase 2: masters */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/products"  element={<Products />} />
          {/* Phase 3+: leads, quotations, orders, dispatch, invoices, etc. */}
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
