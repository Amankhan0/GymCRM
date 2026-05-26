import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, CreditCard, Check } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { PlanForm } from '@/components/plans/PlanForm';

import { planService } from '@/services/planService';
import { formatCurrency } from '@/lib/utils';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await planService.list();
      setPlans(res.data || []);
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
      if (editing) {
        await planService.update(editing._id, values);
        toast.success('Plan updated');
      } else {
        await planService.create(values);
        toast.success('Plan created');
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this plan?')) return;
    try {
      await planService.remove(id);
      toast.success('Plan deleted');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Membership Plans</h1>
          <p className="text-sm text-muted-foreground">Configure pricing and durations.</p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add plan
        </Button>
      </div>

      {loading ? (
        <Loading />
      ) : plans.length === 0 ? (
        <Card><CardContent className="p-4"><EmptyState icon={CreditCard} title="No plans yet" /></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((p) => (
            <Card key={p._id} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {p.name}
                  <span className="text-xs font-normal text-muted-foreground capitalize bg-muted px-2 py-1 rounded-full">
                    {p.duration}
                  </span>
                </CardTitle>
                <CardDescription>{p.description || '—'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">{formatCurrency(p.price)}<span className="text-sm font-normal text-muted-foreground"> / {p.durationInDays}d</span></div>
                <ul className="space-y-1.5">
                  {(p.features || []).map((f, i) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => { setEditing(p); setDialogOpen(true); }}>
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(p._id)}>
                    <Trash2 className="h-4 w-4 mr-1 text-destructive" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit plan' : 'Add plan'}</DialogTitle>
          </DialogHeader>
          <PlanForm defaultValues={editing || {}} onSubmit={onSubmit} submitting={submitting} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
