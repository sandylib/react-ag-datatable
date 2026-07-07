import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useGridFilter } from 'ag-grid-react';
import type { CustomFilterProps } from 'ag-grid-react';
import type { GridApi, IDoesFilterPassParams, IRowNode } from 'ag-grid-community';
import { Checkbox } from '../primitives/Checkbox';
import { Input } from '../primitives/Input';
import { Button } from '../primitives/Button';
import { Search } from 'lucide-react';
import type { DataTableFilterModel, SetFilterModel } from './filter-types';
import type { SetFilterValuesQuery, SetFilterValuesSource } from '../types';

interface DataTableFilterContext {
  setFilterValuesSource?: SetFilterValuesSource;
  filters?: Record<string, DataTableFilterModel>;
}

export function normalizeSetFilterValues(values: string[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];

  for (const value of values) {
    const strVal = value != null ? String(value) : '';
    if (strVal && !seen.has(strVal)) {
      seen.add(strVal);
      ordered.push(strVal);
    }
  }

  return ordered.sort((a, b) => a.localeCompare(b));
}

export function getFiltersExcludingField(
  filters: Record<string, DataTableFilterModel> | undefined,
  field: string,
): Record<string, DataTableFilterModel> {
  const next: Record<string, DataTableFilterModel> = {};

  for (const [key, value] of Object.entries(filters ?? {})) {
    if (key !== field) {
      next[key] = value;
    }
  }

  return next;
}

export function getSetFilterValuesFromRows<TData>(
  api: GridApi<TData>,
  getValue: (node: IRowNode<TData>) => unknown,
): string[] {
  const values: string[] = [];

  api.forEachNode((node) => {
    if (node.data) {
      const val = getValue(node);
      values.push(val != null ? String(val) : '');
    }
  });

  return normalizeSetFilterValues(values);
}

export async function resolveSetFilterValues(
  source: SetFilterValuesSource,
  query: SetFilterValuesQuery,
): Promise<string[]> {
  const values = typeof source === 'function'
    ? await source(query)
    : source[query.field] ?? [];

  return normalizeSetFilterValues(values);
}

export function SetFilter(props: CustomFilterProps<unknown, DataTableFilterContext, SetFilterModel>) {
  const { model, onModelChange, api, getValue, column, colDef, context } = props;
  const [uniqueValues, setUniqueValues] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingValues, setIsLoadingValues] = useState(false);
  const [valuesError, setValuesError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const getValueRef = useRef(getValue);
  getValueRef.current = getValue;
  const loadIdRef = useRef(0);

  const field = colDef.field ?? column.getColId();
  const filterValuesSource = context?.setFilterValuesSource;
  const contextFilters = context?.filters;

  const refreshValues = useCallback(() => {
    const loadId = ++loadIdRef.current;
    setValuesError(null);

    if (!filterValuesSource) {
      setIsLoadingValues(false);
      setUniqueValues(getSetFilterValuesFromRows(api, (node) => getValueRef.current(node)));
      return;
    }

    const query: SetFilterValuesQuery = {
      field,
      filters: getFiltersExcludingField(contextFilters, field),
    };

    setIsLoadingValues(typeof filterValuesSource === 'function');
    void resolveSetFilterValues(filterValuesSource, query)
      .then((values) => {
        if (loadId !== loadIdRef.current) return;
        setUniqueValues(values);
        setValuesError(null);
      })
      .catch((err) => {
        if (loadId !== loadIdRef.current) return;
        setValuesError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (loadId !== loadIdRef.current) return;
        setIsLoadingValues(false);
      });
  }, [api, contextFilters, field, filterValuesSource]);

  useEffect(() => {
    refreshValues();

    if (filterValuesSource) return undefined;

    const handler = () => refreshValues();
    api.addEventListener('rowDataUpdated', handler);
    return () => {
      api.removeEventListener('rowDataUpdated', handler);
    };
  }, [api, filterValuesSource, refreshValues, reloadKey]);

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
          disabled={isLoadingValues || !!valuesError}
          label={`(Select All)`}
        />
      </div>

      <div className="max-h-[250px] overflow-y-auto p-2 space-y-1">
        {isLoadingValues && (
          <div className="text-xs text-[hsl(var(--cdt-muted-foreground))] py-2 text-center">
            Loading values...
          </div>
        )}
        {!isLoadingValues && valuesError && (
          <div className="space-y-2 py-2 text-center">
            <div className="text-xs text-[hsl(var(--cdt-destructive))]">
              Failed to load values
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Retry
            </Button>
          </div>
        )}
        {!isLoadingValues && !valuesError && filteredValues.map((val) => (
          <div key={val}>
            <Checkbox
              checked={selectedValues.has(val)}
              onCheckedChange={() => handleToggle(val)}
              label={val}
            />
          </div>
        ))}
        {!isLoadingValues && !valuesError && filteredValues.length === 0 && (
          <div className="text-xs text-[hsl(var(--cdt-muted-foreground))] py-2 text-center">
            {searchTerm ? 'No matching values' : 'No values'}
          </div>
        )}
      </div>
    </div>
  );
}
