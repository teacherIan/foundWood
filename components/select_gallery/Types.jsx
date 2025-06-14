import { useSpring, animated } from '@react-spring/web';
import Type from './Type';
import './types.css';
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
    if (showTypes && window.innerWidth < window.innerHeight) {
      // Portrait mobile: Strategic asymmetric layout accounting for text length
      let targetY, targetX;

      if (index === 0) {
        // Coffee Tables - 2 lines, needs more space
        targetY = 8;
        targetX = 20; // Top left with space
      } else if (index === 1) {
        // Chairs - 2 lines, medium width
        targetY = 12;
        targetX = 65; // Top right, slightly lower
      } else if (index === 2) {
        // Tables - 1 line, compact
        targetY = 48;
        targetX = 15; // Lower left
      } else {
        // Structures - 1 line, compact
        targetY = 45;
        targetX = 70; // Lower right, slightly higher
      }

      setSpring.start({
        y: targetY,
        x: targetX,
        opacity: 1,
        delay: 200 + index * 120,
      });
    } else if (showTypes) {
      // Landscape: Maximize space usage with content-aware positioning
      let targetY, targetX;

      if (index === 0) {
        // Coffee Tables - longer text, place with ample space
        targetY = 6;
        targetX = 8; // Top left corner
      } else if (index === 1) {
        // Chairs - medium text, wide image
        targetY = 8;
        targetX = 72; // Top right corner
      } else if (index === 2) {
        // Tables - short text, compact
        targetY = 62;
        targetX = 6; // Bottom left corner
      } else {
        // Structures - short text, tall image (house) - move higher to prevent cutoff
        targetY = 52;
        targetX = 74; // Bottom right corner, moved higher
      }

      setSpring.start({
        y: targetY,
        x: targetX,
        opacity: 1,
        delay: 200 + index * 120,
      });
    } else {
      // Hide: animate back up above screen
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
      // Position text strategically based on orientation
      const targetY = window.innerWidth < window.innerHeight ? 0 : 0; // Center vertically in available space
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
  const imgArray = [chair, table, picnicTable, house];
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
        <animated.div
          className="explanationText"
          style={{
            position: 'absolute',
            left: '50svw',
            top: window.innerWidth < window.innerHeight ? '72svh' : '33svh',
            transform: `translateX(-50%) ${explanationSpring.y.to(
              (y) => `translateY(${y}svh)`
            )}`,
            opacity: explanationSpring.opacity,
            width: window.innerWidth < window.innerHeight ? '75svw' : '26svw',
            textAlign: 'center',
            zIndex: 1000,
          }}
        >
          <div className="explanationContent">
            <h3>Custom Crafted for You</h3>
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
