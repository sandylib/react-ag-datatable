/**
 * SetFilter unit tests
 *
 * These tests verify the filter logic in isolation by testing
 * the doesFilterPass behavior through the SetFilterModel interface.
 */

import type { SetFilterModel } from '../src/filters/filter-types';
import {
  getFiltersExcludingField,
  getSetFilterValuesFromRows,
  normalizeSetFilterValues,
  resolveSetFilterValues,
} from '../src/filters/SetFilter';

function doesSetFilterPass(
  model: SetFilterModel | null,
  cellValue: string | null | undefined,
): boolean {
  if (!model) return true;
  const selected = new Set(model.values);
  const strVal = cellValue != null ? String(cellValue) : '';
  if (!strVal) return true;
  return selected.has(strVal);
}

describe('SetFilter logic', () => {
  it('should pass all values when model is null (no filter)', () => {
    expect(doesSetFilterPass(null, 'AAPL')).toBe(true);
    expect(doesSetFilterPass(null, 'GOOG')).toBe(true);
    expect(doesSetFilterPass(null, null)).toBe(true);
  });

  it('should pass values that are in the selected set', () => {
    const model: SetFilterModel = { type: 'set', values: ['AAPL', 'GOOG'] };
    expect(doesSetFilterPass(model, 'AAPL')).toBe(true);
    expect(doesSetFilterPass(model, 'GOOG')).toBe(true);
  });

  it('should reject values not in the selected set', () => {
    const model: SetFilterModel = { type: 'set', values: ['AAPL'] };
    expect(doesSetFilterPass(model, 'GOOG')).toBe(false);
    expect(doesSetFilterPass(model, 'MSFT')).toBe(false);
  });

  it('should always pass empty/blank values', () => {
    const model: SetFilterModel = { type: 'set', values: ['AAPL'] };
    expect(doesSetFilterPass(model, '')).toBe(true);
    expect(doesSetFilterPass(model, null)).toBe(true);
    expect(doesSetFilterPass(model, undefined)).toBe(true);
  });

  it('should reject all values when selected set is empty', () => {
    const model: SetFilterModel = { type: 'set', values: [] };
    expect(doesSetFilterPass(model, 'AAPL')).toBe(false);
    expect(doesSetFilterPass(model, 'GOOG')).toBe(false);
  });

  it('should normalize unique values', () => {
    expect(normalizeSetFilterValues(['Pending', 'Completed', 'Pending', '', 'Failed'])).toEqual([
      'Completed',
      'Failed',
      'Pending',
    ]);
  });

  it('should use externally provided values instead of current page rows', async () => {
    const values = await resolveSetFilterValues(
      async () => ['Archived', 'Completed', 'Pending'],
      { field: 'status', filters: {} },
    );

    expect(values).toEqual(['Archived', 'Completed', 'Pending']);
  });

  it('should use static externally provided values', async () => {
    const values = await resolveSetFilterValues(
      { status: ['Archived', 'Completed'] },
      { field: 'status', filters: {} },
    );

    expect(values).toEqual(['Archived', 'Completed']);
  });

  it('should fall back to scanning current grid rows when no provider is given', () => {
    const api = {
      forEachNode: (callback: (node: { data: { status: string } }) => void) => {
        callback({ data: { status: 'Completed' } });
        callback({ data: { status: 'Pending' } });
        callback({ data: { status: 'Completed' } });
      },
    };

    const values = getSetFilterValuesFromRows(
      api as never,
      (node: { data: { status: string } }) => node.data.status,
    );

    expect(values).toEqual(['Completed', 'Pending']);
  });

  it('should preserve async provider errors for retry UI', async () => {
    await expect(resolveSetFilterValues(
      async () => {
        throw new Error('Failed to load values');
      },
      { field: 'status', filters: {} },
    )).rejects.toThrow('Failed to load values');
  });

  it('should exclude the current field from filter values query filters', () => {
    const filters = getFiltersExcludingField(
      {
        status: { type: 'set', values: ['Completed'] },
        category: { type: 'set', values: ['Food'] },
      },
      'status',
    );

    expect(filters).toEqual({
      category: { type: 'set', values: ['Food'] },
    });
  });
});
