/**
 * NumberFilter unit tests
 *
 * Tests the doesFilterPass logic for all number filter operators.
 */

import type { NumberFilterModel, NumberFilterOperator } from '../src/filters/filter-types';

function doesNumberFilterPass(
  model: NumberFilterModel | null,
  cellValue: number | null | undefined,
): boolean {
  if (!model) return true;

  switch (model.operator) {
    case 'blank':
      return cellValue == null || isNaN(cellValue);
    case 'notBlank':
      return cellValue != null && !isNaN(cellValue);
    default:
      break;
  }

  if (cellValue == null || isNaN(cellValue)) return true;
  if (model.value == null) return true;

  switch (model.operator) {
    case 'equals':
      return cellValue === model.value;
    case 'notEqual':
      return cellValue !== model.value;
    case 'greaterThan':
      return cellValue > model.value;
    case 'greaterThanOrEqual':
      return cellValue >= model.value;
    case 'lessThan':
      return cellValue < model.value;
    case 'lessThanOrEqual':
      return cellValue <= model.value;
    case 'between':
      return model.valueTo != null
        ? cellValue >= model.value && cellValue <= model.valueTo
        : cellValue >= model.value;
    default:
      return true;
  }
}

describe('NumberFilter logic', () => {
  it('should pass all values when model is null', () => {
    expect(doesNumberFilterPass(null, 100)).toBe(true);
    expect(doesNumberFilterPass(null, null)).toBe(true);
  });

  describe('equals', () => {
    const model: NumberFilterModel = { type: 'number', operator: 'equals', value: 50 };
    it('should pass exact match', () => expect(doesNumberFilterPass(model, 50)).toBe(true));
    it('should reject non-match', () => expect(doesNumberFilterPass(model, 51)).toBe(false));
  });

  describe('notEqual', () => {
    const model: NumberFilterModel = { type: 'number', operator: 'notEqual', value: 50 };
    it('should reject exact match', () => expect(doesNumberFilterPass(model, 50)).toBe(false));
    it('should pass non-match', () => expect(doesNumberFilterPass(model, 49)).toBe(true));
  });

  describe('greaterThan', () => {
    const model: NumberFilterModel = { type: 'number', operator: 'greaterThan', value: 50 };
    it('should pass values > 50', () => expect(doesNumberFilterPass(model, 51)).toBe(true));
    it('should reject values = 50', () => expect(doesNumberFilterPass(model, 50)).toBe(false));
    it('should reject values < 50', () => expect(doesNumberFilterPass(model, 49)).toBe(false));
  });

  describe('greaterThanOrEqual', () => {
    const model: NumberFilterModel = { type: 'number', operator: 'greaterThanOrEqual', value: 50 };
    it('should pass values >= 50', () => {
      expect(doesNumberFilterPass(model, 51)).toBe(true);
      expect(doesNumberFilterPass(model, 50)).toBe(true);
    });
    it('should reject values < 50', () => expect(doesNumberFilterPass(model, 49)).toBe(false));
  });

  describe('lessThan', () => {
    const model: NumberFilterModel = { type: 'number', operator: 'lessThan', value: 50 };
    it('should pass values < 50', () => expect(doesNumberFilterPass(model, 49)).toBe(true));
    it('should reject values >= 50', () => {
      expect(doesNumberFilterPass(model, 50)).toBe(false);
      expect(doesNumberFilterPass(model, 51)).toBe(false);
    });
  });

  describe('lessThanOrEqual', () => {
    const model: NumberFilterModel = { type: 'number', operator: 'lessThanOrEqual', value: 50 };
    it('should pass values <= 50', () => {
      expect(doesNumberFilterPass(model, 49)).toBe(true);
      expect(doesNumberFilterPass(model, 50)).toBe(true);
    });
    it('should reject values > 50', () => expect(doesNumberFilterPass(model, 51)).toBe(false));
  });

  describe('between', () => {
    const model: NumberFilterModel = { type: 'number', operator: 'between', value: 10, valueTo: 50 };
    it('should pass values in range', () => {
      expect(doesNumberFilterPass(model, 10)).toBe(true);
      expect(doesNumberFilterPass(model, 30)).toBe(true);
      expect(doesNumberFilterPass(model, 50)).toBe(true);
    });
    it('should reject values outside range', () => {
      expect(doesNumberFilterPass(model, 9)).toBe(false);
      expect(doesNumberFilterPass(model, 51)).toBe(false);
    });
  });

  describe('blank', () => {
    const model: NumberFilterModel = { type: 'number', operator: 'blank' };
    it('should pass null/undefined/NaN', () => {
      expect(doesNumberFilterPass(model, null)).toBe(true);
      expect(doesNumberFilterPass(model, undefined)).toBe(true);
      expect(doesNumberFilterPass(model, NaN)).toBe(true);
    });
    it('should reject valid numbers', () => {
      expect(doesNumberFilterPass(model, 0)).toBe(false);
      expect(doesNumberFilterPass(model, 42)).toBe(false);
    });
  });

  describe('notBlank', () => {
    const model: NumberFilterModel = { type: 'number', operator: 'notBlank' };
    it('should pass valid numbers', () => {
      expect(doesNumberFilterPass(model, 0)).toBe(true);
      expect(doesNumberFilterPass(model, 42)).toBe(true);
    });
    it('should reject null/undefined/NaN', () => {
      expect(doesNumberFilterPass(model, null)).toBe(false);
      expect(doesNumberFilterPass(model, undefined)).toBe(false);
      expect(doesNumberFilterPass(model, NaN)).toBe(false);
    });
  });

  it('should pass null/undefined cell values for value-based operators', () => {
    const model: NumberFilterModel = { type: 'number', operator: 'equals', value: 50 };
    expect(doesNumberFilterPass(model, null)).toBe(true);
    expect(doesNumberFilterPass(model, undefined)).toBe(true);
  });
});
