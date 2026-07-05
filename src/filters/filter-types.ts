export interface SetFilterModel {
  type: 'set';
  values: string[];
}

export type NumberFilterOperator =
  | 'equals'
  | 'notEqual'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'between'
  | 'blank'
  | 'notBlank';

export interface NumberFilterModel {
  type: 'number';
  operator: NumberFilterOperator;
  value?: number;
  valueTo?: number;
}

export type DataTableFilterModel = SetFilterModel | NumberFilterModel;
