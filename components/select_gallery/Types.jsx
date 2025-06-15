import { useSpring, animated } from '@react-spring/web';
import Type from './Type';
import './types.css';
import './type.css';
import { useEffect } from 'react';
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

function useTypeSpring(showTypes, index) {
  const [spring, setSpring] = useSpring(() => ({
    opacity: 0,
    y: -100, // Start above screen
    x: 0,
    config: configAnimation,
  }));

  useEffect(() => {
    if (showTypes) {
      const isPortrait = window.innerWidth < window.innerHeight;
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
      const isSmallMobile = window.innerWidth <= 480;
      const aspectRatio = window.innerWidth / window.innerHeight;

      if (isPortrait && isSmallMobile) {
        // Very small mobile devices: tighter layout
        let targetY, targetX;

        if (index === 0) {
          targetY = 16;
          targetX = 56; // Slightly closer to center for small screens
        } else if (index === 1) {
          targetY = 16;
          targetX = 3; // Slightly inward from edge
        } else if (index === 2) {
          targetY = 42;
          targetX = 3;
        } else {
          targetY = 57;
          targetX = 56;
        }

        setSpring.start({
          y: targetY,
          x: targetX,
          opacity: 1,
          delay: 200 + index * 120,
        });
      } else if (isPortrait && isMobile) {
        // Standard mobile portrait: original optimized layout
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
        });
      } else if (isPortrait && isTablet) {
        // Tablet Portrait: more centered layout with better spacing
        let targetY, targetX;

        if (index === 0) {
          targetY = aspectRatio < 0.7 ? 22 : 20; // Adjust for very wide tablets
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
        });
      } else {
        // Desktop/Landscape: Clean Asymmetric Layout
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
        });
      }
    } else {
      setSpring.start({
        y: -100,
        x: 0,
        opacity: 0,
        delay: index * 80,
      });
    }
  }, [showTypes]);

  return spring;
}

function useExplanationTextSpring(showTypes) {
  const [spring, setSpring] = useSpring(() => ({
    opacity: 0,
    y: -100,
    config: configAnimation,
  }));

  useEffect(() => {
    if (showTypes) {
      const isPortrait = window.innerWidth < window.innerHeight;
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
      const isSmallMobile = window.innerWidth <= 480;
      const aspectRatio = window.innerWidth / window.innerHeight;

      let targetY;
      if (isPortrait && isSmallMobile) {
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
      });
    } else {
      setSpring.start({
        y: -100,
        opacity: 0,
        delay: 0,
      });
    }
  }, [showTypes]);

  return spring;
}

export default function Types({
  showTypes,
  onGalleryTypesClick,
  onMissionButtonClick,
  onTypeSelect,
  setActiveGalleryType,
  setActiveGalleryTypeString,
}) {
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
    useTypeSpring(showTypes, index)
  );

  const explanationSpring = useExplanationTextSpring(showTypes);

  return (
    <>
      <animated.div
        style={{
          width: '100svw',
          height: '100svh',
        }}
        className="typesContainer"
      >
        {springs.map((spring, index) => (
          <animated.div
            key={index}
            style={{
              position: 'absolute',
              left: spring.x ? spring.x.to((x) => `${x}svw`) : '0svw',
              transform: spring.y.to((y) => `translateY(${y}svh)`),
              opacity: spring.opacity,
            }}
          >
            <Type
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

              if (isPortrait && isSmallMobile) {
                return '27.5%'; // Small mobile: slightly more centered
              } else if (isPortrait && isMobile) {
                return '25%'; // Mobile: offset to avoid button overlap
              } else if (isPortrait && isTablet) {
                return '35%'; // Tablet: more centered
              } else {
                return '50%'; // Desktop: perfectly centered
              }
            })(),
            top: (() => {
              const isPortrait = window.innerWidth < window.innerHeight;
              const isMobile = window.innerWidth <= 768;
              const isTablet =
                window.innerWidth > 768 && window.innerWidth <= 1024;
              const isSmallMobile = window.innerWidth <= 480;
              const aspectRatio = window.innerWidth / window.innerHeight;

              if (isPortrait && isSmallMobile) {
                return '45svh'; // Small mobile: lower position for tight layout
              } else if (isPortrait && isMobile) {
                return '45svh'; // Mobile: lower position
              } else if (isPortrait && isTablet) {
                return aspectRatio < 0.7 ? '30svh' : '35svh'; // Tablet: adjust based on aspect ratio
              } else {
                return '50svh'; // Desktop: perfect center
              }
            })(),
            transform: explanationSpring.y.to(
              (y) => `translateX(-50%) translateY(-50%) translateY(${y}svh)` // Always center horizontally and vertically
            ),
            opacity: explanationSpring.opacity,
            width: (() => {
              const isPortrait = window.innerWidth < window.innerHeight;
              const isMobile = window.innerWidth <= 768;
              const isTablet =
                window.innerWidth > 768 && window.innerWidth <= 1024;
              const isSmallMobile = window.innerWidth <= 480;

              if (isPortrait && isSmallMobile) {
                return '52svw'; // Small mobile: narrower for tighter layout
              } else if (isPortrait && isMobile) {
                return '50svw'; // Mobile: wider for readability
              } else if (isPortrait && isTablet) {
                return '45svw'; // Tablet: slightly narrower
              } else {
                return '35svw'; // Desktop: compact
              }
            })(),
            textAlign: 'center',
            zIndex: 1000,
          }}
        >
          <div className="explanationContent">
            <div
              className="typeHeader"
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
            <p>
              No two pieces are alike – the wood itself determines the final
              form, making your furniture as individual as the tree it came
              from.
            </p>
          </div>
        </animated.div>
      </animated.div>
    </>
  );
}
