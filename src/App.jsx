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
import GalleryTypeSelector from '../components/select_gallery/GalleryTypeSelector';
import NewCanvas from '../components/experience/Experience';
import LoadingScreen from '../components/loading/LoadingScreen';
import GalleryLoadingScreen from '../components/loading/GalleryLoadingScreen';
import FontFaceObserver from 'fontfaceobserver';
import {
  useSpring,
  animated,
  useSpringValue,
  useChain,
  useSpringRef,
} from '@react-spring/web';

// PERFORMANCE OPTIMIZATION: Large splat files (39MB+) are served from public directory
// instead of being bundled. This provides:
// - Faster builds (Vite doesn't process large files)
// - Smaller JS bundles (no embedded 39MB assets)
// - Better loading (browser can stream large files efficiently)
// - CDN-ready (static assets can be served from CDN)

// NOTE: The actual splat URL is defined in the App component (line ~564)
// This allows for dynamic URL assignment (e.g., switching to Vercel Blob URLs)

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

// Memoized AnimatedMenuItem component with iPad touch event fix
const AnimatedMenuItem = memo(
  ({ children, onClick, isLogo = false, disabled = false }) => {
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);
    const [touchStarted, setTouchStarted] = useState(false);

    const springProps = useSpring({
      scale: (hovered || pressed) && !disabled ? 1.1 : 1,
      brightness: (hovered || pressed) && !disabled ? 1.05 : 1,
      config: configAnimation,
    });

    // Detect if this is a touch device
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isIpadDetected =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // iPad-optimized event handlers
    const handleTouchStart = useCallback(
      (e) => {
        if (!isTouchDevice || disabled) return;
        setTouchStarted(true);
        setPressed(true);
        // Don't preventDefault on passive listeners - let the gesture library handle it
      },
      [isTouchDevice, disabled]
    );

    const handleTouchEnd = useCallback(
      (e) => {
        if (!isTouchDevice || !touchStarted || disabled) return;

        setPressed(false);
        setTouchStarted(false);

        // Call onClick directly for touch devices to ensure it fires
        if (onClick) {
          // Don't preventDefault on passive listeners
          e.stopPropagation();
          onClick(e);
        }
      },
      [isTouchDevice, touchStarted, onClick, disabled]
    );

    const handleClick = useCallback(
      (e) => {
        if (disabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        // Only handle click if this wasn't a touch interaction
        if (touchStarted || isTouchDevice) {
          e.preventDefault();
          return;
        }
        if (onClick) {
          onClick(e);
        }
      },
      [touchStarted, isTouchDevice, onClick, disabled]
    );

    const handleMouseDown = useCallback(
      (e) => {
        if (isTouchDevice || touchStarted || disabled) return;
        setPressed(true);
      },
      [isTouchDevice, touchStarted, disabled]
    );

    const handleMouseUp = useCallback(
      (e) => {
        if (isTouchDevice || touchStarted || disabled) return;
        setPressed(false);
      },
      [isTouchDevice, touchStarted, disabled]
    );

    const handleMouseEnter = useCallback(
      (e) => {
        if (isTouchDevice || touchStarted || disabled) return;
        setHovered(true);
      },
      [isTouchDevice, touchStarted, disabled]
    );

    const handleMouseLeave = useCallback(
      (e) => {
        if (isTouchDevice || touchStarted || disabled) return;
        setHovered(false);
        setPressed(false);
      },
      [isTouchDevice, touchStarted, disabled]
    );

    return (
      <animated.div
        onClick={
          disabled
            ? (e) => {
                e.preventDefault();
                e.stopPropagation();
              }
            : handleClick
        }
        onMouseEnter={disabled ? undefined : handleMouseEnter}
        onMouseLeave={disabled ? undefined : handleMouseLeave}
        onMouseDown={disabled ? undefined : handleMouseDown}
        onMouseUp={disabled ? undefined : handleMouseUp}
        onTouchStart={disabled ? undefined : handleTouchStart}
        onTouchEnd={disabled ? undefined : handleTouchEnd}
        style={{
          transform: springProps.scale.to((s) => `scale(${s})`),
          filter: springProps.brightness.to((b) => `brightness(${b})`),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: isLogo ? 'auto' : '100%',
          // Enhanced touch handling for iPad
          touchAction: disabled ? 'none' : 'manipulation',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          // Ensure proper pointer events - disabled when contact is active
          pointerEvents: disabled ? 'none' : 'auto',
          cursor: disabled ? 'default' : 'pointer',
          // Prevent stacking context isolation - critical for z-index hierarchy
          position: 'relative',
          zIndex: 'inherit',
          isolation: 'auto',
        }}
      >
        {children}
      </animated.div>
    );
  }
);

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
  showGalleryLoading: false, // NEW: Track gallery loading screen
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
        showGalleryLoading: false, // Hide gallery loading when showing actual gallery
        showDetails: false,
      };
    case 'SHOW_GALLERY_LOADING':
      return {
        ...state,
        showGalleryLoading: true,
        showTypes: false,
        showGallery: false,
        showDetails: false,
      };
    case 'HIDE_GALLERY_LOADING':
      return {
        ...state,
        showGalleryLoading: false,
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
        showGalleryLoading: false, // Hide gallery loading screen when resetting
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

// Utility function to detect iPad Pro portrait mode and return appropriate styles
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // **SIMPLIFIED**: No internal timeout - let LoadingScreen component control timing
  // The LoadingScreen will call onComplete when it's ready to be dismissed

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
    dispatch({ type: 'SHOW_GALLERY_LOADING' });
  }, []);

  const handleGalleryLoadingCompleteCallback = useCallback(() => {
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

  // Home screen logic: not showing gallery, contact, types, or gallery loading
  const isHomeScreen =
    !state.showGallery &&
    !state.showContactPage &&
    !state.showTypes &&
    !state.showGalleryLoading;

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

  // Simple loading state - show LoadingScreen component until complete
  const shouldShowLoading = !state.initialLoadComplete;

  // Callback to handle loading completion
  const handleLoadingComplete = useCallback(() => {
    dispatch({ type: 'SET_INITIAL_LOAD_COMPLETE' });
  }, [dispatch]);

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

  // Prevent body scrolling when gallery is open (mobile fix)
  useEffect(() => {
    if (state.showGallery) {
      // Prevent body from scrolling when gallery is open
      document.body.style.overflow = 'hidden';
      // Allow pan gestures for internal scrolling
      document.body.style.touchAction = 'pan-y';
    } else {
      // Restore normal scrolling when gallery is closed
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    // Cleanup function to restore scrolling on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [state.showGallery]);

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

        {state.showGallery && (
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
        )}

        {state.showTypes && (
          <GalleryTypeSelector
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
                  type:
                    typeof type === 'number' ? type : state.activeGalleryType,
                  typeString,
                },
              })
            }
          />
        )}

        {/* CRITICAL FIX: Move header outside appContainer to prevent stacking context issues */}
        <div
          className={`header ${state.showContactPage ? 'header-disabled' : ''}`}
          style={{
            filter: state.showContactPage ? 'blur(8px)' : 'none',
            WebkitFilter: state.showContactPage ? 'blur(8px)' : 'none',
            MozFilter: state.showContactPage ? 'blur(8px)' : 'none',
            transition:
              'filter 0.3s ease-out, -webkit-filter 0.3s ease-out, -moz-filter 0.3s ease-out',
            pointerEvents: state.showContactPage ? 'none' : 'auto',
          }}
        >
          <div className="menu">
            {/* Animated icon size with React Spring */}
            <AnimatedMenuItem
              onClick={handleEmblemClickCallback}
              isLogo={true}
              disabled={state.showContactPage}
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
            <AnimatedMenuItem
              onClick={handleGalleryTypesClickCallback}
              disabled={state.showContactPage}
            >
              <div className="menu-item">Gallery</div>
            </AnimatedMenuItem>
            <AnimatedMenuItem
              onClick={handleContactPageClick}
              disabled={state.showContactPage}
            >
              <div className="menu-item">Contact</div>
            </AnimatedMenuItem>
          </div>
        </div>

        <div className="appContainer">
          {state.showContactPage && (
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
          )}

          {/* Simplified Canvas rendering - no validation needed */}
          <div
            style={(() => {
              const baseStyles = {
                pointerEvents:
                  state.showContactPage ||
                  state.showTypes ||
                  state.showGalleryLoading
                    ? 'none'
                    : 'auto',
                filter:
                  state.showContactPage ||
                  state.showTypes ||
                  state.showGalleryLoading
                    ? 'blur(20px)'
                    : 'none',
                WebkitFilter:
                  state.showContactPage ||
                  state.showTypes ||
                  state.showGalleryLoading
                    ? 'blur(20px)'
                    : 'none',
                MozFilter:
                  state.showContactPage ||
                  state.showTypes ||
                  state.showGalleryLoading
                    ? 'blur(20px)'
                    : 'none',
                transition:
                  'filter 0.2s ease-out, -webkit-filter 0.2s ease-out, -moz-filter 0.2s ease-out',
                willChange:
                  state.showContactPage ||
                  state.showTypes ||
                  state.showGalleryLoading
                    ? 'filter'
                    : 'auto',
                transform: 'translateZ(0)',
              };

              return baseStyles;
            })()}
          >
            {/* Always mount Canvas with splat URL directly */}
            <NewCanvas
              isAnimating={state.isAnimating}
              showContactPage={state.showContactPage}
              showTypes={state.showTypes}
              showGallery={state.showGallery}
              showGalleryLoading={state.showGalleryLoading}
              onSplatLoaded={handleSplatLoadedCallback}
              imagesLoaded={state.imagesLoaded}
              initialLoadComplete={state.initialLoadComplete}
            />
          </div>
        </div>
      </div>

      {/* Loading Screen Component */}
      {shouldShowLoading && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      {/* Gallery Loading Screen Component */}
      {state.showGalleryLoading && (
        <GalleryLoadingScreen
          galleryType={state.activeGalleryTypeString}
          onComplete={handleGalleryLoadingCompleteCallback}
        />
      )}
    </>
  );
}

export default App;
