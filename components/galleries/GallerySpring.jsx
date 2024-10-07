import './gallery.css';
import imgData from './imgData';
import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

const images = imgData;

export default function Gallery({
  showGallery,
  galleryType,
  showGalleryString,
  showDetails,
  setShowDetails,
  galleryTypeArr,
  setGalleryTypeArr,
  currentPhoto,
  setCurrentPhoto,
  setShowInfographic,
  showInfographic,
}) {
  useEffect(() => {
    const newGalleryTypeArr = images.filter(
      (image) => image.type === showGalleryString
    );

    if (window.innerWidth < 1200) {
      newGalleryTypeArr.splice(8);
    }
    setGalleryTypeArr(newGalleryTypeArr);
  }, [galleryType]);

  const handleThumbNailHover = (event) => {
    const index = Array.prototype.indexOf.call(
      event.target.parentNode.children,
      event.target
    );

    if (event.target.className == 'thumbNailPhoto') {
      setCurrentPhoto(index);
    }
    setShowDetails(false);
    setShowInfographic(false);
  };

  const [spring, api] = useSpring(() => ({
    opacity: 1,
  }));

  function handleMasterImageClick() {
    setShowDetails(!showDetails);
    setShowInfographic(!showInfographic);
  }

  return (
    <>
      <div
        className="galleryContainer"
        style={
          showGallery
            ? { width: '100svw', height: '100svh', opacity: 1, zIndex: 20000 }
            : { width: '100svw', height: '100svh', opacity: 0, zIndex: 0 }
        }
      >
        <div className="galleryLeftTop">
          {/* {window.innerWidth < 1200 && showDetails ? (
            <div className="smallScreenCover">
              <div className="furnitureName">
                {galleryTypeArr[currentPhoto]?.name}
              </div>
              <div className="furnitureDescription">
                {galleryTypeArr[currentPhoto]?.description}
                <br />
                Price: {galleryTypeArr[currentPhoto]?.price}
              </div>
            </div>
          ) : null} */}

          <div
            style={showDetails ? { opacity: '1' } : { opacity: '1' }}
            className="thumbNails"
            onMouseOver={handleThumbNailHover}
          >
            {galleryTypeArr.map((image, index) => (
              <img key={index} src={image.img} className="thumbNailPhoto" />
            ))}
          </div>
          <>
            <div className="galleryLeftBottom">
              <div className="furnitureName">
                {galleryTypeArr[currentPhoto]?.name}
              </div>
              <br />
              <div className="furnitureDescription">
                {galleryTypeArr[currentPhoto]?.description}
              </div>
              <br />
              <br />
              <div className="furniturePrice">
                Price: {galleryTypeArr[currentPhoto]?.price}
              </div>
              <br />
            </div>
          </>
        </div>
        <div onClick={() => handleMasterImageClick()} className="currentPhoto">
          {galleryTypeArr.length > 0 && (
            <>
              {window.innerWidth < 1200 ? (
                showDetails ? (
                  <div className="infoGal">Click to Remove Details </div>
                ) : (
                  <div className="infoGal">Click to View Details</div>
                )
              ) : null}
              <animated.img
                style={{ ...spring }}
                className="masterImage"
                src={
                  galleryTypeArr[currentPhoto]?.img
                    ? galleryTypeArr[currentPhoto]?.img
                    : galleryTypeArr[0]
                }
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
