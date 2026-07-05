import '@sandylib27/react-ag-datatable/styles.css';
import { DataTable, type ColDef, type DataTableDataSource, type DataTableQuery, type DataTableResponse } from '@sandylib27/react-ag-datatable';

interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: string;
}

const ALL_TRANSACTIONS: Transaction[] = Array.from({ length: 100 }, (_, i) => {
  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health'];
  const statuses = ['Completed', 'Pending', 'Failed'];
  const descriptions = [
    'Grocery Store', 'Uber Ride', 'Netflix Subscription', 'Electric Bill',
    'Amazon Purchase', 'Gym Membership', 'Coffee Shop', 'Gas Station',
    'Restaurant', 'Phone Bill', 'Insurance', 'Clothing Store',
  ];
  return {
    id: i + 1,
    date: `2026-${String(Math.floor(Math.random() * 6) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    description: descriptions[i % descriptions.length],
    category: categories[i % categories.length],
    amount: Math.round((Math.random() * 500 + 5) * 100) / 100,
    status: statuses[i % statuses.length],
  };
});

const fetchTransactions: DataTableDataSource<Transaction> = async (query: DataTableQuery): Promise<DataTableResponse<Transaction>> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (Math.random() < 0.2) {
    throw new Error('Network error: Failed to fetch transactions. Please try again.');
  }

  let filtered = [...ALL_TRANSACTIONS];

  if (query.filters && Object.keys(query.filters).length > 0) {
    for (const [field, filterModel] of Object.entries(query.filters)) {
      if (filterModel.type === 'set' && filterModel.values.length > 0) {
        filtered = filtered.filter((row) => {
          const value = String(row[field as keyof Transaction]);
          return filterModel.values.includes(value);
        });
      }
    }
  }

  if (query.sort) {
    const { field, direction } = query.sort;
    filtered.sort((a, b) => {
      const aVal = a[field as keyof Transaction];
      const bVal = b[field as keyof Transaction];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return direction === 'asc' ? cmp : -cmp;
    });
  }

  const totalRows = filtered.length;
  const start = query.page * query.pageSize;
  const rows = filtered.slice(start, start + query.pageSize);

  return { rows, totalRows };
};

const columns: ColDef<Transaction>[] = [
  { field: 'id', headerName: 'ID', maxWidth: 80 },
  { field: 'date', headerName: 'Date', maxWidth: 130 },
  { field: 'description', headerName: 'Description' },
  { field: 'category', headerName: 'Category', maxWidth: 140 },
  {
    field: 'amount',
    headerName: 'Amount',
    type: 'numericColumn',
    maxWidth: 120,
    valueFormatter: (params) => `$${params.value?.toFixed(2)}`,
  },
  { field: 'status', headerName: 'Status', maxWidth: 120 },
];

export default function ApiConnectedExample() {
  return (
    <div style={{ padding: 24 }}>
      <h2>API-Connected DataTable</h2>
      <p style={{ marginBottom: 12, color: '#666' }}>
        Uses <code>dataSource</code> for server-side pagination. Simulates 1s fetch latency
        with a 20% chance of random error (click retry to refetch). 100 total rows,
        15 per page. Sort and filter queries are passed through to the mock API.
      </p>
      <DataTable<Transaction>
        dataSource={fetchTransactions}
        columns={columns}
        enableSorting
        enableColumnFilter
        pagination
        pageSize={15}
        bordered
        hoverable
      />
    </div>
  );
}
