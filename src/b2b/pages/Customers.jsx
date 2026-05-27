import { Users } from 'lucide-react';
import { DataPage } from '../components/common/DataPage';
import { PartyForm } from '../components/parties/PartyForm';
import { customerService } from '../services/customerService';

const columns = [
  { key: 'companyName',   label: 'Company' },
  { key: 'contactPerson', label: 'Contact' },
  { key: 'email',         label: 'Email' },
  { key: 'phone',         label: 'Phone' },
  { key: 'gstNumber',     label: 'GSTIN', render: (i) => i.gstNumber ? <span className="font-mono text-xs">{i.gstNumber}</span> : '-' },
];

export default function Customers() {
  return (
    <DataPage
      title="Customers"
      subtitle="Companies you sell to"
      icon={Users}
      addLabel="Add customer"
      formTitle="customer"
      service={customerService}
      columns={columns}
      FormComponent={PartyForm}
      searchPlaceholder="Search by name, contact, email, phone, GSTIN..."
      emptyMessage="No customers yet — add your first one."
    />
  );
}
