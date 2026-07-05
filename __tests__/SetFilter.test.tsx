/**
 * SetFilter unit tests
 *
 * These tests verify the filter logic in isolation by testing
 * the doesFilterPass behavior through the SetFilterModel interface.
 */

import type { SetFilterModel } from '../src/filters/filter-types';

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
});
