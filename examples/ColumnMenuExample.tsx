import '@sandylib27/react-ag-datatable/styles.css';
import { DataTable, type ColDef } from '@sandylib27/react-ag-datatable';

interface Project {
  id: number;
  name: string;
  owner: string;
  priority: string;
  status: string;
  progress: number;
  dueDate: string;
}

const data: Project[] = [
  { id: 1, name: 'Website Redesign', owner: 'Alice', priority: 'High', status: 'In Progress', progress: 65, dueDate: '2026-08-15' },
  { id: 2, name: 'Mobile App v2', owner: 'Bob', priority: 'Critical', status: 'In Progress', progress: 30, dueDate: '2026-09-01' },
  { id: 3, name: 'API Migration', owner: 'Carol', priority: 'High', status: 'Planning', progress: 10, dueDate: '2026-10-20' },
  { id: 4, name: 'Analytics Dashboard', owner: 'David', priority: 'Medium', status: 'Done', progress: 100, dueDate: '2026-07-01' },
  { id: 5, name: 'CI/CD Pipeline', owner: 'Eva', priority: 'Medium', status: 'In Progress', progress: 80, dueDate: '2026-07-30' },
  { id: 6, name: 'User Onboarding', owner: 'Frank', priority: 'Low', status: 'Planning', progress: 5, dueDate: '2026-11-15' },
  { id: 7, name: 'Security Audit', owner: 'Grace', priority: 'Critical', status: 'In Progress', progress: 50, dueDate: '2026-08-01' },
  { id: 8, name: 'Performance Tuning', owner: 'Henry', priority: 'Medium', status: 'Done', progress: 100, dueDate: '2026-06-15' },
  { id: 9, name: 'Design System', owner: 'Iris', priority: 'High', status: 'In Progress', progress: 45, dueDate: '2026-09-30' },
  { id: 10, name: 'Data Backup Strategy', owner: 'Jack', priority: 'Low', status: 'Planning', progress: 0, dueDate: '2026-12-01' },
];

const columns: ColDef<Project>[] = [
  { field: 'name', headerName: 'Project' },
  { field: 'owner', headerName: 'Owner', maxWidth: 120 },
  { field: 'priority', headerName: 'Priority', maxWidth: 110 },
  { field: 'status', headerName: 'Status', maxWidth: 130 },
  {
    field: 'progress',
    headerName: 'Progress',
    type: 'numericColumn',
    maxWidth: 120,
    valueFormatter: (params) => `${params.value}%`,
  },
  { field: 'dueDate', headerName: 'Due Date', maxWidth: 130 },
];

export default function ColumnMenuExample() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Column Menu Example</h2>
      <p style={{ marginBottom: 12, color: '#666' }}>
        Click the menu icon on any column header for options: Sort ascending/descending,
        Pin left/right, Autosize column, Choose columns, and Reset.
      </p>
      <DataTable<Project>
        data={data}
        columns={columns}
        enableColumnMenu
        enableSorting
        bordered
        hoverable
      />
    </div>
  );
}
