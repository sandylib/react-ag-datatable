import { useRef, useCallback } from 'react';
import type { GridApi } from 'ag-grid-community';

export function useDataTableApi<TData>() {
  const apiRef = useRef<GridApi<TData> | null>(null);

  const setApi = useCallback((api: GridApi<TData>) => {
    apiRef.current = api;
  }, []);

  return { apiRef, setApi };
}
