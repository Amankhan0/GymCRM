import { Menu, Sun, Moon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, toggleTheme } from '@/gym/store/slices/uiSlice';
import { ProfileDropdown } from './ProfileDropdown';

export function Navbar() {
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.ui.theme);
  const isDark = theme === 'dark';

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <button
        className="lg:hidden p-2 -ml-2 rounded-md hover:bg-accent"
        onClick={() => dispatch(toggleSidebar())}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      <button
        className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors mr-1"
        onClick={() => dispatch(toggleTheme())}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Light mode' : 'Dark mode'}
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <ProfileDropdown />
    </header>
  );
}
