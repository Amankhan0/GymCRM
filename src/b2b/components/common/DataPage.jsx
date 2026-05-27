import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Loading } from '@/shared/components/Loading';
import { EmptyState } from '@/shared/components/EmptyState';

// Generic CRUD list page used by Customers / Suppliers / Products. Saves duplicating
// the same search + table + edit-dialog + pagination pattern in every master module.
//
// Props:
//   title, subtitle, icon, addLabel    — header chrome
//   service                            — { list, create, update, remove } service object
//   columns: [{ key, label, render }]  — table columns; render(item) -> ReactNode (defaults to item[key])
//   FormComponent                      — the form to render inside the create/edit dialog
//   searchPlaceholder, emptyMessage
export function DataPage({
  title, subtitle, icon: Icon, addLabel = 'Add',
  service, columns, FormComponent,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No records yet — add your first one.',
  formTitle = title,
  // Optional: tabs that filter the list by some query param.
  // [{ key: 'all', label: 'All' }, { key: 'new', label: 'New', countKey: 'new' }, ...]
  // When set, also pass `filterField` (e.g. 'status') and the value goes into the API query.
  filterTabs,
  filterField,
  // Optional: render extra actions on each row (right of edit/delete). (item) => ReactNode
  extraActions,
  // Optional callback: fires after every list() with the latest meta. Lets the parent read
  // server-supplied numbers like per-status counts for tab badges.
  onMeta,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ pages: 1, total: 0 });
  const [activeTab, setActiveTab] = useState(filterTabs?.[0]?.key || null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = { search, page, limit: 20 };
      if (filterTabs && activeTab && activeTab !== 'all' && filterField) {
        params[filterField] = activeTab;
      }
      const res = await service.list(params);
      setItems(res.data || []);
      setMeta(res.meta || { pages: 1, total: 0 });
      if (onMeta) onMeta(res.meta || {});
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input so we don't hammer the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => load(), search ? 300 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, activeTab]);

  const openCreate = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (item) => { setEditing(item); setDialogOpen(true); };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editing) {
        await service.update(editing._id, values);
        toast.success('Updated');
      } else {
        await service.create(values);
        toast.success('Created');
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      if (err?.response?.status !== 409) {
        toast.error(err?.response?.data?.message || 'Save failed');
      }
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (item) => {
    if (!confirm(`Delete "${item.name || item.companyName}"?`)) return;
    try {
      await service.remove(item._id);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-indigo-600">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight truncate">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" /> {addLabel}
        </Button>
      </div>

      {/* Filter tabs (optional) */}
      {filterTabs && filterTabs.length > 0 && (
        <div className="flex gap-1 border-b overflow-x-auto">
          {filterTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setActiveTab(t.key); setPage(1); }}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                activeTab === t.key
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
              {t.count != null && (
                <span className="ml-2 inline-flex items-center justify-center text-[10px] bg-muted text-muted-foreground rounded-full px-1.5 min-w-[18px] h-[18px]">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>

          {loading ? (
            <Loading />
          ) : items.length === 0 ? (
            <EmptyState icon={Icon} title={emptyMessage} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((c) => (
                        <TableHead key={c.key}>{c.label}</TableHead>
                      ))}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item._id}>
                        {columns.map((c) => (
                          <TableCell key={c.key}>
                            {c.render ? c.render(item) : (item[c.key] ?? '-')}
                          </TableCell>
                        ))}
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            {extraActions && extraActions(item, { reload: load })}
                            <Button size="sm" variant="ghost" onClick={() => openEdit(item)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => onDelete(item)} className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {meta.pages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    Page {page} of {meta.pages} · {meta.total} total
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                      Previous
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(meta.pages, p + 1))} disabled={page >= meta.pages}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${formTitle}` : `New ${formTitle}`}</DialogTitle>
            <DialogDescription>Fill the details and save.</DialogDescription>
          </DialogHeader>
          <FormComponent
            key={editing?._id || 'new'}
            defaultValues={editing}
            onSubmit={onSubmit}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
