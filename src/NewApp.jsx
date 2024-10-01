import './App.css';
import { useState, useCallback, useEffect } from 'react';
import found_wood from './assets/found_wood_icon.png';
import Contact from '../components/contact/Contact';
import GallerySpring from '../components/galleries/GallerySpring';
import Types from '../components/select_gallery/Types';
import Mission from '../components/mission/Mission';
import NewCanvas from '../components/new_experience/Experience';

function NewApp() {
  const [isAnimating, setIsAnimating] = useState(true);
  const [activeGalleryTypeString, setActiveGalleryTypeString] =
    useState('chairs');
  const [activeGalleryType, setActiveGalleryType] = useState(1);
  const [showTypes, setShowTypes] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showContactPage, setShowContactPage] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleGalleryTypesClickCallback = useCallback(() => {
    if (!showGallery) {
      setIsAnimating(!isAnimating);
    }

    setShowTypes(!showTypes);
    setShowGallery(false);
    setTimeout(() => {
      setShowDetails(false);
    }, 1000);
  }, [setShowTypes, setShowGallery, showTypes]);

  const handleMissionButtonClickCallback = useCallback(() => {
    setIsAnimating(!isAnimating);
    setShowTypes(false);
    setShowGallery(false);
    setTimeout(() => {
      setShowDetails(false);
    }, 1000);
  }, [setShowTypes, setShowGallery]);

  const handleGalleryButtonClickCallback = useCallback(() => {
    setShowTypes(false);

    setShowGallery(true);
    setTimeout(() => {
      setShowDetails(false);
    }, 1000);
  }, [setShowTypes, setShowGallery, showGallery]);

  function handleEmblemClick() {
    setIsAnimating(true);
    setShowTypes(false);
    setShowGallery(false);
    setTimeout(() => {
      setShowDetails(false);
    }, 1000);
  }

  function handleContactPageClick() {
    setShowContactPage(!showContactPage);
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  }

  return (
    <>
      {window.innerWidth < 1000 || !isAnimating ? null : (
        <>
          <div className="new_app_header_outline">
            Doug's <br /> Found
            <br /> Wood
            <br />
          </div>
          <div className="new_app_header">
            Doug's <br /> Found
            <br /> Wood
            <br />
          </div>
        </>
      )}

      <GallerySpring
        galleryType={activeGalleryType}
        showGallery={showGallery}
        showGalleryString={activeGalleryTypeString}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
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
              onClick={() => handleEmblemClick()}
              src={found_wood}
              className="icon"
            ></img>
            <div
              className="menu-item"
              onClick={() => handleGalleryTypesClickCallback()}
            >
              Gallery
            </div>

            <div onClick={() => handleContactPageClick()} className="menu-item">
              Contact
            </div>
          </div>
        </div>

        <div className="blur">
          <NewCanvas isAnimating={isAnimating} />
        </div>
      </div>
    </>
  );
}

export default NewApp;
