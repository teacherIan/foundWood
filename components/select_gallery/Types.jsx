import { useSpring, animated } from '@react-spring/web';
import Type from './Type';
import './types.css';
import { useEffect, useLayoutEffect, useState } from 'react';
import chair from '../../src/assets/noBG/double_chair_final_noBG.png';
import table from '../../src/assets/noBG/table_noBG.png';
import picnicTable from '../../src/assets/noBG/picnic_table_B.png';
// import house from '../../src/assets/noBG/hobbit_house_noBG_2.png';
import house from '../../src/assets/noBG/playHouse-transformed.png';
// import house from '../../src/assets/noBG/fort_b_noBG.png';
import light from '../../src/assets/noBG/light_noBG.png';

function useTypeSpring(showTypes, index) {
  const configAnimation = {
    mass: 6,
    tension: 300,
    friction: 60,
    precision: 0.0001,
  };

  const [spring, setSpring] = useSpring(() => ({
    opacity: showTypes ? '1' : '0',
    top: showTypes ? '110svh' : '0svh',
    config: configAnimation,
  }));

  useEffect(() => {
    if (showTypes) {
      setSpring.start({ top: '110vh', opacity: '1', delay: index * 100 });
    } else {
      setSpring.start({ top: '0vh', opacity: '0', delay: index * 100 });
    }
  }, [showTypes]);

  return spring;
}

export default function Types({
  showTypes,
  onTypeSelect,
  setActiveGalleryType,
}) {
  const imgArray = [chair, table, picnicTable, house, light];
  const imgHeader = [
    'Chairs & Ottomans',
    'Coffee Tables & Plant Stands',
    'Tables',
    'Structures',
    // 'Others',
  ];

  const springs = Array.from({ length: 4 }, (_, index) =>
    useTypeSpring(showTypes, index)
  );

  return (
    <>
      <animated.div className="typesContainer">
        {springs.map((spring, index) => (
          <animated.div
            key={index}
            style={{
              position: 'absolute',
              left: 25 * index + 'svw',
              ...spring,
            }}
          >
            <Type
              img={imgArray[index]}
              header={imgHeader[index]}
              onTypeSelect={onTypeSelect}
              index={index}
              setActiveGalleryType={setActiveGalleryType}
            />
          </animated.div>
        ))}
      </animated.div>
    </>
  );
}
