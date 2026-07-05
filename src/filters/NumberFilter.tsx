import React, { useState, useCallback, useMemo } from 'react';
import { useGridFilter } from 'ag-grid-react';
import type { CustomFilterProps } from 'ag-grid-react';
import type { IDoesFilterPassParams } from 'ag-grid-community';
import { Select } from '../primitives/Select';
import { Input } from '../primitives/Input';
import { Button } from '../primitives/Button';
import type { NumberFilterOperator } from './filter-types';

interface NumberFilterModel {
  type: 'number';
  operator: NumberFilterOperator;
  value?: number;
  valueTo?: number;
}

const OPERATOR_OPTIONS = [
  { value: 'equals', label: 'Equals' },
  { value: 'notEqual', label: 'Does not equal' },
  { value: 'greaterThan', label: 'Greater than' },
  { value: 'greaterThanOrEqual', label: 'Greater than or equal to' },
  { value: 'lessThan', label: 'Less than' },
  { value: 'lessThanOrEqual', label: 'Less than or equal to' },
  { value: 'between', label: 'Between' },
  { value: 'blank', label: 'Blank' },
  { value: 'notBlank', label: 'Not blank' },
];

const NO_VALUE_OPERATORS: NumberFilterOperator[] = ['blank', 'notBlank'];

export function NumberFilter(props: CustomFilterProps) {
  const { model, onModelChange, getValue } = props;

  const currentModel = model as NumberFilterModel | null;
  const [operator, setOperator] = useState<NumberFilterOperator>(
    currentModel?.operator ?? 'equals',
  );
  const [value, setValue] = useState<string>(
    currentModel?.value != null ? String(currentModel.value) : '',
  );
  const [valueTo, setValueTo] = useState<string>(
    currentModel?.valueTo != null ? String(currentModel.valueTo) : '',
  );

  const getValueRef = React.useRef(getValue);
  getValueRef.current = getValue;

  const doesFilterPass = useCallback(
    (params: IDoesFilterPassParams) => {
      if (!model) return true;
      const fm = model as NumberFilterModel;
      const raw = getValueRef.current(params.node);
      const cellValue = raw != null ? Number(raw) : null;

      switch (fm.operator) {
        case 'blank':
          return cellValue == null || isNaN(cellValue);
        case 'notBlank':
          return cellValue != null && !isNaN(cellValue);
        default:
          break;
      }

      if (cellValue == null || isNaN(cellValue)) return true;
      if (fm.value == null) return true;

      switch (fm.operator) {
        case 'equals':
          return cellValue === fm.value;
        case 'notEqual':
          return cellValue !== fm.value;
        case 'greaterThan':
          return cellValue > fm.value;
        case 'greaterThanOrEqual':
          return cellValue >= fm.value;
        case 'lessThan':
          return cellValue < fm.value;
        case 'lessThanOrEqual':
          return cellValue <= fm.value;
        case 'between':
          return fm.valueTo != null
            ? cellValue >= fm.value && cellValue <= fm.valueTo
            : cellValue >= fm.value;
        default:
          return true;
      }
    },
    [model],
  );

  useGridFilter({ doesFilterPass });

  const needsValue = useMemo(
    () => !NO_VALUE_OPERATORS.includes(operator),
    [operator],
  );

  const handleApply = () => {
    if (NO_VALUE_OPERATORS.includes(operator)) {
      onModelChange({ type: 'number', operator } as NumberFilterModel);
      return;
    }

    const numValue = value !== '' ? Number(value) : undefined;
    if (numValue == null || isNaN(numValue)) return;

    const filterModel: NumberFilterModel = { type: 'number', operator, value: numValue };
    if (operator === 'between' && valueTo !== '') {
      filterModel.valueTo = Number(valueTo);
    }
    onModelChange(filterModel);
  };

  const handleReset = () => {
    setOperator('equals');
    setValue('');
    setValueTo('');
    onModelChange(null);
  };

  return (
    <div className="min-w-[220px] p-3 bg-[hsl(var(--cdt-background))] text-[hsl(var(--cdt-foreground))] space-y-3">
      <Select
        value={operator}
        onValueChange={(v) => setOperator(v as NumberFilterOperator)}
        options={OPERATOR_OPTIONS}
      />

      {needsValue && (
        <Input
          type="number"
          placeholder="Filter value..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}

      {operator === 'between' && (
        <Input
          type="number"
          placeholder="To value..."
          value={valueTo}
          onChange={(e) => setValueTo(e.target.value)}
        />
      )}

      <div className="flex gap-2">
        <Button variant="default" size="sm" onClick={handleApply} className="flex-1">
          Apply
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset} className="flex-1">
          Reset
        </Button>
      </div>
    </div>
  );
}
