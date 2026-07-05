import React, { useState, useCallback } from 'react';
import { Columns3 } from 'lucide-react';
import type { GridApi } from 'ag-grid-community';
import { Checkbox } from '../primitives/Checkbox';
import { Popover, PopoverTrigger, PopoverContent } from '../primitives/Popover';

interface ColumnEntry {
  colId: string;
  headerName: string;
  visible: boolean;
}

interface ColumnVisibilityPanelProps {
  gridApi: GridApi | null;
}

export function ColumnVisibilityPanel({ gridApi }: ColumnVisibilityPanelProps) {
  const [columnEntries, setColumnEntries] = useState<ColumnEntry[]>([]);

  const refreshColumns = useCallback(() => {
    if (!gridApi) return;
    const cols = gridApi.getColumns?.() ?? [];
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
    setColumnEntries(entries);
  }, [gridApi]);

  const handleToggle = useCallback(
    (colId: string, checked: boolean) => {
      if (!gridApi) return;
      gridApi.setColumnsVisible([colId], checked);
      setColumnEntries((prev) =>
        prev.map((e) => (e.colId === colId ? { ...e, visible: checked } : e)),
      );
    },
    [gridApi],
  );

  return (
    <Popover>
      <PopoverTrigger
        onClick={refreshColumns}
        className="inline-flex items-center justify-center rounded-[var(--cdt-radius)] p-1.5 text-[hsl(var(--cdt-muted-foreground))] hover:text-[hsl(var(--cdt-foreground))] hover:bg-[hsl(var(--cdt-hover))] transition-colors focus:outline-none"
        aria-label="Toggle column visibility"
      >
        <Columns3 className="h-4 w-4" />
      </PopoverTrigger>

      <PopoverContent align="end" className="min-w-[180px] p-3 flex flex-col gap-2">
        {columnEntries.map((entry) => (
          <Checkbox
            key={entry.colId}
            checked={entry.visible}
            onCheckedChange={(checked) => handleToggle(entry.colId, checked)}
            label={entry.headerName}
          />
        ))}
        {columnEntries.length === 0 && (
          <div className="text-xs text-[hsl(var(--cdt-muted-foreground))] py-1">
            No columns
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
