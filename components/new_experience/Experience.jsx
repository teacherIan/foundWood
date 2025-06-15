import { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react';
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
import splat from '../../src/assets/new_experience/full.splat';
import splatFallback from '../../src/assets/new_experience/my_splat.splat';
import driftwood from '../../src/assets/fonts/DriftWood-z8W4.ttf';
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

// Enhanced Splat component with error handling and fallback
const SplatWithErrorHandling = memo(
  ({ alphaTest, chunkSize, splatSize, ...props }) => {
    const [splatSource, setSplatSource] = useState(splat);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      console.log('🎯 SplatWithErrorHandling: Attempting to load splat file');
    }, []);

    const handleError = useCallback(
      (error) => {
        console.error('❌ Splat loading error:', error);
        if (splatSource === splat && !hasError) {
          console.log('🔄 Trying fallback splat file...');
          setSplatSource(splatFallback);
          setHasError(false);
        } else {
          console.error('❌ Both splat files failed to load');
          setHasError(true);
        }
      },
      [splatSource, hasError]
    );

    if (hasError) {
      console.log('⚠️ Splat failed to load, rendering placeholder');
      return (
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshBasicMaterial color="#77481c" transparent opacity={0.3} />
        </mesh>
      );
    }

    try {
      return (
        <Splat
          alphaTest={alphaTest}
          chunkSize={chunkSize}
          src={splatSource}
          splatSize={splatSize}
          onError={handleError}
          {...props}
        />
      );
    } catch (error) {
      console.error('❌ Splat render error:', error);
      handleError(error);
      return null;
    }
  }
);

// Simple and reliable loading detector with error handling
// UPDATED: No longer waits for images since preloading is disabled
function ProgressChecker({ onSplatLoaded, imagesLoaded }) {
  const hasCalledRef = useRef(false);

  useEffect(() => {
    // UPDATED: Call splat loaded callback immediately since we disabled image preloading
    if (!hasCalledRef.current && onSplatLoaded) {
      hasCalledRef.current = true;
      console.log(
        '✅ ProgressChecker: Calling splat loaded callback (image preloading disabled)'
      );
      // Use a small delay to ensure Canvas is stable
      const timer = setTimeout(() => {
        try {
          onSplatLoaded();
        } catch (error) {
          console.error('❌ Error in splat loaded callback:', error);
        }
      }, 800); // 800ms - reasonable delay for splat loading

      return () => clearTimeout(timer);
    }
  }, [onSplatLoaded]); // UPDATED: Removed imagesLoaded dependency

  return null; // No visual elements to prevent context issues
}

