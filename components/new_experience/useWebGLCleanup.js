import { useEffect, useRef } from 'react';
import {
  WebGLCleanupManager,
  isIOSSafari,
  logMemoryUsage,
} from '../new_experience/WebGLCleanup.js';

/**
 * React hook for managing WebGL cleanup, especially for iOS Safari
 * This hook ensures proper cleanup of THREE.js resources when navigating away
 */
export const useWebGLCleanup = () => {
  const cleanupManagerRef = useRef(new WebGLCleanupManager());
  const isIOSSafariBrowser = isIOSSafari();

  useEffect(() => {
    // Set up global cleanup manager
    window.globalWebGLCleanup = cleanupManagerRef.current;

    // iOS Safari specific memory monitoring
    if (isIOSSafariBrowser) {
      console.log('📱 iOS Safari detected - setting up memory monitoring');
      logMemoryUsage();

      const memoryMonitorInterval = setInterval(() => {
        logMemoryUsage();
      }, 30000); // Every 30 seconds

      cleanupManagerRef.current.registerTimer(memoryMonitorInterval);
    }

    // Set up navigation cleanup handlers
    const handleBeforeUnload = (event) => {
      console.log('🚪 beforeunload - Starting WebGL cleanup...');
      cleanupManagerRef.current.cleanup();

      // iOS Safari specific - don't prevent default to avoid blocking navigation
      if (isIOSSafariBrowser) {
        return null;
      }
    };

    const handlePageHide = (event) => {
      console.log('👋 pagehide - Starting WebGL cleanup...');
      cleanupManagerRef.current.cleanup();
    };

    const handleVisibilityChange = () => {
      if (document.hidden && isIOSSafariBrowser) {
        console.log('👁️ visibility hidden on iOS Safari - Starting cleanup...');
        cleanupManagerRef.current.cleanup();
      }
    };

    // iOS Safari navigation handling
    const handlePopState = (event) => {
      if (isIOSSafariBrowser) {
        console.log('⬅️ popstate on iOS Safari - Starting cleanup...');
        // Small delay to allow for navigation
        setTimeout(() => {
          cleanupManagerRef.current.cleanup();
        }, 100);
      }
    };

    // Register event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);

    // iOS Safari specific - listen for hash changes (common in SPAs)
    if (isIOSSafariBrowser) {
      const handleHashChange = () => {
        console.log(
          '🔗 hashchange on iOS Safari - Checking for cleanup need...'
        );
        // Cleanup if navigating to contact page or similar
        if (window.location.hash && window.location.hash.includes('contact')) {
          setTimeout(() => {
            cleanupManagerRef.current.cleanup();
          }, 500);
        }
      };

      window.addEventListener('hashchange', handleHashChange);

      // Cleanup function includes hash change listener
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('pagehide', handlePageHide);
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('hashchange', handleHashChange);

        // Final cleanup
        cleanupManagerRef.current.cleanup();
        window.globalWebGLCleanup = null;
      };
    }

    // Standard cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);

      // Final cleanup
      cleanupManagerRef.current.cleanup();
      window.globalWebGLCleanup = null;
    };
  }, [isIOSSafariBrowser]);

  // Return cleanup manager for manual cleanup if needed
  return {
    cleanupManager: cleanupManagerRef.current,
    isIOSSafari: isIOSSafariBrowser,
    triggerCleanup: () => cleanupManagerRef.current.cleanup(),
  };
};

export default useWebGLCleanup;
