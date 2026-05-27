import { useMemo, useState } from 'react';
import { UserPlus, ArrowRightCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataPage } from '../components/common/DataPage';
import { LeadForm } from '../components/leads/LeadForm';
import { leadService } from '../services/leadService';
import { LEAD_STATUS } from '../utils/validators';
import { formatCurrency, formatDate } from '@/lib/utils';

const STATUS_VARIANT = {
  new: 'secondary',
  contacted: 'warning',
  interested: 'success',
  converted: 'success',
  lost: 'destructive',
};

const fmt = (s) => s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

// Highlight overdue follow-ups in red so they jump out in the table.
const FollowUpCell = ({ date }) => {
  if (!date) return <span className="text-muted-foreground">-</span>;
  const overdue = new Date(date) < new Date(new Date().toDateString());
  return (
    <span className={overdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
      {formatDate(date)}
    </span>
  );
};

export default function Leads() {
  const [statusCounts, setStatusCounts] = useState({});

  const tabs = useMemo(() => [
    { key: 'all', label: 'All', count: Object.values(statusCounts).reduce((a, b) => a + b, 0) || undefined },
    ...LEAD_STATUS.map((s) => ({ key: s, label: fmt(s), count: statusCounts[s] || undefined })),
  ], [statusCounts]);

  const columns = useMemo(() => [
    { key: 'name', label: 'Lead',
      render: (i) => (
        <div>
          <div className="font-medium">{i.name}</div>
          {i.contactCompany && <div className="text-xs text-muted-foreground">{i.contactCompany}</div>}
        </div>
      ),
    },
    { key: 'contact', label: 'Contact',
      render: (i) => (
        <div className="text-xs">
          {i.phone && <div>{i.phone}</div>}
          {i.email && <div className="text-muted-foreground truncate max-w-[180px]">{i.email}</div>}
        </div>
      ),
    },
    { key: 'source', label: 'Source', render: (i) => fmt(i.source) },
    { key: 'estimatedValue', label: 'Value',
      render: (i) => (i.estimatedValue != null ? formatCurrency(i.estimatedValue) : '-'),
    },
    { key: 'followUpDate', label: 'Follow-up', render: (i) => <FollowUpCell date={i.followUpDate} /> },
    { key: 'status', label: 'Status',
      render: (i) => <Badge variant={STATUS_VARIANT[i.status] || 'secondary'} className="capitalize">{fmt(i.status)}</Badge>,
    },
  ], []);

  const renderConvert = (item, { reload }) => {
    if (item.status === 'converted' || item.status === 'lost') return null;
    return (
      <Button
        size="sm"
        variant="ghost"
        title="Convert to quotation (Phase 4)"
        onClick={async () => {
          if (!confirm(`Convert "${item.name}" to a quotation?`)) return;
          try {
            const res = await leadService.convert(item._id);
            toast.success(res.message || 'Converted');
            reload();
          } catch (err) {
            toast.error(err?.response?.data?.message || 'Convert failed');
          }
        }}
      >
        <ArrowRightCircle className="h-4 w-4 text-indigo-600" />
      </Button>
    );
  };

  return (
    <DataPage
      title="Leads"
      subtitle="Your sales pipeline"
      icon={UserPlus}
      addLabel="Add lead"
      formTitle="lead"
      service={leadService}
      columns={columns}
      FormComponent={LeadForm}
      searchPlaceholder="Search by name, company, email, phone..."
      emptyMessage="No leads yet — add your first one."
      filterTabs={tabs}
      filterField="status"
      extraActions={renderConvert}
      onMeta={(meta) => setStatusCounts(meta.statusCounts || {})}
    />
  );
}
