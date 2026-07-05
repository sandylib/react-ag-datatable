import React from 'react';

export function LoadingOverlay() {
  const rows = Array.from({ length: 5 });
  const cols = Array.from({ length: 3 });

  return (
    <div className="w-full p-4 space-y-3" role="status" aria-label="Loading data">
      {rows.map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4">
          {cols.map((_, colIdx) => (
            <div
              key={colIdx}
              className="cdt-skeleton h-5 flex-1"
              style={{ maxWidth: `${60 + ((rowIdx + colIdx) % 3) * 20}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
