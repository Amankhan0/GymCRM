import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataPage } from '../components/common/DataPage';
import { ProductForm } from '../components/products/ProductForm';
import { productService } from '../services/productService';
import { formatCurrency } from '@/lib/utils';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'sku',  label: 'SKU', render: (i) => i.sku ? <span className="font-mono text-xs">{i.sku}</span> : '-' },
  { key: 'hsnCode', label: 'HSN', render: (i) => i.hsnCode ? <span className="font-mono text-xs">{i.hsnCode}</span> : '-' },
  { key: 'price', label: 'Price', render: (i) => formatCurrency(i.price) },
  { key: 'gstPercent', label: 'GST', render: (i) => `${i.gstPercent ?? 0}%` },
  { key: 'unit', label: 'Unit' },
  { key: 'stockQuantity', label: 'Stock' },
  { key: 'isActive', label: 'Status', render: (i) => (
    <Badge variant={i.isActive ? 'success' : 'secondary'}>
      {i.isActive ? 'Active' : 'Inactive'}
    </Badge>
  )},
];

export default function Products() {
  return (
    <DataPage
      title="Products"
      subtitle="Catalog of items you sell"
      icon={Package}
      addLabel="Add product"
      formTitle="product"
      service={productService}
      columns={columns}
      FormComponent={ProductForm}
      searchPlaceholder="Search by name, SKU, HSN code..."
      emptyMessage="No products yet — add your first one."
    />
  );
}
