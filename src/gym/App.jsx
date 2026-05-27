import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'sonner';

import { DashboardLayout } from '@/gym/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/gym/components/common/ProtectedRoute';

import Login from '@/gym/pages/Login';
import Signup from '@/gym/pages/Signup';
import Dashboard from '@/gym/pages/Dashboard';
import Members from '@/gym/pages/Members';
import Trainers from '@/gym/pages/Trainers';
import Attendance from '@/gym/pages/Attendance';
import Plans from '@/gym/pages/Plans';
import Payments from '@/gym/pages/Payments';
import Reports from '@/gym/pages/Reports';
import Profile from '@/gym/pages/Profile';
import SuperLogin from '@/pages/super/SuperLogin';
import SuperDashboard from '@/pages/super/SuperDashboard';
import { SubscriptionDialog } from '@/gym/components/subscription/SubscriptionDialog';

export default function App() {
  const theme = useSelector((s) => s.ui.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <>
      <Toaster position="top-right" richColors theme={theme} />
      <SubscriptionDialog />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Hidden super-admin routes — password-protected, not in any sidebar */}
        <Route path="/super" element={<SuperLogin />} />
        <Route path="/super/dashboard" element={<SuperDashboard />} />

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
