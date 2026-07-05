import React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '../utils/cn';

interface CheckboxProps {
  checked: boolean | 'indeterminate';
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Checkbox({
  checked,
  onCheckedChange,
  label,
  disabled,
  className,
  id,
}: CheckboxProps) {
  const checkboxId = id ?? (label ? `cdt-cb-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <CheckboxPrimitive.Root
        id={checkboxId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          'peer h-4 w-4 shrink-0 rounded-sm border',
          'border-[hsl(var(--cdt-border))]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cdt-ring))] focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:bg-[hsl(var(--cdt-primary))] data-[state=checked]:border-[hsl(var(--cdt-primary))] data-[state=checked]:text-[hsl(var(--cdt-primary-foreground))]',
          'data-[state=indeterminate]:bg-[hsl(var(--cdt-primary))] data-[state=indeterminate]:border-[hsl(var(--cdt-primary))] data-[state=indeterminate]:text-[hsl(var(--cdt-primary-foreground))]',
        )}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
          {checked === 'indeterminate' ? (
            <Minus className="h-3 w-3" />
          ) : (
            <Check className="h-3 w-3" />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label
          htmlFor={checkboxId}
          className="text-sm leading-none cursor-pointer select-none text-[hsl(var(--cdt-foreground))]"
        >
          {label}
        </label>
      )}
    </div>
  );
}
