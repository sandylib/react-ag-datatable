import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalRows,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const rangeStart = totalRows === 0 ? 0 : currentPage * pageSize + 1;
  const rangeEnd = Math.min((currentPage + 1) * pageSize, totalRows);
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <div className="flex items-center justify-between px-2 py-2 text-[hsl(var(--cdt-foreground))]">
      <div className="flex items-center gap-3">
        <span className="text-xs text-[hsl(var(--cdt-muted-foreground))]">
          {rangeStart}&ndash;{rangeEnd} of {totalRows}
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className={cn(
            'text-xs border border-[hsl(var(--cdt-border))] rounded-[var(--cdt-radius)]',
            'px-1.5 py-1 bg-[hsl(var(--cdt-background))] text-[hsl(var(--cdt-foreground))]',
            'cursor-pointer',
          )}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={() => onPageChange(currentPage - 1)}
          className={cn(
            'inline-flex items-center gap-1 rounded-[var(--cdt-radius)] px-2.5 py-1.5 text-xs font-medium',
            'text-[hsl(var(--cdt-muted-foreground))] hover:text-[hsl(var(--cdt-foreground))] hover:bg-[hsl(var(--cdt-hover))]',
            'disabled:opacity-40 disabled:pointer-events-none transition-colors',
          )}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </button>
        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => onPageChange(currentPage + 1)}
          className={cn(
            'inline-flex items-center gap-1 rounded-[var(--cdt-radius)] px-2.5 py-1.5 text-xs font-medium',
            'text-[hsl(var(--cdt-muted-foreground))] hover:text-[hsl(var(--cdt-foreground))] hover:bg-[hsl(var(--cdt-hover))]',
            'disabled:opacity-40 disabled:pointer-events-none transition-colors',
          )}
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
