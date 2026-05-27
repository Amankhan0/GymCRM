import { createSlice } from '@reduxjs/toolkit';

const loadTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return localStorage.getItem('gym_theme') === 'dark' ? 'dark' : 'light';
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    theme: loadTheme(),
    subscriptionDialogOpen: false,
  },
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    setTheme(state, action) {
      state.theme = action.payload === 'dark' ? 'dark' : 'light';
      localStorage.setItem('gym_theme', state.theme);
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('gym_theme', state.theme);
    },
    setSubscriptionDialogOpen(state, action) {
      state.subscriptionDialogOpen = !!action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  toggleTheme,
  setSubscriptionDialogOpen,
} = uiSlice.actions;
export default uiSlice.reducer;
