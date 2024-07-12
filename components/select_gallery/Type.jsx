import './type.css';
import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function Type({ img, header, onTypeSelect }) {
  const [active, setActive] = useState(false);

  const configAnimation = {
    mass: 1,
    tension: 100,
    friction: 7,
    precision: 0.0005,
  };

  const [springs, api] = useSpring(() => ({
    // background: `linear-gradient(to bottom, #ff000000,#ff000000, #ff000000)`,
    scale: 0.9,
    config: configAnimation,
  }));

  useEffect(() => {
    if (active) {
      api.start({
        // background: `linear-gradient(to bottom, #77481C11,#00000000, #77481C11)`,
        scale: 1.2,
      });
    } else {
      api.start({
        // background: `linear-gradient(to bottom, #00000000,#00000000, #77481C00)`,
        scale: 0.8,
      });
    }
  }, [active, api]);

  return (
    <animated.div
      onClick={onTypeSelect}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="typeContainer"
      style={{
        ...springs,
      }}
    >
      <div className="typeHeader">{header}</div>
      <img className="typeImage" src={img} />
    </animated.div>
  );
}
