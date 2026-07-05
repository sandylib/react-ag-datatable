import type React from 'react';
import type { ColDef } from 'ag-grid-community';
import type { DataTableFilterModel } from './filters/filter-types';

// ---------------------------------------------------------------------------
// DataSource (API mode)
// ---------------------------------------------------------------------------

export interface DataTableSortModel {
  field: string;
  direction: 'asc' | 'desc';
}

export interface DataTableQuery {
  page: number;
  pageSize: number;
  sort: DataTableSortModel | null;
  filters: Record<string, DataTableFilterModel>;
}

export interface DataTableResponse<TData> {
  rows: TData[];
  totalRows: number;
}

export type DataTableDataSource<TData> = (
  query: DataTableQuery,
) => Promise<DataTableResponse<TData>>;

// ---------------------------------------------------------------------------
// Pagination config
// ---------------------------------------------------------------------------

export interface PaginationConfig {
  pageSize?: number;
  pageSizeOptions?: number[];
}

// ---------------------------------------------------------------------------
// DataTable props
// ---------------------------------------------------------------------------

export interface DataTableProps<TData> {
  // --- Data ---

  /** Row data for local mode. Mutually exclusive with `dataSource`. */
  data?: TData[];

  /** Async data fetcher for API mode. Mutually exclusive with `data`. */
  dataSource?: DataTableDataSource<TData>;

  /** AG Grid column definitions. */
  columns: ColDef<TData>[];

  // --- Appearance ---

  /** Compact or default row density. Default: 'md'. */
  size?: 'sm' | 'md';
  /** Show outer border around the table. */
  bordered?: boolean;
  /** Highlight rows on hover. */
  hoverable?: boolean;

  // --- Features ---

  /** Enable click-to-sort on column headers. Default: false. */
  enableSorting?: boolean;
  /** Enable column header filter panels (SetFilter for text, NumberFilter for numbers). Default: false. */
  enableColumnFilter?: boolean;
  /** Enable column header menu (sort, pin, autosize, column chooser). Default: false. */
  enableColumnMenu?: boolean;
  /** Enable drag-to-reorder columns. Default: false. */
  enableColumnReorder?: boolean;
  /** Enable drag-to-reorder rows. Default: false. */
  enableRowReorder?: boolean;
  /** Enable column visibility toggle panel. Default: false. */
  enableColumnVisibility?: boolean;

  // --- Pagination ---

  /** Enable pagination. Pass `true` for defaults or a config object. */
  pagination?: boolean | PaginationConfig;
  /** Default page size. Default: 15. Shorthand for `pagination={{ pageSize }}`. */
  pageSize?: number;
  /** Page size dropdown options. Default: [15, 25, 50, 100]. */
  pageSizeOptions?: number[];

  // --- Row interactions ---

  /** Called when rows are reordered via drag. */
  onRowReorder?: (data: TData[]) => void;
  /** Key to use as row identifier. Default: 'id'. */
  rowIdAccessor?: keyof TData & string;
  /** Determines if a row participates in filtering. Rows returning false are always shown. */
  isRowFilterable?: (row: TData) => boolean;
  /** Called when a body row is clicked. */
  onRowClick?: (row: TData) => void;
  /** Return additional className(s) per row. */
  rowClassName?: (row: TData) => string | undefined;
  /** Rows pinned to the top (always visible, not affected by sort/filter). */
  pinnedTopRows?: TData[];

  // --- Overlays ---

  /** Custom loading overlay. Shown during dataSource fetches. */
  loadingOverlay?: React.ReactNode;
  /** Custom error overlay. Receives the error and a retry callback. */
  errorOverlay?: (error: Error, retry: () => void) => React.ReactNode;
  /** Custom empty state overlay. */
  emptyOverlay?: React.ReactNode;

  /** Additional wrapper className. */
  className?: string;
}
