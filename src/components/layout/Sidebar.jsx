import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  UserCog,
  ClipboardCheck,
  CreditCard,
  Receipt,
  Dumbbell,
  X,
} from 'lucide-react';
import { setSidebarOpen } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/members', label: 'Members', icon: Users },
  { to: '/trainers', label: 'Trainers', icon: UserCog },
  { to: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { to: '/plans', label: 'Membership Plans', icon: CreditCard },
  { to: '/payments', label: 'Payments', icon: Receipt },
];

export function Sidebar() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);
  const { user } = useAuth();
  const gymName = user?.gymName || 'My Gym';

  const closeMobile = () => dispatch(setSidebarOpen(false));

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r flex flex-col transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
              <Dumbbell className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg truncate" title={`${gymName} CRM`}>
              {gymName} <span className="text-muted-foreground font-normal">CRM</span>
            </span>
          </div>
          <button className="lg:hidden shrink-0 ml-2" onClick={closeMobile}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t text-xs text-muted-foreground">
          © {new Date().getFullYear()} GymCRM
        </div>
      </aside>
    </>
  );
}
