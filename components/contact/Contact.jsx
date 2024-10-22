import './contact.css';
import { useSpring, animated, config } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';
import { MdExitToApp } from 'react-icons/md';
import Form from './Form';
import bg_image from '../../src/assets/contact_background.JPG';
import bg_image_long from '../../src/assets/poly-snapshot_long.JPG';
import bg_image_cell from '../../src/assets/poly-snapshot_cell.JPG';
import bg_image_cell_2 from '../../src/assets/poly-snapshot_2.JPG';
import bg_image_cell_3 from '../../src/assets/poly-snapshot_3.JPG';

export default function Contact({
  showContactPage,
  setShowContactPage,
  setIsAnimating,
  showTypes,
  showGallery,
}) {
  const myRef = useRef();
  const [hasAnimated, setHasAnimated] = useState(false);

  const configAnimation = {
    mass: 3,
    tension: 40,
    friction: 20,
    precision: 0.001,
  };

  const [springs, api] = useSpring(() => ({
    from: { left: '100%', opacity: 0 },
    config: configAnimation,
  }));

  useEffect(() => {
    if (showContactPage && !hasAnimated) {
      setHasAnimated(true);
      return;
    }
    if (showContactPage) {
      api.start({
        from: {
          left: '100%',
          // background: '#ebf0f2',
          opacity: 0,
        },
        to: {
          left: '0%',
          // background: '#77481C',
          opacity: 1,
        },
      });
    }
    if (!showContactPage) {
      api.start({
        from: {
          left: '0%',
          // background: '#77481C',
          opacity: 1,
        },
        to: {
          left: '100%',
          // background: '#ebf0f2',
          opacity: 0,
        },
      });
    }
  }, [showContactPage, hasAnimated]);

  function handleExitClick() {
    setShowContactPage(!showContactPage);
    if (showTypes || showGallery) {
      setIsAnimating(false);
    } else {
      setIsAnimating(true);
    }
  }

  return (
    <animated.div
      ref={myRef}
      className="contactContainer"
      style={{
        ...springs,
        left: hasAnimated ? springs.left : '100%',
        backgroundImage:
          window.innerWidth > window.innerHeight
            ? `url(${bg_image_long})`
            : `url(${bg_image_cell_3})`,
      }}
    >
      <Form setShowContactPage={setShowContactPage} />
      {/* <img className="contactBackgroundImage" src={bg_image} /> */}
      <MdExitToApp className="exit-icon" onClick={() => handleExitClick()} />
    </animated.div>
  );
}
