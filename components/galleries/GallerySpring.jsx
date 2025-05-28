import './gallery.css';
import imgData from './imgData';
import { useState, useEffect, useRef } from 'react';
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
  const [startY, setStartY] = useState(null);
  const [infoHeight, setInfoHeight] = useState(0);
  const infoRef = useRef(null);
  const swipeThreshold = 50; // minimum pixels to trigger swipe

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
      setTimeout(() => {
        setCurrentPhoto(index);
      }, 0);
    }
    setShowDetails(false);
    setShowInfographic(false);
  };

  const [spring, api] = useSpring(() => ({
    opacity: 1,
  }));

  const [infoSpring, infoApi] = useSpring(() => ({
    transform: 'translateY(100%)',
  }));

  // New spring for the swipe indicator
  const [indicatorSpring, indicatorApi] = useSpring(() => ({
    opacity: 1,
    transform: 'translateY(0px)',
  }));

  function handleMasterImageClick() {
    if (window.innerWidth >= window.innerHeight) {
      setShowDetails(!showDetails);
      setShowInfographic(!showInfographic);
    }
  }

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (startY === null) return;

    const currentY = e.touches[0].clientY;
    const diff = startY - currentY;

    // Only allow upward swipe (positive diff)
    if (diff > 0) {
      const newTransform = Math.max(0, 100 - (diff / window.innerHeight) * 100);
      infoApi.start({ transform: `translateY(${newTransform}%)` });

      // Start fading out the indicator as user swipes up
      const fadeProgress = Math.min(1, diff / (swipeThreshold * 2));
      indicatorApi.start({
        opacity: 1 - fadeProgress,
        transform: `translateY(${fadeProgress * 30}px)`,
      });
    } else if (diff < 0) {
      // For downward swipe
      const newTransform = Math.min(
        100,
        100 - (diff / window.innerHeight) * 100
      );
      infoApi.start({ transform: `translateY(${newTransform}%)` });

      // Bring back the indicator when swiping down
      if (!showDetails) {
        indicatorApi.start({
          opacity: 1,
          transform: 'translateY(0px)',
        });
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (startY === null) return;

    const endY = e.changedTouches[0].clientY;
    const diff = startY - endY;

    if (diff > swipeThreshold) {
      // Swipe up - show info
      infoApi.start({ transform: 'translateY(0%)' });
      setShowDetails(true);

      // Hide the indicator
      indicatorApi.start({
        opacity: 0,
        transform: 'translateY(30px)',
      });
    } else if (diff < -swipeThreshold) {
      // Swipe down - hide info
      infoApi.start({ transform: 'translateY(100%)' });
      setShowDetails(false);

      // Show the indicator again
      indicatorApi.start({
        opacity: 1,
        transform: 'translateY(0px)',
      });
    } else {
      // Reset to previous state
      infoApi.start({
        transform: showDetails ? 'translateY(0%)' : 'translateY(100%)',
      });

      // Reset indicator based on showDetails state
      indicatorApi.start({
        opacity: showDetails ? 0 : 1,
        transform: showDetails ? 'translateY(30px)' : 'translateY(0px)',
      });
    }

    setStartY(null);
  };

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
          <div className="thumbNails" onMouseOver={handleThumbNailHover}>
            {galleryTypeArr.map((image, index) => (
              <img key={index} src={image.img} className="thumbNailPhoto" />
            ))}
            <div className="furniturePrice">
              Price: {galleryTypeArr[currentPhoto]?.price}
            </div>
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
              <br />
            </div>
          </>
        </div>
        <div
          onClick={() => handleMasterImageClick()}
          className="currentPhoto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {galleryTypeArr.length > 0 && (
            <>
              {window.innerWidth < window.innerHeight && (
                <animated.div
                  className="swipeIndicator"
                  style={indicatorSpring}
                >
                  <span className="arrow">↑</span> Swipe up for details
                </animated.div>
              )}
              <animated.img
                style={{ ...spring }}
                className="masterImage"
                src={
                  galleryTypeArr[currentPhoto]?.img
                    ? galleryTypeArr[currentPhoto]?.img
                    : galleryTypeArr[0]
                }
              />
              {window.innerWidth < window.innerHeight && (
                <animated.div
                  className="mobileProductInfo"
                  style={{
                    ...infoSpring,
                    maxHeight: showDetails ? '90svh' : '0%',
                  }}
                  ref={infoRef}
                >
                  <div className="handleBar"></div>
                  <h2 className="mobileProductName">
                    {galleryTypeArr[currentPhoto]?.name}
                  </h2>
                  <div className="mobileProductPrice">
                    Price: {galleryTypeArr[currentPhoto]?.price}
                  </div>
                  <p className="mobileProductDescription">
                    {galleryTypeArr[currentPhoto]?.description}
                  </p>
                </animated.div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
