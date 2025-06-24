import { useSpring, animated } from '@react-spring/web';
import GalleryTypeButton from './GalleryTypeButton';
import './galleryTypeSelector.css';
import './galleryTypeButton.css';
import { useEffect, useState } from 'react';
import chair from '../../src/assets/noBG/double_chair_final_noBG.png';
// import table from '../../src/assets/noBG/plantStand_new.png';
import table from '../../src/assets/noBG/glass-table.png';
import picnicTable from '../../src/assets/noBG/adult_picnic_table.png';
import house from '../../src/assets/noBG/Play-house-4.png';
import light from '../../src/assets/noBG/light_noBG.png';

const configAnimation = {
  mass: 6,
  tension: 300,
  friction: 60,
  precision: 0.0001,
  ease: true,
};

// Custom hook to manage delayed unmounting after exit animation
function useDelayedUnmount(showTypes) {
  const [shouldRender, setShouldRender] = useState(showTypes);
  const [animationState, setAnimationState] = useState(
    showTypes ? 'entering' : 'hidden'
  );

  useEffect(() => {
    if (showTypes) {
      console.log('showTypes became true - mounting and starting entrance');
      setShouldRender(true);
      setAnimationState('entering');

      // Small delay to ensure component is mounted before starting entrance animation
      setTimeout(() => {
        setAnimationState('visible');
      }, 50);
    } else {
      console.log('showTypes became false - starting exit animation');
      // Start exit animation immediately
      setAnimationState('exiting');

      // Calculate the maximum exit animation duration more conservatively
      const maxExitDuration = 1000;

      const timer = setTimeout(() => {
        console.log('Exit animation should be complete - unmounting');
        setShouldRender(false);
        setAnimationState('hidden');
      }, maxExitDuration);

      return () => clearTimeout(timer);
    }
  }, [showTypes]);

  return {
    shouldRender,
    internalShowTypes:
      animationState === 'visible' || animationState === 'entering',
    isExiting: animationState === 'exiting',
  };
}

function useTypeSpring(internalShowTypes, index) {
  const [spring, setSpring] = useSpring(() => ({
    opacity: 0,
    y: -100, // Start above screen
    x: 0,
    config: configAnimation,
  }));

  useEffect(() => {
    console.log(
      `Button ${index} useEffect - internalShowTypes:`,
      internalShowTypes
    );

    if (internalShowTypes) {
      console.log(`Button ${index} starting entrance animation`);
      const isPortrait = window.innerWidth < window.innerHeight;
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
      const isSmallMobile = window.innerWidth <= 480;
      const aspectRatio = window.innerWidth / window.innerHeight;
      const isDesktop = window.innerWidth > 1024 && !isPortrait;

      if (isDesktop) {
        // Desktop/Large Landscape: Clean layout
        let targetY, targetX;

        if (index === 0) {
          targetY = 15;
          targetX = 8;
        } else if (index === 1) {
          targetY = 10;
          targetX = 70;
        } else if (index === 2) {
          targetY = 60;
          targetX = 8;
        } else {
          targetY = 48;
          targetX = 70;
        }

        setSpring.start({
          y: targetY,
          x: targetX,
          opacity: 1,
          delay: 200 + index * 120,
          immediate: false,
        });
      } else if (isPortrait && isTablet) {
        // All tablets in portrait (including iPads): centered layout
        let targetY, targetX;

        if (index === 0) {
          targetY = aspectRatio < 0.7 ? 22 : 20;
          targetX = 15;
        } else if (index === 1) {
          targetY = aspectRatio < 0.7 ? 20 : 18;
          targetX = 65;
        } else if (index === 2) {
          targetY = aspectRatio < 0.7 ? 52 : 50;
          targetX = 15;
        } else {
          targetY = aspectRatio < 0.7 ? 60 : 58;
          targetX = 65;
        }

        setSpring.start({
          y: targetY,
          x: targetX,
          opacity: 1,
          delay: 200 + index * 120,
          immediate: false,
        });
      } else if (isPortrait && isSmallMobile) {
        // Very small mobile devices: tighter layout
        let targetY, targetX;

        if (index === 0) {
          targetY = 15;
          targetX = 52;
        } else if (index === 1) {
          targetY = 10;
          targetX = 3;
        } else if (index === 2) {
          targetY = 39;
          targetX = 3;
        } else {
          targetY = 53;
          targetX = 53;
        }

        setSpring.start({
          y: targetY,
          x: targetX,
          opacity: 1,
          delay: 200 + index * 120,
          immediate: false,
        });
      } else if (isPortrait && isMobile) {
        // Mobile portrait: optimized for phone screens
        let targetY, targetX;

        if (index === 0) {
          targetY = 18;
          targetX = 55;
        } else if (index === 1) {
          targetY = 15;
          targetX = 0;
        } else if (index === 2) {
          targetY = 42;
          targetX = 0;
        } else {
          targetY = 55;
          targetX = 55;
        }

        setSpring.start({
          y: targetY,
          x: targetX,
          opacity: 1,
          delay: 200 + index * 120,
          immediate: false,
        });
      } else {
        // Fallback: landscape or other cases
        let targetY, targetX;

        if (index === 0) {
          targetY = 15;
          targetX = 8;
        } else if (index === 1) {
          targetY = 10;
          targetX = 70;
        } else if (index === 2) {
          targetY = 60;
          targetX = 8;
        } else {
          targetY = 48;
          targetX = 70;
        }

        setSpring.start({
          y: targetY,
          x: targetX,
          opacity: 1,
          delay: 200 + index * 120,
          immediate: false,
        });
      }
    } else {
      console.log(`Button ${index} starting exit animation`);
      setSpring.start({
        y: -100,
        x: 0,
        opacity: 0,
        delay: index * 80,
        immediate: false, // Ensure animation runs
        config: {
          ...configAnimation,
          precision: 0.01, // Lower precision for faster completion
        },
      });
    }
  }, [internalShowTypes, index, setSpring]);

  return spring;
}

