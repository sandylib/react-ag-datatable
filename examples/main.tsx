import './app.css';
import '@sandylib27/react-ag-datatable/styles.css';

import React, { useState, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

const examples = [
  { name: 'Basic', component: lazy(() => import('./BasicExample')) },
  { name: 'Set Filter', component: lazy(() => import('./SetFilterExample')) },
  { name: 'Number Filter', component: lazy(() => import('./NumberFilterExample')) },
  { name: 'Column Menu', component: lazy(() => import('./ColumnMenuExample')) },
  { name: 'Local Pagination', component: lazy(() => import('./LocalPaginationExample')) },
  { name: 'API Connected', component: lazy(() => import('./ApiConnectedExample')) },
  { name: 'Theming', component: lazy(() => import('./ThemingExample')) },
  { name: 'Full Featured', component: lazy(() => import('./FullFeaturedExample')) },
];

function App() {
  const [active, setActive] = useState(0);
  const ActiveComponent = examples[active].component;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <nav
        style={{
          width: 220,
          borderRight: '1px solid #e5e7eb',
          padding: '16px 0',
          background: '#fafafa',
          flexShrink: 0,
        }}
      >
        <div style={{ padding: '0 16px 12px', fontWeight: 700, fontSize: 14, color: '#374151' }}>
          Examples
        </div>
        {examples.map((ex, idx) => (
          <button
            key={ex.name}
            onClick={() => setActive(idx)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '8px 16px',
              border: 'none',
              background: active === idx ? '#e0e7ff' : 'transparent',
              color: active === idx ? '#3730a3' : '#4b5563',
              fontWeight: active === idx ? 600 : 400,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {ex.name}
          </button>
        ))}
      </nav>
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Suspense
          fallback={
            <div style={{ padding: 24, color: '#9ca3af' }}>Loading...</div>
          }
        >
          <ActiveComponent />
        </Suspense>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
