import './contact.css';
import { useSpring, animated, config } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';
import { MdExitToApp } from 'react-icons/md';
import Form from './Form';

export default function Contact({ showContactPage, setShowContactPage }) {
  const myRef = useRef();
  const [hasAnimated, setHasAnimated] = useState(false);

  const configAnimation = {
    mass: 1,
    tension: 5,
    friction: 4,
    precision: 0.0005,
  };

  const [springs, api] = useSpring(() => ({
    from: { left: '100%', background: '#ffffff', opacity: 0 },
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
          background: '#ebf0f2',
          opacity: 0,
        },
        to: {
          left: '0%',
          background: '#77481C',
          opacity: 1,
        },
      });
    }
    if (!showContactPage) {
      api.start({
        from: {
          left: '0%',
          background: '#77481C',
          opacity: 1,
        },
        to: {
          left: '100%',
          background: '#ebf0f2',
          opacity: 0,
        },
      });
    }
  }, [showContactPage, hasAnimated]);

  return (
    <animated.div
      ref={myRef}
      className="container"
      style={{ ...springs, left: hasAnimated ? springs.left : '100%' }}
    >
      <Form />
      <MdExitToApp
        className="exit-icon"
        onClick={() => setShowContactPage(!showContactPage)}
      />
    </animated.div>
  );
}
