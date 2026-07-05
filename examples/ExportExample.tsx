import '@sandylib27/react-ag-datatable/styles.css';
import { DataTable, type ColDef } from '@sandylib27/react-ag-datatable';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
}

const data: Product[] = [
  { id: 1, name: 'Wireless Mouse', category: 'Electronics', price: 29.99, stock: 150, sku: 'WM-001' },
  { id: 2, name: 'Mechanical Keyboard', category: 'Electronics', price: 89.99, stock: 75, sku: 'MK-002' },
  { id: 3, name: 'USB-C Hub', category: 'Accessories', price: 49.99, stock: 200, sku: 'UH-003' },
  { id: 4, name: 'Monitor Stand', category: 'Furniture', price: 34.99, stock: 90, sku: 'MS-004' },
  { id: 5, name: 'Webcam HD', category: 'Electronics', price: 59.99, stock: 120, sku: 'WC-005' },
  { id: 6, name: 'Desk Lamp', category: 'Furniture', price: 24.99, stock: 60, sku: 'DL-006' },
  { id: 7, name: 'Cable Organizer', category: 'Accessories', price: 12.99, stock: 300, sku: 'CO-007' },
  { id: 8, name: 'Laptop Stand', category: 'Furniture', price: 44.99, stock: 85, sku: 'LS-008' },
  { id: 9, name: 'Bluetooth Speaker', category: 'Electronics', price: 39.99, stock: 110, sku: 'BS-009' },
  { id: 10, name: 'Mouse Pad XL', category: 'Accessories', price: 19.99, stock: 250, sku: 'MP-010' },
  { id: 11, name: 'Headphone Stand', category: 'Accessories', price: 15.99, stock: 180, sku: 'HS-011' },
  { id: 12, name: 'Ergonomic Chair', category: 'Furniture', price: 299.99, stock: 25, sku: 'EC-012' },
];

const columns: ColDef<Product>[] = [
  { field: 'sku', headerName: 'SKU', maxWidth: 100 },
  { field: 'name', headerName: 'Product Name' },
  { field: 'category', headerName: 'Category', maxWidth: 140 },
  {
    field: 'price',
    headerName: 'Price',
    type: 'numericColumn',
    maxWidth: 110,
    valueFormatter: (params) => `$${params.value?.toFixed(2)}`,
  },
  {
    field: 'stock',
    headerName: 'Stock',
    type: 'numericColumn',
    maxWidth: 100,
  },
];

export default function ExportExample() {
  return (
    <div style={{ padding: 24 }}>
      <h2>CSV / Excel Export</h2>
      <p style={{ marginBottom: 12, color: '#666' }}>
        Click the <strong>Export</strong> button in the toolbar to download the table data as CSV
        or Excel. The export respects visible columns and applied filters — try filtering first,
        then exporting.
      </p>
      <DataTable<Product>
        data={data}
        columns={columns}
        enableExport
        exportFileName="products"
        enableSorting
        enableColumnFilter
        bordered
        hoverable
      />
    </div>
  );
}
