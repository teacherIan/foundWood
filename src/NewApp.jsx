import './App.css';
import { useState, useCallback, useEffect } from 'react';
import found_wood from './assets/found_wood_final_all.png';
import Contact from '../components/contact/Contact';
import GallerySpring from '../components/galleries/GallerySpring';
import Types from '../components/select_gallery/Types';
import NewCanvas from '../components/new_experience/Experience';
import FontFaceObserver from 'fontfaceobserver';

function NewApp() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [activeGalleryTypeString, setActiveGalleryTypeString] =
    useState('chairs');
  const [activeGalleryType, setActiveGalleryType] = useState(1);
  const [showTypes, setShowTypes] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showContactPage, setShowContactPage] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [galleryTypeArr, setGalleryTypeArr] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [showInfographic, setShowInfographic] = useState(false);

  // Font loading detection
  useEffect(() => {
    const driftWood = new FontFaceObserver('driftWood');
    const CustomFont = new FontFaceObserver('CustomFont');
    const Poppins = new FontFaceObserver('Poppins');
    const LobsterTwo = new FontFaceObserver('Lobster Two');

    Promise.all([
      driftWood.load(),
      CustomFont.load(),
      Poppins.load(),
      LobsterTwo.load(),
    ])
      .then(() => {
        setFontsLoaded(true);
      })
      .catch(() => {
        console.error('One or more fonts failed to load.');
        setFontsLoaded(true); // Proceed anyway
      });
  }, []);

  const handleGalleryTypesClickCallback = useCallback(() => {
    setTimeout(() => {
      setShowTypes(!showTypes);
    }, 100);

    if (!showGallery) {
      setIsAnimating(!isAnimating);
    }

    setShowGallery(false);
    setTimeout(() => {
      setShowDetails(false);
    }, 1000);
    setShowInfographic(false);
  }, [setShowTypes, setShowGallery, showTypes, setIsAnimating, showGallery]);

  const handleMissionButtonClickCallback = useCallback(() => {
    setIsAnimating(!isAnimating);
    setShowTypes(false);
    setShowGallery(false);
    setTimeout(() => {
      setShowDetails(false);
    }, 1000);
  }, [setShowTypes, setShowGallery, setIsAnimating]);

  const handleGalleryButtonClickCallback = useCallback(() => {
    setShowTypes(false);
    setShowGallery(true);
    setTimeout(() => {
      setShowDetails(false);
    }, 1000);
  }, [setShowTypes, setShowGallery, showGallery]);

  const handleEmblemClickCallback = useCallback(() => {
    setIsAnimating(true);
    setShowTypes(false);
    setShowGallery(false);
    setTimeout(() => {
      setShowDetails(false);
    }, 1000);
    setShowInfographic(false);
  }, [
    setIsAnimating,
    setShowTypes,
    setShowGallery,
    showGallery,
    showInfographic,
    setShowInfographic,
  ]);

  function handleContactPageClick() {
    setShowContactPage(!showContactPage);
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
    setShowInfographic(false);
  }

  function handleButtonHover(e) {
    // console.log(e.target.style.border-bottom);
  }

  // If fonts haven't loaded yet, show loading indicator
  if (!fontsLoaded) {
    return (
      <div className="font-loading-screen">
        <div className="loading-spinner"></div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      {window.innerWidth < 1000 || !isAnimating ? null : (
        <>
          <div
            style={
              {
                // fontFamily: 'driftWood',
                // filter: 'drop-shadow(1px 1px 0px #ffffff)',
              }
            }
            className="new_app_header"
          >
            Doug's Found Wood
            <div className="new_app_info">
              {/* Always Uniques */}
              Handcrafted in Maine
            </div>
          </div>
        </>
      )}

      {window.innerWidth < 1000 && isAnimating ? (
        <div className="new_app_small_header">
          <div
            style={
              {
                // fontSize: 'clamp(25px, calc(2svw + 2svh + 13px), 36px)',
              }
            }
          >
            Doug's Found Wood <br />
          </div>
          {/* Always Unique */}
          {/* <br /> */}
          Handcrafted In Maine
        </div>
      ) : null}

      <GallerySpring
        galleryType={activeGalleryType}
        showGallery={showGallery}
        showGalleryString={activeGalleryTypeString}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        galleryTypeArr={galleryTypeArr}
        setGalleryTypeArr={setGalleryTypeArr}
        currentPhoto={currentPhoto}
        setCurrentPhoto={setCurrentPhoto}
        setShowInfographic={setShowInfographic}
        showInfographic={showInfographic}
      />
      <Types
        showTypes={showTypes}
        onGalleryTypesClick={handleGalleryTypesClickCallback}
        onMissionButtonClick={handleMissionButtonClickCallback}
        onTypeSelect={handleGalleryButtonClickCallback}
        setActiveGalleryType={setActiveGalleryType}
        setActiveGalleryTypeString={setActiveGalleryTypeString}
      />
      <div className="appContainer">
        <Contact
          showContactPage={showContactPage}
          setShowContactPage={setShowContactPage}
          setIsAnimating={setIsAnimating}
          showTypes={showTypes}
          showGallery={showGallery}
        />
        <div className="header">
          <div className="menu">
            <img
              onClick={() => handleEmblemClickCallback()}
              src={found_wood}
              className="icon"
              alt="Found Wood Logo"
            ></img>
            <div
              className="menu-item"
              onClick={() => handleGalleryTypesClickCallback()}
              onMouseEnter={(e) => handleButtonHover(e)}
            >
              Gallery
            </div>

            <div onClick={() => handleContactPageClick()} className="menu-item">
              Contact
            </div>
          </div>
        </div>

        <div className="blur">
          <div
            className="infoGraphic"
            onClick={() => setShowInfographic(!showInfographic)}
            style={
              showInfographic
                ? { bottom: '0%', opacity: 1 }
                : { bottom: '-50%', opacity: 0 }
            }
          >
            <div className="gallery_description_header">
              {galleryTypeArr[currentPhoto]?.name}
            </div>

            <br />
            {galleryTypeArr[currentPhoto]?.description}
            <br />
            {galleryTypeArr[currentPhoto]?.price}
          </div>
          <NewCanvas
            showContactPage={showContactPage}
            isAnimating={isAnimating}
          />
        </div>
      </div>
    </>
  );
}

export default NewApp;
