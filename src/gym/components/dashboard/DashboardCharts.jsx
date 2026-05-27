import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService } from '@/gym/services/dashboardService';
import { Loading } from '@/shared/components/Loading';

export function RevenueChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboardService.revenueChart().then((res) => setData(res.data));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue (last 6 months)</CardTitle>
      </CardHeader>
      <CardContent>
        {!data ? (
          <Loading />
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AttendanceChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboardService.attendanceChart().then((res) => setData(res.data));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance (last 7 days)</CardTitle>
      </CardHeader>
      <CardContent>
        {!data ? (
          <Loading />
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
