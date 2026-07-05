import React from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-[var(--cdt-radius)] font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cdt-ring))] focus-visible:ring-offset-1',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-[hsl(var(--cdt-primary))] text-[hsl(var(--cdt-primary-foreground))] hover:opacity-90':
              variant === 'default',
            'border border-[hsl(var(--cdt-border))] bg-[hsl(var(--cdt-background))] text-[hsl(var(--cdt-foreground))] hover:bg-[hsl(var(--cdt-hover))]':
              variant === 'outline',
            'text-[hsl(var(--cdt-foreground))] hover:bg-[hsl(var(--cdt-hover))]':
              variant === 'ghost',
            'bg-[hsl(var(--cdt-destructive))] text-white hover:opacity-90':
              variant === 'destructive',
          },
          {
            'h-7 px-2.5 text-xs': size === 'sm',
            'h-8 px-3 text-sm': size === 'md',
          },
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
