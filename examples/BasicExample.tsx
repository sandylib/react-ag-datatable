import '@sandylib27/react-ag-datatable/styles.css';
import { DataTable, type ColDef } from '@sandylib27/react-ag-datatable';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const data: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Eva Martinez', email: 'eva@example.com', role: 'Admin', status: 'Active' },
  { id: 6, name: 'Frank Lee', email: 'frank@example.com', role: 'Viewer', status: 'Pending' },
];

const columns: ColDef<User>[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'email', headerName: 'Email' },
  { field: 'role', headerName: 'Role' },
  { field: 'status', headerName: 'Status' },
];

export default function BasicExample() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Basic DataTable</h2>
      <DataTable<User> data={data} columns={columns} bordered hoverable />
    </div>
  );
}
