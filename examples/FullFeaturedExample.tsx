import '@sandylib27/react-ag-datatable/styles.css';
import { DataTable, type ColDef } from '@sandylib27/react-ag-datatable';

interface Employee {
  id: number;
  name: string;
  department: string;
  title: string;
  salary: number;
  joinDate: string;
  status: string;
}

const data: Employee[] = [
  { id: 1, name: 'Olivia Chen', department: 'Engineering', title: 'Senior Engineer', salary: 145000, joinDate: '2019-03-15', status: 'Active' },
  { id: 2, name: 'James Wilson', department: 'Engineering', title: 'Staff Engineer', salary: 175000, joinDate: '2017-08-22', status: 'Active' },
  { id: 3, name: 'Sophia Patel', department: 'Design', title: 'Lead Designer', salary: 130000, joinDate: '2020-01-10', status: 'Active' },
  { id: 4, name: "Liam O'Brien", department: 'Product', title: 'Product Manager', salary: 140000, joinDate: '2018-11-05', status: 'Active' },
  { id: 5, name: 'Emma Tanaka', department: 'Engineering', title: 'Junior Engineer', salary: 95000, joinDate: '2023-06-01', status: 'Active' },
  { id: 6, name: 'Noah Garcia', department: 'Sales', title: 'Account Executive', salary: 88000, joinDate: '2021-09-14', status: 'Active' },
  { id: 7, name: 'Ava Johansson', department: 'Marketing', title: 'Marketing Manager', salary: 115000, joinDate: '2019-07-20', status: 'On Leave' },
  { id: 8, name: 'William Kim', department: 'Engineering', title: 'DevOps Engineer', salary: 135000, joinDate: '2020-04-18', status: 'Active' },
  { id: 9, name: 'Isabella Singh', department: 'HR', title: 'HR Director', salary: 150000, joinDate: '2016-02-28', status: 'Active' },
  { id: 10, name: 'Mason Al-Rashid', department: 'Finance', title: 'Financial Analyst', salary: 105000, joinDate: '2022-01-15', status: 'Active' },
  { id: 11, name: 'Mia Thompson', department: 'Design', title: 'UX Researcher', salary: 110000, joinDate: '2021-05-03', status: 'Active' },
  { id: 12, name: 'Ethan Müller', department: 'Engineering', title: 'Frontend Engineer', salary: 125000, joinDate: '2020-10-12', status: 'Active' },
  { id: 13, name: 'Charlotte Lee', department: 'Sales', title: 'Sales Director', salary: 160000, joinDate: '2015-09-08', status: 'Active' },
  { id: 14, name: 'Alexander Costa', department: 'Product', title: 'Senior PM', salary: 155000, joinDate: '2018-03-25', status: 'Active' },
  { id: 15, name: 'Amelia Wright', department: 'Marketing', title: 'Content Lead', salary: 98000, joinDate: '2022-07-19', status: 'Active' },
  { id: 16, name: 'Daniel Nguyen', department: 'Engineering', title: 'Backend Engineer', salary: 138000, joinDate: '2019-12-01', status: 'Active' },
  { id: 17, name: 'Harper Davis', department: 'HR', title: 'Recruiter', salary: 82000, joinDate: '2023-02-14', status: 'Active' },
  { id: 18, name: 'Sebastian Rossi', department: 'Finance', title: 'CFO', salary: 220000, joinDate: '2014-06-10', status: 'Active' },
  { id: 19, name: 'Aria Nakamura', department: 'Design', title: 'Visual Designer', salary: 105000, joinDate: '2021-11-30', status: 'On Leave' },
  { id: 20, name: 'Jack Robinson', department: 'Engineering', title: 'QA Lead', salary: 120000, joinDate: '2018-08-15', status: 'Active' },
  { id: 21, name: 'Luna Perez', department: 'Sales', title: 'BDR', salary: 72000, joinDate: '2024-01-08', status: 'Active' },
  { id: 22, name: 'Henry Zhao', department: 'Engineering', title: 'ML Engineer', salary: 165000, joinDate: '2020-05-22', status: 'Active' },
  { id: 23, name: 'Grace Sullivan', department: 'Product', title: 'Associate PM', salary: 105000, joinDate: '2023-04-17', status: 'Active' },
  { id: 24, name: 'Owen Fernandez', department: 'Marketing', title: 'SEO Specialist', salary: 85000, joinDate: '2022-09-05', status: 'Terminated' },
  { id: 25, name: 'Chloe Anderson', department: 'Finance', title: 'Accountant', salary: 92000, joinDate: '2021-03-12', status: 'Active' },
  { id: 26, name: 'Lucas Martin', department: 'Engineering', title: 'Security Engineer', salary: 155000, joinDate: '2019-06-28', status: 'Active' },
  { id: 27, name: 'Penelope Brown', department: 'HR', title: 'L&D Manager', salary: 108000, joinDate: '2020-02-04', status: 'Active' },
  { id: 28, name: 'Aiden Taylor', department: 'Design', title: 'Product Designer', salary: 125000, joinDate: '2019-10-21', status: 'Active' },
  { id: 29, name: 'Layla Jackson', department: 'Sales', title: 'Enterprise AE', salary: 130000, joinDate: '2018-12-03', status: 'Active' },
  { id: 30, name: 'Matthew Clark', department: 'Engineering', title: 'Engineering Manager', salary: 185000, joinDate: '2016-07-15', status: 'Active' },
];

const columns: ColDef<Employee>[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'department', headerName: 'Department', maxWidth: 140 },
  { field: 'title', headerName: 'Title' },
  {
    field: 'salary',
    headerName: 'Salary',
    type: 'numericColumn',
    maxWidth: 130,
    valueFormatter: (params) => `$${params.value?.toLocaleString()}`,
  },
  { field: 'joinDate', headerName: 'Join Date', maxWidth: 130 },
  { field: 'status', headerName: 'Status', maxWidth: 120 },
];

export default function FullFeaturedExample() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Full-Featured DataTable</h2>
      <p style={{ marginBottom: 12, color: '#666' }}>
        All features enabled: sorting, column filters (SetFilter for text, NumberFilter
        for salary), column menu, column visibility toggle, CSV/Excel export, and pagination.
        30 rows of employee data demonstrating the full power of the DataTable.
      </p>
      <DataTable<Employee>
        data={data}
        columns={columns}
        enableSorting
        enableColumnFilter
        enableColumnMenu
        enableColumnVisibility
        enableExport
        exportFileName="employees"
        pagination
        pageSize={10}
        pageSizeOptions={[10, 15, 30]}
        bordered
        hoverable
      />
    </div>
  );
}
