import './App.css';
import { useState, useCallback, useEffect, useReducer, memo } from 'react';
import found_wood from './assets/found_wood_final_all.png';
import Contact from '../components/contact/Contact';
import Gallery from '../components/galleries/Gallery';
import Types from '../components/select_gallery/Types';
import NewCanvas from '../components/new_experience/Experience';
import FontFaceObserver from 'fontfaceobserver';
import { useSpring, animated } from '@react-spring/web';
import { useImagePreloader } from '../components/galleries/useImagePreloader';

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

// State reducer for better state management
const initialState = {
  fontsLoaded: false,
  splatLoaded: false,
  imagesLoaded: false, // Track if initial image preloading is complete
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

  // Initialize image preloader to start loading images at startup
  const {
    preloadingState,
    isImageLoaded,
    isGalleryTypeLoaded,
    preloadGalleryType,
    preloadAllGalleryTypes,
    cancelPreloading,
    isPreloading,
  } = useImagePreloader(state.activeGalleryTypeString, state.showGallery, true); // Enable startup preloading

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

  // Mark initial load as complete when all assets are loaded
  // Loading order: Fonts → Images → Splat (triggered after images) → Initial Load Complete
  useEffect(() => {
    if (
      !state.initialLoadComplete &&
      state.fontsLoaded &&
      state.splatLoaded &&
      state.imagesLoaded
    ) {
      console.log(
        '🎉 All initial assets loaded! Marking initial load as complete.'
      );
      console.log(
        '📋 Final loading order achieved: Fonts ✅ → Images ✅ → Splat ✅ → Complete ✅'
      );
      dispatch({ type: 'SET_INITIAL_LOAD_COMPLETE' });
    }
  }, [
    state.fontsLoaded,
    state.splatLoaded,
    state.imagesLoaded,
    state.initialLoadComplete,
  ]);

  // Immediate state logging on component mount
  console.log('🚀 App component mounted with initial state:', {
    fontsLoaded: state.fontsLoaded,
    splatLoaded: state.splatLoaded,
    shouldShowLoading: !state.fontsLoaded || !state.splatLoaded,
  });

  // Font loading detection with improved error handling
  useEffect(() => {
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

  // Font loading detection with improved error handling
  useEffect(() => {
    const fonts = [
      new FontFaceObserver('driftWood'),
      new FontFaceObserver('CustomFont'),
      new FontFaceObserver('Poppins'),
      new FontFaceObserver('Lobster Two'),
    ];

    Promise.all(fonts.map((font) => font.load()))
      .then(() => {
        console.log('✅ All fonts loaded successfully');
        console.log('🎨 STEP 1 COMPLETE: Fonts loaded');
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
    console.log('🎬 STEP 3 COMPLETE: Splat (3D scene) loaded after images');
    console.log('Current state before splat loaded:', {
      fontsLoaded: state.fontsLoaded,
      splatLoaded: state.splatLoaded,
    });
    dispatch({ type: 'SET_SPLAT_LOADED' });
  }, []); // Remove dependencies to prevent recreation

  const handleGalleryTypesClickCallback = useCallback(() => {
    dispatch({ type: 'SHOW_TYPES' });
  }, []);

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
    dispatch({ type: 'RESET_VIEW' });
  }, []);

  const handleContactPageClick = useCallback(() => {
    dispatch({ type: 'TOGGLE_CONTACT' });
  }, []);

  const handleHideGalleryCallback = useCallback(() => {
    dispatch({ type: 'RESET_VIEW' });
  }, []);

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

  const iconSpring = useSpring({
    width: isHomeScreen ? '1.8em' : '1.2em',
    height: isHomeScreen ? '1.8em' : '1.2em',
    config: {
      tension: 300,
      friction: 20,
      clamp: false, // Prevents animation from stopping abruptly
      velocity: 0.01, // Ensures smooth animation in both directions
    },
    immediate: false,
  });

  // Loading screen should ONLY appear during initial website startup
  // After initial load is complete, never show loading screen again
  const shouldShowLoading = !state.initialLoadComplete;

  console.log('🔍 Loading check:', {
    fontsLoaded: state.fontsLoaded,
    splatLoaded: state.splatLoaded,
    imagesLoaded: state.imagesLoaded,
    initialLoadComplete: state.initialLoadComplete,
    showGallery: state.showGallery,
    isPreloading: isPreloading,
    progressTotal: preloadingState.progress.total,
    progressLoaded: preloadingState.progress.loaded,
    progressComplete:
      preloadingState.progress.loaded >= preloadingState.progress.total,
    shouldShowLoading: shouldShowLoading,
  });
  console.log('🎯 Final loading decision:', shouldShowLoading);

  return (
    <>
      {/* Always render the main app - use opacity and pointer-events instead of display:none */}
      <div
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

          {/* Always render Experience - Canvas should remain stable */}
          <NewCanvas
            isAnimating={state.isAnimating}
            showContactPage={state.showContactPage}
            showTypes={state.showTypes}
            showGallery={state.showGallery}
            onSplatLoaded={handleSplatLoadedCallback}
            imagesLoaded={state.imagesLoaded}
          />
        </div>
      </div>

      {/* Show loading screen overlay when needed */}
      {shouldShowLoading && (
        <div className="font-loading-screen">
          <div className="loading-spinner" aria-label="Loading spinner"></div>
          <div role="status" aria-live="polite">
            Loading{!state.fontsLoaded ? ' fonts' : ''}
            {!state.imagesLoaded && state.fontsLoaded ? ' images' : ''}
            {!state.splatLoaded && state.imagesLoaded ? ' 3D scene' : ''}...
            {!state.imagesLoaded && preloadingState.progress.total > 0 && (
              <>
                <br />
                <span>
                  {preloadingState.progress.loaded} of{' '}
                  {preloadingState.progress.total} images (
                  {Math.round(preloadingState.progress.percentage)}%)
                </span>
              </>
            )}
            <br />
            <small>
              Step 1 - Fonts: {state.fontsLoaded ? '✅' : '❌'} | Step 2 -
              Images:{' '}
              {state.imagesLoaded
                ? '✅'
                : !state.imagesLoaded && preloadingState.progress.total > 0
                ? `${Math.round(preloadingState.progress.percentage)}%`
                : '❌'}{' '}
              | Step 3 - 3D Scene: {state.splatLoaded ? '✅' : '❌'}
            </small>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
