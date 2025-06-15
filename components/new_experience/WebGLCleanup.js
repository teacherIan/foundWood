// WebGL Cleanup utilities for iOS Safari memory management
// This module handles proper disposal of THREE.js resources to prevent memory leaks

/**
 * Comprehensive WebGL cleanup for iOS Safari compatibility
 * iOS Safari has strict memory limits and aggressive garbage collection
 * that requires explicit resource disposal
 */

export class WebGLCleanupManager {
  constructor() {
    this.disposables = new Set();
    this.contexts = new Set();
    this.animationFrames = new Set();
    this.timers = new Set();
    this.eventListeners = new Map();
    this.animationsPaused = false;
    this.pausedAnimationFrames = new Set();
  }

  // Register disposable resources
  registerDisposable(resource) {
    if (resource && typeof resource.dispose === 'function') {
      this.disposables.add(resource);
    }
  }

  // Register WebGL contexts
  registerContext(context) {
    if (context) {
      this.contexts.add(context);
    }
  }

  // Register animation frames
  registerAnimationFrame(frameId) {
    if (frameId) {
      this.animationFrames.add(frameId);
    }
  }

  // Register timers
  registerTimer(timerId) {
    if (timerId) {
      this.timers.add(timerId);
    }
  }

  // Register event listeners for cleanup
  registerEventListener(element, event, handler) {
    if (!this.eventListeners.has(element)) {
      this.eventListeners.set(element, []);
    }
    this.eventListeners.get(element).push({ event, handler });
  }

  // Pause animations for memory optimization (iOS Safari)
  pauseAnimations() {
    if (this.animationsPaused) return;

    console.log('⏸️ Pausing animations for iOS Safari memory optimization...');
    this.animationsPaused = true;

    // Move current animation frames to paused set
    this.animationFrames.forEach((frameId) => {
      this.pausedAnimationFrames.add(frameId);
      try {
        cancelAnimationFrame(frameId);
      } catch (error) {
        console.warn('Failed to pause animation frame:', error);
      }
    });
    this.animationFrames.clear();
  }

  // Resume animations
  resumeAnimations() {
    if (!this.animationsPaused) return;

    console.log('▶️ Resuming animations...');
    this.animationsPaused = false;
    this.pausedAnimationFrames.clear();
  }

  // Check if animations are paused
  areAnimationsPaused() {
    return this.animationsPaused;
  }

  // Cleanup all registered resources
  cleanup() {
    console.log('🧹 Starting comprehensive WebGL cleanup for iOS Safari...');

    // Cancel animation frames (both active and paused)
    this.animationFrames.forEach((frameId) => {
      try {
        cancelAnimationFrame(frameId);
      } catch (error) {
        console.warn('Failed to cancel animation frame:', error);
      }
    });
    this.animationFrames.clear();

    // Also clear paused animation frames
    this.pausedAnimationFrames.forEach((frameId) => {
      try {
        cancelAnimationFrame(frameId);
      } catch (error) {
        console.warn('Failed to cancel paused animation frame:', error);
      }
    });
    this.pausedAnimationFrames.clear();
    this.animationsPaused = false;

    // Clear timers
    this.timers.forEach((timerId) => {
      try {
        clearTimeout(timerId);
        clearInterval(timerId);
      } catch (error) {
        console.warn('Failed to clear timer:', error);
      }
    });
    this.timers.clear();

    // Remove event listeners
    this.eventListeners.forEach((listeners, element) => {
      listeners.forEach(({ event, handler }) => {
        try {
          element.removeEventListener(event, handler);
        } catch (error) {
          console.warn('Failed to remove event listener:', error);
        }
      });
    });
    this.eventListeners.clear();

    // Dispose THREE.js resources
    this.disposables.forEach((resource) => {
      try {
        if (resource.dispose) {
          resource.dispose();
        }
      } catch (error) {
        console.warn('Failed to dispose resource:', error);
      }
    });
    this.disposables.clear();

    // Force WebGL context loss (iOS Safari specific)
    this.contexts.forEach((context) => {
      try {
        if (context && context.getExtension) {
          const loseContext = context.getExtension('WEBGL_lose_context');
          if (loseContext) {
            loseContext.loseContext();
          }
        }
      } catch (error) {
        console.warn('Failed to lose WebGL context:', error);
      }
    });
    this.contexts.clear();

    console.log('✅ WebGL cleanup completed');
  }
}

/**
 * iOS Safari specific THREE.js cleanup utilities
 */
export const cleanupThreeJSScene = (scene, renderer, camera) => {
  if (!scene || !renderer) return;

  console.log('🧹 Cleaning up THREE.js scene for iOS Safari...');

  try {
    // Dispose all scene objects recursively
    scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }

      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => {
            cleanupMaterial(material);
          });
        } else {
          cleanupMaterial(object.material);
        }
      }

      // Clean up textures
      if (object.texture) {
        object.texture.dispose();
      }
    });

    // Clear the scene
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    // Dispose renderer
    if (renderer.dispose) {
      renderer.dispose();
    }

    // Force context loss on iOS Safari
    if (renderer.domElement && renderer.domElement.getContext) {
      const gl =
        renderer.domElement.getContext('webgl') ||
        renderer.domElement.getContext('webgl2') ||
        renderer.domElement.getContext('experimental-webgl');

      if (gl) {
        const loseContext = gl.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.loseContext();
        }
      }
    }

    console.log('✅ THREE.js scene cleanup completed');
  } catch (error) {
    console.error('❌ Error during THREE.js cleanup:', error);
  }
};

/**
 * Clean up THREE.js materials properly
 */
const cleanupMaterial = (material) => {
  if (!material) return;

  // Dispose textures
  Object.keys(material).forEach((key) => {
    const value = material[key];
    if (value && value.isTexture) {
      value.dispose();
    }
  });

  // Dispose material
  material.dispose();
};

/**
 * iOS Safari memory monitoring (development only)
 */
export const logMemoryUsage = () => {
  if (process.env.NODE_ENV !== 'production' && 'memory' in performance) {
    const memory = performance.memory;
    console.log('📊 Memory usage:', {
      used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`,
    });
  }
};

/**
 * Check if we're on iOS Safari
 */
export const isIOSSafari = () => {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

  return isIOS && isSafari;
};

/**
 * iOS Safari specific performance recommendations
 */
export const getIOSSafariConfig = () => ({
  // Reduced performance for iOS Safari
  powerPreference: 'default', // Lower power consumption
  antialias: false, // Disable for better performance
  alpha: true, // Keep for transparency but be careful
  depth: false, // Disable if not needed
  stencil: false, // Disable for better performance
  preserveDrawingBuffer: false, // Critical for memory management
  premultipliedAlpha: false,
  failIfMajorPerformanceCaveat: false, // Allow software fallback

  // Camera settings
  maxDistance: 10, // Limit zoom to reduce geometry complexity
  minDistance: 2,

  // Render settings
  maxFPS: 30, // Limit frame rate on iOS
  pixelRatio: Math.min(window.devicePixelRatio, 2), // Limit pixel ratio
});

export default WebGLCleanupManager;
