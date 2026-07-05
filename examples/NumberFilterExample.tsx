import '@sandylib27/react-ag-datatable/styles.css';
import { DataTable, type ColDef } from '@sandylib27/react-ag-datatable';

interface OrderItem {
  id: number;
  product: string;
  category: string;
  price: number;
  quantity: number;
  total: number;
}

const data: OrderItem[] = [
  { id: 1, product: 'Wireless Mouse', category: 'Electronics', price: 29.99, quantity: 3, total: 89.97 },
  { id: 2, product: 'USB-C Hub', category: 'Electronics', price: 54.95, quantity: 1, total: 54.95 },
  { id: 3, product: 'Standing Desk Mat', category: 'Office', price: 45.00, quantity: 2, total: 90.00 },
  { id: 4, product: 'Mechanical Keyboard', category: 'Electronics', price: 149.99, quantity: 1, total: 149.99 },
  { id: 5, product: 'Monitor Arm', category: 'Office', price: 89.95, quantity: 2, total: 179.90 },
  { id: 6, product: 'Webcam HD', category: 'Electronics', price: 79.99, quantity: 1, total: 79.99 },
  { id: 7, product: 'Desk Lamp', category: 'Office', price: 34.50, quantity: 4, total: 138.00 },
  { id: 8, product: 'Headphone Stand', category: 'Accessories', price: 19.99, quantity: 5, total: 99.95 },
  { id: 9, product: 'Cable Organizer', category: 'Accessories', price: 12.99, quantity: 10, total: 129.90 },
  { id: 10, product: 'Noise-Cancelling Headphones', category: 'Electronics', price: 299.00, quantity: 1, total: 299.00 },
  { id: 11, product: 'Ergonomic Chair', category: 'Furniture', price: 549.00, quantity: 1, total: 549.00 },
  { id: 12, product: 'Whiteboard Markers', category: 'Office', price: 8.99, quantity: 12, total: 107.88 },
  { id: 13, product: 'Laptop Stand', category: 'Accessories', price: 42.00, quantity: 2, total: 84.00 },
  { id: 14, product: 'Power Strip', category: 'Electronics', price: 24.99, quantity: 3, total: 74.97 },
  { id: 15, product: 'Filing Cabinet', category: 'Furniture', price: 189.00, quantity: 1, total: 189.00 },
];

const columns: ColDef<OrderItem>[] = [
  { field: 'product', headerName: 'Product' },
  { field: 'category', headerName: 'Category', maxWidth: 140 },
  {
    field: 'price',
    headerName: 'Unit Price',
    type: 'numericColumn',
    valueFormatter: (params) => `$${params.value?.toFixed(2)}`,
  },
  {
    field: 'quantity',
    headerName: 'Qty',
    type: 'numericColumn',
    maxWidth: 100,
  },
  {
    field: 'total',
    headerName: 'Total',
    type: 'numericColumn',
    valueFormatter: (params) => `$${params.value?.toFixed(2)}`,
  },
];

export default function NumberFilterExample() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Number Filter Example</h2>
      <p style={{ marginBottom: 12, color: '#666' }}>
        Numeric columns (Price, Qty, Total) use NumberFilter with operators like
        &quot;greater than&quot;, &quot;less than&quot;, &quot;between&quot;, etc.
        Text columns use the default SetFilter.
      </p>
      <DataTable<OrderItem>
        data={data}
        columns={columns}
        enableColumnFilter
        bordered
        hoverable
      />
    </div>
  );
}
