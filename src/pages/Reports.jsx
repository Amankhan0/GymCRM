import { RevenueChart, AttendanceChart } from '@/components/dashboard/DashboardCharts';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Visualize gym performance over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart />
        <AttendanceChart />
      </div>
    </div>
  );
}
