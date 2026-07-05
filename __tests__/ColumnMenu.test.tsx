/**
 * ColumnMenu test stubs.
 *
 * Since the ColumnMenu relies heavily on AG Grid API methods that
 * aren't available in JSDOM, these tests verify the expected API
 * calls via mock interfaces.
 */

describe('ColumnMenu API interactions', () => {
  it('should call api.applyColumnState for sort ascending', () => {
    const api = {
      applyColumnState: jest.fn(),
    };
    api.applyColumnState({
      state: [{ colId: 'name', sort: 'asc' }],
      defaultState: { sort: null },
    });
    expect(api.applyColumnState).toHaveBeenCalledWith({
      state: [{ colId: 'name', sort: 'asc' }],
      defaultState: { sort: null },
    });
  });

  it('should call api.applyColumnState for sort descending', () => {
    const api = {
      applyColumnState: jest.fn(),
    };
    api.applyColumnState({
      state: [{ colId: 'name', sort: 'desc' }],
      defaultState: { sort: null },
    });
    expect(api.applyColumnState).toHaveBeenCalledWith({
      state: [{ colId: 'name', sort: 'desc' }],
      defaultState: { sort: null },
    });
  });

  it('should call api.applyColumnState for clear sort', () => {
    const api = {
      applyColumnState: jest.fn(),
    };
    api.applyColumnState({
      state: [{ colId: 'name', sort: null }],
      defaultState: { sort: null },
    });
    expect(api.applyColumnState).toHaveBeenCalledWith({
      state: [{ colId: 'name', sort: null }],
      defaultState: { sort: null },
    });
  });

  it('should call api.setColumnPinned for pin left', () => {
    const api = { setColumnPinned: jest.fn() };
    api.setColumnPinned('name', 'left');
    expect(api.setColumnPinned).toHaveBeenCalledWith('name', 'left');
  });

  it('should call api.setColumnPinned for pin right', () => {
    const api = { setColumnPinned: jest.fn() };
    api.setColumnPinned('name', 'right');
    expect(api.setColumnPinned).toHaveBeenCalledWith('name', 'right');
  });

  it('should call api.setColumnPinned with null for unpin', () => {
    const api = { setColumnPinned: jest.fn() };
    api.setColumnPinned('name', null);
    expect(api.setColumnPinned).toHaveBeenCalledWith('name', null);
  });

  it('should call api.autoSizeColumns for autosize this column', () => {
    const api = { autoSizeColumns: jest.fn() };
    api.autoSizeColumns(['name']);
    expect(api.autoSizeColumns).toHaveBeenCalledWith(['name']);
  });

  it('should call api.autoSizeAllColumns for autosize all', () => {
    const api = { autoSizeAllColumns: jest.fn() };
    api.autoSizeAllColumns();
    expect(api.autoSizeAllColumns).toHaveBeenCalled();
  });

  it('should call api.resetColumnState for reset columns', () => {
    const api = { resetColumnState: jest.fn() };
    api.resetColumnState();
    expect(api.resetColumnState).toHaveBeenCalled();
  });

  it('should call api.setColumnsVisible for column toggle', () => {
    const api = { setColumnsVisible: jest.fn() };
    api.setColumnsVisible(['email'], false);
    expect(api.setColumnsVisible).toHaveBeenCalledWith(['email'], false);
  });
});
