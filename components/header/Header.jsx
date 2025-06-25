import { useState, useCallback, memo } from 'react';
import { useSpring, animated } from '@react-spring/web';
import found_wood from '../../src/assets/found_wood_final_all.png';
import './header.css';

const configAnimation = {
  mass: 2,
  tension: 400,
  friction: 20,
  precision: 0.0005,
};

// Memoized AnimatedMenuItem component with iPad touch event fix and white flash effect
const AnimatedMenuItem = memo(
  ({ children, onClick, isLogo = false, disabled = false }) => {
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);
    const [touchStarted, setTouchStarted] = useState(false);

    const springProps = useSpring({
      scale: (hovered || pressed) && !disabled ? 1.05 : 1, // Reduced scale for subtlety
      config: configAnimation,
    });

    // Detect if this is a touch device
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isIpadDetected =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // iPad-optimized event handlers
    const handleTouchStart = useCallback(
      (e) => {
        if (!isTouchDevice || disabled) return;
        setTouchStarted(true);
        setPressed(true);
        // Don't preventDefault on passive listeners - let the gesture library handle it
      },
      [isTouchDevice, disabled]
    );

    const handleTouchEnd = useCallback(
      (e) => {
        if (!isTouchDevice || !touchStarted || disabled) return;

        setPressed(false);
        setTouchStarted(false);

        // Call onClick directly for touch devices to ensure it fires
        if (onClick) {
          // Don't preventDefault on passive listeners
          e.stopPropagation();
          onClick(e);
        }
      },
      [isTouchDevice, touchStarted, onClick, disabled]
    );

    const handleClick = useCallback(
      (e) => {
        if (disabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        // Only handle click if this wasn't a touch interaction
        if (touchStarted || isTouchDevice) {
          e.preventDefault();
          return;
        }
        if (onClick) {
          onClick(e);
        }
      },
      [touchStarted, isTouchDevice, onClick, disabled]
    );

    const handleMouseDown = useCallback(
      (e) => {
        if (isTouchDevice || touchStarted || disabled) return;
        setPressed(true);
      },
      [isTouchDevice, touchStarted, disabled]
    );

    const handleMouseUp = useCallback(
      (e) => {
        if (isTouchDevice || touchStarted || disabled) return;
        setPressed(false);
      },
      [isTouchDevice, touchStarted, disabled]
    );

    const handleMouseEnter = useCallback(
      (e) => {
        if (isTouchDevice || touchStarted || disabled) return;
        setHovered(true);
      },
      [isTouchDevice, touchStarted, disabled]
    );

    const handleMouseLeave = useCallback(
      (e) => {
        if (isTouchDevice || touchStarted || disabled) return;
        setHovered(false);
        setPressed(false);
      },
      [isTouchDevice, touchStarted, disabled]
    );

    return (
      <animated.div
        className={`animated-menu-item ${isLogo ? 'logo-item' : 'text-item'}`}
        onClick={
          disabled
            ? (e) => {
                e.preventDefault();
                e.stopPropagation();
              }
            : handleClick
        }
        onMouseEnter={disabled ? undefined : handleMouseEnter}
        onMouseLeave={disabled ? undefined : handleMouseLeave}
        onMouseDown={disabled ? undefined : handleMouseDown}
        onMouseUp={disabled ? undefined : handleMouseUp}
        onTouchStart={disabled ? undefined : handleTouchStart}
        onTouchEnd={disabled ? undefined : handleTouchEnd}
        style={{
          transform: springProps.scale.to((s) => `scale(${s})`),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: isLogo ? 'auto' : '100%',
          // Enhanced touch handling for iPad
          touchAction: disabled ? 'none' : 'manipulation',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          // Ensure proper pointer events - disabled when contact is active
          pointerEvents: disabled ? 'none' : 'auto',
          cursor: disabled ? 'default' : 'pointer',
          // Prevent stacking context isolation - critical for z-index hierarchy
          position: 'relative',
          zIndex: 'inherit',
          isolation: 'auto',
          // Ensure no background color artifacts
          background: 'transparent',
        }}
      >
        {children}
      </animated.div>
    );
  }
);

const Header = memo(
  ({
    onEmblemClick,
    onGalleryClick,
    onContactClick,
    showContactPage,
    isHomeScreen,
    iconSpring,
    initialLoadComplete,
  }) => {
    return (
      <div
        className={`header ${showContactPage ? 'header-disabled' : ''}`}
        style={{
          filter: showContactPage ? 'blur(8px)' : 'none',
          WebkitFilter: showContactPage ? 'blur(8px)' : 'none',
          MozFilter: showContactPage ? 'blur(8px)' : 'none',
          transition:
            'filter 0.3s ease-out, -webkit-filter 0.3s ease-out, -moz-filter 0.3s ease-out',
          pointerEvents: showContactPage ? 'none' : 'auto',
        }}
      >
        <div className="menu">
          {/* Animated icon size with React Spring */}
          <AnimatedMenuItem
            onClick={onEmblemClick}
            isLogo={true}
            disabled={showContactPage}
          >
            <div
              style={{
                width: '2.5em', // Increased to accommodate larger home icon (1.8em)
                height: '2.5em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                paddingTop: '0.2em', // Minimal padding
              }}
            >
              <animated.img
                src={found_wood}
                className="icon"
                alt="Found Wood Logo"
                loading="lazy"
                style={{
                  ...iconSpring,
                  objectFit: 'contain',
                }}
              />
            </div>
          </AnimatedMenuItem>

          <AnimatedMenuItem onClick={onGalleryClick} disabled={showContactPage}>
            <div className="menu-item">Gallery</div>
          </AnimatedMenuItem>

          <AnimatedMenuItem onClick={onContactClick} disabled={showContactPage}>
            <div className="menu-item">Contact</div>
          </AnimatedMenuItem>
        </div>
      </div>
    );
  }
);

export default Header;
