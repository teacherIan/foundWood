import './App.css';
import { useState, useCallback, useEffect, useReducer, memo } from 'react';
import found_wood from './assets/found_wood_final_all.png';
import Contact from '../components/contact/Contact';
import Gallery from '../components/galleries/Gallery';
import Types from '../components/select_gallery/Types';
import NewCanvas from '../components/new_experience/Experience';
import FontFaceObserver from 'fontfaceobserver';
import { useSpring, animated } from '@react-spring/web';

const configAnimation = {
  mass: 2,
  tension: 400,
  friction: 20,
  precision: 0.0005,
};

// Memoized AnimatedMenuItem component
const AnimatedMenuItem = memo(({ children, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const springProps = useSpring({
    scale: hovered ? 1.1 : 1,
    config: configAnimation,
  });

  return (
    <animated.div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: springProps.scale.to((s) => `scale(${s})`),
      }}
    >
      {children}
    </animated.div>
  );
});

// State reducer for better state management
const initialState = {
  fontsLoaded: false,
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
  switch (action.type) {
    case 'SET_FONTS_LOADED':
      return { ...state, fontsLoaded: true };
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
        isAnimating: state.showTypes,
      };
    case 'TOGGLE_GALLERY':
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

  // Font loading detection with improved error handling
  useEffect(() => {
    const fonts = [
      new FontFaceObserver('driftWood'),
      new FontFaceObserver('CustomFont'),
      new FontFaceObserver('Poppins'),
      new FontFaceObserver('Lobster Two'),
    ];

    Promise.all(fonts.map(font => font.load()))
      .then(() => {
        dispatch({ type: 'SET_FONTS_LOADED' });
      })
      .catch((error) => {
        console.error('Font loading error:', error);
        dispatch({ type: 'SET_FONTS_LOADED' }); // Proceed anyway
      });
  }, []);

  const handleGalleryTypesClickCallback = useCallback(() => {
    dispatch({ type: 'TOGGLE_TYPES' });
  }, []);

  const handleMissionButtonClickCallback = useCallback(() => {
    dispatch({ type: 'TOGGLE_ANIMATION' });
    dispatch({ type: 'RESET_VIEW' });
  }, []);

  const handleGalleryButtonClickCallback = useCallback(() => {
    dispatch({ type: 'TOGGLE_GALLERY' });
  }, []);

  const handleEmblemClickCallback = useCallback(() => {
    dispatch({ type: 'RESET_VIEW' });
  }, []);

  const handleContactPageClick = useCallback(() => {
    dispatch({ type: 'TOGGLE_CONTACT' });
  }, []);

  // If fonts haven't loaded yet, show loading indicator
  if (!state.fontsLoaded) {
    return (
      <div className="font-loading-screen">
        <div className="loading-spinner"></div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
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
        setShowDetails={(value) => dispatch({ type: 'SET_SHOW_DETAILS', payload: value })}
        galleryTypeArr={state.galleryTypeArr}
        setGalleryTypeArr={(arr) => dispatch({ type: 'SET_GALLERY_TYPE_ARR', payload: arr })}
        currentPhoto={state.currentPhoto}
        setCurrentPhoto={(photo) => dispatch({ type: 'SET_CURRENT_PHOTO', payload: photo })}
        setShowInfographic={(value) => dispatch({ type: 'SET_SHOW_INFOGraphic', payload: value })}
        showInfographic={state.showInfographic}
      />

      <Types
        showTypes={state.showTypes}
        onGalleryTypesClick={handleGalleryTypesClickCallback}
        onMissionButtonClick={handleMissionButtonClickCallback}
        onTypeSelect={handleGalleryButtonClickCallback}
        setActiveGalleryType={(type) => dispatch({ type: 'SET_GALLERY_TYPE', payload: { type, typeString: state.activeGalleryTypeString } })}
        setActiveGalleryTypeString={(typeString) => dispatch({ type: 'SET_GALLERY_TYPE', payload: { type: state.activeGalleryType, typeString } })}
      />

      <div className="appContainer">
        <Contact
          showContactPage={state.showContactPage}
          setShowContactPage={(value) => dispatch({ type: 'SET_SHOW_CONTACT', payload: value })}
          setIsAnimating={(value) => dispatch({ type: 'SET_ANIMATING', payload: value })}
          showTypes={state.showTypes}
          showGallery={state.showGallery}
        />

        <div className="header">
          <div className="menu">
            <AnimatedMenuItem onClick={handleEmblemClickCallback}>
              <img
                src={found_wood}
                className="icon"
                alt="Found Wood Logo"
                loading="lazy"
              />
            </AnimatedMenuItem>
            <AnimatedMenuItem onClick={handleGalleryTypesClickCallback}>
              <div className="menu-item">Gallery</div>
            </AnimatedMenuItem>
            <AnimatedMenuItem onClick={handleContactPageClick}>
              <div className="menu-item">Contact</div>
            </AnimatedMenuItem>
          </div>
        </div>

        <NewCanvas
          isAnimating={state.isAnimating}
          showContactPage={state.showContactPage}
        />
      </div>
    </>
  );
}

export default App;
