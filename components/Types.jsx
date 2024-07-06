import { useSpring, animated, config } from '@react-spring/web';
import Type from './Type';
import './types.css';
import { useEffect } from 'react';
import chair from '/noBG/double_chair_final_noBG.png?url';

function useTypeSpring(showTypes, index) {
  const configAnimation = {
    mass: 6,
    tension: 300,
    friction: 60,
    precision: 0.0001,
  };

  const [spring, setSpring] = useSpring(() => ({
    opacity: showTypes ? 1 : 0,
    top: showTypes ? '100svh' : '0svh',
    config: configAnimation,
  }));

  useEffect(() => {
    if (showTypes) {
      setSpring({ top: '100vh', opacity: 1, delay: index * 300 });
    } else {
      setSpring({ top: '0vh', opacity: 0, delay: index * 300 });
    }
  }, [showTypes, index, setSpring]);

  return spring;
}

export default function Types({ showTypes, setShowTypes }) {
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
            <Type img={chair} />
          </animated.div>
        ))}
      </animated.div>
    </>
  );
}
