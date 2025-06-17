import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Include all image formats that are actually imported via ES6 modules
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.splat', '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.PNG'],
  plugins: [react()],
  server: {
    host: true,
    force: true, // Force dependency re-optimization
    fs: {
      strict: false,
    },
    cors: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
        },
        // OPTIMIZED: Ensure large assets aren't bundled
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          // Serve large 3D assets from separate directory
          if (/splat|glb|gltf/.test(ext)) {
            return `assets/3d/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    sourcemap: true,
    // OPTIMIZED: Increase asset inline limit for small assets, exclude large ones
    assetsInlineLimit: (filePath, content) => {
      // Never inline splat files (they're huge)
      if (filePath.endsWith('.splat')) return false;
      // Default behavior for other assets
      return content.length < 4096;
    },
  },
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    force: true, // Force dep pre-bundling
  },
});
