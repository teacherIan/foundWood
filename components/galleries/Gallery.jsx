import './gallery.css';
import imgData from './imgData';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useSpring, animated } from '@react-spring/web';

const images = imgData;

// Memoized thumbnail component
const Thumbnail = memo(({ image, index, currentPhoto, onClick }) => (
  <img
    key={index}
    src={image.img}
    className={`thumbNailPhoto ${index === currentPhoto ? 'grayscale' : ''}`}
    onClick={() => onClick(index)}
    loading="lazy"
    alt={`Thumbnail ${index + 1}`}
  />
));

// Memoized mobile info panel
const MobileInfoPanel = memo(({ infoSpring, infoRef, showDetails, currentItem }) => (
  <animated.div
    className="mobileProductInfo"
    style={{
      ...infoSpring,
      maxHeight: showDetails ? '90svh' : '0%',
    }}
    ref={infoRef}
  >
    <div className="handleBar" />
    <h2 className="mobileProductName">{currentItem?.name}</h2>
    <p className="mobileProductDescription">{currentItem?.description}</p>
  </animated.div>
));

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
  const infoRef = useRef(null);
  const swipeThreshold = 50;

  // Memoized gallery type filtering
  useEffect(() => {
    const newGalleryTypeArr = images.filter(
      (image) => image.type === showGalleryString
    );

    if (window.innerWidth < 1200) {
      newGalleryTypeArr.splice(8);
    }

    // Only update if the array has actually changed
    if (JSON.stringify(newGalleryTypeArr) !== JSON.stringify(galleryTypeArr)) {
      setGalleryTypeArr(newGalleryTypeArr);
      setCurrentPhoto(0);
    }
  }, [galleryType, showGalleryString, setGalleryTypeArr, setCurrentPhoto, galleryTypeArr]);

  // Memoized handlers
  const handleThumbNailHover = useCallback((event) => {
    const index = Array.prototype.indexOf.call(
      event.target.parentNode.children,
      event.target
    );

    if (event.target.className === 'thumbNailPhoto') {
      requestAnimationFrame(() => {
        setCurrentPhoto(index);
      });
    }
    setShowDetails(false);
    setShowInfographic(false);
  }, [setCurrentPhoto, setShowDetails, setShowInfographic]);

  const handleMasterImageClick = useCallback(() => {
    if (window.innerWidth >= window.innerHeight) {
      setShowDetails(!showDetails);
      setShowInfographic(!showInfographic);
    }
  }, [showDetails, showInfographic, setShowDetails, setShowInfographic]);

  const handleThumbnailClick = useCallback((index) => {
    setCurrentPhoto(index);
    setShowDetails(false);
    setShowInfographic(false);
    infoApi.start({ transform: 'translateY(100%)' });
    indicatorApi.start({
      opacity: 1,
      transform: 'translateY(0px)',
    });
  }, [setCurrentPhoto, setShowDetails, setShowInfographic]);

  // Spring animations
  const [spring, api] = useSpring(() => ({
    opacity: 1,
  }));

  const [infoSpring, infoApi] = useSpring(() => ({
    transform: 'translateY(100%)',
  }));

  const [indicatorSpring, indicatorApi] = useSpring(() => ({
    opacity: 1,
    transform: 'translateY(0px)',
  }));

  // Touch handlers
  const handleTouchStart = useCallback((e) => {
    setStartY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (startY === null) return;

    const currentY = e.touches[0].clientY;
    const diff = startY - currentY;

    if (diff > 0) {
      const newTransform = Math.max(0, 100 - (diff / window.innerHeight) * 100);
      infoApi.start({ transform: `translateY(${newTransform}%)` });

      const fadeProgress = Math.min(1, diff / (swipeThreshold * 2));
      indicatorApi.start({
        opacity: 1 - fadeProgress,
        transform: `translateY(${fadeProgress * 30}px)`,
      });
    } else if (diff < 0) {
      const newTransform = Math.min(100, 100 - (diff / window.innerHeight) * 100);
      infoApi.start({ transform: `translateY(${newTransform}%)` });

      if (!showDetails) {
        indicatorApi.start({
          opacity: 1,
          transform: 'translateY(0px)',
        });
      }
    }
  }, [startY, showDetails, infoApi, indicatorApi]);

  const handleTouchEnd = useCallback((e) => {
    if (startY === null) return;

    const endY = e.changedTouches[0].clientY;
    const diff = startY - endY;

    if (diff > swipeThreshold) {
      infoApi.start({ transform: 'translateY(0%)' });
      setShowDetails(true);
      indicatorApi.start({
        opacity: 0,
        transform: 'translateY(30px)',
      });
    } else if (diff < -swipeThreshold) {
      infoApi.start({ transform: 'translateY(100%)' });
      setShowDetails(false);
      indicatorApi.start({
        opacity: 1,
        transform: 'translateY(0px)',
      });
    } else {
      infoApi.start({
        transform: showDetails ? 'translateY(0%)' : 'translateY(100%)',
      });
      indicatorApi.start({
        opacity: showDetails ? 0 : 1,
        transform: showDetails ? 'translateY(30px)' : 'translateY(0px)',
      });
    }

    setStartY(null);
  }, [startY, showDetails, infoApi, indicatorApi, setShowDetails]);

  const currentItem = galleryTypeArr[currentPhoto] || galleryTypeArr[0];

  return (
    <div
      className="galleryContainer"
      style={
        showGallery
          ? { width: '100svw', height: '100svh', opacity: 1, zIndex: 20000 }
          : { width: '100svw', height: '100svh', opacity: 0, zIndex: 0 }
      }
    >
      <div className="galleryLeftTop">
        <div className="thumbNails">
          {galleryTypeArr.map((image, index) => (
            <Thumbnail
              key={index}
              image={image}
              index={index}
              currentPhoto={currentPhoto}
              onClick={handleThumbnailClick}
            />
          ))}
        </div>
        <div className="galleryLeftBottom">
          <div className="furnitureName">{currentItem?.name}</div>
          <br />
          <div className="furnitureDescription">{currentItem?.description}</div>
          <br />
          <br />
          <br />
        </div>
      </div>
      <div
        onClick={handleMasterImageClick}
        className="currentPhoto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {galleryTypeArr.length > 0 && (
          <>
            {window.innerWidth < window.innerHeight && (
              <animated.div className="swipeIndicator" style={indicatorSpring}>
                <span className="arrow">↑</span> Swipe up for details
              </animated.div>
            )}
            <animated.img
              style={spring}
              className="masterImage"
              src={currentItem?.img}
              loading="lazy"
              alt={currentItem?.name}
            />
            {window.innerWidth < window.innerHeight && (
              <MobileInfoPanel
                infoSpring={infoSpring}
                infoRef={infoRef}
                showDetails={showDetails}
                currentItem={currentItem}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
