import { Building2 } from 'lucide-react';
import { DataPage } from '../components/common/DataPage';
import { PartyForm } from '../components/parties/PartyForm';
import { supplierService } from '../services/supplierService';

const columns = [
  { key: 'companyName',   label: 'Company' },
  { key: 'contactPerson', label: 'Contact' },
  { key: 'email',         label: 'Email' },
  { key: 'phone',         label: 'Phone' },
  { key: 'gstNumber',     label: 'GSTIN', render: (i) => i.gstNumber ? <span className="font-mono text-xs">{i.gstNumber}</span> : '-' },
];

export default function Suppliers() {
  return (
    <DataPage
      title="Suppliers"
      subtitle="Companies you buy from"
      icon={Building2}
      addLabel="Add supplier"
      formTitle="supplier"
      service={supplierService}
      columns={columns}
      FormComponent={PartyForm}
      searchPlaceholder="Search by name, contact, email, phone, GSTIN..."
      emptyMessage="No suppliers yet — add your first one."
    />
  );
}
