import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Users, X, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { MemberForm } from '@/components/members/MemberForm';
import { PaymentForm } from '@/components/payments/PaymentForm';

import { memberService } from '@/services/memberService';
import { paymentService } from '@/services/paymentService';
import { formatDate } from '@/lib/utils';

const statusVariant = { active: 'success', expired: 'destructive', inactive: 'secondary' };

export default function Members() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pendingFees = searchParams.get('pendingFees') === 'true';

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Payment dialog state — opened from a row's "Record payment" action.
  const [paymentMember, setPaymentMember] = useState(null);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const load = async (q = '') => {
    setLoading(true);
    try {
      const res = await memberService.list({
        search: q,
        limit: 100,
        ...(pendingFees && { pendingFees: 'true' }),
      });
      setMembers(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, pendingFees]);

  const clearFilter = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('pendingFees');
    setSearchParams(next);
  };

  const openCreate = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (m) => { setEditing(m); setDialogOpen(true); };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editing) {
        await memberService.update(editing._id, values);
        toast.success('Member updated');
      } else {
        await memberService.create(values);
        toast.success('Member created');
      }
      setDialogOpen(false);
      load(search);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this member?')) return;
    try {
      await memberService.remove(id);
      toast.success('Member deleted');
      load(search);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  const onRecordPayment = async (values) => {
    setPaymentSubmitting(true);
    try {
      await paymentService.create(values);
      toast.success('Payment recorded — expiry extended');
      setPaymentMember(null);
      load(search);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    } finally {
      setPaymentSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {pendingFees ? 'Members with pending fees' : 'Members'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {pendingFees
              ? 'Expired members or those whose membership expires within 7 days.'
              : 'Manage your gym members.'}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add member
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {pendingFees && (
              <Button variant="outline" size="sm" onClick={clearFilter}>
                <X className="h-4 w-4 mr-1" /> Clear pending-fees filter
              </Button>
            )}
          </div>

          {loading ? (
            <Loading />
          ) : members.length === 0 ? (
            <EmptyState
              icon={Users}
              title={pendingFees ? 'No pending fees — well done!' : 'No members yet'}
              description={pendingFees ? 'Every member is up to date on their fees.' : "Click 'Add member' to register your first member."}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m._id}>
                    <TableCell className="font-medium">
                      <div>{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.email || '-'}</div>
                    </TableCell>
                    <TableCell>{m.phone}</TableCell>
                    <TableCell>{m.membershipPlan?.name || '-'}</TableCell>
                    <TableCell>{formatDate(m.joinDate)}</TableCell>
                    <TableCell>{formatDate(m.expiryDate)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[m.status] || 'secondary'} className="capitalize">
                        {m.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" title="Record payment" onClick={() => setPaymentMember(m)}>
                        <IndianRupee className="h-4 w-4 text-green-700" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit" onClick={() => openEdit(m)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete" onClick={() => onDelete(m._id)}>
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

      {/* Create / edit dialog — key forces a remount so RHF picks up fresh defaults */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit member' : 'Add member'}</DialogTitle>
          </DialogHeader>
          <MemberForm
            key={editing?._id || 'new'}
            defaultValues={editing || {}}
            onSubmit={onSubmit}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>

      {/* Record-payment dialog */}
      <Dialog open={!!paymentMember} onOpenChange={(o) => !o && setPaymentMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record payment for {paymentMember?.name}</DialogTitle>
          </DialogHeader>
          {paymentMember && (
            <PaymentForm
              key={paymentMember._id}
              defaultMemberId={paymentMember._id}
              lockMember
              onSubmit={onRecordPayment}
              submitting={paymentSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