function Scene({
  isAnimating,
  showContactPage,
  showTypes,
  showGallery,
  onSplatLoaded,
  imagesLoaded,
  initialLoadComplete,
}) {
  const [targetX, setTargetX] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userInteracting, setUserInteracting] = useState(false);
  const animationRef = useRef();
  const { camera, scene, gl } = useThree();
  const idleTimeRef = useRef(0);
  const interactionTimeRef = useRef(0);
  const [manualAlphaTest, setManualAlphaTest] = useState(1);
  const alphaAnimationRequestRef = useRef(null); // Ref to store animation frame request
  const isInitialMountRef = useRef(true); // Ref to track initial mount
  const [sceneError, setSceneError] = useState(null);
  const [alphaAnimationComplete, setAlphaAnimationComplete] = useState(false); // Track alpha animation completion

  // TEMPORARILY DISABLED: WebGL cleanup manager for iOS Safari
  // const cleanupManagerRef = useRef(new WebGLCleanupManager());

  // Set scene background to white to ensure consistent background
  useEffect(() => {
    if (scene) {
      scene.background = new THREE.Color('#ffffff');
    }
  }, [scene]);

  // Error boundary for scene rendering
  useEffect(() => {
    const handleError = (event) => {
      console.error('❌ Scene error caught:', event.error);
      setSceneError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []); // Scene component mounted - setup cleanup and debugging
  useEffect(() => {
    console.log('🚀 Scene component mounted and ready');
    console.log('🎯 Splat file info:', {
      primarySplat: splat,
      fallbackSplat: splatFallback,
      splatType: typeof splat,
      fallbackType: typeof splatFallback,
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

  // Check if any overlay is active - must be defined before useEffect
  const hasOverlay = showContactPage || showTypes || showGallery;

  // useEffect for manualAlphaTest animation
  useEffect(() => {
    // Always cancel the previous animation frame if one is pending
    if (alphaAnimationRequestRef.current) {
      cancelAnimationFrame(alphaAnimationRequestRef.current);
    }

    const startAlpha = manualAlphaTest; // Current alpha value from state
    let targetAlpha;
    let duration;

    if (isInitialMountRef.current) {
      // Don't start initial animation until loading is complete
      if (!initialLoadComplete) {
        console.log(
          '⏳ Waiting for loading to complete before starting initial animation'
        );
        return;
      }

      console.log(
        '🎬 Starting initial splat fade-in animation (loading complete)'
      );
      targetAlpha = 0.3;
      duration = 5000; // 5 seconds for initial animation
      isInitialMountRef.current = false; // Mark initial animation as handled
    } else {
      // Check if ANY overlay is active (contact, types, or gallery)
      if (hasOverlay) {
        console.log(
          `🎭 Overlay detected - animating alpha to 1.0 (showContactPage: ${showContactPage}, showTypes: ${showTypes}, showGallery: ${showGallery})`
        );
        targetAlpha = 1.0; // Animate to 1.0 when any overlay is shown
        duration = 600; // 600ms - coordinated timing for all overlays
      } else {
        console.log('🎭 No overlay - animating alpha back to 0.3');
        targetAlpha = 0.3; // Animate back to 0.3 when all overlays are hidden
        duration = 400; // 400ms - quick return to normal
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

      if (elapsedTime < duration) {
        alphaAnimationRequestRef.current = requestAnimationFrame(animateAlpha);
        // TEMPORARILY DISABLED: Cleanup manager registration
        // cleanupManagerRef.current.registerAnimationFrame(
        //   alphaAnimationRequestRef.current
        // );
      } else {
        alphaAnimationRequestRef.current = null; // Clear ref when animation completes
        // Mark alpha animation as complete for initial animation only
        if (isInitialMountRef.current === false && !alphaAnimationComplete) {
          console.log(
            '✨ Alpha animation completed, text animation can now start'
          );
          setAlphaAnimationComplete(true);
        }
      }
    };

    alphaAnimationRequestRef.current = requestAnimationFrame(animateAlpha);
    // TEMPORARILY DISABLED: Cleanup manager registration
    // cleanupManagerRef.current.registerAnimationFrame(
    //   alphaAnimationRequestRef.current
    // );

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
      camera.position.y =
        (windowWidth < 480 ? 2 : 1.2) + verticalWave + breathingEffect * 0.3;
      camera.position.z = (windowWidth < 480 ? 2 : 3) + breathingEffect;

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
      if (width < 480) {
        if (isPortrait) {
          camera.position.set(0, 1.6, 4.2);
          camera.rotation.x = 0;
          camera.fov = 100;
        } else {
          camera.position.set(0, 1.2, 3.2);
          camera.rotation.x = 0;
          camera.fov = 100;
        }
      } else if (width < 1300) {
        if (isPortrait) {
          camera.position.set(0, 1.1, 4.0);
          camera.rotation.x = -0.05;
          camera.fov = 65;
        } else {
          camera.position.set(0, 0.9, 3.5);
          camera.rotation.x = -0.05;
          camera.fov = 60;
        }
      } else {
        camera.position.set(0, 0.7, 3.2);
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
          global
          snap
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 3, Math.PI / 3]}
          config={presentationConfig}
          onStart={() => setUserInteracting(true)}
          onEnd={() => {
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

              {/* Splat component with alphaTest animation */}
              <mesh
                position={deviceConfig.splatConfig.position}
                scale={deviceConfig.splatConfig.scale}
              >
                <SplatWithErrorHandling
                  alphaTest={manualAlphaTest}
                  chunkSize={0.01}
                  splatSize={deviceConfig.splatConfig.size}
                />
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
          background: '#ffffff', // Pure white background for Canvas
          position: 'fixed', // Fixed to viewport to prevent container issues
          top: 0,
          left: 0,
          width: '100vw', // Use standard viewport units
          height: '100vh',
          zIndex: showTypes || showGallery || showContactPage ? 1 : 10,
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
              powerPreference: 'default',
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
          isAnimating={isAnimating}
          onSplatLoaded={onSplatLoaded}
          imagesLoaded={imagesLoaded}
          initialLoadComplete={initialLoadComplete}
        />
      </Canvas>
    </>
  );
}
