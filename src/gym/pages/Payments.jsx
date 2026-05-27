import { useEffect, useState } from 'react';
import { Plus, Receipt, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loading } from '@/shared/components/Loading';
import { EmptyState } from '@/shared/components/EmptyState';
import { PaymentForm } from '@/gym/components/payments/PaymentForm';

import { paymentService } from '@/gym/services/paymentService';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await paymentService.list({ limit: 100 });
      setPayments(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await paymentService.create(values);
      toast.success('Payment recorded — member expiry extended');
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this payment record?')) return;
    try {
      await paymentService.remove(id);
      toast.success('Payment deleted');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground">Record renewals and view payment history.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Record payment
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          {loading ? (
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
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>{formatDate(p.paymentDate)}</TableCell>
                    <TableCell className="font-medium">{p.member?.name || '-'}</TableCell>
                    <TableCell>{p.plan?.name || '-'}</TableCell>
                    <TableCell>{formatCurrency(p.amount)}</TableCell>
                    <TableCell className="capitalize">{p.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'paid' ? 'success' : 'warning'} className="capitalize">
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onDelete(p._id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record payment</DialogTitle>
          </DialogHeader>
          <PaymentForm onSubmit={onSubmit} submitting={submitting} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
