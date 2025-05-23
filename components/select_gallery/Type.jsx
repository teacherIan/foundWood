import './type.css';
import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function Type({
  img,
  header,
  onTypeSelect,
  index,
  setActiveGalleryType,
  setActiveGalleryTypeString,
}) {
  const [active, setActive] = useState(false);

  const typeContainerStyle = {
    width: window.innerWidth > window.innerHeight ? 54 + 'svw' : 30 + 'svw',
  };

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

  function handleClick() {
    if (header == 'Coffee Tables & Plant Stands') {
      setActiveGalleryTypeString('smallTable');
    }

    if (header == 'Chairs & Ottomans') {
      setActiveGalleryTypeString('chairs');
    }

    if (header == 'Tables') {
      setActiveGalleryTypeString('largeTable');
    }

    if (header == 'Structures') {
      setActiveGalleryTypeString('structure');
    }

    if (header == 'Others') {
      setActiveGalleryTypeString('other');
    }

    setActiveGalleryType(index);
    onTypeSelect();
  }

  useEffect(() => {
    if (active) {
      api.start({
        // background: `linear-gradient(to bottom, #77481C11,#00000000, #77481C11)`,
        scale: 0.9,
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
      onClick={() => handleClick()}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="typeContainer"
      style={{
        typeContainerStyle,
        ...springs,
      }}
    >
           {' '}
      <div
        className="typeHeader"
        dangerouslySetInnerHTML={{ __html: header }}
      />
            <img className="typeImage" src={img} />
    </animated.div>
  );
}
