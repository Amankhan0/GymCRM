import { UserPlus, FileText, ShoppingCart, Truck, IndianRupee, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../hooks/useAuth';

// Phase 1 dashboard is a layout placeholder — once Leads/Orders/etc. modules land in later
// phases we'll wire real numbers. Stat cards already in place so the shell looks complete.
const STATS = [
  { label: 'Total Leads',      value: 0, icon: UserPlus,     tone: 'text-indigo-600' },
  { label: 'Quotations',       value: 0, icon: FileText,     tone: 'text-purple-600' },
  { label: 'Orders',           value: 0, icon: ShoppingCart, tone: 'text-emerald-600' },
  { label: 'Pending Dispatch', value: 0, icon: Truck,        tone: 'text-amber-600' },
  { label: 'Revenue (MTD)',    value: '₹0', icon: IndianRupee, tone: 'text-rose-600' },
  { label: 'Activities',       value: 0, icon: Activity,    tone: 'text-cyan-600' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back{firstName ? `, ${firstName}` : ''} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Here's what's happening at {user?.company?.name || 'your business'} today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${s.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Get started</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your workspace is ready. Modules (Leads, Quotations, Orders, etc.) will light up as we
            roll them out in upcoming phases. For now the sidebar shows the roadmap with{' '}
            <span className="font-medium">Soon</span> tags on what's coming.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
