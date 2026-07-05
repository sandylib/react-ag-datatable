import { renderHook, act, waitFor } from '@testing-library/react';
import { useDataSource } from '../src/hooks/useDataSource';
import type { DataTableDataSource, DataTableQuery } from '../src/types';

const createMockQuery = (overrides?: Partial<DataTableQuery>): DataTableQuery => ({
  page: 0,
  pageSize: 15,
  sort: null,
  filters: {},
  ...overrides,
});

describe('useDataSource', () => {
  it('should start with loading state when dataSource is provided', () => {
    const dataSource: DataTableDataSource<{ id: number }> = jest.fn(
      () => new Promise(() => {}),
    );
    const { result } = renderHook(() =>
      useDataSource(dataSource, createMockQuery()),
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should not be loading when no dataSource is provided', () => {
    const { result } = renderHook(() =>
      useDataSource(undefined, createMockQuery()),
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual([]);
  });

  it('should resolve data from dataSource', async () => {
    const mockRows = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    const dataSource: DataTableDataSource<{ id: number; name: string }> = jest.fn(
      async () => ({ rows: mockRows, totalRows: 2 }),
    );

    const { result } = renderHook(() =>
      useDataSource(dataSource, createMockQuery()),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockRows);
    expect(result.current.totalRows).toBe(2);
    expect(result.current.error).toBeNull();
  });

  it('should pass the correct query to dataSource', async () => {
    const dataSource = jest.fn(async () => ({ rows: [], totalRows: 0 }));
    const query = createMockQuery({
      page: 2,
      pageSize: 25,
      sort: { field: 'name', direction: 'asc' },
      filters: { status: { type: 'set', values: ['active'] } },
    });

    renderHook(() => useDataSource(dataSource, query));

    await waitFor(() => expect(dataSource).toHaveBeenCalledWith(query));
  });

  it('should handle errors from dataSource', async () => {
    const error = new Error('Network error');
    const dataSource: DataTableDataSource<{ id: number }> = jest.fn(
      async () => { throw error; },
    );

    const { result } = renderHook(() =>
      useDataSource(dataSource, createMockQuery()),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toEqual([]);
  });

  it('should retry on refetch after error', async () => {
    let callCount = 0;
    const dataSource: DataTableDataSource<{ id: number }> = jest.fn(async () => {
      callCount++;
      if (callCount === 1) throw new Error('First call fails');
      return { rows: [{ id: 1 }], totalRows: 1 };
    });

    const { result } = renderHook(() =>
      useDataSource(dataSource, createMockQuery()),
    );

    await waitFor(() => expect(result.current.error).toBeTruthy());

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([{ id: 1 }]);
    expect(result.current.error).toBeNull();
  });
});
