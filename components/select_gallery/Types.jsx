import { useSpring, animated } from '@react-spring/web';
import Type from './Type';
import './types.css';
import { useEffect } from 'react';
import chair from '../../src/assets/noBG/double_chair_final_noBG.png';
import table from '../../src/assets/noBG/table_noBG.png';
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
};

function useTypeSpring(showTypes, index) {
  const [spring, setSpring] = useSpring(() => ({
    opacity: showTypes ? '0' : '0',
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
    left: 50 + '%',
    config: configAnimation,
  }));

  useEffect(() => {
    if (showTypes) {
      setInformationSpring.start({ opacity: '1', top: '85vh', delay: 100 });
    } else {
      setInformationSpring.start({ opacity: '0', top: '20vh', delay: 150 });
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
          top: '85%',
          ...informationSpring,
        }}
      >
        Everything built by DFW will be completely unique as all furniture is
        built using the natural curvature of the wood. For more information,
        contact us using the button found in the top right corner of the page.
      </animated.div>
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
