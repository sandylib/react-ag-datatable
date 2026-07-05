import React from 'react';
import { cn } from '../utils/cn';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[hsl(var(--cdt-muted-foreground))]">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-8 w-full rounded-[var(--cdt-radius)] border border-[hsl(var(--cdt-border))]',
            'bg-[hsl(var(--cdt-background))] px-3 py-1 text-sm text-[hsl(var(--cdt-foreground))]',
            'placeholder:text-[hsl(var(--cdt-muted-foreground))]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cdt-ring))] focus-visible:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-8',
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = 'Input';
