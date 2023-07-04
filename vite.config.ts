import path from 'path';
import react from '@vitejs/plugin-react';
import unfonts from 'unplugin-fonts/vite';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint(),
    checker({ typescript: true }),
    unfonts({
      google: {
        families: [
          { name: 'Titillium+Web', styles: 'wght@700' },
          { name: 'Source+Serif+Pro', styles: 'wght@400;700' },
          { name: 'Merriweather+Sans', styles: 'wght@400;700' },
          {
            name: 'Source+Sans+Pro',
            styles: 'ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700',
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/shared/lib/test/setup.ts',
    coverage: {
      provider: 'v8',
      exclude: ['src/shared/api/realworld/**'],
    },
  },
  server: { host: false },
  preview: { open: true },
  resolve: {
    alias: {
      '~app': path.resolve('src/app'),
      '~entities': path.resolve('src/entities'),
      '~features': path.resolve('src/features'),
      '~pages': path.resolve('src/pages'),
      '~shared': path.resolve('src/shared'),
      '~widgets': path.resolve('src/widgets'),
    },
  },
});