function useExplanationTextSpring(internalShowTypes) {
  const [spring, setSpring] = useSpring(() => ({
    opacity: 0,
    y: -100,
    config: configAnimation,
  }));

  useEffect(() => {
    console.log(
      'Explanation text useEffect - internalShowTypes:',
      internalShowTypes
    );

    if (internalShowTypes) {
      console.log('Explanation text starting entrance animation');
      const isPortrait = window.innerWidth < window.innerHeight;
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
      const isSmallMobile = window.innerWidth <= 480;
      const aspectRatio = window.innerWidth / window.innerHeight;
      const isDesktop = window.innerWidth > 1024 && !isPortrait;

      let targetY;
      if (isDesktop) {
        targetY = 0; // Desktop: centered
      } else if (isPortrait && isTablet) {
        targetY = aspectRatio < 0.7 ? 15 : 10; // Tablet Portrait: adjust based on aspect ratio
      } else if (isPortrait && isSmallMobile) {
        targetY = 36; // Small mobile: slightly lower to avoid button overlap
      } else if (isPortrait && isMobile) {
        targetY = 35; // Standard mobile: lower position to avoid button overlap
      } else if (isPortrait && isTablet) {
        targetY = aspectRatio < 0.7 ? 15 : 10; // Tablet: adjust based on aspect ratio
      } else {
        targetY = 0; // Desktop/landscape: centered
      }

      setSpring.start({
        y: targetY,
        opacity: 1,
        delay: 680, // Animate in after all buttons
        immediate: false,
      });
    } else {
      console.log('Explanation text starting exit animation');
      setSpring.start({
        y: -100,
        opacity: 0,
        delay: 0,
        immediate: false, // Ensure animation runs
        config: {
          ...configAnimation,
          precision: 0.01, // Lower precision for faster completion
        },
      });
    }
  }, [internalShowTypes, setSpring]);

  return spring;
}

