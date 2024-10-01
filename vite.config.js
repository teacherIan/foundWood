import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // add import for path

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.JPG', '**/*.splat'],
  plugins: [react()],
  server: {
    host: true,
  },
  // resolve: {
  //   alias: [
  //     {
  //       find: '../font',
  //       replacement: path.resolve(__dirname, '/assets/fonts'),
  //     },
  //   ],
  // },
});
