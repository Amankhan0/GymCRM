import { createSlice } from '@reduxjs/toolkit';

// Storage keys are b2b-prefixed so they don't collide with gym keys when running both products
// on different subdomains that may share localStorage during local dev.
const TOKEN_KEY = 'b2b_token';
const USER_KEY = 'b2b_user';

const loadUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem(TOKEN_KEY) || null,
    user: loadUser(),
  },
  reducers: {
    setCredentials(state, action) {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    updateUser(state, action) {
      state.user = { ...(state.user || {}), ...action.payload };
      localStorage.setItem(USER_KEY, JSON.stringify(state.user));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
