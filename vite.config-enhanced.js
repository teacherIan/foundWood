import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('postcss-nested'),
        require('postcss-custom-media')({
          importFrom: 'src/styles/variables.css',
        }),
        ...(process.env.NODE_ENV === 'production'
          ? [require('cssnano')({ preset: 'default' })]
          : []),
      ],
    },
  },
  assetsInclude: [
    '**/*.glb',
    '**/*.gltf',
    '**/*.splat',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.png',
    '**/*.PNG',
  ],
  plugins: [react()],
  server: {
    host: true,
    force: true,
    fs: {
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './components'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
});
