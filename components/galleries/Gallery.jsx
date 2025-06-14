import './gallery.css';
import imgData from './imgData';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useSpring, animated, useTransition } from '@react-spring/web';
import { MdExitToApp } from 'react-icons/md';

const images = imgData;

// Memoized thumbnail component
const Thumbnail = memo(({ image, index, currentPhoto, onClick }) => {
  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(index);
    },
    [index, onClick]
  );

  return (
    <img
      key={index}
      src={image.img}
      className={`thumbNailPhoto ${index === currentPhoto ? 'grayscale' : ''}`}
      onClick={handleClick}
      loading="lazy"
      alt={`Thumbnail ${index + 1}`}
      draggable={false} // Prevent default image drag behavior
      style={{ pointerEvents: 'auto' }} // Ensure clicks are captured
    />
  );
});

// Draggable thumbnail container component
const DraggableThumbnails = memo(
  ({ galleryTypeArr, currentPhoto, onThumbnailClick }) => {
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
    config: {
      tension: 200, // Increased tension for snappier response
      friction: 25, // Slightly reduced friction for smoother movement
      mass: 0.8, // Reduced mass for lighter, more responsive feel
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
        });
      }
      setImgAspect(aspectRatio);
      setImageLoading(false); // Image finished loading
    },
    [imgAspect]
  );

  // Manual touch event registration for non-passive touchmove
  useEffect(() => {
    const imageContainer = imageContainerRef.current;
    if (!imageContainer || window.innerWidth >= window.innerHeight) return;

    // Register touchmove as non-passive so we can preventDefault
    const handleTouchMove = (e) => {
      if (!isMobileDevice() || !lastTouchRef.current) return;

      e.preventDefault(); // This will work now since it's non-passive

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

    // Add non-passive touchmove listener
    imageContainer.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });

    return () => {
      imageContainer.removeEventListener('touchmove', handleTouchMove);
    };
  }, [showGallery, currentPhoto]);

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
      setIsHovering(false);
      // Reset image transform using React Spring API
      imageApi.start({
        transform: 'translate(0%, 0%) scale(1)',
        config: { tension: 170, friction: 26 },
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
  }, []);

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

  // Image hover/pan functionality
  const handleImageMouseMove = useCallback(
    (e) => {
      if (
        !imageContainerRef.current ||
        window.innerWidth < window.innerHeight ||
        !isHovering
      )
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

      // Use React Spring API directly for smooth, deliberate panning
      imageApi.start({
        transform: `translate(${translateX}%, ${translateY}%) scale(1.15)`,
        config: {
          tension: 180, // More responsive than before
          friction: 28, // Balanced friction
          mass: 0.7, // Light mass for immediate response
        },
      });
    },
    [isHovering, imageApi]
  );

  const handleImageMouseEnter = useCallback(() => {
    // Only enable hover effects on desktop (not on mobile devices)
    if (window.innerWidth >= window.innerHeight && window.innerWidth >= 768) {
      setIsHovering(true);
    }
  }, []);

  const handleImageMouseLeave = useCallback(() => {
    setIsHovering(false);
    // Use React Spring API directly for smooth return to center
    imageApi.start({
      transform: 'translate(0%, 0%) scale(1)',
      config: {
        tension: 220, // Fast return to center
        friction: 24, // Smooth but quick
        mass: 0.8, // Light mass
      },
    });
  }, [imageApi]);

  // Handle initial hover state change
  useEffect(() => {
    if (isHovering) {
      // Start with initial scale-up, position will be handled by mouse move
      imageApi.start({
        transform: 'translate(0%, 0%) scale(1.15)',
        config: {
          tension: 200, // Quick scale-up
          friction: 25, // Smooth scaling
          mass: 0.8, // Light mass
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
    config: { tension: 200, friction: 20 },
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
        width: '100svw', // Modern viewport units with VW fallback in CSS
        height: '100svh', // Modern viewport units with VH fallback in CSS
        opacity: showGallery ? 1 : 0,
        zIndex: showGallery ? 20000 : 0,
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

      {/* Exit/Close button */}
      {onClose && (
        <button
          className="exitIcon"
          onClick={onClose}
          aria-label="Close gallery"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 99999,
            cursor: 'pointer',
            color: 'white',
            background: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.8)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.5)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <MdExitToApp />
        </button>
      )}

      {/* Mobile Three-Section Layout: Thumbnails (order: 1) → Photo (order: 2) → Text (order: 3) */}

      {/* 1. Thumbnails Section / Desktop Left Panel */}
      <div className="productPanel">
        <DraggableThumbnails
          galleryTypeArr={galleryTypeArr}
          currentPhoto={currentPhoto}
          onThumbnailClick={handleThumbnailClick}
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
                  ? handleImageTouchStart
                  : undefined
              }
              onTouchEnd={
                window.innerWidth < window.innerHeight
                  ? handleImageTouchEnd
                  : undefined
              }
              onTouchCancel={
                window.innerWidth < window.innerHeight
                  ? handleImageTouchEnd
                  : undefined
              }
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
