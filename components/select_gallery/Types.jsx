import { useSpring, animated } from '@react-spring/web';
import Type from './Type';
import './types.css';
import { useEffect } from 'react';
import chair from '../../src/assets/noBG/double_chair_final_noBG.png';
import table from '../../src/assets/noBG/plantStand_new.png';
import picnicTable from '../../src/assets/noBG/picnic_table_B.png';
// import house from '../../src/assets/noBG/hobbit_house_noBG_2.png';
import house from '../../src/assets/noBG/playHouse-transformed.png';
// import house from '../../src/assets/noBG/fort_b_noBG.png';
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
    opacity: showTypes ? '0' : '0',
    top: showTypes ? '140svh' : '0svh',
    config: configAnimation,
  }));

  useEffect(() => {
    if (showTypes && window.innerWidth < 1200) {
      setSpring.start({
        top: 110 + (index > 1 ? 35 : 0) + 'svh',
        opacity: '1',
        delay: index * 100,
      });
    } else if (showTypes) {
      setSpring.start({ top: '120svh', opacity: '1', delay: index * 100 });
    } else {
      setSpring.start({ top: '0svh', opacity: '0', delay: index * 100 });
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
    'Coffee Tables & Plant Stands',
    'Chairs & Ottomans',
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
    if (showTypes && window.innerWidth < 1200) {
      setInformationSpring.start({ opacity: '1', top: '93svh', delay: 100 });
    } else if (showTypes) {
      setInformationSpring.start({ opacity: '1', top: '71svh', delay: 100 });
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
        className="findMe"
        style={{
          position: 'absolute',
          ...informationSpring,
        }}
      >
        Everything built by DFW is completely unique using the natural curvature
        of the wood, often incorporating roots and burls. As such, no two pieces
        are the same.
      </animated.div>
      <animated.div className="typesContainer">
        {springs.map((spring, index) => (
          <animated.div
            key={index}
            style={{
              position: 'absolute',
              left:
                window.innerWidth < 1200
                  ? 50 * (index % 2) + 'svw'
                  : 25 * index + 'svw',
              top: spring.top,
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
