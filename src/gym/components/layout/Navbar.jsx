import { Menu } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '@/gym/store/slices/uiSlice';
import { ProfileDropdown } from './ProfileDropdown';

export function Navbar() {
  const dispatch = useDispatch();
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

      <ProfileDropdown />
    </header>
  );
}
