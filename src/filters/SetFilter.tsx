import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useGridFilter } from 'ag-grid-react';
import type { CustomFilterProps } from 'ag-grid-react';
import type { IDoesFilterPassParams } from 'ag-grid-community';
import { Checkbox } from '../primitives/Checkbox';
import { Input } from '../primitives/Input';
import { Search } from 'lucide-react';

interface SetFilterModel {
  type: 'set';
  values: string[];
}

export function SetFilter(props: CustomFilterProps) {
  const { model, onModelChange, api, getValue } = props;
  const [uniqueValues, setUniqueValues] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const getValueRef = useRef(getValue);
  getValueRef.current = getValue;

  const refreshValues = useCallback(() => {
    const seen = new Set<string>();
    const ordered: string[] = [];
    api.forEachNode((node) => {
      if (node.data) {
        const val = getValueRef.current(node);
        const strVal = val != null ? String(val) : '';
        if (strVal && !seen.has(strVal)) {
          seen.add(strVal);
          ordered.push(strVal);
        }
      }
    });
    ordered.sort((a, b) => a.localeCompare(b));
    setUniqueValues(ordered);
  }, [api]);

  useEffect(() => {
    refreshValues();

    const handler = () => refreshValues();
    api.addEventListener('rowDataUpdated', handler);
    return () => {
      api.removeEventListener('rowDataUpdated', handler);
    };
  }, [api, refreshValues]);

  const filteredValues = useMemo(() => {
    if (!searchTerm.trim()) return uniqueValues;
    const term = searchTerm.toLowerCase().trim();
    return uniqueValues.filter((v) => v.toLowerCase().includes(term));
  }, [uniqueValues, searchTerm]);

  const selectedValues = useMemo<Set<string>>(() => {
    if (!model) return new Set(uniqueValues);
    return new Set((model as SetFilterModel).values);
  }, [model, uniqueValues]);

  const allVisibleSelected = useMemo(
    () => filteredValues.length > 0 && filteredValues.every((v) => selectedValues.has(v)),
    [filteredValues, selectedValues],
  );

  const someVisibleSelected = useMemo(
    () => filteredValues.some((v) => selectedValues.has(v)) && !allVisibleSelected,
    [filteredValues, selectedValues, allVisibleSelected],
  );

  const doesFilterPass = useCallback(
    (params: IDoesFilterPassParams) => {
      if (!model) return true;
      const filterModel = model as SetFilterModel;
      const selected = new Set(filterModel.values);
      const val = getValueRef.current(params.node);
      const strVal = val != null ? String(val) : '';
      if (!strVal) return true;
      return selected.has(strVal);
    },
    [model],
  );

  useGridFilter({ doesFilterPass });

  const handleToggle = (val: string) => {
    const next = new Set(selectedValues);
    if (next.has(val)) {
      next.delete(val);
    } else {
      next.add(val);
    }
    if (next.size >= uniqueValues.length) {
      onModelChange(null);
    } else {
      onModelChange({ type: 'set', values: Array.from(next) } as SetFilterModel);
    }
  };

  const handleSelectAll = () => {
    if (allVisibleSelected) {
      const next = new Set(selectedValues);
      for (const v of filteredValues) {
        next.delete(v);
      }
      onModelChange({ type: 'set', values: Array.from(next) } as SetFilterModel);
    } else {
      const next = new Set(selectedValues);
      for (const v of filteredValues) {
        next.add(v);
      }
      if (next.size >= uniqueValues.length) {
        onModelChange(null);
      } else {
        onModelChange({ type: 'set', values: Array.from(next) } as SetFilterModel);
      }
    }
  };

  return (
    <div className="min-w-[220px] bg-[hsl(var(--cdt-background))] text-[hsl(var(--cdt-foreground))]">
      <div className="p-2 border-b border-[hsl(var(--cdt-border))]">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="h-3.5 w-3.5" />}
          autoFocus
        />
      </div>

      <div className="p-2 border-b border-[hsl(var(--cdt-border))]">
        <Checkbox
          checked={allVisibleSelected ? true : someVisibleSelected ? 'indeterminate' : false}
          onCheckedChange={handleSelectAll}
          label={`(Select All)`}
        />
      </div>

      <div className="max-h-[250px] overflow-y-auto p-2 space-y-1">
        {filteredValues.map((val) => (
          <div key={val}>
            <Checkbox
              checked={selectedValues.has(val)}
              onCheckedChange={() => handleToggle(val)}
              label={val}
            />
          </div>
        ))}
        {filteredValues.length === 0 && (
          <div className="text-xs text-[hsl(var(--cdt-muted-foreground))] py-2 text-center">
            {searchTerm ? 'No matching values' : 'No values'}
          </div>
        )}
      </div>
    </div>
  );
}
