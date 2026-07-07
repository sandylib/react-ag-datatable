import '@sandylib27/react-ag-datatable/styles.css';
import {
  DataTable,
  type ColDef,
  type DataTableDataSource,
  type DataTableFilterModel,
  type DataTableQuery,
  type DataTableResponse,
  type SetFilterValuesSource,
} from '@sandylib27/react-ag-datatable';

interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: string;
}

const ALL_TRANSACTIONS: Transaction[] = Array.from({ length: 80 }, (_, i) => {
  const categories = ['Food', 'Transport', 'Utilities', 'Shopping'];
  const descriptions = ['Grocery Store', 'Train Fare', 'Electric Bill', 'Online Order'];
  const status = i < 20 ? (i % 2 === 0 ? 'Completed' : 'Pending') : i < 55 ? 'Failed' : 'Archived';

  return {
    id: i + 1,
    date: `2026-07-${String((i % 28) + 1).padStart(2, '0')}`,
    description: descriptions[i % descriptions.length],
    category: categories[i % categories.length],
    amount: Math.round((25 + i * 3.17) * 100) / 100,
    status,
  };
});

function applyFilters(
  rows: Transaction[],
  filters: Record<string, DataTableFilterModel>,
): Transaction[] {
  let filtered = [...rows];

  for (const [field, filterModel] of Object.entries(filters)) {
    if (filterModel.type === 'set' && filterModel.values.length > 0) {
      filtered = filtered.filter((row) => {
        const value = String(row[field as keyof Transaction]);
        return filterModel.values.includes(value);
      });
    }
  }

  return filtered;
}

const fetchTransactions: DataTableDataSource<Transaction> = async (
  query: DataTableQuery,
): Promise<DataTableResponse<Transaction>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const filtered = applyFilters(ALL_TRANSACTIONS, query.filters);
  const totalRows = filtered.length;
  const start = query.page * query.pageSize;

  return {
    rows: filtered.slice(start, start + query.pageSize),
    totalRows,
  };
};

const fetchSetFilterValues: SetFilterValuesSource = async ({ field, filters }) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const filtered = applyFilters(ALL_TRANSACTIONS, filters);
  const values = new Set<string>();

  for (const row of filtered) {
    const value = row[field as keyof Transaction];
    if (value != null) {
      values.add(String(value));
    }
  }

  return Array.from(values);
};

const columns: ColDef<Transaction>[] = [
  { field: 'id', headerName: 'ID', maxWidth: 80 },
  { field: 'date', headerName: 'Date', maxWidth: 130 },
  { field: 'description', headerName: 'Description' },
  { field: 'category', headerName: 'Category', maxWidth: 150 },
  { field: 'status', headerName: 'Status', maxWidth: 140 },
  {
    field: 'amount',
    headerName: 'Amount',
    type: 'numericColumn',
    maxWidth: 120,
    valueFormatter: (params) => `$${params.value?.toFixed(2)}`,
  },
];

export default function ApiFilterValuesExample() {
  return (
    <div style={{ padding: 24 }}>
      <h2>API Set Filter Values</h2>
      <p style={{ marginBottom: 12, color: '#666' }}>
        Rows are fetched one page at a time, but set filter values come from a separate
        server-style source. The status value <code>Archived</code> is not on page one,
        but it still appears in the filter checklist.
      </p>
      <DataTable<Transaction>
        dataSource={fetchTransactions}
        setFilterValuesSource={fetchSetFilterValues}
        columns={columns}
        enableColumnFilter
        pagination
        pageSize={15}
        bordered
        hoverable
      />
    </div>
  );
}
