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
    config: configAnimation,
  }));

  useEffect(() => {
    if (showTypes && window.innerWidth < window.innerHeight) {
      // Portrait mobile: animate from above (-100svh) to visible positions
      const targetY = 10 + (index > 1 ? 52 : 5);
      setSpring.start({
        y: targetY,
        opacity: 1,
        delay: index * 100,
      });
    } else if (showTypes) {
      // Landscape: animate from above (-100svh) to visible positions
      const targetY = index % 2 === 0 ? 12 : index === 1 ? 40 : 28;
      setSpring.start({
        y: targetY,
        opacity: 1,
        delay: index * 200,
      });
    } else {
      // Hide: animate back up above screen
      setSpring.start({
        y: -100,
        opacity: 0,
        delay: index * 200,
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

  const [informationSpring, setInformationSpring] = useSpring(() => ({
    opacity: '0',
    config: configAnimation,
  }));

  useEffect(() => {
    if (showTypes && window.innerWidth > window.innerHeight) {
      setInformationSpring.start({ opacity: '1', top: '92svh', delay: 100 });
    } else if (showTypes) {
      setInformationSpring.start({ opacity: '1', top: '73svh', delay: 100 });
    } else {
      setInformationSpring.start({ opacity: '0', top: '20svh', delay: 150 });
    }
  }, [showTypes]);

  const springs = Array.from({ length: 4 }, (_, index) =>
    useTypeSpring(showTypes, index)
  );

  return (
    <>
      {showTypes && (
        <div
          className="typesOverlay"
          onClick={onGalleryTypesClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1999,
            cursor: 'pointer',
          }}
        />
      )}
      <animated.div
        style={{
          width:
            window.innerWidth > window.innerHeight ? 50 + 'svw' : 50 + 'svw',
        }}
        className="typesContainer"
      >
        {showTypes &&
          springs.map((spring, index) => (
            <animated.div
              key={index}
              style={{
                position: 'absolute',
                left:
                  window.innerWidth < window.innerHeight
                    ? (index % 2) * 50 + 'svw'
                    : index * 20 + 5 + 'svw',
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
      </animated.div>
    </>
  );
}
