import { createSlice } from '@reduxjs/toolkit';

// Try to hydrate from localStorage on first load so the user stays logged in across refreshes.
const loadInitial = () => {
  if (typeof window === 'undefined') return { token: null, user: null };
  try {
    const token = localStorage.getItem('gym_token');
    const user = localStorage.getItem('gym_user');
    return {
      token: token || null,
      user: user ? JSON.parse(user) : null,
    };
  } catch {
    return { token: null, user: null };
  }
};

const initialState = loadInitial();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('gym_token', action.payload.token);
      localStorage.setItem('gym_user', JSON.stringify(action.payload.user));
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('gym_user', JSON.stringify(state.user));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('gym_token');
      localStorage.removeItem('gym_user');
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
