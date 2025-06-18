import './galleryTypeButton.css';
import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import types from '../galleries/dataTypes/types';

export default function GalleryTypeButton({
  img,
  header,
  onTypeSelect,
  index,
  setActiveGalleryType,
  setActiveGalleryTypeString,
}) {
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

  function handleClick() {
    let galleryTypeString;

    switch (header) {
      case 'Coffee Tables <br/> Plant Stands':
        galleryTypeString = types.smallTable;
        break;
      case 'Chairs <br/> Ottomans':
        galleryTypeString = types.chairs;
        break;
      case 'Tables':
        galleryTypeString = types.largeTable;
        break;
      case 'Structures':
        galleryTypeString = types.structure;
        break;
      case 'Others':
        galleryTypeString = types.other;
        break;
      default:
        galleryTypeString = types.chairs; // Default value should be 'chairs'
    }

    setActiveGalleryType(index, galleryTypeString);
    setActiveGalleryTypeString(galleryTypeString, index);
    onTypeSelect();
  }

  useEffect(() => {
    if (active) {
      api.start({
        // background: `linear-gradient(to bottom, #77481C11,#00000000, #77481C11)`,
        scale: 1,
      });
    } else {
      api.start({
        // background: `linear-gradient(to bottom, #00000000,#00000000, #77481C00)`,
        scale: 0.9,
      });
    }
  }, [active, api]);
  return (
    <animated.div
      onClick={() => handleClick()}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="galleryTypeButton"
      style={{
        ...springs,
      }}
    >
      {' '}
      <div
        className="galleryTypeHeader"
        dangerouslySetInnerHTML={{ __html: header }}
      />
      <img className="galleryTypeImage" src={img} />
    </animated.div>
  );
}
