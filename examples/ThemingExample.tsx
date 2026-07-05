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

const greenThemeStyles: React.CSSProperties & Record<string, string> = {
  '--cdt-primary': '142 71% 45%',
  '--cdt-primary-foreground': '0 0% 100%',
  '--cdt-radius': '12px',
  '--cdt-border': '142 30% 80%',
  '--cdt-background': '142 40% 98%',
  '--cdt-foreground': '142 10% 15%',
  '--cdt-muted': '142 20% 94%',
  '--cdt-muted-foreground': '142 10% 40%',
};

const purpleThemeStyles: React.CSSProperties & Record<string, string> = {
  '--cdt-primary': '270 60% 55%',
  '--cdt-primary-foreground': '0 0% 100%',
  '--cdt-radius': '4px',
  '--cdt-border': '270 30% 75%',
  '--cdt-background': '270 30% 98%',
  '--cdt-foreground': '270 10% 15%',
  '--cdt-muted': '270 20% 93%',
  '--cdt-muted-foreground': '270 10% 40%',
};

export default function ThemingExample() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Theming Example</h2>
      <p style={{ marginBottom: 12, color: '#666' }}>
        Override CSS variables to apply custom themes. Each table below uses a different
        set of <code>--cdt-*</code> variables.
      </p>

      <h3 style={{ marginTop: 24, marginBottom: 8 }}>Green Theme (large radius)</h3>
      <div style={greenThemeStyles}>
        <DataTable<User> data={data} columns={columns} bordered hoverable />
      </div>

      <h3 style={{ marginTop: 32, marginBottom: 8 }}>Purple Theme (small radius)</h3>
      <div style={purpleThemeStyles}>
        <DataTable<User> data={data} columns={columns} bordered hoverable />
      </div>
    </div>
  );
}
