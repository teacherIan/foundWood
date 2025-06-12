import "./gallery.css";
import imgData from "./imgData";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useSpring, animated, useTransition } from "@react-spring/web";

const images = imgData;

// Memoized thumbnail component
const Thumbnail = memo(({ image, index, currentPhoto, onClick }) => (
  <img
    key={index}
    src={image.img}
    className={`thumbNailPhoto ${index === currentPhoto ? "grayscale" : ""}`}
    onClick={() => onClick(index)}
    loading="lazy"
    alt={`Thumbnail ${index + 1}`}
  />
));

// Memoized mobile info panel
const MobileInfoPanel = memo(
  ({ infoSpring, infoRef, showDetails, currentItem }) => (
    <animated.div
      className="mobileProductInfo"
      style={{
        ...infoSpring,
        // Changed from fixed positioning to relative positioning behavior
        maxHeight: showDetails ? "90svh" : "0%",
        overflowY: showDetails ? "auto" : "hidden", // Enable scrolling when visible
      }}
      ref={infoRef}
    >
      <div className="handleBar" />
      <h2 className="mobileProductName">{currentItem?.name}</h2>
      <p className="mobileProductDescription">{currentItem?.description}</p>
    </animated.div>
  ),
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

  // Touch pan state for master image (mobile)
  const [touchPan, setTouchPan] = useState({ x: 0, y: 0 });
  const lastTouchRef = useRef(null);

  // Memoized gallery type filtering
  useEffect(() => {
    const newGalleryTypeArr = images.filter(
      (image) => image.type === showGalleryString,
    );

    // Debug: log what is being compared
    if (process.env.NODE_ENV !== "production") {
      console.log("Filtering gallery:", {
        showGalleryString,
        typesInImages: Array.from(new Set(images.map((img) => img.type))),
        newGalleryTypeArr,
      });
    }

    // Only update if the array has actually changed
    if (JSON.stringify(newGalleryTypeArr) !== JSON.stringify(galleryTypeArr)) {
      setGalleryTypeArr(newGalleryTypeArr);
      setCurrentPhoto(0); // Always reset to first image for safety
    }
  }, [
    galleryType,
    showGalleryString,
    setGalleryTypeArr,
    setCurrentPhoto,
    galleryTypeArr,
  ]);

  // Memoized handlers
  const handleThumbNailHover = useCallback(
    (event) => {
      const index = Array.prototype.indexOf.call(
        event.target.parentNode.children,
        event.target,
      );

      if (event.target.className === "thumbNailPhoto") {
        requestAnimationFrame(() => {
          setCurrentPhoto(index);
        });
      }
      setShowDetails(false);
      setShowInfographic(false);
    },
    [setCurrentPhoto, setShowDetails, setShowInfographic],
  );

  const handleMasterImageClick = useCallback(() => {
    if (window.innerWidth >= window.innerHeight) {
      setShowDetails(!showDetails);
      setShowInfographic(!showInfographic);
    }
  }, [showDetails, showInfographic, setShowDetails, setShowInfographic]);

  const handleThumbnailClick = useCallback(
    (index) => {
      setCurrentPhoto(index);
      setShowDetails(false);
      setShowInfographic(false);
      infoApi.start({ transform: "translateY(100%)" });
      indicatorApi.start({
        opacity: 1,
        transform: "translateY(0px)",
      });
    },
    [setCurrentPhoto, setShowDetails, setShowInfographic],
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
    const maxTranslateX = 20; // percentage
    const maxTranslateY = 20; // percentage

    // Calculate the actual translation
    const translateX = maxTranslateX * (0.5 - relativeX) * 2;
    const translateY = maxTranslateY * (0.5 - relativeY) * 2;

    setImagePosition({ x: translateX, y: translateY });
  }, []);

  const handleImageMouseEnter = useCallback(() => {
    if (window.innerWidth >= window.innerHeight) {
      setIsHovering(true);
    }
  }, []);

  const handleImageMouseLeave = useCallback(() => {
    setIsHovering(false);
    setImagePosition({ x: 0, y: 0 });
  }, []);

  // Spring animations
  const [spring, api] = useSpring(() => ({
    opacity: 1,
  }));

  const [infoSpring, infoApi] = useSpring(() => ({
    transform: "translateY(100%)",
  }));

  const [indicatorSpring, indicatorApi] = useSpring(() => ({
    opacity: 1,
    transform: "translateY(0px)",
  }));

  const [imageSpring, imageApi] = useSpring(() => ({
    transform: "translate(0%, 0%) scale(1)",
    config: { tension: 170, friction: 26 },
  }));

  // Update the image position when hovering
  useEffect(() => {
    if (isHovering) {
      imageApi.start({
        transform: `translate(${imagePosition.x}%, ${imagePosition.y}%) scale(1.15)`,
      });
    } else {
      imageApi.start({
        transform: "translate(0%, 0%) scale(1)",
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
          100 - (diff / window.innerHeight) * 100,
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
          100 - (diff / window.innerHeight) * 100,
        );
        infoApi.start({ transform: `translateY(${newTransform}%)` });

        if (!showDetails) {
          indicatorApi.start({
            opacity: 1,
            transform: "translateY(0px)",
          });
        }
      }
    },
    [startY, showDetails, infoApi, indicatorApi],
  );

  const handleTouchEnd = useCallback(
    (e) => {
      if (startY === null) return;

      const endY = e.changedTouches[0].clientY;
      const diff = startY - endY;

      if (diff > swipeThreshold) {
        infoApi.start({ transform: "translateY(0%)" });
        setShowDetails(true);
        indicatorApi.start({
          opacity: 0,
          transform: "translateY(30px)",
        });
      } else if (diff < -swipeThreshold) {
        infoApi.start({ transform: "translateY(100%)" });
        setShowDetails(false);
        indicatorApi.start({
          opacity: 1,
          transform: "translateY(0px)",
        });
      } else {
        infoApi.start({
          transform: showDetails ? "translateY(0%)" : "translateY(100%)",
        });
        indicatorApi.start({
          opacity: showDetails ? 0 : 1,
          transform: showDetails ? "translateY(30px)" : "translateY(0px)",
        });
      }

      setStartY(null);
    },
    [startY, showDetails, infoApi, indicatorApi, setShowDetails],
  );

  // Touch pan handlers for master image (mobile)
  const handleImageTouchStart = (e) => {
    if (window.innerWidth >= window.innerHeight) return; // Only on mobile
    const touch = e.touches[0];
    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleImageTouchMove = (e) => {
    if (window.innerWidth >= window.innerHeight || !lastTouchRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - lastTouchRef.current.x;
    const dy = touch.clientY - lastTouchRef.current.y;

    setTouchPan((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleImageTouchEnd = () => {
    lastTouchRef.current = null;
  };

  // Reset pan when image changes (mobile)
  useEffect(() => {
    setTouchPan({ x: 0, y: 0 });
  }, [currentPhoto]);

  const currentItem = galleryTypeArr[currentPhoto] || galleryTypeArr[0];

  // Crossfade transition for master image
  const imageTransitions = useTransition(currentItem?.img, {
    key: currentItem?.img,
    from: { opacity: 0, position: "absolute" },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { tension: 200, friction: 20 },
  });

  return (
    <div
      className="galleryContainer"
      style={
        showGallery
          ? { width: "100svw", height: "100svh", opacity: 1, zIndex: 20000 }
          : { width: "100svw", height: "100svh", opacity: 0, zIndex: 0 }
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
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        {galleryTypeArr.length > 0 && (
          <>
            {/* Crossfade transition for master image with hover functionality */}
            <div
              ref={imageContainerRef}
              style={{
                position: "relative",
                width:
                  window.innerWidth < window.innerHeight ? "100vw" : "70svw",
                height:
                  window.innerWidth < window.innerHeight ? "50svh" : "50svw",
                margin: "0 auto",
                zIndex: 1,
                overflow: "hidden",
                cursor:
                  window.innerWidth >= window.innerHeight
                    ? "zoom-in"
                    : "pointer",
              }}
              onMouseMove={handleImageMouseMove}
              onMouseEnter={handleImageMouseEnter}
              onMouseLeave={handleImageMouseLeave}
              onTouchStart={handleImageTouchStart}
              onTouchMove={handleImageTouchMove}
              onTouchEnd={handleImageTouchEnd}
              onTouchCancel={handleImageTouchEnd}
            >
              {imageTransitions((style, item) =>
                item ? (
                  <animated.img
                    key={item}
                    style={{
                      ...style,
                      width:
                        window.innerWidth < window.innerHeight
                          ? "100vw"
                          : "70svw",
                      height:
                        window.innerWidth < window.innerHeight
                          ? "50svh"
                          : "50svw",
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      ...(window.innerWidth < window.innerHeight
                        ? { transform: `translate(${touchPan.x}px, ${touchPan.y}px) scale(1.15)` }
                        : imageSpring),
                    }}
                    className="masterImage"
                    src={item}
                    loading="lazy"
                    alt={currentItem?.name}
                  />
                ) : null,
              )}

              {/* Magnifying glass indicator - always show, both desktop and mobile */}
              <div
                className="magnifyIndicator"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "rgba(255, 255, 255, 0.7)",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  zIndex: 300000,
                  opacity: isHovering ? 0.3 : 0.8,
                  transition: "opacity 0.3s ease",
                  pointerEvents: "none", // allow touches/clicks to pass through
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
            </div>

            {/* Info/Text panels below the image, as originally */}
            {window.innerWidth < window.innerHeight && (
              <div className="mobileProductInfo always-visible">
                {/* <div className="handleBar" /> */}
                <h2 className="mobileProductName">{currentItem?.name}</h2>
                <p className="mobileProductDescription">
                  {currentItem?.description}
                </p>
              </div>
            )}
            {window.innerWidth >= window.innerHeight && showDetails && (
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