export default function GalleryTypeSelector({
  showTypes,
  onGalleryTypesClick,
  onMissionButtonClick,
  onTypeSelect,
  setActiveGalleryType,
  setActiveGalleryTypeString,
}) {
  const { shouldRender, internalShowTypes, isExiting } =
    useDelayedUnmount(showTypes);

  const types = {
    chairs: 'chairs',
    smallTable: 'smallTable',
    largeTable: 'largeTable',
    structure: 'structure',
    other: 'other',
  };
  const imgArray = [table, chair, picnicTable, house]; // Fixed order: table for Coffee Tables, chair for Chairs
  const imgHeader = [
    'Coffee Tables <br/> Plant Stands',
    'Chairs <br/> Ottomans',
    'Tables',
    'Structures',
    // 'Others',
  ];

  const springs = Array.from({ length: 4 }, (_, index) =>
    useTypeSpring(internalShowTypes, index)
  );

  const explanationSpring = useExplanationTextSpring(internalShowTypes);

  // Don't render if component should be unmounted
  if (!shouldRender) {
    console.log('Component returning null - not rendering');
    return null;
  }

  console.log(
    'Component rendering with internalShowTypes:',
    internalShowTypes,
    'isExiting:',
    isExiting
  );

  return (
    <>
      <animated.div
        style={{
          width: '100vw',
          height: '100svh',
        }}
        className="galleryTypeSelector"
        data-visible={internalShowTypes}
      >
        {springs.map((spring, index) => (
          <animated.div
            key={index}
            style={{
              position: 'absolute',
              left: spring.x ? spring.x.to((x) => `${x}vw`) : '0vw',
              transform: spring.y.to((y) => `translateY(${y}vh)`),
              opacity: spring.opacity,
            }}
          >
            <GalleryTypeButton
              img={imgArray[index]}
              header={imgHeader[index]}
              onTypeSelect={onTypeSelect}
              index={index}
              setActiveGalleryType={setActiveGalleryType}
              setActiveGalleryTypeString={setActiveGalleryTypeString}
            />
          </animated.div>
        ))}

        {/* Explanatory Text */}
        {/* Mobile Layout: Centered for balanced presentation
             Desktop Layout: Perfectly centered both horizontally and vertically */}
        <animated.div
          className="explanationText"
          style={{
            position: 'absolute',
            left: (() => {
              const isPortrait = window.innerWidth < window.innerHeight;
              const isMobile = window.innerWidth <= 768;
              const isTablet =
                window.innerWidth > 768 && window.innerWidth <= 1024;
              const isSmallMobile = window.innerWidth <= 480;
              const isDesktop = window.innerWidth > 1024 && !isPortrait;

              if (isDesktop) {
                return '50%'; // Desktop: centered
              } else if (isPortrait && isTablet) {
                return '35%'; // Tablet Portrait: more centered
              } else if (isPortrait && isSmallMobile) {
                return '27.5%'; // Small mobile: slightly more centered
              } else if (isPortrait && isMobile) {
                return '25%'; // Mobile: offset to avoid button overlap
              } else {
                return '50%'; // Fallback: centered
              }
            })(),
            top: (() => {
              const isPortrait = window.innerWidth < window.innerHeight;
              const isMobile = window.innerWidth <= 768;
              const isTablet =
                window.innerWidth > 768 && window.innerWidth <= 1024;
              const isSmallMobile = window.innerWidth <= 480;
              const aspectRatio = window.innerWidth / window.innerHeight;
              const isDesktop = window.innerWidth > 1024 && !isPortrait;

              if (isDesktop) {
                return '50vh'; // Desktop: centered
              } else if (isPortrait && isTablet) {
                return aspectRatio < 0.7 ? '70svh' : '70svh'; // Tablet: adjust based on aspect ratio, use svh for mobile devices
              } else if (isPortrait && isSmallMobile) {
                return '45svh'; // Small mobile: lower position for tight layout, use svh for true screen size
              } else if (isPortrait && isMobile) {
                return '45svh'; // Mobile: lower position, use svh for true screen size
              } else {
                return '50vh'; // Fallback: centered
              }
            })(),
            transform: explanationSpring.y.to((y) => {
              const isPortrait = window.innerWidth < window.innerHeight;
              const isMobile = window.innerWidth <= 768;
              const isTablet =
                window.innerWidth > 768 && window.innerWidth <= 1024;
              const isDesktop = window.innerWidth > 1024 && !isPortrait;

              // Use svh for mobile devices to account for browser UI
              const unit = isPortrait && (isMobile || isTablet) ? 'svh' : 'vh';
              return `translateX(-50%) translateY(-50%) translateY(${y}${unit})`;
            }),
            opacity: explanationSpring.opacity,
            width: (() => {
              const isPortrait = window.innerWidth < window.innerHeight;
              const isMobile = window.innerWidth <= 768;
              const isTablet =
                window.innerWidth > 768 && window.innerWidth <= 1024;
              const isSmallMobile = window.innerWidth <= 480;
              const isDesktop = window.innerWidth > 1024 && !isPortrait;

              if (isDesktop) {
                return '35vw'; // Desktop: compact width
              } else if (isPortrait && isTablet) {
                return '45vw'; // Tablet: slightly narrower
              } else if (isPortrait && isSmallMobile) {
                return '52vw'; // Small mobile: narrower for tighter layout
              } else if (isPortrait && isMobile) {
                return '50vw'; // Mobile: wider for readability
              } else {
                return '35vw'; // Fallback: compact
              }
            })(),
            textAlign: 'center',
            zIndex: 1000,
          }}
        >
          <div className="explanationContent">
            <div
              className="galleryTypeHeader"
              dangerouslySetInnerHTML={{
                __html: 'Custom Crafted <br/> for You',
              }}
            />
            <p>
              Every piece at Found Wood is uniquely handcrafted from carefully
              selected wood. From maple burl coffee tables with their swirling
              grain patterns to cedar Adirondack chairs with mahogany accents,
              each creation celebrates the natural character of the wood.
            </p>
          </div>
        </animated.div>
      </animated.div>
    </>
  );
}
