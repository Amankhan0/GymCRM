import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction, setCredentials } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);
  return {
    token,
    user,
    isAuthenticated: !!token,
    setCredentials: (payload) => dispatch(setCredentials(payload)),
    logout: () => dispatch(logoutAction()),
  };
};
