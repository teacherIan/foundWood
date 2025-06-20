import './gallery.css';
import imgData from './imgData';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useSpring, animated, useTransition } from '@react-spring/web';
import { useImagePreloader } from './useImagePreloader';
import { usePinch, useGesture } from '@use-gesture/react';

const images = imgData;

// Memoized thumbnail component with preloading support
const Thumbnail = memo(({ image, index, currentPhoto, onClick, isLoaded }) => {
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(index);
    },
    [index, onClick]
  );

  const handleLoad = useCallback(() => {
    setThumbnailLoaded(true);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '60px',
        height: '60px',
      }}
    >
      <img
        key={index}
        src={image.img}
        className={`thumbNailPhoto ${
          index === currentPhoto ? 'grayscale' : ''
        }`}
        onClick={handleClick}
        loading={isLoaded ? 'eager' : 'lazy'} // Use eager loading for preloaded images
        alt={`Thumbnail ${index + 1}`}
        draggable={false} // Prevent default image drag behavior
        style={{
          pointerEvents: 'auto',
          opacity: thumbnailLoaded ? 1 : 0.7,
          transition: 'opacity 0.3s ease',
        }} // Ensure clicks are captured
        onLoad={handleLoad}
      />
      {!thumbnailLoaded && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '16px',
            height: '16px',
            border: '2px solid rgba(119, 72, 28, 0.3)',
            borderTop: '2px solid var(--brown)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
});

