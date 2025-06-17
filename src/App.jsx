import './App.css';
import './seo-enhancements.css';
import {
  useState,
  useCallback,
  useEffect,
  useReducer,
  memo,
  useRef,
} from 'react';
import found_wood from './assets/found_wood_final_all.png';
import Contact from '../components/contact/Contact';
import Gallery from '../components/galleries/Gallery';
import Types from '../components/select_gallery/Types';
import NewCanvas from '../components/experience/Experience';
import FontFaceObserver from 'fontfaceobserver';
import {
  useSpring,
  animated,
  useSpringValue,
  useChain,
  useSpringRef,
} from '@react-spring/web';

// PERFORMANCE OPTIMIZATION: Large splat files (39MB+) are now served from public directory
// instead of being bundled. This provides:
// - Faster builds (Vite doesn't process large files)
// - Smaller JS bundles (no embedded 39MB assets)
// - Better loading (browser can stream large files efficiently)
// - CDN-ready (static assets can be served from CDN)

// OPTIMIZED: Large splat files moved to public directory to avoid bundling (~39MB)
const splat = '/assets/experience/new_fixed_PLY.splat'; // Served statically, not bundled

// TEMPORARILY DISABLED: Image preloading to reduce memory pressure
// import { useImagePreloader } from '../components/galleries/useImagePreloader';
// TEMPORARILY DISABLED: Custom WebGL cleanup to rely on R3F's built-in memory management
// import { useWebGLCleanup } from '../components/experience/useWebGLCleanup.js';
// import { logMemoryUsage } from '../components/experience/WebGLCleanup.js';

const configAnimation = {
  mass: 2,
  tension: 400,
  friction: 20,
  precision: 0.0005,
};

// Memoized AnimatedMenuItem component
const AnimatedMenuItem = memo(({ children, onClick, isLogo = false }) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const springProps = useSpring({
    scale: hovered || pressed ? 1.1 : 1,
    config: configAnimation,
  });

  return (
    <animated.div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        transform: springProps.scale.to((s) => `scale(${s})`),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: isLogo ? 'auto' : '100%',
      }}
    >
      {children}
    </animated.div>
  );
});

// Simplified loading text components - reduced resource usage
const AnimatedLoadingContainer = memo(({ children, shouldShow }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        textAlign: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: shouldShow ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      {children}
    </div>
  );
});

const AnimatedLoadingSpinner = memo(() => {
  return (
    <div
      style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="loading-spinner"
        aria-label="Loading spinner"
        style={{
          animation:
            'spin-smooth 1.5s cubic-bezier(0.4, 0.0, 0.6, 1.0) infinite',
          WebkitAnimation:
            'spin-smooth 1.5s cubic-bezier(0.4, 0.0, 0.6, 1.0) infinite',
          position: 'relative',
          zIndex: 1,
        }}
      />
    </div>
  );
});

const AnimatedLoadingTitle = memo(({ children, delay = 0 }) => {
  const titleSpring = useSpring({
    from: {
      opacity: 0,
      transform: 'translateY(24px) scale(0.94)',
      filter: 'blur(1px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0px) scale(1)',
      filter: 'blur(0px)',
    },
    config: { mass: 1, tension: 120, friction: 16 },
    delay,
  });

  return (
    <animated.h2
      style={{
        ...titleSpring,
        margin: '0 0 10px 0',
        fontSize: '1.6rem',
        fontWeight: '600',
        color: '#77481c',
        fontFamily: '"CustomFont", "Poppins", "Lobster Two", sans-serif',
      }}
    >
      {children}
    </animated.h2>
  );
});

const AnimatedLoadingSubtitle = memo(({ children, delay = 0 }) => {
  const subtitleSpring = useSpring({
    from: {
      opacity: 0,
      transform: 'translateY(18px) scale(0.96)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0px) scale(1)',
    },
    config: { mass: 1, tension: 140, friction: 18 },
    delay,
  });

  return (
    <animated.div
      style={{
        ...subtitleSpring,
        fontSize: '1.1rem',
        color: '#8b5a2b',
        fontFamily: '"CustomFont", "Poppins", "Lobster Two", sans-serif',
        marginBottom: '8px',
      }}
    >
      {children}
    </animated.div>
  );
});

const AnimatedLoadingTagline = memo(({ children, delay = 0 }) => {
  const taglineSpring = useSpring({
    from: {
      opacity: 0,
      transform: 'translateY(16px) scale(0.97)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0px) scale(1)',
    },
    config: { mass: 1, tension: 130, friction: 17 },
    delay,
  });

  return (
    <animated.div
      style={{
        ...taglineSpring,
        fontSize: '0.9rem',
        color: '#a67c52',
        fontFamily: '"CustomFont", "Poppins", "Lobster Two", sans-serif',
        fontStyle: 'italic',
      }}
    >
      {children}
    </animated.div>
  );
});

