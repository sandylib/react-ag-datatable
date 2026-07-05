import React, { useState, useCallback } from 'react';
import type { GridApi, Column } from 'ag-grid-community';
import {
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
  ArrowUpDown,
  PinIcon,
  Columns3,
  RotateCcw,
  Filter,
  MoveHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '../primitives/DropdownMenu';
import { Checkbox } from '../primitives/Checkbox';

interface ColumnMenuProps {
  api: GridApi;
  column: Column;
  enableSorting?: boolean;
  showColumnMenu?: (source: HTMLElement) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface ColumnEntry {
  colId: string;
  headerName: string;
  visible: boolean;
}

export function ColumnMenu({
  api,
  column,
  enableSorting,
  open,
  onOpenChange,
  children,
}: ColumnMenuProps) {
  const colId = column.getColId();
  const [columns, setColumns] = useState<ColumnEntry[]>([]);

  const refreshColumns = useCallback(() => {
    const cols = api.getColumns?.() ?? [];
    const entries: ColumnEntry[] = [];
    for (const col of cols) {
      const def = col.getColDef();
      if (def.lockVisible) continue;
      const headerName = def.headerName;
      if (!headerName) continue;
      entries.push({
        colId: col.getColId(),
        headerName,
        visible: col.isVisible(),
      });
    }
    setColumns(entries);
  }, [api]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) refreshColumns();
    onOpenChange(nextOpen);
  };

  const handleSort = (direction: 'asc' | 'desc' | null) => {
    api.applyColumnState({
      state: [{ colId, sort: direction }],
      defaultState: { sort: null },
    });
    onOpenChange(false);
  };

  const handlePin = (pinned: 'left' | 'right' | null) => {
    api.setColumnsPinned([colId], pinned);
    onOpenChange(false);
  };

  const handleAutosizeThis = () => {
    api.autoSizeColumns([colId]);
    onOpenChange(false);
  };

  const handleAutosizeAll = () => {
    api.autoSizeAllColumns();
    onOpenChange(false);
  };

  const handleOpenFilter = () => {
    const colInstance = api.getColumn(colId);
    if (colInstance) {
      api.showColumnFilter(colId);
    }
    onOpenChange(false);
  };

  const handleResetColumns = () => {
    api.resetColumnState();
    onOpenChange(false);
  };

  const handleToggleColumn = (targetColId: string, visible: boolean) => {
    api.setColumnsVisible([targetColId], visible);
    setColumns((prev) =>
      prev.map((e) => (e.colId === targetColId ? { ...e, visible } : e)),
    );
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={4}>
        {enableSorting && (
          <>
            <DropdownMenuItem
              icon={<ArrowUpNarrowWide className="h-4 w-4" />}
              onClick={() => handleSort('asc')}
            >
              Sort Ascending
            </DropdownMenuItem>
            <DropdownMenuItem
              icon={<ArrowDownNarrowWide className="h-4 w-4" />}
              onClick={() => handleSort('desc')}
            >
              Sort Descending
            </DropdownMenuItem>
            <DropdownMenuItem
              icon={<ArrowUpDown className="h-4 w-4" />}
              onClick={() => handleSort(null)}
            >
              Clear Sort
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<PinIcon className="h-4 w-4" />}>
            Pin Column
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handlePin('left')}>
              Pin Left
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePin('right')}>
              Pin Right
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handlePin(null)}>
              No Pin
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          icon={<MoveHorizontal className="h-4 w-4" />}
          onClick={handleAutosizeThis}
        >
          Autosize This Column
        </DropdownMenuItem>
        <DropdownMenuItem
          icon={<MoveHorizontal className="h-4 w-4" />}
          onClick={handleAutosizeAll}
        >
          Autosize All Columns
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          icon={<Filter className="h-4 w-4" />}
          onClick={handleOpenFilter}
        >
          Open Filter
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<Columns3 className="h-4 w-4" />}>
            Choose Columns
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="max-h-[300px] overflow-y-auto">
            {columns.map((entry) => (
              <div key={entry.colId} className="px-2 py-1">
                <Checkbox
                  checked={entry.visible}
                  onCheckedChange={(checked) =>
                    handleToggleColumn(entry.colId, checked)
                  }
                  label={entry.headerName}
                />
              </div>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          icon={<RotateCcw className="h-4 w-4" />}
          onClick={handleResetColumns}
        >
          Reset Columns
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
