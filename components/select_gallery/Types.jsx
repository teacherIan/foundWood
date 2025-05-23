import { useSpring, animated } from '@react-spring/web';
import Type from './Type';
import './types.css';
import { useEffect } from 'react';
import chair from '../../src/assets/noBG/double_chair_final_noBG.png';
// import table from '../../src/assets/noBG/plantStand_new.png';
import table from '../../src/assets/gallery/dentist.png';
import picnicTable from '../../src/assets/noBG/picnic_table_B.png';
import house from '../../src/assets/noBG/playHouse-transformed.png';
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
      setSpring.start({
        y: 110 + (index > 1 ? 52 : 5),
        opacity: 1,
        delay: index * 100,
      });
    } else if (showTypes) {
      setSpring.start({
        y: index % 2 === 0 ? 112 : 150,
        opacity: 1,
        delay: index * 200,
      });
    } else {
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
    // left: 50 + 'svw',
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
              marginLeft: '-10px',
              position: 'absolute',
              left:
                window.innerWidth < window.innerHeight
                  ? 50 * (index % 2) + 'svw'
                  : 22 * index + 'svw',
              transform: spring.y.to((y) => `translateY(${y}svh)`), // Use translateY
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
