import './gallery.css';
import imgData from './imgData';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useSpring, animated, useTransition } from '@react-spring/web';

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
const MobileInfoPanel = memo(
  ({ infoSpring, infoRef, showDetails, currentItem }) => (
    <animated.div
      className="mobileProductInfo overlay-panel"
      style={{
        ...infoSpring,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: showDetails ? '90svh' : '0%',
        overflowY: showDetails ? 'auto' : 'hidden',
        zIndex: 10000,
        background: 'rgba(245, 245, 245, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
      ref={infoRef}
    >
      <div className="handleBar" />
      <h2 className="mobileProductName">{currentItem?.name}</h2>
      <p className="mobileProductDescription">{currentItem?.description}</p>
    </animated.div>
  )
);

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
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);

  // Track aspect ratio for dynamic container sizing (desktop)
  const [imgAspect, setImgAspect] = useState(1.4); // default aspect ratio

  // Loading state for smooth transitions
  const [imageLoading, setImageLoading] = useState(false);

  // Touch pan state for master image (mobile)
  const [touchPan, setTouchPan] = useState({ x: 0, y: 0 });
  const lastTouchRef = useRef(null);
  const PAN_MARGIN = 60; // pixels of extra space beyond the strict edge

  // Spring animations - must be declared before any callbacks that use them
  const [gallerySpring, galleryApi] = useSpring(() => ({
    opacity: 1,
  }));

  const [infoSpring, infoApi] = useSpring(() => ({
    transform: 'translateY(100%)',
  }));

  const [indicatorSpring, indicatorApi] = useSpring(() => ({
    opacity: 1,
    transform: 'translateY(0px)',
  }));

  const [imageSpring, imageApi] = useSpring(() => ({
    transform: 'translate(0%, 0%) scale(1)',
    config: { tension: 170, friction: 26 },
  }));

  // Update aspect ratio when image loads
  const handleImageLoad = useCallback(
    (e) => {
      const img = e.target;
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      // Only log in development
      if (process.env.NODE_ENV !== 'production') {
        console.log('Image loaded:', {
          src: img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          aspectRatio,
          currentAspect: imgAspect,
        });
      }
      setImgAspect(aspectRatio);
      setImageLoading(false); // Image finished loading
    },
    [imgAspect]
  );

  // Reset aspect ratio when current photo changes
  useEffect(() => {
    // Reset to default aspect ratio when photo changes, will be updated by handleImageLoad
    setImgAspect(1.4);
    setImageLoading(true); // Start loading state
  }, [currentPhoto]); // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Force a re-render on resize to update container dimensions
      // This is especially important for orientation changes
      setImagePosition({ x: 0, y: 0 });
      setIsHovering(false);
      if (window.innerWidth < window.innerHeight) {
        setTouchPan({ x: 0, y: 0 });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showGallery) return; // Only handle keys when gallery is open

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          setCurrentPhoto((prev) =>
            prev > 0 ? prev - 1 : galleryTypeArr.length - 1
          );
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          setCurrentPhoto((prev) =>
            prev < galleryTypeArr.length - 1 ? prev + 1 : 0
          );
          break;
        case 'Escape':
          // You might want to add a close gallery function here
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGallery, galleryTypeArr.length, setCurrentPhoto]);

  // Memoized gallery type filtering
  useEffect(() => {
    const newGalleryTypeArr = images.filter(
      (image) => image.type === showGalleryString
    );

    // Debug: log what is being compared
    if (process.env.NODE_ENV !== 'production') {
      console.log('Filtering gallery:', {
        showGalleryString,
        typesInImages: Array.from(new Set(images.map((img) => img.type))),
        newGalleryTypeArr,
      });
    }

    // Only update if the array has actually changed
    if (JSON.stringify(newGalleryTypeArr) !== JSON.stringify(galleryTypeArr)) {
      setGalleryTypeArr(newGalleryTypeArr);
      setCurrentPhoto(0); // Always reset to first image for safety
      // Reset aspect ratio to default when gallery type changes
      setImgAspect(1.4);
    }
  }, [
    galleryType,
    showGalleryString,
    setGalleryTypeArr,
    setCurrentPhoto,
    galleryTypeArr,
  ]);

  // Animate gallery visibility
  useEffect(() => {
    galleryApi.start({
      opacity: showGallery ? 1 : 0,
    });
  }, [showGallery, galleryApi]);

  // Memoized handlers
  const handleThumbNailHover = useCallback(
    (event) => {
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
    },
    [setCurrentPhoto, setShowDetails, setShowInfographic]
  );

  const handleMasterImageClick = useCallback(() => {
    // Only show mobile-style info panel on actual mobile devices (portrait orientation + small screen)
    if (window.innerWidth < window.innerHeight && window.innerWidth < 768) {
      setShowDetails(!showDetails);
      setShowInfographic(!showInfographic);
    }
  }, [showDetails, showInfographic, setShowDetails, setShowInfographic]);

  const handleThumbnailClick = useCallback(
    (index) => {
      setCurrentPhoto(index);
      setShowDetails(false);
      setShowInfographic(false);
      // Hide the mobile info panel when thumbnail is clicked
      infoApi.start({ transform: 'translateY(100%)' });
      indicatorApi.start({
        opacity: 1,
        transform: 'translateY(0px)',
      });
    },
    [setCurrentPhoto, setShowDetails, setShowInfographic, infoApi, indicatorApi]
  );

  // Image hover/pan functionality
  const handleImageMouseMove = useCallback((e) => {
    if (!imageContainerRef.current || window.innerWidth < window.innerHeight)
      return;

    const container = imageContainerRef.current;
    const rect = container.getBoundingClientRect();

    // Calculate relative position (0 to 1)
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;

    // Calculate the maximum translation based on the image size vs container
    // We want to be able to move the image around to see all parts
    const maxTranslateX = 40; // percentage
    const maxTranslateY = 40; // percentage

    // Calculate the actual translation
    const translateX = maxTranslateX * (0.5 - relativeX) * 2;
    const translateY = maxTranslateY * (0.5 - relativeY) * 2;

    setImagePosition({ x: translateX, y: translateY });
  }, []);

  const handleImageMouseEnter = useCallback(() => {
    // Only enable hover effects on desktop (not on mobile devices)
    if (window.innerWidth >= window.innerHeight && window.innerWidth >= 768) {
      setIsHovering(true);
    }
  }, []);

  const handleImageMouseLeave = useCallback(() => {
    setIsHovering(false);
    setImagePosition({ x: 0, y: 0 });
  }, []);

  // Update the image position when hovering
  useEffect(() => {
    if (isHovering) {
      imageApi.start({
        transform: `translate(${imagePosition.x}%, ${imagePosition.y}%) scale(1.15)`,
      });
    } else {
      imageApi.start({
        transform: 'translate(0%, 0%) scale(1)',
      });
    }
  }, [imagePosition, isHovering, imageApi]);

  // Touch handlers for info panel swipe (vertical)
  const handleTouchStart = useCallback((e) => {
    setStartY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (startY === null) return;

      const currentY = e.touches[0].clientY;
      const diff = startY - currentY;

      if (diff > 0) {
        const newTransform = Math.max(
          0,
          100 - (diff / window.innerHeight) * 100
        );
        infoApi.start({ transform: `translateY(${newTransform}%)` });

        const fadeProgress = Math.min(1, diff / (swipeThreshold * 2));
        indicatorApi.start({
          opacity: 1 - fadeProgress,
          transform: `translateY(${fadeProgress * 30}px)`,
        });
      } else if (diff < 0) {
        const newTransform = Math.min(
          100,
          100 - (diff / window.innerHeight) * 100
        );
        infoApi.start({ transform: `translateY(${newTransform}%)` });

        if (!showDetails) {
          indicatorApi.start({
            opacity: 1,
            transform: 'translateY(0px)',
          });
        }
      }
    },
    [startY, showDetails, infoApi, indicatorApi]
  );

  const handleTouchEnd = useCallback(
    (e) => {
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
    },
    [startY, showDetails, infoApi, indicatorApi, setShowDetails]
  );

  // Touch pan handlers for master image (mobile) with boundaries
  const MOBILE_IMAGE_WIDTH = 1.3; // 130vw
  const MOBILE_IMAGE_HEIGHT = 1.3; // 130% of container height (relative to 50svh container, so 65svh)
  const MOBILE_CONTAINER_WIDTH = 1.0; // 100vw
  const MOBILE_CONTAINER_HEIGHT = 0.5; // 50svh

  // Utility to detect mobile devices
  function isMobileDevice() {
    return (
      typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.userAgent.toLowerCase().includes('mobi'))
    );
  }

  // Calculate pan boundaries for mobile image panning
  function getPanBounds(container, image, margin = 0) {
    if (!container || !image)
      return { minPanX: 0, maxPanX: 0, minPanY: 0, maxPanY: 0 };

    const containerRect = container.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();

    const minPanX = Math.min(0, containerRect.width - imageRect.width - margin);
    const maxPanX = Math.max(0, margin);
    const minPanY = Math.min(
      0,
      containerRect.height - imageRect.height - margin
    );
    const maxPanY = Math.max(0, margin);

    return { minPanX, maxPanX, minPanY, maxPanY };
  }

  const handleImageTouchStart = (e) => {
    if (!isMobileDevice()) return; // Only on mobile devices
    const touch = e.touches[0];
    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleImageTouchMove = (e) => {
    if (!isMobileDevice() || !lastTouchRef.current) return;
    e.preventDefault(); // Prevent iOS pull-to-refresh and scroll bounce
    const touch = e.touches[0];
    const dx = touch.clientX - lastTouchRef.current.x;
    const dy = touch.clientY - lastTouchRef.current.y;

    setTouchPan((prev) => {
      // Apply some momentum damping for smoother feel
      const dampingFactor = 0.8;
      const newX = prev.x + dx * dampingFactor;
      const newY = prev.y + dy * dampingFactor;

      // Get better boundary constraints
      const container = imageContainerRef.current;
      const image = imageRef.current;
      if (container && image) {
        const { minPanX, maxPanX, minPanY, maxPanY } = getPanBounds(
          container,
          image,
          PAN_MARGIN
        );

        return {
          x: Math.max(Math.min(newX, maxPanX), minPanX),
          y: Math.max(Math.min(newY, maxPanY), minPanY),
        };
      }

      return { x: newX, y: newY };
    });

    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleImageTouchEnd = () => {
    lastTouchRef.current = null;
  };

  // Reset pan when image changes (mobile)
  useEffect(() => {
    // Center the image initially on mobile using DOM measurements
    if (window.innerWidth < window.innerHeight) {
      setTimeout(() => {
        const container = imageContainerRef.current;
        const image = imageRef.current;
        if (container && image) {
          const containerRect = container.getBoundingClientRect();
          const imageRect = image.getBoundingClientRect();
          const centerX = (containerRect.width - imageRect.width) / 2;
          const centerY = (containerRect.height - imageRect.height) / 2;
          // Clamp to bounds with margin
          const { minPanX, maxPanX, minPanY, maxPanY } = getPanBounds(
            container,
            image,
            PAN_MARGIN
          );
          setTouchPan({
            x: Math.max(Math.min(centerX, maxPanX), minPanX),
            y: Math.max(Math.min(centerY, maxPanY), minPanY),
          });
        }
      }, 0);
    } else {
      setTouchPan({ x: 0, y: 0 });
    }
  }, [currentPhoto]);

  const currentItem = galleryTypeArr[currentPhoto] || galleryTypeArr[0];

  // Helper function to calculate container dimensions
  const calculateImageDimensions = useCallback(() => {
    const isTabletLandscape =
      window.innerWidth >= 768 &&
      window.innerWidth <= 1024 &&
      window.innerWidth > window.innerHeight;

    // For very large screens (like 4K monitors), use even more space
    const isLargeDesktop = window.innerWidth >= 1440;

    const maxW = isTabletLandscape
      ? window.innerWidth * 0.85 // Good size for tablets
      : isLargeDesktop
      ? window.innerWidth * 0.85 // Good size for large desktop screens
      : window.innerWidth * 0.85; // Good size for regular desktop
    const maxH = isTabletLandscape
      ? window.innerHeight * 0.8 // Good height for tablets
      : isLargeDesktop
      ? window.innerHeight * 0.8 // Good height for large desktop screens
      : window.innerHeight * 0.8; // Good height for regular desktop

    // Ensure we have a valid aspect ratio
    const safeAspectRatio = imgAspect && imgAspect > 0 ? imgAspect : 1.4;

    // Calculate container dimensions based on image aspect ratio
    let containerW = maxW;
    let containerH = maxW / safeAspectRatio;

    // If height exceeds max, constrain by height
    if (containerH > maxH) {
      containerH = maxH;
      containerW = maxH * safeAspectRatio;
    }

    return { width: containerW, height: containerH };
  }, [imgAspect]);

  // Crossfade transition for master image
  const imageTransitions = useTransition(currentItem?.img, {
    key: currentItem?.img,
    from: { opacity: 0, position: 'absolute' },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { tension: 200, friction: 20 },
  });

  return (
    <animated.div
      className="galleryContainer"
      style={{
        ...gallerySpring,
        width: '100svw',
        height: '100svh',
        opacity: showGallery ? 1 : 0,
        zIndex: showGallery ? 20000 : 0,
      }}
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
        style={{ position: 'relative', width: '100%', height: '100%' }}
      >
        {galleryTypeArr.length > 0 && (
          <>
            {/* Crossfade transition for master image with hover functionality */}
            <div
              ref={imageContainerRef}
              style={{
                position: 'relative',
                width:
                  window.innerWidth < window.innerHeight
                    ? '100vw'
                    : `${calculateImageDimensions().width}px`,
                height:
                  window.innerWidth < window.innerHeight
                    ? '50svh'
                    : `${calculateImageDimensions().height}px`,
                margin: '0 auto',
                zIndex: 1,
                overflow: 'hidden',
                cursor:
                  window.innerWidth >= window.innerHeight &&
                  window.innerWidth >= 768
                    ? 'zoom-in'
                    : 'pointer',
                touchAction: 'none', // Prevents browser gestures like pull-to-refresh
              }}
              onMouseMove={handleImageMouseMove}
              onMouseEnter={handleImageMouseEnter}
              onMouseLeave={handleImageMouseLeave}
              onTouchStart={handleImageTouchStart}
              onTouchMoveCapture={handleImageTouchMove}
              onTouchEnd={handleImageTouchEnd}
              onTouchCancel={handleImageTouchEnd}
            >
              {imageTransitions((style, item) =>
                item ? (
                  <animated.img
                    key={item}
                    ref={imageRef}
                    style={{
                      ...style,
                      width: '100%',
                      height: '100%',
                      objectFit:
                        window.innerWidth < window.innerHeight
                          ? 'cover'
                          : 'contain',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      ...(window.innerWidth < window.innerHeight
                        ? {
                            transform: `translate(${touchPan.x}px, ${touchPan.y}px) scale(1.15)`,
                          }
                        : imageSpring),
                    }}
                    className="masterImage"
                    src={item}
                    loading="lazy"
                    alt={currentItem?.name}
                    onLoad={handleImageLoad}
                  />
                ) : null
              )}

              {/* Loading indicator */}
              {imageLoading && <div className="imageLoading" />}

              {/* Show movement indicator (four-way arrows) on mobile, magnifying glass on desktop */}
              {window.innerWidth < 700 &&
              window.innerWidth < window.innerHeight ? (
                <div
                  className="moveIndicator"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    zIndex: 300000,
                    opacity: 0.8,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                  }}
                >
                  {/* Four-way arrow SVG */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="5 9 2 12 5 15" />
                    <polyline points="9 5 12 2 15 5" />
                    <polyline points="15 19 12 22 9 19" />
                    <polyline points="19 9 22 12 19 15" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <line x1="12" y1="2" x2="12" y2="22" />
                  </svg>
                </div>
              ) : (
                <div
                  className="magnifyIndicator"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    zIndex: 300000,
                    opacity: isHovering ? 0.3 : 0.8,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none', // allow touches/clicks to pass through
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-search"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              )}
            </div>

            {/* Info/Text panels below the image, as originally */}
            {window.innerWidth < window.innerHeight &&
              window.innerWidth < 768 && (
                <div className="mobileProductInfo always-visible">
                  {/* <div className="handleBar" /> */}
                  <h2 className="mobileProductName">{currentItem?.name}</h2>
                  <p className="mobileProductDescription">
                    {currentItem?.description}
                  </p>
                </div>
              )}
            {window.innerWidth < window.innerHeight &&
              window.innerWidth < 768 &&
              showDetails && (
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
    </animated.div>
  );
}
