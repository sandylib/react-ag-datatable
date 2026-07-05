import { useState, useEffect, useCallback, useRef } from 'react';
import type { DataTableDataSource, DataTableQuery, DataTableResponse } from '../types';

interface UseDataSourceState<TData> {
  data: TData[];
  totalRows: number;
  isLoading: boolean;
  error: Error | null;
}

interface UseDataSourceReturn<TData> extends UseDataSourceState<TData> {
  refetch: () => void;
}

export function useDataSource<TData>(
  dataSource: DataTableDataSource<TData> | undefined,
  query: DataTableQuery,
): UseDataSourceReturn<TData> {
  const [state, setState] = useState<UseDataSourceState<TData>>({
    data: [],
    totalRows: 0,
    isLoading: !!dataSource,
    error: null,
  });

  const queryRef = useRef(query);
  queryRef.current = query;
  const dataSourceRef = useRef(dataSource);
  dataSourceRef.current = dataSource;
  const fetchIdRef = useRef(0);

  const fetchData = useCallback(async () => {
    const ds = dataSourceRef.current;
    if (!ds) return;

    const fetchId = ++fetchIdRef.current;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response: DataTableResponse<TData> = await ds(queryRef.current);

      if (fetchId !== fetchIdRef.current) return;

      setState({
        data: response.rows,
        totalRows: response.totalRows,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      if (fetchId !== fetchIdRef.current) return;

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error(String(err)),
      }));
    }
  }, []);

  useEffect(() => {
    if (!dataSource) return;
    fetchData();
  }, [
    dataSource,
    query.page,
    query.pageSize,
    JSON.stringify(query.sort),
    JSON.stringify(query.filters),
    fetchData,
  ]);

  return {
    ...state,
    refetch: fetchData,
  };
}
