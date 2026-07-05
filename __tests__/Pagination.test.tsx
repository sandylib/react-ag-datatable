import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../src/pagination/Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 0,
    totalPages: 10,
    totalRows: 150,
    pageSize: 15,
    pageSizeOptions: [15, 25, 50],
    onPageChange: jest.fn(),
    onPageSizeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display correct range', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText(/1–15 of 150/)).toBeTruthy();
  });

  it('should display correct range on page 2', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    expect(screen.getByText(/16–30 of 150/)).toBeTruthy();
  });

  it('should display correct range on last page', () => {
    render(<Pagination {...defaultProps} currentPage={9} />);
    expect(screen.getByText(/136–150 of 150/)).toBeTruthy();
  });

  it('should disable Previous button on first page', () => {
    render(<Pagination {...defaultProps} />);
    const prevBtn = screen.getByText('Previous').closest('button');
    expect(prevBtn?.disabled).toBe(true);
  });

  it('should disable Next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={9} />);
    const nextBtn = screen.getByText('Next').closest('button');
    expect(nextBtn?.disabled).toBe(true);
  });

  it('should call onPageChange when clicking Next', () => {
    render(<Pagination {...defaultProps} />);
    fireEvent.click(screen.getByText('Next'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
  });

  it('should call onPageChange when clicking Previous', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    fireEvent.click(screen.getByText('Previous'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageSizeChange when changing page size', () => {
    render(<Pagination {...defaultProps} />);
    const select = screen.getByDisplayValue('15 / page');
    fireEvent.change(select, { target: { value: '25' } });
    expect(defaultProps.onPageSizeChange).toHaveBeenCalledWith(25);
  });

  it('should show 0 of 0 when no rows', () => {
    render(<Pagination {...defaultProps} totalRows={0} totalPages={0} />);
    expect(screen.getByText(/0–0 of 0/)).toBeTruthy();
  });
});
