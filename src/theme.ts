import { themeQuartz } from 'ag-grid-community';

export const gridTheme = themeQuartz.withParams({
  borderColor: 'hsl(var(--cdt-border))',
  headerBackgroundColor: 'hsl(var(--cdt-header-bg))',
  headerTextColor: 'hsl(var(--cdt-muted-foreground))',
  headerFontWeight: 500,
  foregroundColor: 'hsl(var(--cdt-foreground))',
  backgroundColor: 'hsl(var(--cdt-background))',
  rowHoverColor: 'hsl(var(--cdt-row-hover))',
  columnHoverColor: 'transparent',
  selectedRowBackgroundColor: 'hsl(var(--cdt-row-selected))',
  borderRadius: 0,
  wrapperBorderRadius: 0,
  wrapperBorder: false,
  rowBorder: true,
  columnBorder: false,
  headerColumnBorder: false,
  headerColumnResizeHandleColor: 'hsl(var(--cdt-border))',
});

export const gridIcons = {
  filter: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  filterActive: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--cdt-primary))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
};
