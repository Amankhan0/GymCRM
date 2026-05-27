import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'sonner';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Members from '@/pages/Members';
import Trainers from '@/pages/Trainers';
import Attendance from '@/pages/Attendance';
import Plans from '@/pages/Plans';
import Payments from '@/pages/Payments';
import Reports from '@/pages/Reports';
import Profile from '@/pages/Profile';
import Subscribe from '@/pages/Subscribe';
import SuperLogin from '@/pages/super/SuperLogin';
import SuperDashboard from '@/pages/super/SuperDashboard';

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

        {/* Hidden super-admin routes — password-protected, not in any sidebar */}
        <Route path="/super" element={<SuperLogin />} />
        <Route path="/super/dashboard" element={<SuperDashboard />} />

        {/* Subscription page is auth-gated but NOT subscription-gated — expired users need to reach it to renew */}
        <Route
          path="/subscribe"
          element={
            <ProtectedRoute>
              <Subscribe />
            </ProtectedRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
