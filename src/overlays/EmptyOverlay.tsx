import React from 'react';

interface EmptyOverlayProps {
  message?: React.ReactNode;
}

export function EmptyOverlay({ message }: EmptyOverlayProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-sm text-[hsl(var(--cdt-muted-foreground))]">
        {message ?? 'No rows to display'}
      </div>
    </div>
  );
}
