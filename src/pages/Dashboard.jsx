import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCog, ClipboardCheck, AlertCircle, DollarSign, UserPlus } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueChart, AttendanceChart } from '@/components/dashboard/DashboardCharts';
import { RecentPayments } from '@/components/dashboard/RecentPayments';
import { dashboardService } from '@/services/dashboardService';
import { formatCurrency } from '@/lib/utils';
import { Loading } from '@/components/common/Loading';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dashboardService.stats().then((res) => setStats(res.data));
  }, []);

  if (!stats) return <Loading label="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">An overview of your gym at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Members" value={stats.totalMembers} icon={Users} />

        {/* Click jumps to /members?pendingFees=true so the user can immediately see who to chase */}
        <button onClick={() => navigate('/members?pendingFees=true')} className="text-left">
          <StatCard
            title="Pending Fees"
            value={stats.pendingFees}
            subtitle="Click to view list"
            icon={AlertCircle}
            iconClass="bg-red-100 text-red-700"
          />
        </button>

        <StatCard
          title="New Members"
          value={stats.newMembersThisMonth}
          subtitle="This month"
          icon={UserPlus}
          iconClass="bg-green-100 text-green-700"
        />
        <StatCard title="Trainers" value={stats.totalTrainers} icon={UserCog} />
        <StatCard
          title="Today's Attendance"
          value={stats.todaysAttendance}
          icon={ClipboardCheck}
          iconClass="bg-blue-100 text-blue-700"
        />
        <StatCard
          title="Revenue (Month)"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={DollarSign}
          iconClass="bg-purple-100 text-purple-700"
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
