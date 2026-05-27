import { useEffect, useState } from 'react';
import { Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Loading } from '@/shared/components/Loading';
import { EmptyState } from '@/shared/components/EmptyState';
import { paymentService } from '@/gym/services/paymentService';
import { formatCurrency, formatDate } from '@/lib/utils';

export function RecentPayments() {
  const [payments, setPayments] = useState(null);

  useEffect(() => {
    paymentService.list({ limit: 5 }).then((r) => setPayments(r.data || []));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent payments</CardTitle>
      </CardHeader>
      <CardContent>
        {!payments ? (
          <Loading />
        ) : payments.length === 0 ? (
          <EmptyState icon={Receipt} title="No payments yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{formatDate(p.paymentDate)}</TableCell>
                  <TableCell className="font-medium">{p.member?.name || '-'}</TableCell>
                  <TableCell>{p.plan?.name || '-'}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === 'paid' ? 'success' : 'warning'} className="capitalize">
                      {p.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
