import { Menu, Moon, Sun, LogOut, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleSidebar, toggleTheme } from '../../store/slices/uiSlice';
import { useAuth } from '../../hooks/useAuth';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/shared/components/Avatar';

export function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useSelector((s) => s.ui.theme);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 border-b bg-card flex items-center px-4 lg:px-6 gap-2 sticky top-0 z-20">
      {/* Mobile menu trigger */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="lg:hidden p-2 -ml-2 rounded-md hover:bg-accent"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      {/* Theme toggle */}
      <button
        onClick={() => dispatch(toggleTheme())}
        className="p-2 rounded-md hover:bg-accent"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      {/* User dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 p-1 pr-2 rounded-md hover:bg-accent">
          <Avatar name={user?.name} size="sm" />
          <div className="hidden sm:flex flex-col items-start min-w-0">
            <span className="text-sm font-medium truncate max-w-[140px]">{user?.name}</span>
            <span className="text-[10px] text-muted-foreground capitalize">{user?.role}</span>
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="font-medium">{user?.name}</div>
            <div className="text-xs text-muted-foreground font-normal truncate">{user?.email}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Profile (soon)</DropdownMenuItem>
          <DropdownMenuItem disabled>Settings (soon)</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
