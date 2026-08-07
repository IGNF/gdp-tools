import path from 'path';
import { defineConfig } from 'vite';

const external = (id: string) =>
  id === 'ol' ||
  id.startsWith('ol/') ||
  id === 'proj4' ||
  id === 'react' ||
  id === 'react-dom' ||
  id === 'react/jsx-runtime' ||
  id.startsWith('react/') ||
  id === 'ol-ext' ||
  id.startsWith('ol-ext/');

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        react: path.resolve(__dirname, 'src/react.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external,
      output: {
        entryFileNames: '[name].js',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
