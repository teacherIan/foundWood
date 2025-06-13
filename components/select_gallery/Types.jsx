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
    y: 0, // Changed from 'top' to 'y' for translateY
    config: configAnimation,
  }));

  useEffect(() => {
    if (showTypes && window.innerWidth < window.innerHeight) {
      // Portrait mobile: animate from top (-100svh) to visible positions
      setSpring.start({
        y: 100 + 10 + (index > 1 ? 52 : 5), // 100svh to counteract -100svh + positioning
        opacity: 1,
        delay: index * 100,
      });
    } else if (showTypes) {
      // Landscape: animate from top (-100svh) to visible positions
      setSpring.start({
        y: 100 + (index % 2 === 0 ? 12 : index === 1 ? 40 : 28), // 100svh + positioning
        opacity: 1,
        delay: index * 200,
      });
    } else {
      // Hide: animate back up
      setSpring.start({
        y: -50,
        opacity: 0,
        delay: index * 200,
      });
    }
  }, [showTypes]);

  return spring;
}

export default function Types({
  showTypes,
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
  const imgArray = [table, chair, picnicTable, house, light];
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
      <animated.div
        style={{
          width:
            window.innerWidth > window.innerHeight ? 50 + 'svw' : 50 + 'svw',
        }}
        className="typesContainer"
      >
        {springs.map((spring, index) => (
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
