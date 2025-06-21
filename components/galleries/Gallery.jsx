import './gallery.css';
import imgData from './imgData';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useSpring, animated, useTransition } from '@react-spring/web';
import { useImagePreloader } from './useImagePreloader';
import { useGesture } from '@use-gesture/react';

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

// Enhanced DraggableThumbnails with @use-gesture/react
const DraggableThumbnails = memo(
  ({ galleryTypeArr, currentPhoto, onThumbnailClick, isImageLoaded }) => {
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;

    // Unified gesture handling for thumbnails
    const bind = useGesture(
      {
        onDrag: ({ offset: [x], dragging, cancel, distance }) => {
          if (!containerRef.current) return;

          const container = containerRef.current;
          const maxScrollLeft = Math.max(
            0,
            container.scrollWidth - container.clientWidth
          );

          // Convert drag offset to scroll position
          const newScrollLeft = Math.max(0, Math.min(-x, maxScrollLeft));
          container.scrollLeft = newScrollLeft;

          // Set dragging state based on distance threshold
          setIsDragging(distance > 5);
        },
        onDragEnd: () => {
          setTimeout(() => setIsDragging(false), 50);
        },
      },
      {
        drag: {
          from: () => [-containerRef.current?.scrollLeft || 0, 0],
          axis: 'x',
          enabled: !isMobile, // Use native scrolling on mobile
        },
      }
    );

    const handleThumbnailClick = useCallback(
      (index) => {
        if (!isDragging) {
          onThumbnailClick(index);
        }
      },
      [isDragging, onThumbnailClick]
    );

    // Auto-center the active thumbnail
    const centerActiveThumbnail = useCallback(() => {
      const container = containerRef.current;
      if (!container) return;

      const thumbnails = container.querySelectorAll('.thumbNailPhoto');
      const activeThumbnail = thumbnails[currentPhoto];

      if (!activeThumbnail) return;

      const containerRect = container.getBoundingClientRect();
      const thumbnailRect = activeThumbnail.getBoundingClientRect();
      const containerCenter = containerRect.width / 2;
      const thumbnailCenter =
        thumbnailRect.left - containerRect.left + thumbnailRect.width / 2;
      const scrollOffset = thumbnailCenter - containerCenter;
      const targetScrollLeft = container.scrollLeft + scrollOffset;
      const maxScrollLeft = Math.max(
        0,
        container.scrollWidth - container.clientWidth
      );
      const boundedScrollLeft = Math.max(
        0,
        Math.min(targetScrollLeft, maxScrollLeft)
      );

      container.scrollTo({
        left: boundedScrollLeft,
        behavior: 'smooth',
      });
    }, [currentPhoto]);

    useEffect(() => {
      const timeoutId = setTimeout(centerActiveThumbnail, 150);
      return () => clearTimeout(timeoutId);
    }, [currentPhoto, centerActiveThumbnail]);

    return (
      <div
        ref={containerRef}
        className="thumbNails"
        {...bind()}
        style={{
          cursor: isMobile ? 'default' : isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: isMobile ? 'pan-x' : 'none',
          outline: 'none',
        }}
      >
        {galleryTypeArr.map((image, index) => (
          <Thumbnail
            key={index}
            image={image}
            index={index}
            currentPhoto={currentPhoto}
            onClick={handleThumbnailClick}
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
  const galleryLengthRef = useRef(0);
  const prevGalleryTypeRef = useRef(null);

  // Platform detection - Enhanced mobile detection
  const isMobile =
    window.innerWidth < 768 ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0;
  const isDesktop = !isMobile;

  // Track aspect ratio for dynamic container sizing
  const [imgAspect, setImgAspect] = useState(1.4);
  const [imageLoading, setImageLoading] = useState(false);

  // Unified gesture state
  const [gestureState, setGestureState] = useState({
    x: 0,
    y: 0,
    scale: 1.15,
  });

  // Initialize image preloader
  const {
    preloadingState,
    isImageLoaded,
    isGalleryTypeLoaded,
    preloadGalleryType,
    isPreloading,
  } = useImagePreloader(showGalleryString, showGallery);

  // Spring animations
  const [gallerySpring, galleryApi] = useSpring(() => ({
    opacity: 0,
    config: {
      tension: 80,
      friction: 30,
      mass: 1,
    },
  }));

  const [infoSpring, infoApi] = useSpring(() => ({
    transform: 'translateY(100%)',
  }));

  const [indicatorSpring, indicatorApi] = useSpring(() => ({
    opacity: 1,
    transform: 'translateY(0px)',
  }));

  // Unified image spring for both mobile and desktop
  const [imageSpring, imageApi] = useSpring(() => ({
    transform: isMobile
      ? 'translate(0px, 0px) scale(1.15)'
      : 'translate(0%, 0%) scale(1)',
    config: {
      tension: isMobile ? 300 : 25,
      friction: isMobile ? 40 : 90,
      mass: isMobile ? 1 : 2.0,
      precision: 0.01,
    },
  }));

  // Unified bounds calculation with scale parameter
  const getBounds = useCallback(
    (scale = gestureState.scale) => {
      const container = imageContainerRef.current;
      if (!container) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };

      if (isMobile) {
        // Mobile: pixel-based bounds for touch gestures
        const rect = container.getBoundingClientRect();
        const scaledWidth = rect.width * scale;
        const scaledHeight = rect.height * scale;
        const overflowX = Math.max(0, scaledWidth - rect.width);
        const overflowY = Math.max(0, scaledHeight - rect.height);

        return {
          minX: -(overflowX / 2) - 60,
          maxX: overflowX / 2 + 60,
          minY: -(overflowY / 2) - 60,
          maxY: overflowY / 2 + 60,
        };
      } else {
        // Desktop: percentage-based bounds for subtle hover effect
        return {
          minX: -15,
          maxX: 15,
          minY: -15,
          maxY: 15,
        };
      }
    },
    [isMobile, gestureState.scale]
  );

  // Reset function
  const resetGesture = useCallback(() => {
    const resetState = { x: 0, y: 0, scale: 1.15 };
    setGestureState(resetState);

    imageApi.start({
      transform: isMobile
        ? 'translate(0px, 0px) scale(1.15)'
        : 'translate(0%, 0%) scale(1)',
      immediate: false,
      config: {
        tension: 160,
        friction: 20,
        mass: 1.2,
      },
    });
  }, [isMobile, imageApi]);

  // Unified gesture handlers with @use-gesture/react
  const bind = useGesture(
    {
      // Unified drag handling (mouse on desktop, touch on mobile)
      onDrag: ({ offset: [x, y], pinching, cancel, velocity, distance }) => {
        if (pinching) return cancel();

        console.log('Drag gesture:', { x, y, isMobile, pinching, distance });

        // Get fresh bounds on each drag using current state
        const container = imageContainerRef.current;
        if (!container) return;

        // Use a function to get current scale to avoid stale closures
        const getCurrentScale = () => {
          if (isMobile) {
            // For mobile, get the current scale from state
            return gestureState.scale;
          } else {
            return 1.15; // Desktop uses fixed scale for hover
          }
        };

        const currentScale = getCurrentScale();
        const bounds = getBounds(currentScale);

        const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, x));
        const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, y));

        setGestureState((prev) => ({ ...prev, x: clampedX, y: clampedY }));

        if (isMobile) {
          // Mobile: pixel-based translation
          imageApi.start({
            transform: `translate(${clampedX}px, ${clampedY}px) scale(${currentScale})`,
            immediate: true,
          });
        } else {
          // Desktop: percentage-based hover effect
          imageApi.start({
            transform: `translate(${clampedX}%, ${clampedY}%) scale(1.15)`,
            immediate: false,
            config: { tension: 25, friction: 90, mass: 2.0 },
          });
        }
      },

      // Pinch handling (mobile only)
      onPinch: ({ offset: [scale], origin: [ox, oy] }) => {
        if (!isMobile) return;

        console.log('Pinch gesture:', { scale, origin: [ox, oy], isMobile });

        const constrainedScale = Math.max(1.0, Math.min(3.0, scale));

        // Calculate pan adjustment for zoom-to-point
        const container = imageContainerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const offsetX = ox - rect.left - centerX;
          const offsetY = oy - rect.top - centerY;

          // Get current state to avoid stale closures
          setGestureState((prevState) => {
            const scaleChange = constrainedScale - prevState.scale;
            const panAdjustX = (-offsetX * scaleChange) / constrainedScale;
            const panAdjustY = (-offsetY * scaleChange) / constrainedScale;

            let newX = prevState.x + panAdjustX;
            let newY = prevState.y + panAdjustY;

            // Calculate bounds with new scale
            const scaledWidth = rect.width * constrainedScale;
            const scaledHeight = rect.height * constrainedScale;
            const overflowX = Math.max(0, scaledWidth - rect.width);
            const overflowY = Math.max(0, scaledHeight - rect.height);

            const bounds = {
              minX: -(overflowX / 2) - 60,
              maxX: overflowX / 2 + 60,
              minY: -(overflowY / 2) - 60,
              maxY: overflowY / 2 + 60,
            };

            newX = Math.max(bounds.minX, Math.min(bounds.maxX, newX));
            newY = Math.max(bounds.minY, Math.min(bounds.maxY, newY));

            // Update animation immediately
            imageApi.start({
              transform: `translate(${newX}px, ${newY}px) scale(${constrainedScale})`,
              immediate: true,
            });

            return { x: newX, y: newY, scale: constrainedScale };
          });
        }
      },

      // Wheel handling (desktop only)
      onWheel: ({ delta: [, dy], event }) => {
        if (!isDesktop) return;

        event.preventDefault();

        setGestureState((prevState) => {
          const newScale = Math.max(
            1.0,
            Math.min(2.0, prevState.scale - dy * 0.002)
          );

          imageApi.start({
            transform: `translate(${prevState.x}%, ${prevState.y}%) scale(${newScale})`,
          });

          return { ...prevState, scale: newScale };
        });
      },

      // Swipe navigation (both platforms)
      onSwipe: ({ direction: [dx], velocity, distance }) => {
        console.log('Swipe gesture:', {
          direction: dx,
          velocity,
          distance,
          threshold: Math.abs(dx) > 0.5 && velocity > 0.5 && distance > 100,
        });

        if (Math.abs(dx) > 0.5 && velocity > 0.5 && distance > 100) {
          const newIndex =
            dx > 0
              ? currentPhoto > 0
                ? currentPhoto - 1
                : galleryTypeArr.length - 1
              : currentPhoto < galleryTypeArr.length - 1
              ? currentPhoto + 1
              : 0;

          console.log('Swipe navigation:', {
            currentPhoto,
            newIndex,
            direction: dx > 0 ? 'right' : 'left',
          });
          setCurrentPhoto(newIndex);
          resetGesture();
        }
      },

      // Hover handling (desktop only)
      onHover: ({ hovering }) => {
        if (!isDesktop) return;

        setIsHovering(hovering);
        if (!hovering) {
          resetGesture();
        }
      },
    },
    {
      drag: {
        enabled: true,
        from: () => [gestureState.x, gestureState.y],
        bounds: () => getBounds(),
        rubberband: true,
      },
      pinch: {
        enabled: isMobile,
        scaleBounds: { min: 0.5, max: 4.0 },
        from: () => [gestureState.scale, 0],
        rubberband: true,
      },
      wheel: {
        enabled: isDesktop,
      },
      swipe: {
        enabled: true,
        distance: 100,
        velocity: 0.5,
      },
      hover: {
        enabled: isDesktop,
      },
    }
  );

  // Double-tap to reset (mobile only) - Enhanced detection
  const [lastTap, setLastTap] = useState(0);
  const handleImageTap = useCallback(
    (e) => {
      if (!isMobile) return;

      // Prevent default to avoid any conflicts
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      const timeDiff = now - lastTap;

      console.log('Mobile tap detected:', { timeDiff, isMobile, gestureState });

      if (timeDiff < 300 && timeDiff > 50) {
        // Double-tap detected
        console.log('Double-tap detected - resetting gesture');
        resetGesture();
      }
      setLastTap(now);
    },
    [lastTap, isMobile, resetGesture, gestureState]
  );

  // Reset gesture when image changes
  useEffect(() => {
    resetGesture();
  }, [currentPhoto, resetGesture]);

  // Update bounds on resize
  useEffect(() => {
    const handleResize = () => {
      resetGesture();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resetGesture]);

  // Update aspect ratio when image loads
  const handleImageLoad = useCallback((e) => {
    const img = e.target;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    setImgAspect(aspectRatio);
    setImageLoading(false);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (!showGallery) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          const newLeftIndex =
            currentPhoto > 0 ? currentPhoto - 1 : galleryTypeArr.length - 1;
          setCurrentPhoto(newLeftIndex);
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          const newRightIndex =
            currentPhoto < galleryTypeArr.length - 1 ? currentPhoto + 1 : 0;
          setCurrentPhoto(newRightIndex);
          break;
        case 'Escape':
          e.preventDefault();
          if (onClose) onClose();
          break;
      }
    },
    [showGallery, setCurrentPhoto, currentPhoto, galleryTypeArr.length, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  // Gallery type filtering
  useEffect(() => {
    const newGalleryTypeArr = images.filter(
      (image) => image.type === showGalleryString
    );

    if (prevGalleryTypeRef.current !== showGalleryString) {
      setGalleryTypeArr(newGalleryTypeArr);
      galleryLengthRef.current = newGalleryTypeArr.length;
      setCurrentPhoto(0);
      prevGalleryTypeRef.current = showGalleryString;
      setImgAspect(1.4);
    }
  }, [galleryType, showGalleryString, setGalleryTypeArr, setCurrentPhoto]);

  // Keep ref in sync with array length
  useEffect(() => {
    galleryLengthRef.current = galleryTypeArr.length;
  }, [galleryTypeArr.length]);

  // Animate gallery visibility
  useEffect(() => {
    if (showGallery) {
      // Smooth entrance animation - just a clean fade in
      galleryApi.start({
        opacity: 1,
        delay: 200, // Short delay for seamless transition
      });
    } else {
      // Quick exit animation
      galleryApi.start({
        opacity: 0,
        delay: 0,
      });
    }
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
    // Only show mobile-style info panel on actual mobile devices
    if (isMobile) {
      // For mobile, just log the click - remove info panel functionality to simplify
      console.log('Mobile image clicked');
      // setShowDetails(!showDetails);
      // setShowInfographic(!showInfographic);
    }
  }, [isMobile]);

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
      if (!imageContainerRef.current || isMobile || !isHovering) return;

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
    // Only enable hover effects on desktop
    if (isDesktop) {
      // Cancel any pending leave timeout to prevent race conditions
      if (hoverLeaveTimeoutRef.current) {
        clearTimeout(hoverLeaveTimeoutRef.current);
        hoverLeaveTimeoutRef.current = null;
      }
      setIsHovering(true);
    }
  }, [isDesktop]);

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
    const maxPanX = overflowX / 2 + margin;
    const minPanX = -maxPanX;
    const maxPanY = overflowY / 2 + margin;
    const minPanY = -maxPanY;

    return { minPanX, maxPanX, minPanY, maxPanY };
  }

  // Reset transform when image changes (handled by resetGesture)
  // This effect is already handled by the resetGesture useEffect above

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
      // Don't reset transforms during hover for desktop
      if (!isHovering && !isMobile) {
        imageApi.set({ transform: 'translate(0%, 0%) scale(1)' });
        currentTransformRef.current = 'translate(0%, 0%) scale(1)';
      }
      // For mobile, let the gesture system handle transforms
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
      {/* Debug info for Safari - enhanced with gesture state */}
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
            maxWidth: '300px',
          }}
        >
          Debug: {galleryTypeArr?.length || 0} items | Current: {currentPhoto}
          <br />
          Browser:{' '}
          {isiOSSafari() ? 'iOS Safari' : isSafari() ? 'Safari' : 'Other'}
          <br />
          Mobile: {isMobile ? 'YES' : 'NO'} | Gesture: x:
          {gestureState.x.toFixed(0)} y:{gestureState.y.toFixed(0)} scale:
          {gestureState.scale.toFixed(1)}
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
            {/* Enhanced Photo Section with gesture support */}
            <div
              ref={imageContainerRef}
              {...bind()} // Apply unified gesture handlers
              style={{
                position: 'relative',
                width: isMobile
                  ? '100vw'
                  : `${calculateImageDimensions().width}px`,
                height: isMobile
                  ? '40vh'
                  : `${calculateImageDimensions().height}px`,
                margin: '0 auto',
                zIndex: 1,
                overflow: 'hidden',
                cursor: isDesktop ? 'zoom-in' : 'grab',
                touchAction: 'none', // Unified: prevent default gestures
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
              onClick={handleImageTap} // Double-tap handler for mobile
              // Remove mouse event handlers on mobile to prevent conflicts
              onMouseMove={isMobile ? undefined : handleImageMouseMove}
              onMouseEnter={isMobile ? undefined : handleImageMouseEnter}
              onMouseLeave={isMobile ? undefined : handleImageMouseLeave}
            >
              {imageTransitions((style, item) =>
                item ? (
                  <animated.img
                    key={`${item}-${currentPhoto}`}
                    ref={imageRef}
                    style={{
                      ...style,
                      width: '100%',
                      height: '100%',
                      objectFit: isMobile ? 'cover' : 'contain',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      // Apply unified gesture transforms
                      transform: imageSpring.transform,
                      willChange: 'transform',
                      backfaceVisibility: 'hidden',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                    }}
                    className="masterImage"
                    src={item}
                    loading="lazy"
                    alt={currentItem?.name}
                    onLoad={handleImageLoad}
                    draggable={false}
                  />
                ) : null
              )}

              {/* Enhanced gesture indicator for mobile with debug info */}
              {isMobile && (
                <div
                  className="gestureIndicator"
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
                    opacity: 0.8,
                    pointerEvents: 'none',
                    fontSize: '8px',
                    color: '#774728',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    lineHeight: '1.1',
                    maxWidth: '70px',
                  }}
                >
                  <div style={{ fontSize: '16px', marginBottom: '2px' }}>
                    🤏
                  </div>
                  <div style={{ fontSize: '9px' }}>
                    {gestureState.scale.toFixed(1)}x
                  </div>
                  <div style={{ fontSize: '7px', opacity: 0.8 }}>
                    PINCH • PAN
                  </div>
                  <div
                    style={{ fontSize: '6px', marginTop: '1px', opacity: 0.8 }}
                  >
                    Double-tap reset
                  </div>
                  <div style={{ fontSize: '6px', opacity: 0.8 }}>
                    Swipe ← → navigate
                  </div>
                  {/* Debug info */}
                  {process.env.NODE_ENV !== 'production' && (
                    <div
                      style={{
                        fontSize: '5px',
                        marginTop: '2px',
                        opacity: 0.6,
                      }}
                    >
                      x:{gestureState.x.toFixed(0)} y:
                      {gestureState.y.toFixed(0)}
                    </div>
                  )}
                </div>
              )}

              {/* Desktop zoom indicator */}
              {isDesktop && (
                <div
                  className="zoomIndicator"
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
                    pointerEvents: 'none',
                  }}
                >
                  🔍
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Mobile-Only Product Info Section */}
      <div className="productInfo mobile-only">
        <div className="furnitureName">{currentItem?.name}</div>
        <div className="furnitureDescription">{currentItem?.description}</div>
      </div>

      {/* Legacy Mobile Info Panel (swipe-up overlay) */}
      <MobileInfoPanel
        infoSpring={infoSpring}
        infoRef={infoRef}
        showDetails={false}
        currentItem={currentItem}
      />

      {/* Swipe indicator for legacy mobile info panel */}
      <animated.div
        className="swipeIndicator"
        style={{
          ...indicatorSpring,
          position: 'fixed',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20002,
          display: 'none',
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
