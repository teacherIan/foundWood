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

  // Touch handlers
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
            {/* Crossfade transition for master image */}
            <div
              style={{
                position: "relative",
                width: window.innerWidth < window.innerHeight ? "100vw" : "70svw",
                height: window.innerWidth < window.innerHeight ? "50svh" : "50svw",
                margin: "0 auto",
                zIndex: 1,
              }}
            >
              {imageTransitions((style, item) =>
                item ? (
                  <animated.img
                    key={item}
                    style={{
                      ...style,
                      width: window.innerWidth < window.innerHeight ? "100vw" : "70svw",
                      height: window.innerWidth < window.innerHeight ? "50svh" : "50svw",
                      objectFit: "fill",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                    className="masterImage"
                    src={item}
                    loading="lazy"
                    alt={currentItem?.name}
                  />
                ) : null
              )}
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
