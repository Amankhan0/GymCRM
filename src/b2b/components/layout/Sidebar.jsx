import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, UserPlus, FileText, ShoppingCart, Truck, Users, Building2,
  Package, FilePlus, FileSpreadsheet, Receipt, BarChart3, Settings, X,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '@/lib/utils';

// Sidebar items grouped roughly by frequency-of-use.
// `disabled: true` items render greyed-out so the user can see the roadmap but can't navigate
// to half-finished pages while we build them out module by module.
const NAV = [
  { to: '/dashboard',         label: 'Dashboard',          icon: LayoutDashboard },
  { to: '/leads',             label: 'Leads',              icon: UserPlus,          disabled: true },
  { to: '/quotations',        label: 'Quotations',         icon: FileText,          disabled: true },
  { to: '/orders',            label: 'Orders',             icon: ShoppingCart,      disabled: true },
  { to: '/dispatch',          label: 'Dispatch',           icon: Truck,             disabled: true },
  { to: '/customers',         label: 'Customers',          icon: Users,             disabled: true },
  { to: '/suppliers',         label: 'Suppliers',          icon: Building2,         disabled: true },
  { to: '/products',          label: 'Products',           icon: Package,           disabled: true },
  { to: '/purchase-orders',   label: 'Purchase Orders',    icon: FilePlus,          disabled: true },
  { to: '/proforma-invoices', label: 'Proforma Invoices',  icon: FileSpreadsheet,   disabled: true },
  { to: '/invoices',          label: 'Invoices',           icon: Receipt,           disabled: true },
  { to: '/reports',           label: 'Reports',            icon: BarChart3,         disabled: true },
];

export function Sidebar() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);

  const close = () => dispatch(setSidebarOpen(false));

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r flex flex-col transform transition-transform lg:transform-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand */}
        <div className="h-16 px-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user?.company?.name?.charAt(0)?.toUpperCase() || 'B'}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{user?.company?.name || 'B2B CRM'}</p>
              <p className="text-[10px] text-muted-foreground">Business CRM</p>
            </div>
          </div>
          <button onClick={close} className="lg:hidden p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            if (item.disabled) {
              return (
                <div
                  key={item.to}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground/60 cursor-not-allowed"
                  title="Coming soon"
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  <span className="text-[9px] uppercase tracking-wide bg-muted px-1.5 py-0.5 rounded">Soon</span>
                </div>
              );
            }
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={close}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer: Settings (always available) */}
        <div className="p-3 border-t">
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground/60 cursor-not-allowed"
            title="Coming soon"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </div>
        </div>
      </aside>
    </>
  );
}
