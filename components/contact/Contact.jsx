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

  const configAnimation = { mass: 3, tension: 40, friction: 20 };

  const [springs, api] = useSpring(() => ({
    from: { transform: 'translateX(100%)', opacity: 0 },
    config: configAnimation,
  }));

  useEffect(() => {
    if (showContactPage) {
      api.start({
        from: { transform: 'translateX(100%)', opacity: 0 },
        to: { transform: 'translateX(0%)', opacity: 1 },
      });
    } else {
      api.start({
        to: { transform: 'translateX(100%)', opacity: 0 },
      });
    }
  }, [showContactPage, api]);

  function handleExitClick() {
    setShowContactPage(false);
    // If we were in gallery view before, keep it that way
    if (showGallery) {
      setIsAnimating(false);
    } else if (showTypes) {
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

        backgroundImage:
          window.innerWidth > window.innerHeight
            ? `url(${bg_image_long})`
            : `url(${bg_image_cell_3})`,
      }}
    >
      <Form
        handleExitClick={handleExitClick}
        setShowContactPage={setShowContactPage}
      ></Form>
    </animated.div>
  );
}
