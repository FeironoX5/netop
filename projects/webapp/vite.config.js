import path from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { themePlugin } from './src/app/App.theme.vite.plugin';

export default defineConfig({
  plugins: [vue(), themePlugin()],
  resolve: {
    alias: [
      { find: '@/app', replacement: path.resolve(__dirname, './src/app') },
      { find: '@/ui', replacement: path.resolve(__dirname, './src/app/ui') },
      { find: '@/types', replacement: path.resolve(__dirname, './src/app/types') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '@shared', replacement: path.resolve(__dirname, './src/shared') },
      { find: '@bits', replacement: path.resolve(__dirname, './src/shared/ui/bits') },
      { find: '@components', replacement: path.resolve(__dirname, './src/shared/ui/components') },
      { find: '@netop/types', replacement: path.resolve(__dirname, '../types/src/index.ts') },
    ],
    tsConfigPaths: true,
  },
});
