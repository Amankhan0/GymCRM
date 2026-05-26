import { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, UserCog } from 'lucide-react';
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
import { TrainerForm } from '@/components/trainers/TrainerForm';

import { trainerService } from '@/services/trainerService';
import { formatCurrency } from '@/lib/utils';

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async (q = '') => {
    setLoading(true);
    try {
      const res = await trainerService.list({ search: q, limit: 100 });
      setTrainers(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editing) {
        await trainerService.update(editing._id, values);
        toast.success('Trainer updated');
      } else {
        await trainerService.create(values);
        toast.success('Trainer created');
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
    if (!confirm('Delete this trainer?')) return;
    try {
      await trainerService.remove(id);
      toast.success('Trainer deleted');
      load(search);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trainers</h1>
          <p className="text-sm text-muted-foreground">Manage your trainer staff.</p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add trainer
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trainers"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <Loading />
          ) : trainers.length === 0 ? (
            <EmptyState icon={UserCog} title="No trainers yet" description="Click 'Add trainer' to add staff." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainers.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell className="font-medium">
                      <div>{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.email || '-'}</div>
                    </TableCell>
                    <TableCell>{t.phone}</TableCell>
                    <TableCell>{t.specialization || '-'}</TableCell>
                    <TableCell>{t.experience} yrs</TableCell>
                    <TableCell>{t.assignedMembers?.length || 0}</TableCell>
                    <TableCell>{formatCurrency(t.salary)}</TableCell>
                    <TableCell>
                      <Badge variant={t.status === 'active' ? 'success' : 'secondary'} className="capitalize">
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(t); setDialogOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(t._id)}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit trainer' : 'Add trainer'}</DialogTitle>
          </DialogHeader>
          <TrainerForm defaultValues={editing || {}} onSubmit={onSubmit} submitting={submitting} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
