import React from 'react';
import { cn } from '../utils/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder,
  className,
  disabled,
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
      className={cn(
        'flex h-8 w-full rounded-[var(--cdt-radius)] border border-[hsl(var(--cdt-border))]',
        'bg-[hsl(var(--cdt-background))] px-2.5 py-1 text-sm text-[hsl(var(--cdt-foreground))]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cdt-ring))] focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'cursor-pointer appearance-none',
        'bg-[length:16px_16px] bg-[position:right_6px_center] bg-no-repeat',
        className,
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        paddingRight: '28px',
      }}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
