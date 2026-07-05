import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@sandylib27/react-ag-datatable/styles.css': path.resolve(__dirname, '../src/styles.css'),
      '@sandylib27/react-ag-datatable': path.resolve(__dirname, '../src/index.ts'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