const AnimatedLoadingStatus = memo(({ children, delay = 0 }) => {
  const statusSpring = useSpring({
    from: {
      opacity: 0,
      transform: 'translateY(20px) scale(0.92)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0px) scale(1)',
    },
    config: { mass: 1.1, tension: 150, friction: 20 },
    delay,
  });

  return (
    <animated.div
      style={{
        ...statusSpring,
        fontSize: '0.95rem',
        color: '#9d7856',
        fontFamily: '"CustomFont", "Poppins", "Lobster Two", sans-serif',
        fontWeight: '500',
      }}
    >
      {children}
    </animated.div>
  );
});

const AnimatedLoadingSaying = memo(({ children, opacity, delay = 0 }) => {
  const [hasInitialAnimationCompleted, setHasInitialAnimationCompleted] =
    useState(false);

  // Track when initial animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasInitialAnimationCompleted(true);
    }, 3200); // 2.5s delay + 0.7s animation duration
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        fontStyle: 'italic',
        fontSize: '1.2rem',
        color: '#8b5a2b',
        maxWidth: '380px',
        textAlign: 'center',
        lineHeight: '1.5',
        fontWeight: '500',
        margin: '0 auto',
        padding: '0 20px',
        fontFamily: '"CustomFont", "Poppins", "Lobster Two", sans-serif',
        letterSpacing: '0.3px',
        minHeight: '2.4rem',
        // Use runtime opacity after initial animation, otherwise use CSS animation
        opacity: hasInitialAnimationCompleted ? opacity : 0,
        animation: hasInitialAnimationCompleted
          ? 'none'
          : 'seamlessEntranceQuote 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.5s forwards',
        transition: hasInitialAnimationCompleted
          ? 'opacity 0.4s cubic-bezier(0.4, 0, 0.6, 1)'
          : 'none',
      }}
    >
      {children}
    </div>
  );
});

// Perfect saying that captures Doug's Found Wood personality and Maine craftsmanship
const loadingSaying = 'Always unique, made in Maine';

// Special sayings for when retries are happening
const retrySayings = [
  'Sometimes the best pieces need a little extra care',
  'Patience creates the finest craftsmanship',
  'Good things come to those who wait',
  'Every craftsman knows: the second attempt often succeeds',
  'Like sanding wood smooth, some things take multiple passes',
  'Each piece from Maine tells its own story',
];

// State reducer for better state management
const initialState = {
  fontsLoaded: false,
  splatLoaded: false,
  imagesLoaded: true, // UPDATED: Set to true since we disabled image preloading
  initialLoadComplete: false, // Track if the entire initial load sequence is done
  isAnimating: true,
  activeGalleryTypeString: 'chairs',
  activeGalleryType: 1,
  showTypes: false,
  showGallery: false,
  showContactPage: false,
  showDetails: true,
  galleryTypeArr: [],
  currentPhoto: 0,
  showInfographic: false,
};

