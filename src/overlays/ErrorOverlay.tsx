import React from 'react';

interface ErrorOverlayProps {
  error: Error;
  onRetry: () => void;
}

export function ErrorOverlay({ error, onRetry }: ErrorOverlayProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
      <div className="text-sm font-medium text-[hsl(var(--cdt-foreground))]">
        Something went wrong
      </div>
      <div className="text-xs text-[hsl(var(--cdt-muted-foreground))] max-w-xs">
        {error.message || 'Failed to load data'}
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="mt-1 inline-flex items-center gap-1.5 rounded-[var(--cdt-radius)] border border-[hsl(var(--cdt-border))] bg-[hsl(var(--cdt-background))] px-3 py-1.5 text-sm font-medium text-[hsl(var(--cdt-foreground))] hover:bg-[hsl(var(--cdt-hover))] transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
