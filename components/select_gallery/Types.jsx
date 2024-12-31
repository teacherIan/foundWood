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
    opacity: showTypes ? '0' : '0',
    top: showTypes ? '140svh' : '0svh',
    config: configAnimation,
  }));

  useEffect(() => {
    if (showTypes && window.innerWidth < window.innerHeight) {
      setSpring.start({
        top: 110 + (index > 1 ? 52 : 5) + 'svh',
        opacity: '1',
        delay: index * 100,
      });
      //wide Screen
    } else if (showTypes) {
      setSpring.start({
        top: index % 2 == 0 ? '112svh' : '150svh',
        opacity: '1',
        delay: index * 200,
      });
    } else {
      setSpring.start({ top: '-50svh', opacity: '0', delay: index * 200 });
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
