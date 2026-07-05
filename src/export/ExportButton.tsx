import React from 'react';
import type { GridApi } from 'ag-grid-community';
import { Download } from 'lucide-react';
import { Button } from '../primitives/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../primitives/DropdownMenu';
import { exportToCSV, exportToExcel, type ExportOptions } from './export-utils';

interface ExportButtonProps {
  gridApi: GridApi | null;
  fileName?: string;
  options?: Omit<ExportOptions, 'fileName'>;
}

export function ExportButton({ gridApi, fileName = 'export', options }: ExportButtonProps) {
  const handleCSV = () => {
    if (!gridApi) return;
    exportToCSV(gridApi, { ...options, fileName: `${fileName}.csv` });
  };

  const handleExcel = () => {
    if (!gridApi) return;
    exportToExcel(gridApi, { ...options, fileName: `${fileName}.xlsx` });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={!gridApi}>
          <Download size={14} />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={handleCSV}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleExcel}>
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
