import React, { useMemo, useCallback, useRef, useState } from 'react';
import {
  AllCommunityModule,
  type ColDef,
  type GridReadyEvent,
  type RowDragEndEvent,
  type RowClickedEvent,
  type GridApi,
  type SortChangedEvent,
  type FilterChangedEvent,
  type PaginationChangedEvent,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { cn } from './utils/cn';
import { gridTheme, gridIcons } from './theme';
import type { DataTableProps, DataTableQuery, PaginationConfig } from './types';
import type { DataTableFilterModel } from './filters/filter-types';
import { SetFilter } from './filters/SetFilter';
import { NumberFilter } from './filters/NumberFilter';
import { ColumnMenuHeader } from './column-menu/ColumnMenuHeader';
import { ColumnVisibilityPanel } from './panels/ColumnVisibilityPanel';
import { Pagination } from './pagination/Pagination';
import { LoadingOverlay } from './overlays/LoadingOverlay';
import { ErrorOverlay } from './overlays/ErrorOverlay';
import { EmptyOverlay } from './overlays/EmptyOverlay';
import { useDataSource } from './hooks/useDataSource';

const modules = [AllCommunityModule];

const DEFAULT_PAGE_SIZE = 15;
const DEFAULT_PAGE_SIZE_OPTIONS = [15, 25, 50, 100];

function isNumericColumn<TData>(col: ColDef<TData>): boolean {
  if (col.filter === NumberFilter || col.filter === 'numberFilter') return true;
  if (col.type === 'numericColumn' || col.type === 'numberColumn') return true;
  return false;
}

export function DataTable<TData>({
  data,
  dataSource,
  columns,
  size = 'md',
  bordered,
  hoverable,
  enableSorting = false,
  enableColumnFilter = false,
  enableColumnMenu = false,
  enableColumnReorder = false,
  enableRowReorder = false,
  enableColumnVisibility = false,
  pagination: paginationProp,
  pageSize: pageSizeProp,
  pageSizeOptions: pageSizeOptionsProp,
  onRowReorder,
  rowIdAccessor = 'id' as keyof TData & string,
  isRowFilterable,
  onRowClick,
  rowClassName,
  emptyOverlay: emptyOverlayProp,
  loadingOverlay: loadingOverlayProp,
  errorOverlay: errorOverlayProp,
  pinnedTopRows,
  className,
}: DataTableProps<TData>) {
  const gridRef = useRef<GridApi<TData> | null>(null);
  const [gridApiState, setGridApiState] = useState<GridApi<TData> | null>(null);

  // --- Pagination config ---
  const paginationEnabled = !!paginationProp;
  const paginationConfig: PaginationConfig = typeof paginationProp === 'object' ? paginationProp : {};
  const resolvedPageSize = pageSizeProp ?? paginationConfig.pageSize ?? DEFAULT_PAGE_SIZE;
  const resolvedPageSizeOptions = pageSizeOptionsProp ?? paginationConfig.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS;

  // --- API mode state ---
  const isApiMode = !!dataSource;
  const [apiPage, setApiPage] = useState(0);
  const [apiPageSize, setApiPageSize] = useState(resolvedPageSize);
  const [apiSort, setApiSort] = useState<DataTableQuery['sort']>(null);
  const [apiFilters, setApiFilters] = useState<Record<string, DataTableFilterModel>>({});

  const apiQuery: DataTableQuery = useMemo(
    () => ({ page: apiPage, pageSize: apiPageSize, sort: apiSort, filters: apiFilters }),
    [apiPage, apiPageSize, apiSort, apiFilters],
  );

  const { data: apiData, totalRows: apiTotalRows, isLoading, error, refetch } = useDataSource(
    dataSource,
    apiQuery,
  );

  // --- Local mode pagination state ---
  const [localPage, setLocalPage] = useState(0);
  const [localPageSize, setLocalPageSize] = useState(resolvedPageSize);
  const [localTotalRows, setLocalTotalRows] = useState(0);
  const [localTotalPages, setLocalTotalPages] = useState(0);

  const rowData = isApiMode ? apiData : data;

  // --- Sizes ---
  const rowHeight = size === 'sm' ? 36 : 44;
  const headerHeight = size === 'sm' ? 36 : 44;

  // --- Default column def ---
  const defaultColDef = useMemo<ColDef<TData>>(
    () => ({
      sortable: enableSorting,
      filter: enableColumnFilter ? SetFilter : false,
      resizable: true,
      suppressMovable: !enableColumnReorder,
      flex: 1,
      minWidth: 80,
      ...(enableColumnMenu ? { headerComponent: ColumnMenuHeader } : {}),
    }),
    [enableSorting, enableColumnFilter, enableColumnReorder, enableColumnMenu],
  );

  // --- Process columns ---
  const agColumns = useMemo<ColDef<TData>[]>(() => {
    return columns.map((col, idx) => {
      const agCol: ColDef<TData> = { ...col };

      if (enableRowReorder && idx === 0) {
        agCol.rowDrag = true;
      }

      if (enableColumnFilter && col.filter !== false) {
        if (isNumericColumn(col)) {
          agCol.filter = NumberFilter;
        } else if (!col.filter) {
          agCol.filter = SetFilter;
        }
      }

      return agCol;
    });
  }, [columns, enableRowReorder, enableColumnFilter]);

  // --- Grid events ---
  const onGridReady = useCallback(
    (event: GridReadyEvent<TData>) => {
      gridRef.current = event.api;
      setGridApiState(event.api);
    },
    [],
  );

  const handleRowDragEnd = useCallback(
    (event: RowDragEndEvent<TData>) => {
      if (!onRowReorder) return;
      const rows: TData[] = [];
      event.api.forEachNodeAfterFilterAndSort((node) => {
        if (node.data) rows.push(node.data);
      });
      onRowReorder(rows);
    },
    [onRowReorder],
  );

  const handleRowClicked = useCallback(
    (event: RowClickedEvent<TData>) => {
      if (!onRowClick || !event.data) return;
      onRowClick(event.data);
    },
    [onRowClick],
  );

  const handleSortChanged = useCallback(
    (event: SortChangedEvent<TData>) => {
      if (!isApiMode) return;
      const sortModel = event.api.getColumnState().find((c) => c.sort);
      if (sortModel?.sort) {
        setApiSort({ field: sortModel.colId, direction: sortModel.sort });
      } else {
        setApiSort(null);
      }
      setApiPage(0);
    },
    [isApiMode],
  );

  const handleFilterChanged = useCallback(
    (event: FilterChangedEvent<TData>) => {
      if (!isApiMode) return;
      const filterModel = event.api.getFilterModel();
      const filters: Record<string, DataTableFilterModel> = {};
      for (const [key, value] of Object.entries(filterModel)) {
        filters[key] = value as DataTableFilterModel;
      }
      setApiFilters(filters);
      setApiPage(0);
    },
    [isApiMode],
  );

  const handlePaginationChanged = useCallback(
    (event: PaginationChangedEvent<TData>) => {
      if (isApiMode) return;
      const api = event.api;
      setLocalPage(api.paginationGetCurrentPage());
      setLocalTotalPages(api.paginationGetTotalPages());
      setLocalTotalRows(api.paginationGetRowCount());
    },
    [isApiMode],
  );

  const getRowId = useCallback(
    (params: { data: TData }) => {
      const id = (params.data as Record<string, unknown>)[rowIdAccessor];
      return id != null ? String(id) : String(Math.random());
    },
    [rowIdAccessor],
  );

  const getRowClass = useCallback(
    (params: { data: TData | undefined }) => {
      if (!params.data) return undefined;
      const classes: string[] = [];
      if (hoverable) classes.push('ag-row-hoverable');
      if (onRowClick) classes.push('cursor-pointer');
      if (rowClassName) {
        const extra = rowClassName(params.data);
        if (extra) classes.push(extra);
      }
      return classes.join(' ') || undefined;
    },
    [hoverable, onRowClick, rowClassName],
  );

  const isExternalFilterPresent = useCallback(() => !!isRowFilterable, [isRowFilterable]);

  const doesExternalFilterPass = useCallback(
    (node: { data: TData | undefined }) => {
      if (!isRowFilterable || !node.data) return true;
      return isRowFilterable(node.data);
    },
    [isRowFilterable],
  );

  // --- Overlay components ---
  const noRowsOverlay = useMemo(() => {
    if (error) {
      return function CdtErrorOverlay() {
        if (errorOverlayProp) {
          return <>{errorOverlayProp(error, refetch)}</>;
        }
        return <ErrorOverlay error={error} onRetry={refetch} />;
      };
    }
    return function CdtEmptyOverlay() {
      if (emptyOverlayProp) return <>{emptyOverlayProp}</>;
      return <EmptyOverlay />;
    };
  }, [error, refetch, errorOverlayProp, emptyOverlayProp]);

  const loadingOverlayComponent = useMemo(() => {
    return function CdtLoadingOverlay() {
      if (loadingOverlayProp) return <>{loadingOverlayProp}</>;
      return <LoadingOverlay />;
    };
  }, [loadingOverlayProp]);

  // --- Pagination handlers ---
  const handlePageChange = useCallback(
    (page: number) => {
      if (isApiMode) {
        setApiPage(page);
      } else {
        gridRef.current?.paginationGoToPage(page);
      }
    },
    [isApiMode],
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      if (isApiMode) {
        setApiPageSize(newPageSize);
        setApiPage(0);
      } else {
        gridRef.current?.setGridOption('paginationPageSize', newPageSize);
        setLocalPageSize(newPageSize);
      }
    },
    [isApiMode],
  );

  // --- Pagination display values ---
  const paginationCurrentPage = isApiMode ? apiPage : localPage;
  const paginationTotalRows = isApiMode ? apiTotalRows : localTotalRows;
  const paginationTotalPages = isApiMode
    ? Math.max(1, Math.ceil(apiTotalRows / apiPageSize))
    : localTotalPages;
  const paginationPageSize = isApiMode ? apiPageSize : localPageSize;

  return (
    <div
      data-cdt-datatable=""
      className={cn(
        'w-full',
        bordered && 'border border-[hsl(var(--cdt-border))] rounded-[var(--cdt-radius)] overflow-hidden',
        className,
      )}
    >
      {enableColumnVisibility && (
        <div className="flex justify-end px-2 py-1">
          <ColumnVisibilityPanel gridApi={gridApiState} />
        </div>
      )}

      <AgGridReact<TData>
        modules={modules}
        theme={gridTheme}
        icons={gridIcons}
        rowData={rowData}
        columnDefs={agColumns}
        defaultColDef={defaultColDef}
        rowHeight={rowHeight}
        headerHeight={headerHeight}
        domLayout="autoHeight"
        suppressCellFocus
        loading={isLoading}
        rowDragManaged={enableRowReorder}
        animateRows={enableRowReorder}
        getRowId={getRowId}
        getRowClass={getRowClass}
        onGridReady={onGridReady}
        onRowDragEnd={enableRowReorder ? handleRowDragEnd : undefined}
        onRowClicked={onRowClick ? handleRowClicked : undefined}
        onSortChanged={isApiMode ? handleSortChanged : undefined}
        onFilterChanged={isApiMode ? handleFilterChanged : undefined}
        pinnedTopRowData={pinnedTopRows}
        noRowsOverlayComponent={noRowsOverlay}
        loadingOverlayComponent={loadingOverlayComponent}
        isExternalFilterPresent={isRowFilterable ? isExternalFilterPresent : undefined}
        doesExternalFilterPass={isRowFilterable ? doesExternalFilterPass : undefined}
        // Local mode pagination
        pagination={paginationEnabled && !isApiMode}
        paginationPageSize={paginationEnabled && !isApiMode ? resolvedPageSize : undefined}
        suppressPaginationPanel={paginationEnabled}
        onPaginationChanged={paginationEnabled && !isApiMode ? handlePaginationChanged : undefined}
      />

      {paginationEnabled && (
        <Pagination
          currentPage={paginationCurrentPage}
          totalPages={paginationTotalPages}
          totalRows={paginationTotalRows}
          pageSize={paginationPageSize}
          pageSizeOptions={resolvedPageSizeOptions}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}
