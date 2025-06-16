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
        marginBottom: '30px',
        opacity: 0,
        animation: 'fadeInUp 0.8s ease-out 0.8s forwards', // Restore CSS animation with delay
        position: 'relative',
        width: '80px', // Explicit container size to prevent cropping
        height: '80px', // Adequate space for 60px spinner + borders + rotation clearance
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="loading-spinner"
        aria-label="Loading spinner"
        style={{
          // Use pure CSS for the spinner animation - no React Spring transform conflicts
          animation: 'spin-smooth 1.2s ease-in-out infinite',
          WebkitAnimation: 'spin-smooth 1.2s ease-in-out infinite',
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
      transform: 'translateY(30px) scale(0.8)',
      filter: 'blur(8px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0px) scale(1)',
      filter: 'blur(0px)',
    },
    config: { mass: 1, tension: 120, friction: 14 },
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
      transform: 'translateY(20px) rotateX(90deg)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0px) rotateX(0deg)',
    },
    config: { mass: 1, tension: 180, friction: 20 },
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
        perspective: '1000px',
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
      transform: 'translateX(-50px) rotateY(45deg)',
    },
    to: {
      opacity: 1,
      transform: 'translateX(0px) rotateY(0deg)',
    },
    config: { mass: 1, tension: 160, friction: 18 },
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
        perspective: '1000px',
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
      transform: 'scale(0.3) rotate(-10deg)',
    },
    to: {
      opacity: 1,
      transform: 'scale(1) rotate(0deg)',
    },
    config: { mass: 1.2, tension: 200, friction: 25 },
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
    }, 2800); // 2.0s delay + 0.8s animation duration
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
        minHeight: '2.4rem', // Keep this to prevent layout shift when text changes
        // Use runtime opacity after initial animation, otherwise use CSS animation
        opacity: hasInitialAnimationCompleted ? opacity : 0,
        animation: hasInitialAnimationCompleted
          ? 'none'
          : 'fadeInUp 0.8s ease-out 2.0s forwards',
        transition: hasInitialAnimationCompleted
          ? 'opacity 0.3s ease-in-out'
          : 'none',
      }}
    >
      {children}
    </div>
  );
});

// Collection of warm, welcoming messages for the loading screen
const loadingSayings = [
  'Like trees, the finest furniture grows with time',
  'Crafting something beautiful takes time',
  "Nature doesn't hurry, yet everything is accomplished",
  'The best wood comes from the oldest trees',
  'In every branch lies a future masterpiece',
  'Every masterpiece begins with a single cut',
  'Wood remembers the seasons in its rings',
  'From forest floor to fine furniture',
  'The forest teaches us to grow slowly and strong',
  'Handcrafted with love and time',
  'Each piece of wood tells its own story',
  'True craftsmanship cannot be rushed',
  'From fallen trees, beautiful furniture rises',
  "The grain reveals nature's hidden patterns",
  'Welcome to a world where wood comes alive',
  'Discovering beauty in every knot and grain',
  'Where sustainability meets artistry',
  "Creating tomorrow from yesterday's trees",
  'Every piece has found its purpose',
];

