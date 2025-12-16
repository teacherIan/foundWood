import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Custom plugin to set proper MIME types for splat files and WASM
const splatMimePlugin = () => ({
  name: 'splat-mime-type',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // Handle .splat files
      if (req.url && req.url.endsWith('.splat')) {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.setHeader('Access-Control-Allow-Origin', '*');
      }
      // Handle .spz files (SparkJS format)
      if (req.url && req.url.endsWith('.spz')) {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.setHeader('Access-Control-Allow-Origin', '*');
      }
      // Handle .wasm files (WebAssembly)
      if (req.url && req.url.endsWith('.wasm')) {
        res.setHeader('Content-Type', 'application/wasm');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.setHeader('Access-Control-Allow-Origin', '*');
      }
      next();
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  // Include all image formats that are actually imported via ES6 modules
  assetsInclude: [
    '**/*.glb',
    '**/*.gltf',
    '**/*.splat',
    '**/*.spz',
    '**/*.wasm',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.png',
    '**/*.PNG',
  ],
  plugins: [react(), splatMimePlugin()],
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
          if (/splat|spz|glb|gltf|wasm/.test(ext)) {
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
      // Never inline splat, spz, or wasm files (they're huge or need special handling)
      if (filePath.endsWith('.splat') || filePath.endsWith('.spz') || filePath.endsWith('.wasm')) {
        return false;
      }
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
