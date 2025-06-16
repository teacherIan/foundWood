import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  memo,
} from 'react';
import {
  Splat,
  Text,
  PresentationControls,
  useProgress,
  Preload,
} from '@react-three/drei';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three'; // Import useSpring and animated
import * as THREE from 'three'; // Import Three.js for Color
import './experienceStyles.css';
import splat from '../../src/assets/experience/full.splat';

/**
 * PRODUCTION SAFETY NOTE:
 *
 * This Experience component includes sophisticated splat reload functionality that is designed
 * to be production-safe. The reload mechanism:
 *
 * ✅ ONLY reloads during initial loading phase (when loading screen is visible)
 * ✅ NEVER reloads after users reach the interactive experience
 * ✅ Can be completely disabled via window.DISABLE_SPLAT_RELOAD = true
 * ✅ Provides comprehensive error logging for debugging
 *
 * This ensures users never see unexpected page reloads during normal usage while still
 * providing automatic recovery from critical loading failures.
 */
import driftwood from '../../src/assets/fonts/DriftWood-z8W4.ttf';

// Utility function to detect splat parsing errors
const isSplatParsingError = (errorMessage, context = {}) => {
  const message = errorMessage.toLowerCase();

  // Common splat parsing error patterns
  const parseErrors = [
    'failed to parse file',
    'parse file',
    'parsing error',
    'failed to load splat',
    'splat loading failed',
    'invalid splat format',
    'corrupted splat file',
    'splat decode error',
    'splat parse failed',
  ];

  // Check if error message contains any parsing error patterns
  const hasParseError = parseErrors.some((pattern) =>
    message.includes(pattern)
  );

  // Additional checks for splat-related errors
  const isSplatRelated =
    message.includes('splat') ||
    context.filename?.includes('Splat.js') ||
    context.filename?.includes('splat') ||
    context.stack?.includes('Splat');

  return (
    hasParseError ||
    (isSplatRelated &&
      (message.includes('network error') ||
        message.includes('loading failed') ||
        message.includes('decode') ||
        message.includes('buffer') ||
        message.includes('format')))
  );
};
const initiateSplatReload = (errorDetails, initialLoadComplete = false) => {
  if (window.splatReloadInProgress) return;

  // PRODUCTION SAFETY: Never reload page if we've made it past the initial loading screen
  // This ensures users never see reload messages once they're using the app
  if (initialLoadComplete) {
    console.warn(
      '🚫 Splat error detected after initial load complete - NOT reloading page to maintain user experience'
    );
    console.log('📝 Error logged for debugging:', {
      ...errorDetails,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      note: 'PRODUCTION SAFE: No page reload attempted after initial load complete',
    });
    // Just log the error but don't reload - user experience is more important
    return;
  }

  // ADDITIONAL SAFETY: Check for explicit reload disable (useful for production environments)
  if (window.DISABLE_SPLAT_RELOAD === true) {
    console.warn(
      '🚫 Splat reload disabled by DISABLE_SPLAT_RELOAD flag - logging error only'
    );
    console.log('📝 Error logged for debugging:', {
      ...errorDetails,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      note: 'RELOAD DISABLED: DISABLE_SPLAT_RELOAD flag set to true',
    });
    return;
  }

  // DEVELOPMENT/INITIAL LOAD ONLY: Only allow reload during critical loading phase
  // This ensures smooth initial loading experience while protecting ongoing user sessions
  console.warn(
    '⚠️ INITIAL LOAD PHASE: Splat error during loading - reload allowed for recovery'
  );

  window.splatReloadInProgress = true;

  console.error(
    '🚨 Critical splat parsing error during initial load - initiating reload'
  );
  console.log('📄 Error details:', {
    ...errorDetails,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    },
    connection: navigator.connection
      ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt,
        }
      : 'unknown',
    memory: navigator.deviceMemory || 'unknown',
  });

  // Send error to console for production debugging
  console.group('🚨 SPLAT RELOAD TRIGGER (LOADING SCENE ONLY)');
  console.error('Error Source:', errorDetails.source);
  console.error('Error Message:', errorDetails.message);
  console.error('Full Error:', errorDetails);
  console.groupEnd();

  // Create a user-friendly reload overlay
  const reloadOverlay = document.createElement('div');
  reloadOverlay.id = 'splat-reload-overlay';
  reloadOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 999999999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    color: #77481c;
    text-align: center;
    padding: 20px;
  `;

  reloadOverlay.innerHTML = `
    <div style="margin-bottom: 20px;">
      <div style="
        border: 5px solid rgba(119, 72, 28, 0.2);
        border-radius: 50%;
        border-top: 5px solid #77481c;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px auto;
      "></div>
      <h2 style="margin: 0 0 10px 0; font-size: 1.5rem; font-weight: 500;">
        Refreshing 3D Scene
      </h2>
      <p style="margin: 0; font-size: 1.1rem; color: #8b5a2b; max-width: 400px;">
        The 3D scene encountered a loading issue. We're refreshing the page to fix this automatically.
      </p>
    </div>
  `;

  // Add the spin animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(reloadOverlay);

  // Reload after a brief delay
  setTimeout(() => {
    console.log(
      '🔄 Reloading page due to splat parsing failure during initial load...'
    );
    window.location.reload();
  }, 2000);
};
class SplatErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ SplatErrorBoundary caught an error:', error, errorInfo);

    // Check if this is a splat parsing error
    const errorMessage = error?.message || error?.toString() || '';
    const isParseFileError = isSplatParsingError(errorMessage, {
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
    });

    if (isParseFileError) {
      initiateSplatReload(
        {
          source: 'React Error Boundary',
          message: errorMessage,
          stack: error?.stack,
          componentStack: errorInfo?.componentStack,
        },
        this.props.initialLoadComplete
      );
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshBasicMaterial color="#77481c" transparent opacity={0.3} />
        </mesh>
      );
    }

    return this.props.children;
  }
}
// TEMPORARILY DISABLED: Custom WebGL cleanup to rely on R3F's built-in memory management
/*
import {
  WebGLCleanupManager,
  cleanupThreeJSScene,
  logMemoryUsage,
  isIOSSafari,
  getIOSSafariConfig,
  isWebGLLoseContextSupported,
  safeForceContextLoss,
} from './WebGLCleanup.js';
*/

// Mock functions to replace disabled WebGL cleanup
const WebGLCleanupManager = class {
  constructor() {}
  registerContext() {}
  registerTimer() {}
  registerAnimationFrame() {}
  registerEventListener() {}
  cleanup() {}
};
const cleanupThreeJSScene = () => {};
const logMemoryUsage = () => {};
const isIOSSafari = () => false;
const getIOSSafariConfig = () => ({
  pixelRatio: 1,
  antialias: false,
  powerPreference: 'default',
  depth: true,
  stencil: false,
  alpha: false,
  premultipliedAlpha: false,
  preserveDrawingBuffer: false,
  failIfMajorPerformanceCaveat: false,
});
const isWebGLLoseContextSupported = () => false;
const safeForceContextLoss = () => {};

// Removed post-processing effects for better performance and simplified visuals

// Animated Text component with upward animation support
const AnimatedText = memo(
  ({
    position,
    children,
    fontSize,
    delay = 0,
    initialLoadComplete,
    alphaAnimationComplete,
    deviceConfig,
  }) => {
    // Calculate grass level based on device type - text should start from below the grass
    const grassLevel = deviceConfig.isMobile
      ? -1.5
      : deviceConfig.isTablet
      ? -1.2
      : -1.0;
    const startPosition = [position[0], grassLevel, position[2]];

    // Text animation should start only after both loading is complete AND alpha animation is done
    const shouldAnimateText = initialLoadComplete && alphaAnimationComplete;

    const { animatedPosition } = useSpring({
      animatedPosition: shouldAnimateText ? position : startPosition,
      config: {
        mass: 3,
        tension: 180,
        friction: 35,
        precision: 0.001,
      },
      delay: shouldAnimateText ? delay * 1000 : 0, // Convert delay to milliseconds
    });

    return (
      <animated.group position={animatedPosition}>
        <Text
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font={driftwood}
          fontSize={fontSize}
          letterSpacing={0.03}
          textAlign="center"
          maxWidth={200}
          lineHeight={1.2}
        >
          <meshBasicMaterial color="#ffffff" />
          {children}
        </Text>
      </animated.group>
    );
  }
);

// Simple Text component with basic material that doesn't require lighting (keeping for fallback)
const MemoizedText = memo(({ position, children, fontSize, delay = 0 }) => (
  <Text
    position={position}
    color="#ffffff"
    anchorX="center"
    anchorY="middle"
    font={driftwood}
    fontSize={fontSize}
    letterSpacing={0.03}
    textAlign="center"
    maxWidth={200}
    lineHeight={1.2}
  >
    <meshBasicMaterial color="#ffffff" />
    {children}
  </Text>
));

// Simplified Splat component that uses pre-validated splat URL
const SplatWithErrorHandling = memo(
  ({
    alphaTest,
    chunkSize,
    splatSize,
    onSplatLoaded,
    initialLoadComplete,
    validatedSplatUrl, // NEW: Use pre-validated splat URL
    ...props
  }) => {
    // Use the pre-validated splat URL instead of trying multiple sources
    const splatSource = validatedSplatUrl || splat;

    console.log(
      '🎯 SplatWithErrorHandling: Using pre-validated splat file:',
      splatSource
    );

    const handleLoad = useCallback(() => {
      console.log('✅ Splat onLoad callback fired successfully');
    }, []);

    const handleError = useCallback(
      (error) => {
        console.error(
          '❌ Unexpected splat loading error after validation:',
          error
        );
        // Since we pre-validated, this should be very rare
        // Just log the error - no complex fallback needed
      },
      [splatSource, initialLoadComplete]
    );

    try {
      return (
        <Splat
          alphaTest={alphaTest}
          chunkSize={chunkSize}
          src={splatSource}
          splatSize={splatSize}
          onError={handleError}
          onLoad={handleLoad}
          {...props}
        />
      );
    } catch (error) {
      console.error('❌ Splat render error:', error);
      handleError(error);
      return (
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshBasicMaterial color="#77481c" transparent opacity={0.3} />
        </mesh>
      );
    }
  }
);

// Enhanced loading detector that coordinates with the main alpha animation
// CRITICAL FIX: Ensure splat loaded callback gets called and fix loading state
function ProgressChecker({
  onSplatLoaded,
  imagesLoaded,
  initialLoadComplete,
  onSceneStart,
}) {
  const hasCalledRef = useRef(false);
  const sceneReadyTimerRef = useRef(null);

  useEffect(() => {
    console.log('🔍 ProgressChecker mounted with props:', {
      hasCalledRef: hasCalledRef.current,
      onSplatLoaded: !!onSplatLoaded,
      onSplatLoadedType: typeof onSplatLoaded,
      initialLoadComplete,
      onSceneStart: !!onSceneStart,
    });

    if (!onSplatLoaded) {
      console.error(
        '❌ CRITICAL: ProgressChecker onSplatLoaded callback is missing!'
      );
      return;
    }

    if (hasCalledRef.current) {
      console.log('⚡ ProgressChecker: Callback already called, skipping');
      return;
    }

    // Mark as called immediately to prevent multiple calls
    hasCalledRef.current = true;
    console.log('🎬 ProgressChecker: Starting sequence...');

    // Clear any existing timer
    if (sceneReadyTimerRef.current) {
      clearTimeout(sceneReadyTimerRef.current);
      sceneReadyTimerRef.current = null;
    }

    // Signal that the scene has started (triggers alpha animation)
    if (onSceneStart) {
      console.log(
        '📡 ProgressChecker: Calling onSceneStart to trigger alpha animation'
      );
      try {
        onSceneStart();
      } catch (error) {
        console.error('❌ Error calling onSceneStart:', error);
      }
    }

    // Call onSplatLoaded after a short delay to ensure canvas is ready
    console.log(
      '⏰ ProgressChecker: Setting timer to call onSplatLoaded in 800ms'
    );
    sceneReadyTimerRef.current = setTimeout(() => {
      try {
        console.log(
          '✅ ProgressChecker: Timer fired - calling onSplatLoaded NOW!'
        );
        onSplatLoaded();
        console.log(
          '✅ ProgressChecker: onSplatLoaded callback completed successfully'
        );
      } catch (error) {
        console.error('❌ CRITICAL ERROR calling onSplatLoaded:', error);
      }
    }, 800); // Reduced to 800ms for faster loading

    // Cleanup function
    return () => {
      if (sceneReadyTimerRef.current) {
        console.log('🧹 ProgressChecker: Cleaning up timer');
        clearTimeout(sceneReadyTimerRef.current);
        sceneReadyTimerRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  return null; // No visual elements to prevent context issues
}

function Scene({
  isAnimating,
  showContactPage,
  showTypes,
  showGallery,
  hasOverlay, // Accept hasOverlay as prop instead of calculating locally
  onSplatLoaded,
  imagesLoaded,
  initialLoadComplete,
  validatedSplatUrl, // NEW: Pre-validated splat URL
}) {
  const [targetX, setTargetX] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userInteracting, setUserInteracting] = useState(false);
  const animationRef = useRef();
  const { camera, scene, gl } = useThree();
  const idleTimeRef = useRef(0);
  const interactionTimeRef = useRef(0);
  const [manualAlphaTest, setManualAlphaTest] = useState(1.0); // Start with full opacity so splat is immediately visible
  const alphaAnimationRequestRef = useRef(null); // Ref to store animation frame request
  const isInitialMountRef = useRef(true); // Ref to track initial mount
  const [sceneError, setSceneError] = useState(null);
  const [alphaAnimationComplete, setAlphaAnimationComplete] = useState(false); // Track alpha animation completion
  const [sceneStarted, setSceneStarted] = useState(false); // NEW: Track when scene actually starts

  // TEMPORARILY DISABLED: WebGL cleanup manager for iOS Safari
  // const cleanupManagerRef = useRef(new WebGLCleanupManager());

  // Set scene background to match theme color for consistency
  useEffect(() => {
    if (scene) {
      scene.background = new THREE.Color('#f5f5f5');
    }
  }, [scene]);

  // Enhanced error boundary for scene rendering with splat reload detection
  useEffect(() => {
    const handleError = (event) => {
      console.error('❌ Scene error caught:', event.error);

      // Check for splat parsing errors that require page reload
      const errorMessage =
        event.error?.message || event.error?.toString() || '';
      const isParseFileError = isSplatParsingError(errorMessage, {
        filename: event.filename,
        stack: event.error?.stack,
      });

      if (isParseFileError) {
        console.error(
          '🚨 Critical splat parsing error detected in global error handler'
        );

        initiateSplatReload(
          {
            source: 'Global Error Handler',
            message: errorMessage,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error,
          },
          initialLoadComplete
        );

        return;
      }

      // Normal error handling
      setSceneError(event.error);
    };

    const handleUnhandledRejection = (event) => {
      console.error('❌ Unhandled promise rejection caught:', event.reason);

      // Check for splat parsing errors in promise rejections
      const errorMessage =
        event.reason?.message || event.reason?.toString() || '';
      const isParseFileError = isSplatParsingError(errorMessage, {
        stack: event.reason?.stack,
      });

      if (isParseFileError) {
        console.error('🚨 Critical splat parsing error in promise rejection');

        initiateSplatReload(
          {
            source: 'Promise Rejection',
            message: errorMessage,
            reason: event.reason,
          },
          initialLoadComplete
        );
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
    };
  }, []); // Scene component mounted - setup cleanup and debugging
  useEffect(() => {
    console.log('🚀 Scene component mounted and ready');
    console.log('🎯 Splat file info:', {
      primarySplat: splat,
      splatType: typeof splat,
    });

    // TEMPORARILY DISABLED: WebGL cleanup to rely on R3F's built-in memory management
    /*
      // Register WebGL context for cleanup
      if (gl) {
        cleanupManagerRef.current.registerContext(gl.getContext());
      }

      // Log memory usage on iOS Safari
      if (isIOSSafari()) {
        logMemoryUsage();
        const memoryTimer = setInterval(logMemoryUsage, 10000); // Every 10 seconds
        cleanupManagerRef.current.registerTimer(memoryTimer);
      }
      */

    // Cleanup on unmount
    return () => {
      console.log('🧹 Scene unmounting, cleaning up resources...');

      // Cancel any pending animations
      if (alphaAnimationRequestRef.current) {
        cancelAnimationFrame(alphaAnimationRequestRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // TEMPORARILY DISABLED: Custom WebGL cleanup to rely on R3F's built-in memory management
      /*
        // Comprehensive cleanup for iOS Safari
        cleanupManagerRef.current.cleanup();

        // Clean up THREE.js scene
        if (scene && gl) {
          cleanupThreeJSScene(scene, gl, camera);
        }
        */

      console.log('✅ Scene cleanup completed');
    };
  }, []);

  // hasOverlay is now passed as prop from parent component

  // Debug overlay state
  useEffect(() => {
    console.log('🔍 Overlay state changed:', {
      hasOverlay,
      showContactPage,
      showTypes,
      showGallery,
      presentationControlsEnabled: !hasOverlay,
    });
  }, [hasOverlay, showContactPage, showTypes, showGallery]);

  // useEffect for manualAlphaTest animation - THE MOST IMPORTANT ANIMATION
  // REQUIREMENT: When splat is loaded and visible, animate alphaTest from 1.0 to 0.0
  useEffect(() => {
    // Always cancel the previous animation frame if one is pending
    if (alphaAnimationRequestRef.current) {
      cancelAnimationFrame(alphaAnimationRequestRef.current);
    }

    const startAlpha = manualAlphaTest; // Current alpha value from state
    let targetAlpha;
    let duration;

    if (isInitialMountRef.current) {
      // CRITICAL FIX: When loading completes and canvas becomes visible, start alpha animation immediately
      if (initialLoadComplete) {
        console.log(
          '🎬 LOADING COMPLETE - Canvas now visible, starting 5-second alpha animation from 1.0 → 0.0'
        );

        const startTime = Date.now();
        const animationDuration = 5000; // 5-second animation from 1.0 to 0.0 as requested

        const animateAlpha = () => {
          const elapsedTime = Date.now() - startTime;
          const progress = Math.min(elapsedTime / animationDuration, 1);
          const currentAlpha = 1.0 + (0.0 - 1.0) * progress; // Interpolate from 1.0 to 0.0

          setManualAlphaTest(currentAlpha);

          if (progress < 1) {
            alphaAnimationRequestRef.current =
              requestAnimationFrame(animateAlpha);
          } else {
            alphaAnimationRequestRef.current = null;
            console.log(
              '✅ 5-second alpha animation completed: splat now at alphaTest = 0.0'
            );
            setAlphaAnimationComplete(true);
          }
        };

        // Start animation immediately without any delay
        alphaAnimationRequestRef.current = requestAnimationFrame(animateAlpha);
        isInitialMountRef.current = false;
        return;
      } else {
        // Loading not complete yet - wait
        console.log(
          '⏳ Waiting for loading to complete before starting alpha animation'
        );
        return;
      }
    } else {
      // After initial animation, handle overlay changes
      // Check if ANY overlay is active (contact, types, or gallery)
      let targetAlpha;
      let duration;

      if (hasOverlay) {
        console.log(
          `🎭 Overlay detected - animating alpha to 1.0 (showContactPage: ${showContactPage}, showTypes: ${showTypes}, showGallery: ${showGallery})`
        );
        targetAlpha = 1.0; // Animate to 1.0 when any overlay is shown

        // Slower animation for contact page specifically
        if (showContactPage) {
          duration = 1200; // 1.2 seconds for contact page - slower, more elegant
        } else {
          duration = 600; // 600ms for other overlays (types, gallery)
        }
      } else {
        console.log('🎭 No overlay - animating alpha back to 0.0');
        targetAlpha = 0.0; // Animate back to 0.0 when all overlays are hidden

        // Slower return animation for contact page specifically
        if (showContactPage === false) {
          duration = 800; // 800ms for contact page closing - smooth transition
        } else {
          duration = 400; // 400ms for other overlays
        }
      }

      // If already at the target, no need to animate
      if (startAlpha === targetAlpha) {
        alphaAnimationRequestRef.current = null; // Ensure ref is cleared if no animation
        return;
      }

      const startTime = Date.now();

      const animateAlpha = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1); // Ensure progress doesn't exceed 1

        setManualAlphaTest(startAlpha + (targetAlpha - startAlpha) * progress);

        if (progress < 1) {
          alphaAnimationRequestRef.current =
            requestAnimationFrame(animateAlpha);
        } else {
          alphaAnimationRequestRef.current = null; // Clear ref when animation completes
        }
      };

      alphaAnimationRequestRef.current = requestAnimationFrame(animateAlpha);
    }

    // Cleanup function to cancel animation if component unmounts or effect re-runs
    return () => {
      if (alphaAnimationRequestRef.current) {
        cancelAnimationFrame(alphaAnimationRequestRef.current);
        alphaAnimationRequestRef.current = null;
      }
    };
  }, [
    hasOverlay,
    showContactPage,
    showTypes,
    showGallery,
    initialLoadComplete,
    sceneStarted, // Added sceneStarted dependency
  ]); // Explicitly include all overlay states

  // Enhanced camera animation with interaction awareness
  const animateCamera = useCallback(
    (state, delta) => {
      // Skip camera movements when gallery is active but keep minimal frame updates
      if (showGallery) {
        // Minimal camera update to keep scene responsive without expensive animations
        camera.updateProjectionMatrix();
        return;
      }

      idleTimeRef.current += delta;

      // Detect user interaction
      if (userInteracting) {
        interactionTimeRef.current = 0;
        setUserInteracting(false);
      } else {
        interactionTimeRef.current += delta;
      }

      // Reduce animation intensity when user is interacting
      const interactionFactor = Math.min(1, interactionTimeRef.current / 2); // Fade in over 2 seconds

      // More sophisticated camera movement with multiple sine waves
      const slowWave =
        Math.sin(idleTimeRef.current * 0.3) * 0.015 * interactionFactor;
      const fastWave =
        Math.sin(idleTimeRef.current * 1.2) * 0.008 * interactionFactor;
      const verticalWave =
        Math.sin(idleTimeRef.current * 0.8) * 0.01 * interactionFactor;

      // Subtle breathing effect
      const breathingEffect =
        Math.sin(idleTimeRef.current * 0.5) * 0.05 * interactionFactor;

      camera.position.x = slowWave + fastWave * 0.5;

      // Calculate the base Y position with constraints
      const baseY = windowWidth < 480 ? 1.5 : 1.2;
      const animatedY = baseY + verticalWave + breathingEffect * 0.3;

      // Apply Y-axis constraint: never go below grass level (y = 0.3)
      const minY = 0.3; // Minimum Y position to stay above grass level
      camera.position.y = Math.max(animatedY, minY);

      camera.position.z = (windowWidth < 480 ? 1.7 : 3) + breathingEffect;

      // Subtle rotation for more dynamic feel + downward tilt to see text better
      camera.rotation.y = slowWave * 0.03;
      camera.rotation.x =
        (windowWidth < 480 ? -0.1 : -0.05) + verticalWave * 0.01;

      camera.updateProjectionMatrix();
    },
    [camera, isAnimating, userInteracting, hasOverlay, showGallery]
  );

  useFrame(animateCamera);

  // Enhanced resize handler with better camera positioning
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    setWindowWidth(width);
    setTargetX(width > 1000 ? -1.5 : 0);

    if (camera) {
      // Define minimum Y position to stay above grass level
      const minY = 0.3;

      if (width < 480) {
        if (isPortrait) {
          camera.position.set(0, Math.max(1.6, minY), 4.2);
          camera.rotation.x = 0;
          camera.fov = 100;
        } else {
          camera.position.set(0, Math.max(1.2, minY), 3.2);
          camera.rotation.x = 0;
          camera.fov = 100;
        }
      } else if (width < 1300) {
        if (isPortrait) {
          camera.position.set(0, Math.max(1.1, minY), 4.0);
          camera.rotation.x = -0.05;
          camera.fov = 65;
        } else {
          camera.position.set(0, Math.max(0.9, minY), 3.5);
          camera.rotation.x = -0.05;
          camera.fov = 60;
        }
      } else {
        camera.position.set(0, Math.max(0.7, minY), 3.2);
        camera.rotation.x = -0.05;
        camera.fov = 55;
      }
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  useEffect(() => {
    handleResize();
    const debouncedResize = debounce(handleResize, 250);
    window.addEventListener('resize', debouncedResize);

    // Register event listener for cleanup
    // TEMPORARILY DISABLED: Cleanup manager registration
    // cleanupManagerRef.current.registerEventListener(
    //   window,
    //   'resize',
    //   debouncedResize
    // );

    return () => window.removeEventListener('resize', debouncedResize);
  }, [handleResize]);

  // Optimized animation frame
  useEffect(() => {
    // if (!isAnimating) return;
    //never stop the animation loop
    let startTime = null;
    let loadProgress = 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const delta = Math.min(0.01, (elapsed / 1000) * 0.5);
      loadProgress = Math.min(loadProgress + delta, 1);

      if (loadProgress < 1 && isAnimating) {
        animationRef.current = requestAnimationFrame(animate);
        // TEMPORARILY DISABLED: Cleanup manager registration
        // cleanupManagerRef.current.registerAnimationFrame(animationRef.current);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    // TEMPORARILY DISABLED: Cleanup manager registration
    // cleanupManagerRef.current.registerAnimationFrame(animationRef.current);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  // Enhanced device configuration with better text positioning for portrait/landscape
  const deviceConfig = useMemo(() => {
    const isMobile = windowWidth < 480;
    const isTablet = windowWidth >= 480 && windowWidth < 1300;
    const isDesktop = windowWidth >= 1300;
    const isHighDPI = window.devicePixelRatio > 1.5;

    // Better orientation detection
    const isPortrait = window.innerHeight > window.innerWidth;
    const aspectRatio = window.innerWidth / window.innerHeight;

    let titlePosition,
      foundPosition,
      woodPosition,
      fontSize,
      splatConfig,
      effectsLevel;

    if (isMobile) {
      // Mobile: Positioned for camera at y=1.2-1.6, looking straight or slightly down
      titlePosition = [-0.7, -0.1, -0.3];
      foundPosition = [0, -0.1, 0.0];
      woodPosition = [0.7, -0.1, -0.3];
      fontSize = isPortrait ? 0.25 : 0.22;
      effectsLevel = 'low'; // Minimal effects for mobile
      splatConfig = {
        size: 40,
        scale: 0.8,
        position: [0, 0, -0.5],
      };
    } else if (isTablet) {
      // Tablet: Positioned for camera at y=0.9-1.1, looking slightly down
      titlePosition = [-0.9, -0.3, -0.3];
      foundPosition = [0, -0.3, 0.6];
      woodPosition = [1, -0.3, -0.3];
      fontSize = isPortrait ? 0.3 : 0.28;
      effectsLevel = 'medium'; // Moderate effects for tablets
      splatConfig = {
        size: 35,
        scale: 1,
        position: [0, 0, 0],
      };
    } else {
      // Desktop: Positioned for camera at y=0.7, looking slightly down
      titlePosition = [-1.2, -0.1, 0.0];
      foundPosition = [0, -0.1, 0.6];
      woodPosition = [1.2, -0.1, 0];
      fontSize = 0.35;
      effectsLevel = 'high'; // Full effects for desktop
      splatConfig = {
        size: 30,
        scale: 1,
        position: [0, 0, 0],
      };
    }

    return {
      titlePosition,
      foundPosition,
      woodPosition,
      fontSize,
      splatConfig,
      effectsLevel,
      isMobile,
      isTablet,
      isDesktop,
      isHighDPI,
      isPortrait,
      aspectRatio,
    };
  }, [windowWidth]);

  // Memoized presentation controls config
  const presentationConfig = useMemo(
    () => ({
      mass: deviceConfig.isMobile ? 5 : 10,
      tension: 100,
      friction: deviceConfig.isMobile ? 15 : 20,
      speed: deviceConfig.isMobile ? 1.5 : 2,
    }),
    [deviceConfig.isMobile]
  );

  return (
    <>
      {sceneError ? (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 2, 0.1]} />
          <meshBasicMaterial color="#ff6b6b" transparent opacity={0.8} />
        </mesh>
      ) : (
        <PresentationControls
          makeDefault
          enabled={!hasOverlay}
          global={true}
          snap={true}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 6, Math.PI / 3]}
          azimuth={[-Math.PI / 3, Math.PI / 3]}
          config={presentationConfig}
          onStart={() => {
            console.log('🎮 PresentationControls: User interaction started!', {
              enabled: !hasOverlay,
              hasOverlay,
              showContactPage,
              showTypes,
              showGallery,
              timestamp: new Date().toISOString(),
            });
            setUserInteracting(true);
          }}
          onEnd={() => {
            console.log('🎮 PresentationControls: User interaction ended!', {
              enabled: !hasOverlay,
              hasOverlay,
              timestamp: new Date().toISOString(),
            });
            // Reset after a delay to allow for smooth transition
            setTimeout(() => setUserInteracting(false), 100);
          }}
        >
          {/* Render 3D content - splat stays visible for alpha animation even in gallery mode */}
          {
            <>
              {/* Only show text when NO overlays are active */}
              {!hasOverlay && (
                <>
                  <AnimatedText
                    position={deviceConfig.titlePosition}
                    fontSize={deviceConfig.fontSize}
                    delay={0.2}
                    initialLoadComplete={initialLoadComplete}
                    alphaAnimationComplete={alphaAnimationComplete}
                    deviceConfig={deviceConfig}
                  >
                    DOUG'S
                  </AnimatedText>
                  <AnimatedText
                    position={deviceConfig.foundPosition}
                    fontSize={deviceConfig.fontSize}
                    delay={0.5}
                    initialLoadComplete={initialLoadComplete}
                    alphaAnimationComplete={alphaAnimationComplete}
                    deviceConfig={deviceConfig}
                  >
                    Found
                  </AnimatedText>
                  <AnimatedText
                    position={deviceConfig.woodPosition}
                    fontSize={deviceConfig.fontSize}
                    delay={0.8}
                    initialLoadComplete={initialLoadComplete}
                    alphaAnimationComplete={alphaAnimationComplete}
                    deviceConfig={deviceConfig}
                  >
                    Wood
                  </AnimatedText>
                </>
              )}

              {/* Splat component with alphaTest animation wrapped in error boundary */}
              <mesh
                position={deviceConfig.splatConfig.position}
                scale={deviceConfig.splatConfig.scale}
              >
                <SplatErrorBoundary initialLoadComplete={initialLoadComplete}>
                  <SplatWithErrorHandling
                    alphaTest={manualAlphaTest}
                    chunkSize={0.01}
                    splatSize={deviceConfig.splatConfig.size}
                    onSplatLoaded={onSplatLoaded}
                    initialLoadComplete={initialLoadComplete}
                    validatedSplatUrl={validatedSplatUrl}
                  />
                </SplatErrorBoundary>
              </mesh>
            </>
          }
        </PresentationControls>
      )}

      {/* Splats don't respond to lighting - keeping scene minimal and clean */}
      {/* Preload splat for loading screen integration */}
      <Preload all />
      <ProgressChecker
        onSplatLoaded={onSplatLoaded}
        imagesLoaded={imagesLoaded}
        initialLoadComplete={initialLoadComplete}
        onSceneStart={() => setSceneStarted(true)} // NEW: Signal when scene starts
      />
    </>
  );
}

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function App({
  isAnimating,
  showContactPage,
  showTypes,
  showGallery,
  onSplatLoaded,
  imagesLoaded,
  initialLoadComplete,
  validatedSplatUrl, // NEW: Pre-validated splat URL from parent
}) {
  // Protect against WebGL context loss extension errors globally
  useEffect(() => {
    // Override THREE.js WebGLRenderer forceContextLoss if it doesn't check for extension support
    const originalError = console.error;
    console.error = function (...args) {
      const message = args[0];
      if (
        typeof message === 'string' &&
        message.includes('WEBGL_lose_context extension not supported')
      ) {
        console.warn(
          '⚠️ WEBGL_lose_context extension not supported - this is expected on some devices'
        );
        return;
      }
      return originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  // Debug logging to check prop values
  useEffect(() => {
    console.log('🎬 Canvas component mounted and props received:', {
      showGallery,
      showTypes,
      showContactPage,
      imagesLoaded,
      initialLoadComplete,
      onSplatLoaded: !!onSplatLoaded,
      onSplatLoadedType: typeof onSplatLoaded,
    });
  }, [
    showGallery,
    showTypes,
    showContactPage,
    isAnimating,
    onSplatLoaded,
    imagesLoaded,
    initialLoadComplete,
  ]);

  // Adaptive performance settings based on device capability
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 480;
  const isTablet = windowWidth >= 480 && windowWidth < 1300;
  const isHighDPI = window.devicePixelRatio > 1.5;

  // Performance settings based on device and gallery state
  const performanceConfig = useMemo(() => {
    // Reduce performance when gallery is active to free up resources for smooth panning
    const isGalleryActive = showGallery;
    const isIOSSafariBrowser = isIOSSafari();

    // Use iOS Safari specific config if detected
    if (isIOSSafariBrowser) {
      const iosConfig = getIOSSafariConfig();
      console.log('📱 iOS Safari detected, using optimized config');

      return {
        dpr: [1, Math.min(1.5, iosConfig.pixelRatio)],
        performance: {
          min: 0.2,
          max: isGalleryActive ? 0.3 : 0.6, // Very conservative for iOS
          debounce: 500, // Longer debounce for iOS
        },
        antialias: iosConfig.antialias,
        frameloop: 'always', // Keep render loop active for React Spring
        iosConfig, // Include iOS specific WebGL settings
      };
    }

    if (isMobile) {
      return {
        dpr: [1, 1.5],
        performance: {
          min: 0.3,
          max: isGalleryActive ? 0.4 : 0.8,
          debounce: 300,
        },
        antialias: false,
        frameloop: 'always', // Keep render loop active for React Spring
      };
    } else if (isTablet) {
      return {
        dpr: [1, 2],
        performance: {
          min: 0.4,
          max: isGalleryActive ? 0.5 : 0.9,
          debounce: 250,
        },
        antialias: true,
        frameloop: 'always', // Keep render loop active for React Spring
      };
    } else {
      return {
        dpr: [1, 2],
        performance: {
          min: 0.5,
          max: isGalleryActive ? 0.6 : 1,
          debounce: 200,
        },
        antialias: true,
        frameloop: 'always', // Keep render loop active for React Spring
      };
    }
  }, [isMobile, isTablet, showGallery]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Global cleanup effect for page navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('🚪 Page unloading, triggering cleanup...');
      // TEMPORARILY DISABLED: Custom cleanup to rely on R3F's built-in memory management
      // if (window.cleanupManager) {
      //   window.cleanupManager.cleanup();
      // }
    };

    const handlePageHide = () => {
      console.log('👋 Page hiding, triggering cleanup...');
      // TEMPORARILY DISABLED: Custom cleanup to rely on R3F's built-in memory management
      // if (window.cleanupManager) {
      //   window.cleanupManager.cleanup();
      // }
    };

    // iOS Safari often doesn't fire beforeunload, use pagehide instead
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  // Define hasOverlay at the component level to match Scene component logic
  const hasOverlay = showContactPage || showTypes || showGallery;

  // Debug overlay state at the main component level
  useEffect(() => {
    console.log('🎯 Main Experience: Overlay state changed:', {
      hasOverlay,
      showContactPage,
      showTypes,
      showGallery,
      canvasPointerEvents: hasOverlay ? 'none' : 'auto',
      canvasZIndex: hasOverlay ? 1 : 1000,
    });
  }, [hasOverlay, showContactPage, showTypes, showGallery]);

  return (
    <>
      <Canvas
        camera={{
          position: [0, 0.7, 3.2], // Match desktop camera position from resize handler
          fov: 55, // Match desktop FOV
          near: 0.1,
          far: 100,
        }}
        dpr={performanceConfig.dpr}
        performance={performanceConfig.performance}
        style={{
          background: '#f5f5f5', // Consistent background color matching theme
          position: 'fixed', // Fixed to viewport to prevent container issues
          top: 0,
          left: 0,
          width: '100vw', // Use standard viewport units
          height: '100vh',
          zIndex: hasOverlay ? 1 : 1000, // Simplified z-index logic
          pointerEvents: hasOverlay ? 'none' : 'auto', // Disable pointer events when overlays are active
          touchAction: 'none', // Prevent default touch actions that might interfere
        }}
        onMouseDown={(e) => {
          console.log('🖱️ Canvas mouse down detected!', {
            clientX: e.clientX,
            clientY: e.clientY,
            hasOverlay,
            pointerEvents: hasOverlay ? 'none' : 'auto',
          });
        }}
        onMouseMove={(e) => {
          // Only log occasionally to avoid spam
          if (Math.random() < 0.01) {
            console.log('🖱️ Canvas mouse move detected!', {
              hasOverlay,
              pointerEvents: hasOverlay ? 'none' : 'auto',
            });
          }
        }}
        gl={{
          powerPreference:
            performanceConfig.iosConfig?.powerPreference || 'high-performance', // iOS Safari optimized
          antialias: performanceConfig.iosConfig?.antialias || false, // iOS Safari optimized
          depth: performanceConfig.iosConfig?.depth ?? true, // iOS Safari optimized
          stencil: performanceConfig.iosConfig?.stencil || false, // Disable stencil buffer for all devices
          alpha: performanceConfig.iosConfig?.alpha ?? false, // do not use transparency
          premultipliedAlpha:
            performanceConfig.iosConfig?.premultipliedAlpha || false, // Disable for simpler blending
          preserveDrawingBuffer:
            performanceConfig.iosConfig?.preserveDrawingBuffer || false, // Critical for iOS Safari memory management
          outputColorSpace: 'srgb',
          failIfMajorPerformanceCaveat:
            performanceConfig.iosConfig?.failIfMajorPerformanceCaveat ?? false, // Allow fallback to software rendering if needed
          // iOS Safari specific optimizations
          ...(isIOSSafari() && {
            contextAttributes: {
              powerPreference: 'high-performance',
              antialias: false,
              depth: false,
              stencil: false,
              alpha: false,
              premultipliedAlpha: false,
              preserveDrawingBuffer: false,
            },
          }),
        }}
        frameloop={performanceConfig.frameloop}
        onCreated={({ gl, scene, camera }) => {
          // TEMPORARILY DISABLED: Custom WebGL cleanup to rely on R3F's built-in memory management
          /*
          // Store references globally for cleanup
          window.cleanupManager = new WebGLCleanupManager();
          window.cleanupManager.registerContext(gl.getContext());

          // Protect against WEBGL_lose_context extension not supported error
          const originalForceContextLoss = gl.forceContextLoss;
          if (originalForceContextLoss) {
            gl.forceContextLoss = function () {
              try {
                return safeForceContextLoss(gl.getContext());
              } catch (error) {
                console.warn('⚠️ Failed to force context loss safely:', error);
              }
            };
          }

          // iOS Safari specific setup
          if (isIOSSafari()) {
            console.log('📱 iOS Safari Canvas created with optimized settings');
            logMemoryUsage();

            // Set up memory monitoring
            const memoryInterval = setInterval(() => {
              logMemoryUsage();
            }, 15000); // Every 15 seconds

            window.cleanupManager.registerTimer(memoryInterval);
          }
          */
        }}
      >
        <Scene
          showContactPage={showContactPage}
          showTypes={showTypes}
          showGallery={showGallery}
          hasOverlay={hasOverlay}
          isAnimating={isAnimating}
          onSplatLoaded={onSplatLoaded}
          imagesLoaded={imagesLoaded}
          initialLoadComplete={initialLoadComplete}
          validatedSplatUrl={validatedSplatUrl}
        />
      </Canvas>
    </>
  );
}