// Special sayings for when retries are happening
const retrySayings = [
  'Sometimes the best pieces need a little extra care',
  'Patience creates the finest craftsmanship',
  'Good things come to those who wait',
  'Every craftsman knows: the second attempt often succeeds',
  'Like sanding wood smooth, some things take multiple passes',
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

  // State for rotating inspirational sayings during loading
  // Start with a random saying each time the page loads
  const [currentSayingIndex, setCurrentSayingIndex] = useState(() =>
    Math.floor(Math.random() * loadingSayings.length)
  );
  const [sayingOpacity, setSayingOpacity] = useState(1);

  // **EXIT ANIMATION STATE**: Track when the loading screen should exit
  const [isExiting, setIsExiting] = useState(false);

  // **ABSOLUTE 4-SECOND TIMEOUT**: Enhanced for better animation timing
  // This CANNOT be interrupted and WILL fire after exactly 4 seconds
  const loadingTimeoutRef = useRef(null);

  // Start the absolute timeout immediately on component mount
  useEffect(() => {
    console.log(
      '🚨 ABSOLUTE 4-SECOND TIMEOUT STARTING NOW - Component just mounted!'
    );

    loadingTimeoutRef.current = setTimeout(() => {
      console.log(
        '🎬 ABSOLUTE 4-SECOND TIMEOUT FIRED - STARTING EPIC EXIT ANIMATIONS!'
      );

      // First trigger exit animations
      setIsExiting(true);

      // Then complete loading after EPIC exit animation duration
      setTimeout(() => {
        console.log(
          '🎬 EPIC EXIT ANIMATIONS COMPLETE - DISMISSING LOADING SCREEN!'
        );
        dispatch({ type: 'SET_INITIAL_LOAD_COMPLETE' });
      }, 2100); // 2100ms for epic exit animations (0.9s delay + 1.2s duration)
    }, 4000); // 4 seconds ABSOLUTE - enhanced timing for EPIC experience

    // Cleanup on unmount only
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array - run ONCE on mount only

  // Simplified sayings - no retry logic needed
  const activeSayings = loadingSayings;
  const activeSayingIndex = currentSayingIndex;
  const setActiveSayingIndex = setCurrentSayingIndex;

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

  // Rotate inspirational sayings during loading
  useEffect(() => {
    if (!shouldShowLoading) return; // Only rotate during loading

    const interval = setInterval(() => {
      // Fade out current saying
      setSayingOpacity(0);

      // After fade out, change saying and fade in
      setTimeout(() => {
        setActiveSayingIndex(
          (prevIndex) => (prevIndex + 1) % activeSayings.length
        );
        setSayingOpacity(1);
      }, 300); // Half second for fade transition
    }, 4000); // Slightly longer interval to enjoy each saying

    return () => clearInterval(interval);
  }, [shouldShowLoading, activeSayings.length, setActiveSayingIndex]);

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
              opacity: state.showContactPage ? 0.3 : 1, // Keep scene visible but dimmed
              pointerEvents: state.showContactPage ? 'none' : 'auto',
              transition: 'opacity 0.3s ease-in-out',
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

      {/* Show loading screen overlay when needed - enhanced animations */}
      {shouldShowLoading && (
        <div
          className="font-loading-screen"
          style={{
            opacity: 1,
            animation: isExiting
              ? 'epicBackgroundExit 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.9s forwards'
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
              {/* Title section with fixed heights */}
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '30px',
                  minHeight: '120px', // Fixed height for title section
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
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
                    opacity: isExiting ? 1 : 0, // Maintain opacity during transition
                    animation: isExiting
                      ? 'epicFadeOutUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards'
                      : 'fadeInUp 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards',
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
                    opacity: isExiting ? 1 : 0, // Maintain opacity during transition
                    animation: isExiting
                      ? 'epicFadeOutLeft 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.15s forwards'
                      : 'fadeInUp 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s forwards',
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
                    opacity: isExiting ? 1 : 0, // Maintain opacity during transition
                    animation: isExiting
                      ? 'epicFadeOutRight 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s forwards'
                      : 'fadeInUp 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.9s forwards',
                  }}
                >
                  Each piece tells a story
                </div>
              </div>

              {/* Spinner with fixed height - enhanced animation */}
              <div
                style={{
                  minHeight: '100px', // Increased from 80px to provide more clearance
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '30px',
                  padding: '10px', // Add padding for extra safety margin
                  position: 'relative',
                  zIndex: 10, // Ensure spinner stays on top
                  opacity: isExiting ? 1 : 0, // Maintain opacity during transition
                  animation: isExiting
                    ? 'epicSpinnerExit 1.0s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.45s forwards'
                    : 'spinnerFadeIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s forwards',
                }}
              >
                <AnimatedLoadingSpinner />
              </div>

              {/* Loading status with fixed height */}
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '25px',
                  minHeight: '30px', // Fixed height for status
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
                    opacity: isExiting ? 1 : 0, // Maintain opacity during transition
                    animation: isExiting
                      ? 'epicFadeOutDown 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s forwards'
                      : 'fadeInUp 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.8s forwards',
                  }}
                >
                  🪵 Crafting your experience... 🪵
                </div>
              </div>

              {/* Quote section with fixed height - enhanced animation */}
              <div
                style={{
                  minHeight: '80px', // Fixed height for quotes to prevent jumping
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  opacity: isExiting ? 1 : 0, // Maintain opacity during transition
                  animation: isExiting
                    ? 'epicFadeOutScale 1.0s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.75s forwards'
                    : 'fadeInUp 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.4s forwards',
                }}
              >
                <AnimatedLoadingSaying opacity={sayingOpacity} delay={0}>
                  {activeSayings[activeSayingIndex]}
                </AnimatedLoadingSaying>
              </div>
            </div>
          </AnimatedLoadingContainer>
        </div>
      )}
    </>
  );
}

export default App;
