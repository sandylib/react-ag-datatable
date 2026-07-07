/**
 * DataTable integration test stubs.
 *
 * AG Grid doesn't render in JSDOM, so these tests verify the component's
 * TypeScript interface and prop handling rather than visual rendering.
 * For full integration tests, use Playwright or Cypress with a real browser.
 */

import type { DataTableProps } from '../src/types';
import type { ColDef } from 'ag-grid-community';

interface User {
  id: number;
  name: string;
  email: string;
  salary: number;
}

const sampleColumns: ColDef<User>[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'email', headerName: 'Email' },
  { field: 'salary', headerName: 'Salary', type: 'numericColumn' },
];

const sampleData: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', salary: 50000 },
  { id: 2, name: 'Bob', email: 'bob@example.com', salary: 60000 },
];

describe('DataTableProps type checks', () => {
  it('should accept local mode props', () => {
    const props: DataTableProps<User> = {
      data: sampleData,
      columns: sampleColumns,
    };
    expect(props.data).toHaveLength(2);
    expect(props.columns).toHaveLength(3);
  });

  it('should accept API mode props', () => {
    const props: DataTableProps<User> = {
      dataSource: async (query) => {
        expect(query.page).toBeDefined();
        expect(query.pageSize).toBeDefined();
        return { rows: sampleData, totalRows: 100 };
      },
      columns: sampleColumns,
    };
    expect(props.dataSource).toBeDefined();
  });

  it('should accept server-side set filter values source', () => {
    const props: DataTableProps<User> = {
      dataSource: async () => ({ rows: sampleData, totalRows: 100 }),
      setFilterValuesSource: async ({ field, filters }) => {
        expect(field).toBe('name');
        expect(filters).toBeDefined();
        return ['Alice', 'Bob'];
      },
      columns: sampleColumns,
      enableColumnFilter: true,
    };
    expect(props.setFilterValuesSource).toBeDefined();
  });

  it('should accept static set filter values', () => {
    const props: DataTableProps<User> = {
      dataSource: async () => ({ rows: sampleData, totalRows: 100 }),
      setFilterValuesSource: {
        name: ['Alice', 'Bob', 'Carol'],
      },
      columns: sampleColumns,
      enableColumnFilter: true,
    };
    expect(props.setFilterValuesSource).toEqual({ name: ['Alice', 'Bob', 'Carol'] });
  });

  it('should accept all optional feature props', () => {
    const props: DataTableProps<User> = {
      data: sampleData,
      columns: sampleColumns,
      size: 'sm',
      bordered: true,
      hoverable: true,
      enableSorting: true,
      enableColumnFilter: true,
      enableColumnMenu: true,
      enableColumnReorder: true,
      enableRowReorder: true,
      enableColumnVisibility: true,
      pagination: true,
      pageSize: 25,
      pageSizeOptions: [10, 25, 50],
      rowIdAccessor: 'id',
      onRowClick: (row) => console.log(row.name),
      rowClassName: (row) => (row.salary > 55000 ? 'high-salary' : undefined),
      pinnedTopRows: [sampleData[0]],
      emptyOverlay: 'No users found',
      className: 'my-table',
    };
    expect(props.enableSorting).toBe(true);
    expect(props.pagination).toBe(true);
  });

  it('should accept pagination config object', () => {
    const props: DataTableProps<User> = {
      data: sampleData,
      columns: sampleColumns,
      pagination: { pageSize: 25, pageSizeOptions: [25, 50, 100] },
    };
    expect(typeof props.pagination).toBe('object');
  });

  it('should accept custom overlay props', () => {
    const props: DataTableProps<User> = {
      dataSource: async () => ({ rows: [], totalRows: 0 }),
      columns: sampleColumns,
      loadingOverlay: 'Loading...',
      errorOverlay: (error, retry) => `Error: ${error.message}`,
      emptyOverlay: 'Empty',
    };
    expect(props.loadingOverlay).toBeDefined();
    expect(props.errorOverlay).toBeDefined();
  });
});
