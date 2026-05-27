import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCog, ClipboardCheck, AlertCircle, DollarSign, UserPlus } from 'lucide-react';

import { StatCard } from '@/gym/components/dashboard/StatCard';
import { RevenueChart, AttendanceChart } from '@/gym/components/dashboard/DashboardCharts';
import { RecentPayments } from '@/gym/components/dashboard/RecentPayments';
import { dashboardService } from '@/gym/services/dashboardService';
import { formatCurrency } from '@/lib/utils';
import { Loading } from '@/shared/components/Loading';
import { useAuth } from '@/gym/hooks/useAuth';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    dashboardService.stats().then((res) => setStats(res.data));
  }, []);

  if (!stats) return <Loading label="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Here's what's happening at {user?.gymName || 'your gym'} today.
        </p>
      </div>

      {/* 3 cards per row at desktop — gives more visual breathing room than the old 6-up grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Members" value={stats.totalMembers} icon={Users} tone="indigo" />

        {/* Pending fees in red so it visually pops as the most urgent metric */}
        <button onClick={() => navigate('/members?pendingFees=true')} className="text-left">
          <StatCard
            title="Pending Fees"
            value={stats.pendingFees}
            subtitle="Click to view"
            icon={AlertCircle}
            tone="red"
            accent="text-red-600 dark:text-red-400"
          />
        </button>

        <StatCard
          title="New This Month"
          value={stats.newMembersThisMonth}
          subtitle="Members joined"
          icon={UserPlus}
          tone="green"
        />

        <StatCard title="Trainers" value={stats.totalTrainers} icon={UserCog} tone="purple" />

        {/* "Attended today / total active" so the owner sees the ratio at a glance */}
        <StatCard
          title="Today's Attendance"
          value={`${stats.todaysAttendance} / ${stats.activeMembers}`}
          subtitle="Present today / active"
          icon={ClipboardCheck}
          tone="blue"
        />

        <StatCard
          title="Revenue (Month)"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={DollarSign}
          tone="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart />
        <AttendanceChart />
      </div>

      <RecentPayments />
    </div>
  );
}
