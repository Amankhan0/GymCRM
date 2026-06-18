import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';

import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';
import Admin from './pages/Admin';

const GOOGLE_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function App() {
  useEffect(() => {
    document.title = 'Aether — AI Image & Video Studio';
  }, []);

  const tree = (
    <>
      <Toaster theme="dark" position="top-center" richColors toastOptions={{ style: { background: 'rgba(20,20,28,0.9)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(12px)' } }} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/app" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );

  // GoogleOAuthProvider is only needed when a client ID is configured.
  return GOOGLE_ID ? <GoogleOAuthProvider clientId={GOOGLE_ID}>{tree}</GoogleOAuthProvider> : tree;
}
