import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction, setCredentials } from '@/store/slices/authSlice';

export function useAuth() {
  const { user, token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  return {
    user,
    token,
    isAuthenticated: !!token,
    role: user?.role,
    setCredentials: (payload) => dispatch(setCredentials(payload)),
    logout: () => dispatch(logoutAction()),
  };
}