// Draggable thumbnail container component
const DraggableThumbnails = memo(
  ({ galleryTypeArr, currentPhoto, onThumbnailClick, isImageLoaded }) => {
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    const [dragDistance, setDragDistance] = useState(0);
    const dragThreshold = 5; // Minimum pixels to consider as dragging

    // Detect if we're on a mobile device
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;

    // Detect if we need vertical dragging (very small landscape screens)
    const needsVerticalDrag =
      window.innerWidth <= 600 &&
      window.innerHeight <= 480 &&
      window.innerWidth > window.innerHeight;

    // Use refs to store the latest values for closures
    const stateRef = useRef({
      startX: 0,
      startY: 0,
      scrollLeft: 0,
      scrollTop: 0,
      isMobile: isMobile,
      needsVerticalDrag: needsVerticalDrag,
      dragThreshold: 5,
    });

    // Update state ref whenever state changes
    useEffect(() => {
      stateRef.current = {
        startX,
        startY,
        scrollLeft,
        scrollTop,
        isMobile,
        needsVerticalDrag,
        dragThreshold,
      };
    }, [
      startX,
      startY,
      scrollLeft,
      scrollTop,
      isMobile,
      needsVerticalDrag,
      dragThreshold,
    ]);

    // Global mouse move handler
    const handleGlobalMouseMove = useCallback((e) => {
      const {
        startX: currentStartX,
        startY: currentStartY,
        scrollLeft: currentScrollLeft,
        scrollTop: currentScrollTop,
        isMobile: currentIsMobile,
        needsVerticalDrag: currentNeedsVerticalDrag,
        dragThreshold: currentDragThreshold,
      } = stateRef.current;

      if (
        !containerRef.current ||
        (currentStartX === 0 && currentStartY === 0) ||
        currentIsMobile
      )
        return;

      e.preventDefault();
      const x = e.pageX - containerRef.current.offsetLeft;
      const y = e.pageY - containerRef.current.offsetTop;
      const distanceX = Math.abs(x - currentStartX);
      const distanceY = Math.abs(y - currentStartY);

      // For x-direction only dragging, prioritize horizontal movement
      // Only register as dragging if horizontal movement is significant OR
      // if we're on a very small landscape screen that allows vertical dragging
      let totalDistance;
      if (currentNeedsVerticalDrag) {
        // On very small landscape screens, allow both directions
        totalDistance = Math.max(distanceX, distanceY);
      } else {
        // On all other screens, prioritize x-direction dragging
        // Only consider horizontal distance for drag threshold
        totalDistance = distanceX;
      }

      if (totalDistance > currentDragThreshold) {
        setIsDragging(true);

        const container = containerRef.current;

        // Always handle horizontal dragging (x-direction)
        const walkX = (x - currentStartX) * 2;
        const newScrollLeft = currentScrollLeft - walkX;
        const maxScrollLeft = Math.max(
          0,
          container.scrollWidth - container.clientWidth
        );
        const boundedScrollLeft = Math.max(
          0,
          Math.min(newScrollLeft, maxScrollLeft)
        );
        container.scrollLeft = boundedScrollLeft;

        // Handle vertical dragging (y-direction) only on very small landscape screens
        if (currentNeedsVerticalDrag) {
          const walkY = (y - currentStartY) * 2;
          const newScrollTop = currentScrollTop - walkY;
          const maxScrollTop = Math.max(
            0,
            container.scrollHeight - container.clientHeight
          );
          const boundedScrollTop = Math.max(
            0,
            Math.min(newScrollTop, maxScrollTop)
          );
          container.scrollTop = boundedScrollTop;
        }

        setDragDistance(totalDistance);
      }
    }, []);

    // Global mouse up handler
    const handleGlobalMouseUp = useCallback(() => {
      const { isMobile: currentIsMobile } = stateRef.current;

      if (currentIsMobile) return;

      setStartX(0);
      setStartY(0);
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
      }
      setIsDragging(false);
      setTimeout(() => setDragDistance(0), 50);

      // Remove global event listeners
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [handleGlobalMouseMove]);

    const handleMouseDown = useCallback(
      (e) => {
        if (!containerRef.current || isMobile) return;

        setIsDragging(false);
        setDragDistance(0);
        const newStartX = e.pageX - containerRef.current.offsetLeft;
        const newStartY = e.pageY - containerRef.current.offsetTop;
        const newScrollLeft = containerRef.current.scrollLeft;
        const newScrollTop = containerRef.current.scrollTop;
        setStartX(newStartX);
        setStartY(newStartY);
        setScrollLeft(newScrollLeft);
        setScrollTop(newScrollTop);

        // Set cursor to grabbing with directional hint
        if (needsVerticalDrag) {
          containerRef.current.style.cursor = 'grabbing'; // Both directions on very small landscape
        } else {
          containerRef.current.style.cursor = 'grabbing'; // Primarily x-direction
        }

        e.preventDefault();

        // Add global mouse event listeners for proper drag handling
        document.addEventListener('mousemove', handleGlobalMouseMove);
        document.addEventListener('mouseup', handleGlobalMouseUp);
      },
      [isMobile, needsVerticalDrag, handleGlobalMouseMove, handleGlobalMouseUp]
    );

    const handleMouseMove = useCallback((e) => {
      // This is now handled by the global event listener
      return;
    }, []);

    const handleMouseUp = useCallback(() => {
      // This is now handled by the global event listener
      return;
    }, []);

    const handleMouseLeave = useCallback(() => {
      if (isMobile) return;
      // Clean up any ongoing drag when mouse leaves
      if (startX !== 0 || startY !== 0) {
        setStartX(0);
        setStartY(0);
        if (containerRef.current) {
          containerRef.current.style.cursor = 'grab';
        }
        setIsDragging(false);
        setDragDistance(0);

        // Remove global event listeners
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      }
    }, [isMobile, startX, startY, handleGlobalMouseMove, handleGlobalMouseUp]);

    // Touch events for mobile - use native scrolling
    const handleTouchStart = useCallback(
      (e) => {
        if (!isMobile || !containerRef.current) return;
        // For mobile, just reset any previous dragging state
        setIsDragging(false);
        setDragDistance(0);
      },
      [isMobile]
    );

    const handleTouchMove = useCallback(
      (e) => {
        // Let native scrolling handle touch moves on mobile
        if (isMobile) return;
      },
      [isMobile]
    );

    const handleTouchEnd = useCallback(() => {
      // Reset state on mobile
      if (isMobile) {
        setIsDragging(false);
        setDragDistance(0);
      }
    }, [isMobile]);

    const handleThumbnailClick = useCallback(
      (index) => {
        // On mobile or when drag distance is small, allow the click
        if (isMobile || dragDistance <= dragThreshold) {
          onThumbnailClick(index);
        }
      },
      [dragDistance, dragThreshold, onThumbnailClick, isMobile]
    );

    // Add keyboard support for scrolling thumbnails - only when focused
    const handleKeyDown = useCallback((e) => {
      if (!containerRef.current) return;

      // Only handle thumbnail scrolling if the thumbnails container is focused
      // This prevents conflicts with the main gallery navigation
      if (document.activeElement !== containerRef.current) return;

      const container = containerRef.current;
      const scrollAmount = 150; // Scroll distance in pixels
      const maxScrollLeft = Math.max(
        0,
        container.scrollWidth - container.clientWidth
      );

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          e.stopPropagation(); // Prevent the main gallery from handling this
          const newLeftScroll = Math.max(
            0,
            container.scrollLeft - scrollAmount
          );
          container.scrollTo({
            left: newLeftScroll,
            behavior: 'smooth',
          });
          break;
        case 'ArrowRight':
          e.preventDefault();
          e.stopPropagation(); // Prevent the main gallery from handling this
          const newRightScroll = Math.min(
            maxScrollLeft,
            container.scrollLeft + scrollAmount
          );
          container.scrollTo({
            left: newRightScroll,
            behavior: 'smooth',
          });
          break;
        default:
          break;
      }
    }, []);

    // Add keyboard event listener when component mounts
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      // Make container focusable and add keyboard listener
      container.tabIndex = 0;
      container.addEventListener('keydown', handleKeyDown);

      return () => {
        container.removeEventListener('keydown', handleKeyDown);
      };
    }, [handleKeyDown]);

    // Cleanup global event listeners on unmount
    useEffect(() => {
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }, [handleGlobalMouseMove, handleGlobalMouseUp]);

    // Auto-center the active thumbnail
    const centerActiveThumbnail = useCallback(() => {
      const container = containerRef.current;
      if (!container) return;

      const thumbnails = container.querySelectorAll('.thumbNailPhoto');
      const activeThumbnail = thumbnails[currentPhoto];

      if (!activeThumbnail) return;

      const containerRect = container.getBoundingClientRect();
      const thumbnailRect = activeThumbnail.getBoundingClientRect();

      // Calculate the position to center the thumbnail
      const containerCenter = containerRect.width / 2;
      const thumbnailCenter =
        thumbnailRect.left - containerRect.left + thumbnailRect.width / 2;
      const scrollOffset = thumbnailCenter - containerCenter;

      // Calculate the target scroll position
      const targetScrollLeft = container.scrollLeft + scrollOffset;

      // Ensure we don't scroll beyond boundaries
      const maxScrollLeft = Math.max(
        0,
        container.scrollWidth - container.clientWidth
      );
      let boundedScrollLeft = Math.max(
        0,
        Math.min(targetScrollLeft, maxScrollLeft)
      );

      // Special handling for first and last thumbnails to ensure they're fully visible
      if (currentPhoto === 0) {
        // For the first thumbnail, always scroll to the very beginning
        boundedScrollLeft = 0;
      } else if (currentPhoto === thumbnails.length - 1) {
        // For the last thumbnail, ensure it's fully visible
        const thumbnailRight = thumbnailRect.right - containerRect.left;
        const containerWidth = containerRect.width;
        if (thumbnailRight > containerWidth) {
          boundedScrollLeft = Math.min(
            maxScrollLeft,
            container.scrollLeft + (thumbnailRight - containerWidth) + 10
          );
        }
      }

      // Only scroll if we're not already in the right position
      const threshold = 5;
      const currentScrollDiff = Math.abs(
        container.scrollLeft - boundedScrollLeft
      );
      if (currentScrollDiff > threshold) {
        container.scrollTo({
          left: boundedScrollLeft,
          behavior: 'smooth',
        });
      }
    }, [currentPhoto]);

    // Center the thumbnail when currentPhoto changes
    useEffect(() => {
      // Use a slightly longer delay to ensure DOM and CSS have updated
      const timeoutId = setTimeout(centerActiveThumbnail, 150);
      return () => clearTimeout(timeoutId);
    }, [currentPhoto, centerActiveThumbnail]);

    // Force scroll to beginning when component mounts or gallery changes
    useEffect(() => {
      const container = containerRef.current;
      if (container && galleryTypeArr.length > 0) {
        // Force immediate scroll to position 0 without animation
        container.scrollLeft = 0;
        // Also ensure the container is properly positioned
        setTimeout(() => {
          container.scrollLeft = 0;
        }, 100);
      }
    }, [galleryTypeArr]);

    return (
      <div
        ref={containerRef}
        className="thumbNails"
        style={{
          cursor: isMobile ? 'default' : 'grab',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          msUserSelect: 'none',
          outline: 'none', // Remove default focus outline
          // Enhanced dragging behavior: x-direction primary, y-direction on very small landscape only
          touchAction: isMobile ? 'pan-x' : 'none', // Native x-scroll on mobile, custom on desktop
        }}
        tabIndex={isMobile ? -1 : 0} // Only focusable on desktop
        onMouseDown={isMobile ? undefined : handleMouseDown}
        onMouseMove={isMobile ? undefined : handleMouseMove}
        onMouseUp={isMobile ? undefined : handleMouseUp}
        onMouseLeave={isMobile ? undefined : handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {galleryTypeArr.map((image, index) => (
          <Thumbnail
            key={index}
            image={image}
            index={index}
            currentPhoto={currentPhoto}
            onClick={(clickedIndex) => handleThumbnailClick(clickedIndex)}
            isLoaded={isImageLoaded(image.img)}
          />
        ))}
      </div>
    );
  }
);

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
        maxHeight: showDetails ? '90vh' : '0%', // Use VH for Safari compatibility
        overflowY: showDetails ? 'auto' : 'hidden',
        zIndex: 10000,
        background: 'rgba(245, 245, 245, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)', // Safari compatibility
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
  onClose,
}) {
  const [startY, setStartY] = useState(null);
  const infoRef = useRef(null);
  const swipeThreshold = 50;
  const [isHovering, setIsHovering] = useState(false);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const galleryLengthRef = useRef(0); // Add ref to track gallery length
  const prevGalleryTypeRef = useRef(null); // Track previous gallery type

  // Track aspect ratio for dynamic container sizing (desktop)
  const [imgAspect, setImgAspect] = useState(1.4); // default aspect ratio

  // Loading state for smooth transitions
  const [imageLoading, setImageLoading] = useState(false);

  // Enhanced touch state for master image (mobile) with @use-gesture
  const [touchTransform, setTouchTransform] = useState({ 
    x: 0, 
    y: 0, 
    scale: 1.15 
  });
  const [isGestureActive, setIsGestureActive] = useState(false);
  const PAN_MARGIN = 60;
  const MIN_SCALE = 1.0;
  const MAX_SCALE = 3.0;

  // Animated transform state using react-spring for smooth gestures
  const [mobileImageSpring, mobileImageApi] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1.15,
    config: {
      tension: 300,
      friction: 40,
      mass: 1,
      precision: 0.01,
    },
  }));

  // Use-gesture pinch and drag handlers
  const bind = useGesture(
    {
      onDrag: ({ offset: [x, y], pinching, cancel, ...state }) => {
        // Don't drag while pinching
        if (pinching) return cancel();
        
        // Apply boundaries
        const container = imageContainerRef.current;
        if (container) {
          const { minPanX, maxPanX, minPanY, maxPanY } = getPanBoundsWithScale(
            container,
            imageRef.current,
            touchTransform.scale,
            PAN_MARGIN
          );
          
          const boundedX = Math.max(Math.min(x, maxPanX), minPanX);
          const boundedY = Math.max(Math.min(y, maxPanY), minPanY);
          
          setTouchTransform(prev => ({ ...prev, x: boundedX, y: boundedY }));
          mobileImageApi.start({ x: boundedX, y: boundedY, immediate: state.dragging });
        }
      },
      onPinch: ({ origin: [ox, oy], offset: [scale], ...state }) => {
        setIsGestureActive(state.pinching);
        
        // Constrain scale with rubber band effect
        let constrainedScale = scale;
        if (scale < MIN_SCALE) {
          const overshoot = MIN_SCALE - scale;
          constrainedScale = MIN_SCALE - (overshoot * 0.3);
        } else if (scale > MAX_SCALE) {
          const overshoot = scale - MAX_SCALE;
          constrainedScale = MAX_SCALE + (overshoot * 0.3);
        }
        
        // Calculate pan adjustment to zoom around the pinch point
        const container = imageContainerRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          
          // Convert origin to container-relative coordinates
          const originX = ox - containerRect.left;
          const originY = oy - containerRect.top;
          
          // Calculate offset from center
          const centerX = containerRect.width / 2;
          const centerY = containerRect.height / 2;
          const offsetX = originX - centerX;
          const offsetY = originY - centerY;
          
          // Calculate pan adjustment based on scale change
          const scaleChange = constrainedScale - touchTransform.scale;
          const panAdjustX = -offsetX * scaleChange / constrainedScale;
          const panAdjustY = -offsetY * scaleChange / constrainedScale;
          
          let newX = touchTransform.x + panAdjustX;
          let newY = touchTransform.y + panAdjustY;
          
          // Apply boundaries
          const { minPanX, maxPanX, minPanY, maxPanY } = getPanBoundsWithScale(
            container,
            imageRef.current,
            constrainedScale,
            PAN_MARGIN
          );
          
          newX = Math.max(Math.min(newX, maxPanX), minPanX);
          newY = Math.max(Math.min(newY, maxPanY), minPanY);
          
          setTouchTransform({ x: newX, y: newY, scale: constrainedScale });
          mobileImageApi.start({ 
            x: newX, 
            y: newY, 
            scale: constrainedScale,
            immediate: state.pinching 
          });
        }
      },
      onWheelEnd: () => {
        // Smooth finish when gesture ends
        mobileImageApi.start({ 
          x: touchTransform.x, 
          y: touchTransform.y, 
          scale: touchTransform.scale,
          immediate: false 
        });
      }
    },
    {
      drag: {
        from: () => [touchTransform.x, touchTransform.y],
        enabled: window.innerWidth < window.innerHeight, // Only on mobile portrait
      },
      pinch: {
        scaleBounds: { min: MIN_SCALE * 0.5, max: MAX_SCALE * 1.5 },
        rubberband: true,
        from: () => [touchTransform.scale, 0],
        enabled: window.innerWidth < window.innerHeight, // Only on mobile portrait
      },
    }
  );

  // Double-tap to reset (we'll handle this separately)
  const [lastTap, setLastTap] = useState(0);
  const handleImageTap = useCallback((e) => {
    if (window.innerWidth >= window.innerHeight) return; // Only on mobile
    
    const now = Date.now();
    if (now - lastTap < 300) {
      // Double tap - reset
      const resetTransform = { x: 0, y: 0, scale: 1.15 };
      setTouchTransform(resetTransform);
      setIsGestureActive(false);
      
      mobileImageApi.start({
        x: 0,
        y: 0,
        scale: 1.15,
        immediate: false,
        config: {
          tension: 160,
          friction: 20,
          mass: 1.2,
        },
      });
    }
    setLastTap(now);
  }, [lastTap, mobileImageApi]);

  // Initialize image preloader
  const {
    preloadingState,
    isImageLoaded,
    isGalleryTypeLoaded,
    preloadGalleryType,
    isPreloading,
  } = useImagePreloader(showGalleryString, showGallery);

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
    config: {
      tension: 25, // Reduced tension for slower, more deliberate movement
      friction: 90, // Higher friction for smoother control
      mass: 2.0, // Higher mass for more weighted, deliberate feel
      precision: 0.01, // Higher precision to reduce micro-animations
    },
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
          preloaded: isImageLoaded(img.src) ? '✅' : '❌',
        });
      }
      setImgAspect(aspectRatio);
      setImageLoading(false); // Image finished loading

      // Ensure transform is reset after image loads to prevent conflicts
      if (!isHovering) {
        imageApi.set({ transform: 'translate(0%, 0%) scale(1)' });
        currentTransformRef.current = 'translate(0%, 0%) scale(1)';
      }
    },
    [imgAspect, isImageLoaded, isHovering, imageApi]
  );

  // Enhanced touch handling with gesture support
  useEffect(() => {
    const imageContainer = imageContainerRef.current;
    if (!imageContainer || window.innerWidth >= window.innerHeight) return;

    let initialTouchDistance = null;
    let initialScale = 1.15;
    let lastTouchCenter = null;
    let gestureStartTransform = null;
    let lastTapTime = 0;
    let tapTimeout = null;

    // Calculate distance between two touches
    const getTouchDistance = (touches) => {
      if (touches.length < 2) return null;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Calculate center point between touches
    const getTouchCenter = (touches) => {
      if (touches.length === 1) {
        return { x: touches[0].clientX, y: touches[0].clientY };
      }
      if (touches.length === 2) {
        return {
          x: (touches[0].clientX + touches[1].clientX) / 2,
          y: (touches[0].clientY + touches[1].clientY) / 2,
        };
      }
      return null;
    };

    // Double-tap to reset zoom and pan only (not navigation)
    const handleDoubleTap = () => {
      const resetTransform = { x: 0, y: 0, scale: 1.15 };
      setTouchTransform(resetTransform);
      setIsGestureActive(false);
      
      // Smooth reset animation (no navigation change)
      mobileImageApi.start({
        transform: `translate(0px, 0px) scale(1.15)`,
        immediate: false,
        config: {
          tension: 160,
          friction: 20,
          mass: 1.2,
        },
      });
    };

    // Enhanced touchmove handler with smooth real-time zoom
    const handleTouchMove = (e) => {
      if (!isMobileDevice()) return;

      const touches = e.touches;
      if (touches.length === 0) return;

      e.preventDefault(); // Prevent default browser gestures

      const currentTouchCenter = getTouchCenter(touches);
      if (!currentTouchCenter) return;

      // Handle pinch-to-zoom with two fingers - REAL-TIME SCALING
      if (touches.length === 2) {
        const currentDistance = getTouchDistance(touches);
        
        if (initialTouchDistance && currentDistance && gestureStartTransform) {
          // Calculate scale change directly from finger distance
          const scaleChange = currentDistance / initialTouchDistance;
          let newScale = gestureStartTransform.scale * scaleChange;
          
          // Add resistance near limits for natural feel
          const rawScale = newScale;
          if (rawScale < MIN_SCALE) {
            // Rubber band effect when zooming out too far
            const overshoot = MIN_SCALE - rawScale;
            newScale = MIN_SCALE - (overshoot * 0.3); // 30% resistance
          } else if (rawScale > MAX_SCALE) {
            // Rubber band effect when zooming in too far
            const overshoot = rawScale - MAX_SCALE;
            newScale = MAX_SCALE + (overshoot * 0.3); // 30% resistance
          }
          
          // Final hard constraints (in case resistance isn't enough)
          newScale = Math.max(MIN_SCALE * 0.8, Math.min(MAX_SCALE * 1.2, newScale));
          
          // Proper zoom-to-point calculation
          const container = imageContainer.getBoundingClientRect();
          
          // Get the touch point relative to the current image position
          const touchX = currentTouchCenter.x - container.left;
          const touchY = currentTouchCenter.y - container.top;
          
          // Calculate the point in the image coordinate system (before scaling)
          const imagePointX = (touchX - gestureStartTransform.x) / gestureStartTransform.scale;
          const imagePointY = (touchY - gestureStartTransform.y) / gestureStartTransform.scale;
          
          // Calculate where this point should be after scaling
          const newImagePointX = imagePointX * newScale;
          const newImagePointY = imagePointY * newScale;
          
          // Calculate the new pan to keep the touch point in the same screen position
          let newX = touchX - newImagePointX;
          let newY = touchY - newImagePointY;

          // Apply boundaries for panning with current scale
          const { minPanX, maxPanX, minPanY, maxPanY } = getPanBoundsWithScale(
            imageContainer,
            imageRef.current,
            newScale,
            PAN_MARGIN
          );

          newX = Math.max(Math.min(newX, maxPanX), minPanX);
          newY = Math.max(Math.min(newY, maxPanY), minPanY);

          // Update state and animate immediately for real-time feel
          const newTransform = `translate(${newX}px, ${newY}px) scale(${newScale})`;
          
          setTouchTransform({ x: newX, y: newY, scale: newScale });
          
          // Use immediate update for real-time gesture tracking with slight smoothing
          mobileImageApi.start({
            transform: newTransform,
            immediate: false, // Use slight smoothing for more natural feel
            config: {
              tension: 400, // Higher tension for more responsive feel
              friction: 50,  // Balanced friction
              mass: 0.5,     // Lower mass for quicker response
              precision: 0.001, // Higher precision for smooth scaling
            },
          });
          
          setIsGestureActive(true);
        }
      }
      // Handle single finger panning - SMOOTH AND RESPONSIVE
      else if (touches.length === 1 && lastTouchCenter) {
        const dx = currentTouchCenter.x - lastTouchCenter.x;
        const dy = currentTouchCenter.y - lastTouchCenter.y;

        setTouchTransform((prev) => {
          const dampingFactor = 1.0; // Full responsiveness for panning
          const newX = prev.x + dx * dampingFactor;
          const newY = prev.y + dy * dampingFactor;

          // Apply boundaries with current scale
          const { minPanX, maxPanX, minPanY, maxPanY } = getPanBoundsWithScale(
            imageContainer,
            imageRef.current,
            prev.scale,
            PAN_MARGIN
          );

          const boundedX = Math.max(Math.min(newX, maxPanX), minPanX);
          const boundedY = Math.max(Math.min(newY, maxPanY), minPanY);

          // Update spring animation with slight smoothing for natural panning
          const newTransform = `translate(${boundedX}px, ${boundedY}px) scale(${prev.scale})`;
          mobileImageApi.start({
            transform: newTransform,
            immediate: false, // Slight smoothing for more natural panning
            config: {
              tension: 350,
              friction: 45,
              mass: 0.6,
              precision: 0.01,
            },
          });

          return {
            x: boundedX,
            y: boundedY,
            scale: prev.scale,
          };
        });
      }

      lastTouchCenter = currentTouchCenter;
    };

    // Touch start handler
    const handleTouchStart = (e) => {
      if (!isMobileDevice()) return;

      const touches = e.touches;
      const currentTime = Date.now();
      lastTouchCenter = getTouchCenter(touches);
      
      if (touches.length === 2) {
        // Start pinch gesture
        initialTouchDistance = getTouchDistance(touches);
        gestureStartTransform = { ...touchTransform }; // Use state directly
        setIsGestureActive(true);
      } else if (touches.length === 1) {
        // Handle double-tap detection
        if (currentTime - lastTapTime < 300) {
          // Double tap detected
          if (tapTimeout) {
            clearTimeout(tapTimeout);
            tapTimeout = null;
          }
          handleDoubleTap();
        } else {
          // Single tap - wait to see if it becomes a double tap
          tapTimeout = setTimeout(() => {
            // Single tap confirmed - start pan gesture
            gestureStartTransform = { ...touchTransform }; // Use state directly
            setIsGestureActive(false);
            tapTimeout = null;
          }, 300);
        }
        lastTapTime = currentTime;
      }
    };

    // Touch end handler with smooth finish animations
    const handleTouchEnd = (e) => {
      if (!isMobileDevice()) return;

      const touches = e.touches;
      
      if (touches.length === 0) {
        // All touches ended - add smooth finish animation
        const currentTransform = `translate(${touchTransform.x}px, ${touchTransform.y}px) scale(${touchTransform.scale})`;
        
        // Smooth animation when gesture completes
        mobileImageApi.start({
          transform: currentTransform,
          immediate: false, // Enable smooth animation on release
          config: {
            tension: 180,
            friction: 25,
            mass: 1,
          },
        });
        
        initialTouchDistance = null;
        lastTouchCenter = null;
        gestureStartTransform = null;
        setIsGestureActive(false);
      } else if (touches.length === 1 && initialTouchDistance) {
        // Switched from pinch to pan - smooth transition
        initialTouchDistance = null;
        gestureStartTransform = { ...touchTransform }; // Use state directly
        lastTouchCenter = getTouchCenter(touches);
        
        // Add a subtle spring animation for the transition
        const currentTransform = `translate(${touchTransform.x}px, ${touchTransform.y}px) scale(${touchTransform.scale})`;
        mobileImageApi.start({
          transform: currentTransform,
          immediate: false,
          config: {
            tension: 220,
            friction: 30,
            mass: 0.8,
          },
        });
      }
    };

    // Add touch event listeners
    imageContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    imageContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    imageContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
    imageContainer.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      if (tapTimeout) {
        clearTimeout(tapTimeout);
      }
      imageContainer.removeEventListener('touchstart', handleTouchStart);
      imageContainer.removeEventListener('touchmove', handleTouchMove);
      imageContainer.removeEventListener('touchend', handleTouchEnd);
      imageContainer.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [showGallery, currentPhoto, touchTransform, mobileImageApi]); // Restore proper dependencies

  // Reset aspect ratio when current photo changes
  useEffect(() => {
    // Reset to default aspect ratio when photo changes, will be updated by handleImageLoad
    setImgAspect(1.4);
    setImageLoading(true); // Start loading state

    // Reset hover state and image transform when photo changes
    setIsHovering(false);
    currentTransformRef.current = 'translate(0%, 0%) scale(1)';

    // Use set instead of start to avoid animation conflicts during image transitions
    imageApi.set({
      transform: 'translate(0%, 0%) scale(1)',
    });
  }, [currentPhoto, imageApi]); // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Force a re-render on resize to update container dimensions
      // This is especially important for orientation changes
      setIsHovering(false);
      currentTransformRef.current = 'translate(0%, 0%) scale(1)';

      // Use set instead of start to avoid animation conflicts during resize
      imageApi.set({
        transform: 'translate(0%, 0%) scale(1)',
      });

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
  }, [imageApi]);

  // Keyboard navigation with useCallback to ensure stable function reference
  const handleKeyDown = useCallback(
    (e) => {
      if (!showGallery) return; // Only handle keys when gallery is open

      console.log(
        'Key pressed:',
        e.key,
        'showGallery:',
        showGallery,
        'galleryLength:',
        galleryLengthRef.current,
        'currentPhoto:',
        currentPhoto
      );

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          const currentLength = galleryLengthRef.current;
          if (currentLength === 0) return;
          const newLeftIndex =
            currentPhoto > 0 ? currentPhoto - 1 : currentLength - 1;
          console.log(
            'Arrow Left/Up: current =',
            currentPhoto,
            'length =',
            currentLength,
            'new =',
            newLeftIndex
          );
          setCurrentPhoto(newLeftIndex);
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          const currentLength2 = galleryLengthRef.current;
          if (currentLength2 === 0) return;
          const newRightIndex =
            currentPhoto < currentLength2 - 1 ? currentPhoto + 1 : 0;
          console.log(
            'Arrow Right/Down: current =',
            currentPhoto,
            'length =',
            currentLength2,
            'new =',
            newRightIndex
          );
          setCurrentPhoto(newRightIndex);
          break;
        case 'Escape':
          e.preventDefault();
          console.log('Escape pressed - closing gallery');
          if (onClose) {
            onClose();
          }
          break;
      }
    },
    [showGallery, setCurrentPhoto, currentPhoto]
  );

  useEffect(() => {
    console.log('Setting up keyboard listener, showGallery:', showGallery);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      console.log('Cleaning up keyboard listener');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]); // Depend on the memoized callback

  // Memoized gallery type filtering
  useEffect(() => {
    const newGalleryTypeArr = images.filter(
      (image) => image.type === showGalleryString
    );

    // Debug: log what is being compared
    if (process.env.NODE_ENV !== 'production') {
      console.log('Filtering gallery:', {
        showGalleryString,
        prevGalleryType: prevGalleryTypeRef.current,
        typesInImages: Array.from(new Set(images.map((img) => img.type))),
        newGalleryTypeArr,
      });
    }

    // Only update if the gallery type has actually changed
    if (prevGalleryTypeRef.current !== showGalleryString) {
      console.log(
        'Gallery type changed, updating array and resetting to first photo'
      );
      setGalleryTypeArr(newGalleryTypeArr);
      galleryLengthRef.current = newGalleryTypeArr.length; // Update ref
      setCurrentPhoto(0); // Only reset when gallery type actually changes
      prevGalleryTypeRef.current = showGalleryString; // Update ref
      // Reset aspect ratio to default when gallery type changes
      setImgAspect(1.4);
    } else {
      console.log('Gallery type unchanged, keeping current photo');
    }
  }, [
    galleryType,
    showGalleryString,
    // Removed setGalleryTypeArr, setCurrentPhoto, and galleryTypeArr to prevent unnecessary re-runs
  ]);

  // Keep ref in sync with array length
  useEffect(() => {
    galleryLengthRef.current = galleryTypeArr.length;
    console.log('Gallery length updated:', galleryTypeArr.length);
  }, [galleryTypeArr.length]);

  // Debug: log currentPhoto changes
  useEffect(() => {
    console.log('Current photo changed to:', currentPhoto);
  }, [currentPhoto]);

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
      // For mobile, just log the click - remove info panel functionality to simplify
      console.log('Mobile image clicked');
      // setShowDetails(!showDetails);
      // setShowInfographic(!showInfographic);
    }
  }, []);

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

  // Add refs for throttling mouse movement
  const lastMouseMoveTime = useRef(0);
  const throttleDelay = 8; // Reduced throttle for smoother movement
  const currentTransformRef = useRef('translate(0%, 0%) scale(1)');
  const animationFrameRef = useRef(null);

  // Image hover/pan functionality
  const handleImageMouseMove = useCallback(
    (e) => {
      if (
        !imageContainerRef.current ||
        window.innerWidth < window.innerHeight ||
        !isHovering
      )
        return;

      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Use requestAnimationFrame for smoother movement
      animationFrameRef.current = requestAnimationFrame(() => {
        const container = imageContainerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();

        // Calculate relative position (0 to 1)
        const relativeX = Math.max(
          0,
          Math.min(1, (e.clientX - rect.left) / rect.width)
        );
        const relativeY = Math.max(
          0,
          Math.min(1, (e.clientY - rect.top) / rect.height)
        );

        // Calculate the maximum translation based on the image size vs container
        // We want to be able to move the image around to see all parts
        const maxTranslateX = 15; // Reduced for more subtle, deliberate movement
        const maxTranslateY = 15; // Reduced for more subtle, deliberate movement

        // Calculate the actual translation with smooth interpolation
        const translateX = maxTranslateX * (0.5 - relativeX) * 2;
        const translateY = maxTranslateY * (0.5 - relativeY) * 2;

        const newTransform = `translate(${translateX}%, ${translateY}%) scale(1.15)`;

        // Only update if the transform has changed significantly
        if (currentTransformRef.current !== newTransform) {
          currentTransformRef.current = newTransform;

          // Use React Spring API directly for smooth, deliberate panning
          imageApi.start({
            transform: newTransform,
            immediate: false, // Ensure smooth animation
            config: {
              tension: 25, // Reduced tension for slower, more deliberate movement
              friction: 90, // Higher friction for smoother, more controlled movement
              mass: 2.0, // Higher mass for more deliberate, weighted feel
            },
          });
        }
      });
    },
    [isHovering, imageApi]
  );

  const handleImageMouseEnter = useCallback(() => {
    // Only enable hover effects on desktop (not on mobile devices)
    if (window.innerWidth >= window.innerHeight && window.innerWidth >= 768) {
      // Cancel any pending leave timeout to prevent race conditions
      if (hoverLeaveTimeoutRef.current) {
        clearTimeout(hoverLeaveTimeoutRef.current);
        hoverLeaveTimeoutRef.current = null;
      }
      setIsHovering(true);
    }
  }, []);

  const hoverLeaveTimeoutRef = useRef(null);

  const handleImageMouseLeave = useCallback(() => {
    // Use a small delay to prevent flashing when mouse briefly leaves and re-enters
    hoverLeaveTimeoutRef.current = setTimeout(() => {
      setIsHovering(false);

      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      currentTransformRef.current = 'translate(0%, 0%) scale(1)';
      // Use React Spring API directly for smooth return to center
      imageApi.start({
        transform: 'translate(0%, 0%) scale(1)',
        immediate: false, // Ensure smooth animation
        config: {
          tension: 25, // Slower return for more deliberate feel
          friction: 85, // Higher friction for smoother controlled return
          mass: 2.0, // Higher mass for more weighted, deliberate return
        },
      });
      hoverLeaveTimeoutRef.current = null;
    }, 50); // Small delay to prevent flashing
  }, [imageApi]);

  // Handle initial hover state change
  useEffect(() => {
    if (isHovering) {
      // Start with initial scale-up, position will be handled by mouse move
      const initialTransform = 'translate(0%, 0%) scale(1.15)';
      currentTransformRef.current = initialTransform;
      imageApi.start({
        transform: initialTransform,
        immediate: false, // Ensure smooth animation
        config: {
          tension: 30, // Reduced tension for more deliberate initial scale
          friction: 85, // Higher friction for controlled scaling
          mass: 1.8, // Higher mass for more deliberate feel
          precision: 0.01, // Higher precision
        },
      });
    }
    // Mouse leave handler already takes care of the exit animation
  }, [isHovering, imageApi]);

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
  const MOBILE_CONTAINER_HEIGHT = 0.5; // 50vh (Safari compatible)

  // Utility to detect Safari browser
  function isSafari() {
    return (
      typeof window !== 'undefined' &&
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    );
  }

  // Utility to detect iOS Safari specifically
  function isiOSSafari() {
    return (
      typeof window !== 'undefined' &&
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !window.MSStream &&
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    );
  }

  // Utility to detect mobile devices with Safari-specific handling
  function isMobileDevice() {
    if (typeof window === 'undefined') return false;

    // Safari iOS specific detection
    if (isiOSSafari()) return true;

    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.userAgent.toLowerCase().includes('mobi')
    );
  }

  // Calculate pan boundaries for mobile image panning with scale support
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

  // Enhanced pan boundaries calculation with scale factor
  function getPanBoundsWithScale(container, image, scale = 1, margin = 0) {
    if (!container || !image)
      return { minPanX: 0, maxPanX: 0, minPanY: 0, maxPanY: 0 };

    const containerRect = container.getBoundingClientRect();
    
    // Calculate effective image dimensions with scale
    const baseImageWidth = containerRect.width; 
    const baseImageHeight = containerRect.height; 
    const scaledImageWidth = baseImageWidth * scale;
    const scaledImageHeight = baseImageHeight * scale;

    // Calculate how much the scaled image overflows the container
    const overflowX = Math.max(0, scaledImageWidth - containerRect.width);
    const overflowY = Math.max(0, scaledImageHeight - containerRect.height);

    // Pan bounds are half the overflow (since image is centered) plus margin
    const maxPanX = (overflowX / 2) + margin;
    const minPanX = -maxPanX;
    const maxPanY = (overflowY / 2) + margin;
    const minPanY = -maxPanY;

    return { minPanX, maxPanX, minPanY, maxPanY };
  }

  // Reset transform when image changes with immediate state and animation sync
  useEffect(() => {
    const resetTransform = { x: 0, y: 0, scale: 1.15 };
    setTouchTransform(resetTransform);
    setIsGestureActive(false);
    
    if (window.innerWidth < window.innerHeight) {
      // Immediate reset for mobile
      mobileImageApi.start({
        transform: `translate(0px, 0px) scale(1.15)`,
        immediate: true, // Immediate reset when changing images
      });
    }
  }, [currentPhoto, mobileImageApi]);

  const currentItem = galleryTypeArr[currentPhoto] || galleryTypeArr[0];

  // Debug logging for Safari
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Gallery component state:', {
        showGallery,
        galleryTypeArr: galleryTypeArr?.length || 0,
        currentPhoto,
        currentItem: currentItem?.name || 'none',
        windowDimensions:
          typeof window !== 'undefined'
            ? {
                width: window.innerWidth,
                height: window.innerHeight,
                orientation:
                  window.innerWidth > window.innerHeight
                    ? 'landscape'
                    : 'portrait',
              }
            : 'no window',
      });
    }
  }, [showGallery, galleryTypeArr, currentPhoto, currentItem]);

  // Helper function to calculate container dimensions
  const calculateImageDimensions = useCallback(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isPortrait = screenHeight > screenWidth;

    // Different calculations based on screen size and orientation
    const isSmallMobile = screenWidth <= 480;
    const isMobileLandscape =
      screenWidth >= 600 && screenWidth <= 768 && !isPortrait;
    const isTablet = screenWidth >= 768 && screenWidth <= 1024;
    const isSmallLaptop = screenWidth >= 1200 && screenWidth <= 1439;
    const isLargeDesktop = screenWidth >= 1440 && screenWidth <= 1919;
    const isUltraWide = screenWidth >= 1920;

    let maxW, maxH;

    if (isPortrait && screenWidth < 768) {
      // Mobile portrait - handled in CSS
      return { width: screenWidth, height: screenHeight * 0.5 };
    } else if (isMobileLandscape) {
      // Mobile landscape - compact layout
      maxW = screenWidth * 0.75;
      maxH = screenHeight * 0.9;
    } else if (isTablet) {
      // Tablet - balanced layout
      maxW = screenWidth * 0.65;
      maxH = screenHeight * 0.8;
    } else if (isSmallLaptop) {
      // Small laptop - good balance
      maxW = screenWidth * 0.68;
      maxH = screenHeight * 0.82;
    } else if (isLargeDesktop) {
      // Large desktop - maximize space
      maxW = screenWidth * 0.72;
      maxH = screenHeight * 0.85;
    } else if (isUltraWide) {
      // Ultra-wide - prevent too wide images
      maxW = Math.min(screenWidth * 0.75, 1400); // Cap at reasonable width
      maxH = screenHeight * 0.9;
    } else {
      // Default fallback
      maxW = screenWidth * 0.85;
      maxH = screenHeight * 0.8;
    }

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
    config: { tension: 200, friction: 30 }, // Faster transitions to reduce conflict time
    immediate: false, // Ensure smooth transitions
    onStart: () => {
      // Reset image transform when starting new image transition to prevent conflicts
      if (!isHovering) {
        imageApi.set({ transform: 'translate(0%, 0%) scale(1)' });
        currentTransformRef.current = 'translate(0%, 0%) scale(1)';
      }
    },
  });

  // Safari iOS debugging and compatibility
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Log browser info for debugging Safari issues
    if (process.env.NODE_ENV !== 'production') {
      console.log('Browser detection:', {
        userAgent: navigator.userAgent,
        isSafari: isSafari(),
        isiOSSafari: isiOSSafari(),
        isMobile: isMobileDevice(),
        viewport: {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          visualViewport: window.visualViewport
            ? {
                width: window.visualViewport.width,
                height: window.visualViewport.height,
              }
            : 'not supported',
        },
      });
    }

    // Safari iOS specific viewport handling
    if (isiOSSafari()) {
      // Force a reflow to fix Safari iOS rendering issues
      document.body.style.height = window.innerHeight + 'px';

      // Handle viewport changes on Safari iOS
      const handleViewportChange = () => {
        if (window.visualViewport) {
          document.body.style.height = window.visualViewport.height + 'px';
        }
      };

      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleViewportChange);
        return () => {
          window.visualViewport.removeEventListener(
            'resize',
            handleViewportChange
          );
        };
      }
    }
  }, []);

  return (
    <animated.div
      className="galleryContainer"
      style={{
        ...gallerySpring,
        width: '100vw', // Use standard viewport units for better compatibility
        height: '100vh', // Use standard viewport units for better compatibility
        opacity: showGallery ? 1 : 0,
        zIndex: showGallery ? 20000 : 0, // Use CSS media queries to control z-index
        /* Prevent pull-to-refresh on mobile devices */
        overscrollBehavior: 'none',
        WebkitOverscrollBehavior: 'none',
        touchAction: 'pan-x pan-y',
      }}
    >
      {/* Debug info for Safari - remove in production */}
      {process.env.NODE_ENV !== 'production' && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '5px',
            fontSize: '12px',
            zIndex: 99999,
            borderRadius: '3px',
          }}
        >
          Safari Debug: {galleryTypeArr?.length || 0} items | Current:{' '}
          {currentPhoto} | Browser:{' '}
          {isiOSSafari() ? 'iOS Safari' : isSafari() ? 'Safari' : 'Other'}
        </div>
      )}

      {/* Mobile Three-Section Layout: Thumbnails (order: 1) → Photo (order: 2) → Text (order: 3) */}

      {/* 1. Thumbnails Section / Desktop Left Panel */}
      <div className="productPanel">
        <DraggableThumbnails
          galleryTypeArr={galleryTypeArr}
          currentPhoto={currentPhoto}
          onThumbnailClick={handleThumbnailClick}
          isImageLoaded={isImageLoaded}
        />

        {/* Desktop Product Info (inside productPanel for desktop layout) */}
        <div className="productInfo desktop-only">
          <div className="furnitureName">{currentItem?.name}</div>
          <div className="furnitureDescription">{currentItem?.description}</div>
        </div>
      </div>

      {/* 2. Photo Section */}
      <div
        onClick={handleMasterImageClick}
        className="currentPhoto"
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
                    ? '40vh' // Further reduced to 40vh to match CSS for more text space
                    : `${calculateImageDimensions().height}px`,
                margin: '0 auto',
                zIndex: 1,
                overflow: 'hidden',
                cursor:
                  window.innerWidth >= window.innerHeight &&
                  window.innerWidth >= 768
                    ? 'zoom-in'
                    : 'pointer',
                touchAction:
                  window.innerWidth < window.innerHeight ? 'none' : 'auto', // Prevents browser gestures like pull-to-refresh on mobile only
              }}
              onMouseMove={handleImageMouseMove}
              onMouseEnter={handleImageMouseEnter}
              onMouseLeave={handleImageMouseLeave}
              onTouchStart={
                window.innerWidth < window.innerHeight
                  ? undefined // Touch handling is now managed by useEffect
                  : undefined
              }
              onTouchEnd={
                window.innerWidth < window.innerHeight
                  ? undefined // Touch handling is now managed by useEffect
                  : undefined
              }
              onTouchCancel={
                window.innerWidth < window.innerHeight
                  ? undefined // Touch handling is now managed by useEffect
                  : undefined
              }
            >
              {imageTransitions((style, item) =>
                item ? (
                  <animated.img
                    key={`${item}-${currentPhoto}`} // More specific key to force re-mount
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
                      // Apply transforms with smooth animations on mobile, static transforms on desktop
                      transform:
                        window.innerWidth < window.innerHeight
                          ? mobileImageSpring.transform // Use animated spring transform
                          : imageSpring.transform ||
                            'translate(0%, 0%) scale(1)',
                      // Ensure stable willChange for performance
                      willChange: 'transform',
                      // Force hardware acceleration
                      backfaceVisibility: 'hidden',
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

              {/* Show enhanced movement indicator (pan + zoom) on mobile, magnifying glass on desktop */}
              {window.innerWidth < 700 &&
              window.innerWidth < window.innerHeight ? (
                <div
                  className="moveIndicator"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(255, 255, 255, 0.90)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.25)',
                    zIndex: 300000,
                    opacity: isGestureActive ? 0.4 : 0.8,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                    fontSize: '8px',
                    color: '#774728',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    lineHeight: '1.1',
                    maxWidth: '60px',
                  }}
                >
                  {/* Pan + Zoom + Double-tap indicator with zoom level */}
                  <div style={{ fontSize: '16px', marginBottom: '2px' }}>🤏</div>
                  <div style={{ fontSize: '9px' }}>{(touchTransform.scale).toFixed(1)}x</div>
                  <div style={{ fontSize: '7px', opacity: 0.8 }}>ZOOM</div>
                  <div style={{ fontSize: '6px', marginTop: '1px', opacity: 0.8 }}>
                    Tap×2 reset view
                  </div>
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
          </>
        )}
      </div>

      {/* 3. Mobile-Only Product Info Section (separate for mobile three-section layout) */}
      <div className="productInfo mobile-only">
        <div className="furnitureName">{currentItem?.name}</div>
        <div className="furnitureDescription">{currentItem?.description}</div>
      </div>

      {/* Legacy Mobile Info Panel (swipe-up overlay) - Hidden by default in three-section layout */}
      <MobileInfoPanel
        infoSpring={infoSpring}
        infoRef={infoRef}
        showDetails={false} // Always hidden for three-section layout
        currentItem={currentItem}
      />

      {/* Swipe indicator for legacy mobile info panel - Hidden by default */}
      <animated.div
        className="swipeIndicator"
        style={{
          ...indicatorSpring,
          position: 'fixed',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20002,
          display: 'none', // Hidden for three-section layout
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="arrow">⬆</div>
      </animated.div>
    </animated.div>
  );
}
