import { createSlice } from '@reduxjs/toolkit';

const loadTheme = () => (localStorage.getItem('b2b_theme') === 'dark' ? 'dark' : 'light');

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false, // mobile sidebar
    theme: loadTheme(),
  },
  reducers: {
    toggleSidebar(state) { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen(state, action) { state.sidebarOpen = !!action.payload; },
    setTheme(state, action) {
      state.theme = action.payload === 'dark' ? 'dark' : 'light';
      localStorage.setItem('b2b_theme', state.theme);
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('b2b_theme', state.theme);
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setTheme, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
