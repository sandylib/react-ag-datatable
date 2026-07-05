import type { GridApi, ColDef } from 'ag-grid-community';

export interface ExportOptions {
  fileName?: string;
  onlyVisible?: boolean;
  includeHeaders?: boolean;
  columnSeparator?: string;
}

function escapeCSVValue(value: unknown): string {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function getVisibleColumns<TData>(api: GridApi<TData>): { colId: string; headerName: string }[] {
  return api
    .getAllDisplayedColumns()
    .map((col) => ({
      colId: col.getColId(),
      headerName: col.getColDef().headerName || col.getColId(),
    }))
    .filter((c) => c.colId !== 'ag-Grid-AutoColumn');
}

function getRowData<TData>(api: GridApi<TData>): TData[] {
  const rows: TData[] = [];
  api.forEachNodeAfterFilterAndSort((node) => {
    if (node.data) rows.push(node.data);
  });
  return rows;
}

function getCellValue<TData>(api: GridApi<TData>, colId: string, row: TData): unknown {
  const col = api.getColumn(colId);
  if (!col) return (row as Record<string, unknown>)[colId];

  const colDef = col.getColDef() as ColDef<TData>;
  const value = (row as Record<string, unknown>)[colDef.field as string] ?? '';

  if (colDef.valueFormatter && typeof colDef.valueFormatter === 'function') {
    return colDef.valueFormatter({ value, data: row, node: null, colDef, column: col, api } as never);
  }

  return value;
}

export function exportToCSV<TData>(api: GridApi<TData>, options: ExportOptions = {}): void {
  const {
    fileName = 'export.csv',
    includeHeaders = true,
    columnSeparator = ',',
  } = options;

  const columns = getVisibleColumns(api);
  const rows = getRowData(api);

  const lines: string[] = [];

  if (includeHeaders) {
    lines.push(columns.map((c) => escapeCSVValue(c.headerName)).join(columnSeparator));
  }

  for (const row of rows) {
    const values = columns.map((c) => escapeCSVValue(getCellValue(api, c.colId, row)));
    lines.push(values.join(columnSeparator));
  }

  const csvContent = lines.join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);
}

export function exportToExcel<TData>(api: GridApi<TData>, options: ExportOptions = {}): void {
  const { fileName = 'export.xlsx', includeHeaders = true } = options;

  const columns = getVisibleColumns(api);
  const rows = getRowData(api);

  const worksheetRows: string[][] = [];

  if (includeHeaders) {
    worksheetRows.push(columns.map((c) => c.headerName));
  }

  for (const row of rows) {
    worksheetRows.push(columns.map((c) => String(getCellValue(api, c.colId, row) ?? '')));
  }

  const xmlParts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?mso-application progid="Excel.Sheet"?>',
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"',
    '  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">',
    '<Styles>',
    '  <Style ss:ID="header"><Font ss:Bold="1"/></Style>',
    '</Styles>',
    '<Worksheet ss:Name="Sheet1">',
    '<Table>',
  ];

  worksheetRows.forEach((row, rowIdx) => {
    xmlParts.push('<Row>');
    row.forEach((cell) => {
      const isNum = !isNaN(Number(cell)) && cell.trim() !== '';
      const style = rowIdx === 0 && includeHeaders ? ' ss:StyleID="header"' : '';
      if (isNum) {
        xmlParts.push(`<Cell${style}><Data ss:Type="Number">${cell}</Data></Cell>`);
      } else {
        const escaped = cell.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        xmlParts.push(`<Cell${style}><Data ss:Type="String">${escaped}</Data></Cell>`);
      }
    });
    xmlParts.push('</Row>');
  });

  xmlParts.push('</Table>', '</Worksheet>', '</Workbook>');

  const blob = new Blob([xmlParts.join('\n')], {
    type: 'application/vnd.ms-excel',
  });
  const name = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') ? fileName : `${fileName}.xlsx`;
  downloadBlob(blob, name);
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
