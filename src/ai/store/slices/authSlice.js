import { createSlice } from '@reduxjs/toolkit';

const loadUser = () => {
  try {
    return JSON.parse(localStorage.getItem('ai_user')) || null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadUser(),
    token: localStorage.getItem('ai_token') || null,
  },
  reducers: {
    setAuth(state, { payload }) {
      state.user = payload.user;
      state.token = payload.token;
      localStorage.setItem('ai_token', payload.token);
      localStorage.setItem('ai_user', JSON.stringify(payload.user));
    },
    setUser(state, { payload }) {
      state.user = payload;
      localStorage.setItem('ai_user', JSON.stringify(payload));
    },
    // Convenience for live credit updates after a generation.
    setCredits(state, { payload }) {
      if (state.user) {
        state.user = { ...state.user, credits: payload };
        localStorage.setItem('ai_user', JSON.stringify(state.user));
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('ai_token');
      localStorage.removeItem('ai_user');
    },
  },
});

export const { setAuth, setUser, setCredits, logout } = authSlice.actions;
export default authSlice.reducer;