function reducer(state, action) {
  console.log('🔄 Reducer called with action:', action.type, action);
  console.log('🔄 Current state before action:', {
    fontsLoaded: state.fontsLoaded,
    splatLoaded: state.splatLoaded,
  });

  switch (action.type) {
    case 'SET_FONTS_LOADED':
      console.log('✅ Setting fonts as loaded');
      return { ...state, fontsLoaded: true };
    case 'SET_SPLAT_LOADED':
      console.log('✅ Setting splat as loaded');
      const newState = { ...state, splatLoaded: true };
      console.log('✅ New state after splat loaded:', {
        fontsLoaded: newState.fontsLoaded,
        splatLoaded: newState.splatLoaded,
      });
      return newState;
    case 'SET_IMAGES_LOADED':
      console.log('✅ Setting images as loaded');
      return { ...state, imagesLoaded: true };
    case 'SET_INITIAL_LOAD_COMPLETE':
      console.log(
        '✅ Setting initial load as complete - no more loading screens!'
      );
      return { ...state, initialLoadComplete: true };
    case 'TOGGLE_ANIMATION':
      return { ...state, isAnimating: !state.isAnimating };
    case 'SET_GALLERY_TYPE':
      return {
        ...state,
        activeGalleryType: action.payload.type,
        activeGalleryTypeString: action.payload.typeString,
      };
    case 'TOGGLE_TYPES':
      return {
        ...state,
        showTypes: !state.showTypes,
        showGallery: false,
        showInfographic: false,
        isAnimating: false,
      };
    case 'SHOW_TYPES':
      return {
        ...state,
        showTypes: true,
        showGallery: false,
        showInfographic: false,
        isAnimating: false,
      };
    case 'HIDE_TYPES':
      return {
        ...state,
        showTypes: false,
        isAnimating: true,
      };
    case 'TOGGLE_GALLERY':
      return {
        ...state,
        showGallery: !state.showGallery,
        showTypes: false,
        showDetails: false,
      };
    case 'SHOW_GALLERY':
      return {
        ...state,
        showGallery: true,
        showTypes: false,
        showDetails: false,
      };
    case 'TOGGLE_CONTACT':
      return {
        ...state,
        showContactPage: !state.showContactPage,
        showTypes: false,
        isAnimating: false,
        showInfographic: false,
      };
    case 'RESET_VIEW':
      return {
        ...state,
        isAnimating: true,
        showTypes: false,
        showGallery: false,
        showDetails: false,
        showInfographic: false,
      };
    case 'SET_SHOW_DETAILS':
      return { ...state, showDetails: action.payload };
    case 'SET_GALLERY_TYPE_ARR':
      return { ...state, galleryTypeArr: action.payload };
    case 'SET_CURRENT_PHOTO':
      return { ...state, currentPhoto: action.payload };
    case 'SET_SHOW_INFOGraphic':
      return { ...state, showInfographic: action.payload };
    case 'SET_SHOW_CONTACT':
      return { ...state, showContactPage: action.payload };
    case 'SET_ANIMATING':
      return { ...state, isAnimating: action.payload };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // **SIMPLIFIED**: Skip splat validation since we have a 3-second timeout
  // Just provide the splat URL directly - no pre-validation needed
  const splatUrl = '/assets/experience/new_fixed_PLY.splat';

  // **EXIT ANIMATION STATE**: Track when the loading screen should exit
  const [isExiting, setIsExiting] = useState(false);

  // **ENTRANCE COMPLETION STATE**: Track when entrance animations complete for smooth handoff
  const [entranceComplete, setEntranceComplete] = useState(false);

  // **OPTIMIZED TIMING**: Improved for seamless transition between entrance and exit
  // Total timeline: entrance animations end at ~3.1s, brief hold, then exit at 3.5s
  const loadingTimeoutRef = useRef(null);
  const entranceCompleteRef = useRef(null);

  // Track entrance completion for smooth transition
  useEffect(() => {
    entranceCompleteRef.current = setTimeout(() => {
      console.log(
        '✅ ENTRANCE ANIMATIONS COMPLETE - Elements now in hold state'
      );
      setEntranceComplete(true);
    }, 3200); // 3.2s - just after the last entrance animation completes (quote at 1.8s + 1.3s = 3.1s)

    return () => {
      if (entranceCompleteRef.current) {
        clearTimeout(entranceCompleteRef.current);
      }
    };
  }, []);

  // Start the optimized timeout immediately on component mount
  useEffect(() => {
    console.log(
      '🚨 OPTIMIZED LOADING SEQUENCE STARTING - Component just mounted!'
    );

    loadingTimeoutRef.current = setTimeout(() => {
      console.log(
        '✨ STARTING SEAMLESS EXIT TRANSITION - Perfect timing after entrance completion!'
      );

      // First trigger exit animations with better timing
      setIsExiting(true);

      // Then complete loading after exit animation duration
      setTimeout(() => {
        console.log(
          '🎉 SEAMLESS EXIT ANIMATIONS COMPLETE - LOADING SCREEN DISMISSED!'
        );
        dispatch({ type: 'SET_INITIAL_LOAD_COMPLETE' });
      }, 1200); // 1200ms for exit animations to complete
    }, 3500); // 3.5 seconds - optimized for seamless transition (entrance completes at ~3.1s)

    // Cleanup on unmount only
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array - run ONCE on mount only

  // Single saying - no rotation logic needed

  // Initialize image preloader to start loading images at startup
  // TEMPORARILY DISABLED: Image preloading to reduce memory pressure
  /*
  const {
    preloadingState,
    isImageLoaded,
    isGalleryTypeLoaded,
    preloadGalleryType,
    preloadAllGalleryTypes,
    cancelPreloading,
    isPreloading,
  } = useImagePreloader(state.activeGalleryTypeString, state.showGallery, true); // Enable startup preloading
  */

  // Mock preloading state to replace disabled functionality
  const preloadingState = {
    progress: { total: 0, loaded: 0, percentage: 100 },
    loaded: new Set(),
    loading: new Set(),
    failed: new Set(),
  };
  const isImageLoaded = () => false;
  const isGalleryTypeLoaded = () => false;
  const preloadGalleryType = () => {};
  const preloadAllGalleryTypes = () => {};
  const cancelPreloading = () => {};
  const isPreloading = false;

  // TEMPORARILY DISABLED: Custom WebGL cleanup to rely on R3F's built-in memory management
  // Initialize WebGL cleanup for iOS Safari
  // const {
  //   cleanupManager,
  //   isIOSSafari: isIOSSafariBrowser,
  //   triggerCleanup,
  // } = useWebGLCleanup();

  // Mock implementations to replace disabled functionality
  const isIOSSafariBrowser = false;
  const cleanupManager = null;
  const triggerCleanup = () => {};

  // UPDATED: Image preloading monitoring disabled since we're not preloading images
  /*
  // Debug: Log preloader state changes and mark images as loaded when startup preloading completes
  useEffect(() => {
    console.log('🔬 Preloader state changed:', {
      isPreloading,
      progressTotal: preloadingState.progress.total,
      progressLoaded: preloadingState.progress.loaded,
      progressPercentage: preloadingState.progress.percentage,
      showGallery: state.showGallery,
      activeGalleryType: state.activeGalleryTypeString,
      imagesLoaded: state.imagesLoaded,
    });

    // Mark images as loaded when startup preloading is complete
    if (
      !state.imagesLoaded &&
      !isPreloading &&
      preloadingState.progress.total > 0 &&
      preloadingState.progress.loaded >= preloadingState.progress.total
    ) {
      console.log(
        '🎯 Startup image preloading completed, marking images as loaded'
      );
      console.log('📷 STEP 2 COMPLETE: All gallery images preloaded');
      dispatch({ type: 'SET_IMAGES_LOADED' });
    }
  }, [
    isPreloading,
    preloadingState.progress,
    state.showGallery,
    state.activeGalleryTypeString,
    state.imagesLoaded,
  ]);
  */

  // REMOVED: All normal loading completion logic
  // The loading screen ONLY ends via the 3-second timeout - no other conditions matter

  // Immediate state logging on component mount
  console.log('🚀 App component mounted with initial state:', {
    splatLoaded: state.splatLoaded,
    shouldShowLoading: !state.splatLoaded,
  });

  // Font loading detection with improved error handling
  useEffect(() => {
    console.log('🎨 Starting font loading...');
    const fonts = [
      new FontFaceObserver('driftWood'),
      new FontFaceObserver('CustomFont'),
      new FontFaceObserver('Poppins'),
      new FontFaceObserver('Lobster Two'),
    ];

    Promise.all(fonts.map((font) => font.load()))
      .then(() => {
        console.log('✅ All fonts loaded successfully');
        dispatch({ type: 'SET_FONTS_LOADED' });
      })
      .catch((error) => {
        console.error('Font loading error:', error);
        console.log('⚠️ Proceeding without all fonts loaded');
        dispatch({ type: 'SET_FONTS_LOADED' }); // Proceed anyway
      });
  }, []);

  const handleSplatLoadedCallback = useCallback(() => {
    console.log('🎯 Splat loaded callback triggered in App.jsx');
    console.log('🎬 3D SCENE LOADED: Ready to dismiss loading screen');
    console.log('Current state before splat loaded:', {
      splatLoaded: state.splatLoaded,
    });
    dispatch({ type: 'SET_SPLAT_LOADED' });
  }, []); // Remove dependencies to prevent recreation

  const handleGalleryTypesClickCallback = useCallback(() => {
    // TEMPORARILY DISABLED: iOS Safari specific cleanup
    // if (isIOSSafariBrowser && !state.showTypes) {
    //   console.log('📱 iOS Safari: Triggering cleanup before Gallery Types');
    //   triggerCleanup();
    // }

    dispatch({ type: 'SHOW_TYPES' });
  }, []); // TEMPORARILY DISABLED: Removed isIOSSafariBrowser, triggerCleanup dependencies

  const handleHideTypesCallback = useCallback(() => {
    dispatch({ type: 'HIDE_TYPES' });
  }, []);

  const handleMissionButtonClickCallback = useCallback(() => {
    dispatch({ type: 'TOGGLE_ANIMATION' });
    dispatch({ type: 'RESET_VIEW' });
  }, []);

  const handleGalleryButtonClickCallback = useCallback(() => {
    dispatch({ type: 'SHOW_GALLERY' });
  }, []);

  const handleEmblemClickCallback = useCallback(() => {
    // TEMPORARILY DISABLED: iOS Safari specific cleanup
    // if (
    //   isIOSSafariBrowser &&
    //   (state.showContactPage || state.showGallery || state.showTypes)
    // ) {
    //   console.log('📱 iOS Safari: Triggering cleanup before home navigation');
    //   triggerCleanup();
    // }

    dispatch({ type: 'RESET_VIEW' });
  }, []); // TEMPORARILY DISABLED: Removed isIOSSafariBrowser, triggerCleanup dependencies

  const handleContactPageClick = useCallback(() => {
    // TEMPORARILY DISABLED: iOS Safari specific cleanup
    // if (isIOSSafariBrowser && !state.showContactPage) {
    //   console.log('📱 iOS Safari: Triggering cleanup before Contact page');
    //   triggerCleanup();
    // }

    dispatch({ type: 'TOGGLE_CONTACT' });
  }, []); // TEMPORARILY DISABLED: Removed isIOSSafariBrowser, triggerCleanup dependencies

  const handleHideGalleryCallback = useCallback(() => {
    // TEMPORARILY DISABLED: iOS Safari specific cleanup
    // if (isIOSSafariBrowser && state.showGallery) {
    //   console.log('📱 iOS Safari: Triggering cleanup when closing gallery');
    //   triggerCleanup();
    // }

    dispatch({ type: 'RESET_VIEW' });
  }, []); // TEMPORARILY DISABLED: Removed isIOSSafariBrowser, triggerCleanup dependencies

  // Home screen logic: not showing gallery, contact, or types
  const isHomeScreen =
    !state.showGallery && !state.showContactPage && !state.showTypes;

  // Debug: Simple state logging
  useEffect(() => {
    console.log('🏠 App state changed:', {
      showGallery: state.showGallery,
      showTypes: state.showTypes,
      showContactPage: state.showContactPage,
      activeGalleryType: state.activeGalleryType,
      activeGalleryTypeString: state.activeGalleryTypeString,
      fontsLoaded: state.fontsLoaded,
      splatLoaded: state.splatLoaded,
    });
  }, [
    state.showGallery,
    state.showTypes,
    state.showContactPage,
    state.activeGalleryType,
    state.fontsLoaded,
    state.splatLoaded,
  ]);

  // TEMPORARILY DISABLED: iOS Safari specific cleanup monitoring
  /*
  useEffect(() => {
    if (isIOSSafariBrowser) {
      // When leaving Contact page, trigger additional cleanup
      if (!state.showContactPage && state.initialLoadComplete) {
        console.log(
          '📱 iOS Safari: Contact page closed, performing additional cleanup'
        );
        setTimeout(() => {
          triggerCleanup();
        }, 200);
      }

      // When leaving gallery, trigger additional cleanup
      if (!state.showGallery && state.initialLoadComplete) {
        console.log(
          '📱 iOS Safari: Gallery closed, performing additional cleanup'
        );
        setTimeout(() => {
          triggerCleanup();
        }, 200);
      }
    }
  }, [
    isIOSSafariBrowser,
    state.showContactPage,
    state.showGallery,
    state.initialLoadComplete,
    triggerCleanup,
  ]);
  */

  const iconSpring = useSpring({
    width: isHomeScreen ? '1.8em' : '1.2em',
    height: isHomeScreen ? '1.8em' : '1.2em',
    config: {
      tension: 300,
      friction: 20,
      clamp: false, // Prevents animation from stopping abruptly
      velocity: 0.01, // Ensures smooth animation in both directions
    },
    immediate: !state.initialLoadComplete, // Only animate after loading is complete
  });

  // Loading screen should ONLY appear until the 3-second timeout fires
  // No other conditions matter - ABSOLUTE timeout control only
  const shouldShowLoading = !state.initialLoadComplete;

  console.log('🔍 Loading check:', {
    initialLoadComplete: state.initialLoadComplete,
    shouldShowLoading: shouldShowLoading,
    timeoutActive: loadingTimeoutRef.current !== null,
  });
  console.log(
    '🎯 Final loading decision (ABSOLUTE TIMEOUT ONLY):',
    shouldShowLoading
  );

  // Single saying - no rotation needed

  // TEMPORARILY DISABLED: iOS Safari specific global error handling
  /*
  useEffect(() => {
    if (!isIOSSafariBrowser) return;

    console.log('📱 Setting up iOS Safari specific error handlers');

    // WebGL context lost handler
    const handleWebGLContextLost = (event) => {
      console.error('❌ WebGL context lost detected on iOS Safari');
      event.preventDefault();

      // Trigger immediate cleanup
      if (cleanupManager) {
        cleanupManager.cleanup();
      }

      // Attempt to force garbage collection if available
      if (window.gc) {
        window.gc();
      }

      // TEMPORARILY DISABLED: Log memory usage for debugging
      // logMemoryUsage();
    };

    // WebGL context restored handler
    const handleWebGLContextRestored = (event) => {
      console.log('✅ WebGL context restored on iOS Safari');
      // Could potentially reinitialize if needed
    };

    // Global error handler for iOS Safari
    const handleGlobalError = (event) => {
      const error = event.error || event.reason;
      if (
        error &&
        (error.message?.includes('WebGL') ||
          error.message?.includes('memory') ||
          error.message?.includes('texture') ||
          error.message?.includes('buffer'))
      ) {
        console.error('❌ iOS Safari WebGL error detected:', error);

        // Trigger cleanup on WebGL-related errors
        if (cleanupManager) {
          setTimeout(() => {
            cleanupManager.cleanup();
          }, 100);
        }
      }
    };

    // Memory pressure warning handler
    const handleMemoryWarning = () => {
      console.warn('⚠️ Memory pressure detected on iOS Safari');
      // TEMPORARILY DISABLED: Custom cleanup to rely on R3F's built-in memory management
      // if (cleanupManager) {
      //   cleanupManager.cleanup();
      // }
      // logMemoryUsage();
    };

    // Add event listeners
    window.addEventListener('webglcontextlost', handleWebGLContextLost);
    window.addEventListener('webglcontextrestored', handleWebGLContextRestored);
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleGlobalError);

    // iOS specific memory warning (if available)
    if ('onmemorywarning' in window) {
      window.addEventListener('memorywarning', handleMemoryWarning);
    }

    return () => {
      window.removeEventListener('webglcontextlost', handleWebGLContextLost);
      window.removeEventListener(
        'webglcontextrestored',
        handleWebGLContextRestored
      );
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleGlobalError);

      if ('onmemorywarning' in window) {
        window.removeEventListener('memorywarning', handleMemoryWarning);
      }
    };
  }, [isIOSSafariBrowser, cleanupManager]);
  */

  // TEMPORARILY DISABLED: iOS Safari specific contact page optimization
  /*
  useEffect(() => {
    if (isIOSSafariBrowser && state.showContactPage) {
      console.log(
        '📱 iOS Safari: Contact page opened, performing memory optimization'
      );

      // Slight delay to ensure Contact page animation starts
      const optimizationTimer = setTimeout(() => {
        // Reduce WebGL operations while Contact page is open
        if (cleanupManager) {
          cleanupManager.pauseAnimations();
        }

        // Force garbage collection if available
        if (window.gc) {
          window.gc();
        }

        // TEMPORARILY DISABLED: Log memory usage for debugging
        // logMemoryUsage();
      }, 1000);

      return () => clearTimeout(optimizationTimer);
    }
  }, [state.showContactPage]); // TEMPORARILY DISABLED: Removed isIOSSafariBrowser, cleanupManager dependencies
  */

  // TEMPORARILY DISABLED: Memory monitoring for iOS Safari to rely on R3F's built-in memory management
  /*
  useEffect(() => {
    if (!isIOSSafariBrowser || !state.initialLoadComplete) return;

    const memoryCheckInterval = setInterval(() => {
      logMemoryUsage();

      // Check if we need emergency cleanup
      if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        const usedMemoryPercent =
          (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

        if (usedMemoryPercent > 80) {
          console.warn(
            '⚠️ High memory usage detected:',
            usedMemoryPercent.toFixed(1) + '%'
          );
          if (cleanupManager) {
            cleanupManager.cleanup();
          }
        }
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(memoryCheckInterval);
  }, [isIOSSafariBrowser, state.initialLoadComplete, cleanupManager]);
  */

  // Enhanced state logging
  useEffect(() => {
    console.log('🔄 App state updated:', {
      showGallery: state.showGallery,
      showTypes: state.showTypes,
      showContactPage: state.showContactPage,
      activeGalleryType: state.activeGalleryType,
      activeGalleryTypeString: state.activeGalleryTypeString,
      fontsLoaded: state.fontsLoaded,
      splatLoaded: state.splatLoaded,
      imagesLoaded: state.imagesLoaded,
      initialLoadComplete: state.initialLoadComplete,
      isAnimating: state.isAnimating,
    });
  }, [
    state.showGallery,
    state.showTypes,
    state.showContactPage,
    state.activeGalleryType,
    state.fontsLoaded,
    state.splatLoaded,
    state.imagesLoaded,
    state.initialLoadComplete,
    state.isAnimating,
  ]);

  return (
    <>
      {/* Always render the main app - use opacity and pointer-events instead of display:none */}
      <div
        className="app-container"
        style={{
          opacity: shouldShowLoading ? 0 : 1,
          pointerEvents: shouldShowLoading ? 'none' : 'auto',
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        {window.innerWidth < 1000 || !state.isAnimating ? null : (
          <div className="new_app_header">
            <div className="new_app_info" />
          </div>
        )}

        {window.innerWidth < 1000 && state.isAnimating ? (
          <div className="new_app_small_header">
            <div />
          </div>
        ) : null}

        <Gallery
          galleryType={state.activeGalleryType}
          showGallery={state.showGallery}
          showGalleryString={state.activeGalleryTypeString}
          showDetails={state.showDetails}
          setShowDetails={(value) =>
            dispatch({ type: 'SET_SHOW_DETAILS', payload: value })
          }
          galleryTypeArr={state.galleryTypeArr}
          setGalleryTypeArr={(arr) =>
            dispatch({ type: 'SET_GALLERY_TYPE_ARR', payload: arr })
          }
          currentPhoto={state.currentPhoto}
          setCurrentPhoto={(photo) =>
            dispatch({ type: 'SET_CURRENT_PHOTO', payload: photo })
          }
          setShowInfographic={(value) =>
            dispatch({ type: 'SET_SHOW_INFOGraphic', payload: value })
          }
          showInfographic={state.showInfographic}
          onClose={handleHideGalleryCallback}
        />

        <Types
          showTypes={state.showTypes}
          onGalleryTypesClick={handleHideTypesCallback}
          onMissionButtonClick={handleMissionButtonClickCallback}
          onTypeSelect={handleGalleryButtonClickCallback}
          setActiveGalleryType={(type, typeString) =>
            dispatch({
              type: 'SET_GALLERY_TYPE',
              payload: { type, typeString },
            })
          }
          setActiveGalleryTypeString={(typeString, type) =>
            dispatch({
              type: 'SET_GALLERY_TYPE',
              payload: {
                type: typeof type === 'number' ? type : state.activeGalleryType,
                typeString,
              },
            })
          }
        />

        <div className="appContainer">
          <Contact
            showContactPage={state.showContactPage}
            setShowContactPage={(value) =>
              dispatch({ type: 'SET_SHOW_CONTACT', payload: value })
            }
            setIsAnimating={(value) =>
              dispatch({ type: 'SET_ANIMATING', payload: value })
            }
            showTypes={state.showTypes}
            showGallery={state.showGallery}
          />

          <div className="header">
            <div className="menu">
              {/* Animated icon size with React Spring */}
              <AnimatedMenuItem
                onClick={handleEmblemClickCallback}
                isLogo={true}
              >
                <div
                  style={{
                    width: '2.5em', // Increased to accommodate larger home icon (1.8em)
                    height: '2.5em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    paddingTop: '0.2em', // Minimal padding
                  }}
                >
                  <animated.img
                    src={found_wood}
                    className="icon"
                    alt="Found Wood Logo"
                    loading="lazy"
                    style={{
                      ...iconSpring,
                      objectFit: 'contain',
                    }}
                  />
                </div>
              </AnimatedMenuItem>
              <AnimatedMenuItem onClick={handleGalleryTypesClickCallback}>
                <div className="menu-item">Gallery</div>
              </AnimatedMenuItem>
              <AnimatedMenuItem onClick={handleContactPageClick}>
                <div className="menu-item">Contact</div>
              </AnimatedMenuItem>
            </div>
          </div>

          {/* Simplified Canvas rendering - no validation needed */}
          <div
            style={{
              pointerEvents:
                state.showContactPage || state.showTypes ? 'none' : 'auto',
              filter:
                state.showContactPage || state.showTypes
                  ? 'blur(8px)'
                  : 'none',
              WebkitFilter:
                state.showContactPage || state.showTypes
                  ? 'blur(8px)'
                  : 'none', // Webkit prefix for Safari and older browsers
              MozFilter:
                state.showContactPage || state.showTypes
                  ? 'blur(8px)'
                  : 'none', // Mozilla prefix
              msFilter:
                state.showContactPage || state.showTypes
                  ? 'blur(8px)'
                  : 'none', // IE prefix
              transition:
                'filter 0.2s ease-out, -webkit-filter 0.2s ease-out, -moz-filter 0.2s ease-out',
              willChange: state.showContactPage || state.showTypes ? 'filter' : 'auto',
              transform: 'translateZ(0)', // Force hardware acceleration
            }}
          >
            {/* Always mount Canvas with splat URL directly */}
            <NewCanvas
              isAnimating={state.isAnimating}
              showContactPage={state.showContactPage}
              showTypes={state.showTypes}
              showGallery={state.showGallery}
              onSplatLoaded={handleSplatLoadedCallback}
              imagesLoaded={state.imagesLoaded}
              initialLoadComplete={state.initialLoadComplete}
              validatedSplatUrl={splatUrl}
            />
          </div>
        </div>
      </div>

      {/* Show loading screen overlay when needed - seamless transition timing */}
      {shouldShowLoading && (
        <div
          className="font-loading-screen"
          style={{
            opacity: 1,
            transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
            willChange: isExiting ? 'opacity, transform' : 'auto',
            backfaceVisibility: 'hidden', // Prevent flicker
            animation: isExiting
              ? 'epicBackgroundExit 0.9s cubic-bezier(0.4, 0, 0.6, 1) 0.7s forwards'
              : 'none',
          }}
        >
          <AnimatedLoadingContainer shouldShow={shouldShowLoading}>
            {/* Fixed layout container to prevent jumping */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px', // Fixed height to prevent layout shifts
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto',
              }}
            >
              {/* Title section with fixed heights and optimized container */}
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '30px',
                  minHeight: '120px', // Fixed height for title section
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
                  willChange: 'auto', // Optimize for changes
                }}
              >
                <h2
                  style={{
                    margin: '0 0 10px 0',
                    fontSize: '1.6rem',
                    fontWeight: '600',
                    color: '#77481c',
                    fontFamily:
                      '"CustomFont", "Poppins", "Lobster Two", sans-serif',
                    // Smooth state transitions: entrance -> hold -> exit
                    opacity: isExiting ? undefined : entranceComplete ? 1 : 0,
                    transform: isExiting
                      ? undefined
                      : entranceComplete
                      ? 'translate3d(0, 0, 0) scale(1)'
                      : 'translate3d(0, 16px, 0) scale(0.98)',
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    transition:
                      entranceComplete && !isExiting ? 'none' : undefined,
                    animation: isExiting
                      ? 'epicFadeOutUp 0.7s cubic-bezier(0.4, 0, 0.6, 1) forwards'
                      : 'seamlessEntranceTitle 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s forwards',
                  }}
                >
                  Welcome to Doug's Found Wood
                </h2>
                <div
                  style={{
                    fontSize: '1.1rem',
                    color: '#8b5a2b',
                    fontFamily:
                      '"CustomFont", "Poppins", "Lobster Two", sans-serif',
                    marginBottom: '8px',
                    // Smooth state transitions: entrance -> hold -> exit
                    opacity: isExiting ? undefined : entranceComplete ? 1 : 0,
                    transform: isExiting
                      ? undefined
                      : entranceComplete
                      ? 'translate3d(0, 0, 0) scale(1)'
                      : 'translate3d(0, 14px, 0) scale(0.97)',
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    transition:
                      entranceComplete && !isExiting ? 'none' : undefined,
                    animation: isExiting
                      ? 'epicFadeOutLeft 0.7s cubic-bezier(0.4, 0, 0.6, 1) 0.1s forwards'
                      : 'seamlessEntranceSubtitle 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s forwards',
                  }}
                >
                  Preparing your handcrafted journey...
                </div>
                <div
                  style={{
                    fontSize: '0.9rem',
                    color: '#a67c52',
                    fontFamily:
                      '"CustomFont", "Poppins", "Lobster Two", sans-serif',
                    fontStyle: 'italic',
                    // Smooth state transitions: entrance -> hold -> exit
                    opacity: isExiting ? undefined : entranceComplete ? 1 : 0,
                    transform: isExiting
                      ? undefined
                      : entranceComplete
                      ? 'translate3d(0, 0, 0) scale(1)'
                      : 'translate3d(0, 12px, 0) scale(0.98)',
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    transition:
                      entranceComplete && !isExiting ? 'none' : undefined,
                    animation: isExiting
                      ? 'epicFadeOutRight 0.7s cubic-bezier(0.4, 0, 0.6, 1) 0.2s forwards'
                      : 'seamlessEntranceTagline 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.3s forwards',
                  }}
                >
                  Each piece tells a story
                </div>
              </div>

              {/* Spinner with fixed height - seamless transition */}
              <div
                style={{
                  minHeight: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '30px',
                  padding: '10px',
                  position: 'relative',
                  zIndex: 10,
                  // Smooth state transitions: entrance -> hold -> exit
                  opacity: isExiting ? undefined : entranceComplete ? 1 : 0,
                  transition:
                    entranceComplete && !isExiting ? 'none' : undefined,
                  animation: isExiting
                    ? 'epicSpinnerExit 0.8s cubic-bezier(0.4, 0, 0.6, 1) 0.3s forwards'
                    : 'seamlessEntranceSpinner 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s forwards',
                }}
              >
                <AnimatedLoadingSpinner />
              </div>

              {/* Loading status with fixed height */}
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '25px',
                  minHeight: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '0.95rem',
                    color: '#9d7856',
                    fontFamily:
                      '"CustomFont", "Poppins", "Lobster Two", sans-serif',
                    fontWeight: '500',
                    // Smooth state transitions: entrance -> hold -> exit
                    opacity: isExiting ? undefined : entranceComplete ? 1 : 0,
                    transition:
                      entranceComplete && !isExiting ? 'none' : undefined,
                    animation: isExiting
                      ? 'epicFadeOutDown 0.7s cubic-bezier(0.4, 0, 0.6, 1) 0.4s forwards'
                      : 'seamlessEntranceStatus 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.5s forwards',
                  }}
                >
                  🪵 Crafting your experience... 🪵
                </div>
              </div>

              {/* Quote section with fixed height - seamless transition */}
              <div
                style={{
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  // Smooth state transitions: entrance -> hold -> exit
                  opacity: isExiting ? undefined : entranceComplete ? 1 : 0,
                  transition:
                    entranceComplete && !isExiting ? 'none' : undefined,
                  animation: isExiting
                    ? 'epicFadeOutScale 0.8s cubic-bezier(0.4, 0, 0.6, 1) 0.5s forwards'
                    : 'seamlessEntranceQuote 1.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.8s forwards',
                }}
              >
                <div
                  style={{
                    fontStyle: 'italic',
                    fontSize: '1.2rem',
                    color: '#8b5a2b',
                    maxWidth: '380px',
                    textAlign: 'center',
                    lineHeight: '1.5',
                    fontWeight: '500',
                    margin: '0 auto',
                    padding: '0 20px',
                    fontFamily:
                      '"CustomFont", "Poppins", "Lobster Two", sans-serif',
                    letterSpacing: '0.3px',
                    minHeight: '2.4rem',
                  }}
                >
                  {loadingSaying}
                </div>
              </div>
            </div>
          </AnimatedLoadingContainer>
        </div>
      )}
    </>
  );
}

export default App;
