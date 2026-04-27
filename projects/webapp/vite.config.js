import path from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // app
      '@app': path.resolve(__dirname, './src/app'),
      '@ui': path.resolve(__dirname, './src/app/ui'),
      // shared
      '@shared': path.resolve(__dirname, './src/shared'),
      '@bits': path.resolve(__dirname, './src/shared/ui/bits'),
      '@components': path.resolve(__dirname, './src/shared/ui/components'),
    },
    tsConfigPaths: true,
  },
});
