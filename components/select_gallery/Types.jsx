import { useSpring, animated } from '@react-spring/web';
import Type from './Type';
import './types.css';
import { useEffect } from 'react';
import chair from '../../src/assets/noBG/double_chair_final_noBG.png';
import table from '../../src/assets/noBG/table_noBG.png';
import picnicTable from '../../src/assets/noBG/picnic_table_B.png';
import house from '../../src/assets/noBG/hobbit_house_noBG.png';
import light from '../../src/assets/noBG/light_noBG.png';

function useTypeSpring(showTypes, index) {
  const configAnimation = {
    mass: 6,
    tension: 300,
    friction: 60,
    precision: 0.0001,
  };

  const [spring, setSpring] = useSpring(() => ({
    opacity: showTypes ? 1 : 0,
    top: showTypes ? '110svh' : '0svh',
    config: configAnimation,
  }));

  useEffect(() => {
    if (showTypes) {
      setSpring({ top: '110vh', opacity: 1, delay: index * 800 });
    } else {
      setSpring({ top: '0vh', opacity: 0, delay: index * 800 });
    }
  }, [showTypes, index, setSpring]);

  return spring;
}

export default function Types({ showTypes, setShowTypes }) {
  const imgArray = [chair, table, picnicTable, house, light];
  const imgHeader = [
    'Chairs',
    'Stools & Plant Stands',
    'Tables',
    'Structures',
    'Others',
  ];

  const springs = Array.from({ length: 5 }, (_, index) =>
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
              left: 20 * index + 'svw',
              ...spring,
            }}
          >
            <Type img={imgArray[index]} header={imgHeader[index]} />
          </animated.div>
        ))}
      </animated.div>
    </>
  );
}
