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
  },
});

export const { toggleSidebar, setSidebarOpen, setTheme, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
