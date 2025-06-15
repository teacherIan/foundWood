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
    if (showTypes && window.innerWidth < window.innerHeight) {
      // Portrait mobile: Strategic asymmetric layout optimized for content length and visual balance
      // This layout accounts for varying text lengths and creates visual interest while ensuring readability
      let targetY, targetX;

      if (index === 0) {
        // Coffee Tables <br/> Plant Stands - Longest text (2 lines), positioned top-right with more space
        // Moved to 55% right to balance against the explanation text on the left
        targetY = 20;
        targetX = 55; // Top right with adequate breathing room
      } else if (index === 1) {
        // Chairs <br/> Ottomans - Medium text (2 lines), positioned top-left for asymmetric balance
        // Placed at left edge to create dynamic contrast with Coffee Tables
        targetY = 15;
        targetX = 0; // Far left, slightly lower than Coffee Tables for hierarchy
      } else if (index === 2) {
        // Tables - Shortest text (1 line), positioned lower-left
        // Compact placement since single-line text requires less visual weight
        targetY = 42;
        targetX = 0; // Left aligned with Chairs for vertical consistency
      } else {
        // Structures - Short text (1 line), positioned lower-right
        // Balances the Tables button and creates visual symmetry with Coffee Tables above
        targetY = 55;
        targetX = 55; // Right aligned with Coffee Tables, slightly lower for hierarchy
      }

      setSpring.start({
        y: targetY,
        x: targetX,
        opacity: 1,
        delay: 200 + index * 120,
      });
    } else if (showTypes) {
      // Desktop: Clean Asymmetric Layout
      // Elegant positioning that creates visual interest without chaos
      let targetY, targetX;

      if (index === 0) {
        // Coffee Tables - Top left with space for 2-line text
        targetY = 15;
        targetX = 8;
      } else if (index === 1) {
        // Chairs - Top right with adequate spacing
        targetY = 10;
        targetX = 70;
      } else if (index === 2) {
        // Tables - Bottom left, compact placement
        targetY = 60;
        targetX = 8;
      } else {
        // Structures - Bottom right, raised to prevent tall image cutoff
        targetY = 48;
        targetX = 70;
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
      // Mobile: Strategic positioning to work around asymmetric button layout
      // On mobile, buttons are positioned asymmetrically with varying text lengths,
      // so explanation text is moved to the left side (1svw) to avoid overlap
      // and create a cohesive composition with the 4-button layout
      const targetY = window.innerWidth < window.innerHeight ? 35 : 0; // Mobile: lower position, Desktop: centered
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
            left: window.innerWidth < window.innerHeight ? '25%' : '50%',
            top: window.innerWidth < window.innerHeight ? '45svh' : '50svh', // Mobile: lower position, Desktop: perfect center
            transform: explanationSpring.y.to(
              (y) => `translateX(-50%) translateY(-50%) translateY(${y}svh)` // Always center horizontally and vertically
            ),
            opacity: explanationSpring.opacity,
            width: window.innerWidth < window.innerHeight ? '50svw' : '35svw', // Mobile: wider for readability
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
