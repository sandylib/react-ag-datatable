import React, { useRef, useState } from 'react';
import type { CustomHeaderProps } from 'ag-grid-react';
import { ColumnMenu } from './ColumnMenu';
import { MoreVertical, ArrowUp, ArrowDown } from 'lucide-react';

export function ColumnMenuHeader(props: CustomHeaderProps) {
  const { displayName, column, api, enableSorting, enableMenu, showColumnMenu } = props;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);

  const sortState = column.getSort();

  const handleSort = (e: React.MouseEvent) => {
    if (!enableSorting) return;
    const isMulti = e.shiftKey;
    if (!sortState) {
      props.setSort('asc', isMulti);
    } else if (sortState === 'asc') {
      props.setSort('desc', isMulti);
    } else {
      props.setSort(null, isMulti);
    }
  };

  return (
    <div className="flex items-center w-full gap-1 group">
      <div
        className="flex-1 truncate cursor-pointer select-none flex items-center gap-1"
        onClick={handleSort}
      >
        <span className="truncate">{displayName}</span>
        {sortState === 'asc' && <ArrowUp className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--cdt-primary))]" />}
        {sortState === 'desc' && <ArrowDown className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--cdt-primary))]" />}
      </div>

      {enableMenu !== false && (
        <ColumnMenu
          api={api}
          column={column}
          enableSorting={enableSorting}
          showColumnMenu={showColumnMenu}
          open={menuOpen}
          onOpenChange={setMenuOpen}
        >
          <button
            ref={menuRef}
            type="button"
            className="h-5 w-5 shrink-0 inline-flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 hover:bg-[hsl(var(--cdt-hover))] transition-all"
            aria-label={`Menu for ${displayName}`}
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        </ColumnMenu>
      )}
    </div>
  );
}
