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
  const [showDetails, setShowDetails] = useState(true);
  const [galleryTypeArr, setGalleryTypeArr] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [showInfographic, setShowInfographic] = useState(false);

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

  return (
    <>
      {window.innerWidth < 1000 || !isAnimating ? null : (
        <>
          <div className="new_app_header">
            Doug's <br /> Found
            <br /> Wood
            <br />
            <div className="new_app_info">
              Always Unique <br /> Handcrafted in Maine
            </div>
          </div>
        </>
      )}

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
          <div
            className="infoGraphic"
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
          <NewCanvas isAnimating={isAnimating} />
        </div>
      </div>
    </>
  );
}

export default NewApp;
