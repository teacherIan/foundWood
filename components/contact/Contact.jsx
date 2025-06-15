import { useSpring, animated } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import emailjs from '@emailjs/browser';
import './form.css';
import bg_image_long from '../../src/assets/poly-snapshot_long.JPG';
import bg_image_cell_3 from '../../src/assets/poly-snapshot_3.JPG';
// TEMPORARILY DISABLED: Custom WebGL cleanup to rely on R3F's built-in memory management
// import { isIOSSafari } from '../new_experience/WebGLCleanup.js';

export default function Contact({
  showContactPage,
  setShowContactPage,
  setIsAnimating,
  showTypes,
  showGallery,
}) {
  const myRef = useRef();
  const [nameLabel, setNameLabel] = useState(['']);
  const [emailLabel, setEmailLabel] = useState(['']);
  const [messageLabel, setMessageLabel] = useState(['']);
  const nameInputRef = useRef(null);
  const nameLabelRef = useRef(null);
  const emailInputRef = useRef(null);
  const emailLabelRef = useRef(null);
  const messageInputRef = useRef(null);
  const messageLabelRef = useRef(null);

  const configAnimation = { mass: 3, tension: 40, friction: 20 };

  const [springs, api] = useSpring(() => ({
    from: {
      opacity: 0,
      transform: 'scale(0.8) translateY(30px)',
      backdropFilter: 'blur(0px)',
    },
    config: configAnimation,
  }));

  useEffect(() => {
    if (showContactPage) {
      api.start({
        from: {
          opacity: 0,
          transform: 'scale(0.8) translateY(30px)',
          backdropFilter: 'blur(0px)',
        },
        to: {
          opacity: 1,
          transform: 'scale(1) translateY(0px)',
          backdropFilter: 'blur(10px)',
        },
      });
    } else {
      api.start({
        to: {
          opacity: 0,
          transform: 'scale(0.8) translateY(30px)',
          backdropFilter: 'blur(0px)',
        },
      });
    }
  }, [showContactPage, api]);

  // Add ESC key support for closing the contact form
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showContactPage) {
        handleExitClick();
      }
    };

    if (showContactPage) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showContactPage]);

  function handleExitClick() {
    // TEMPORARILY DISABLED: iOS Safari specific cleanup to rely on R3F's built-in memory management
    // if (isIOSSafari() && window.globalWebGLCleanup) {
    //   console.log('📱 iOS Safari: Triggering cleanup from Contact exit button');
    //   window.globalWebGLCleanup.cleanup();
    // }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const serviceId = 'service_ucr96wu';
    const templateId = 'template_pkhjdgm';

    try {
      const form = new FormData(e.target);
      const name = form.get('name');
      const email = form.get('email');
      const message = form.get('message');

      await emailjs.send(serviceId, templateId, {
        name,
        email,
        message,
      });

      // TEMPORARILY DISABLED: iOS Safari specific cleanup to rely on R3F's built-in memory management
      // if (isIOSSafari() && window.globalWebGLCleanup) {
      //   console.log(
      //     '📱 iOS Safari: Triggering cleanup after Contact form submission'
      //   );
      //   window.globalWebGLCleanup.cleanup();
      // }

      setShowContactPage(false);
      alert('Email sent successfully!');
    } catch (error) {
      alert('Unable to send email. Please check connection');
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    emailjs.init('nsZGLCenvPQb-kW11');
  }, []);

  useEffect(() => {
    if (nameLabelRef.current) {
      const label = nameLabelRef.current;
      const text = label.innerText;
      const letters = text.split('').map((letter, idx) => ({
        letter,
        delay: idx * 50,
      }));

      const timer = setInterval(() => {
        if (letters.length > 0) {
          const [currentLetter, ...restLetters] = letters;
          setNameLabel((prevLabels) => [
            ...prevLabels,
            <span
              key={prevLabels.length}
              style={{ transitionDelay: `${currentLetter.delay}ms` }}
            >
              {currentLetter.letter}
            </span>,
          ]);
          letters.splice(0, 1);
        } else {
          clearInterval(timer);
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, []);

  useEffect(() => {
    if (emailLabelRef.current) {
      const label = emailLabelRef.current;
      const text = label.innerText;
      const letters = text.split('').map((letter, idx) => ({
        letter,
        delay: idx * 50,
      }));

      const timer = setInterval(() => {
        if (letters.length > 0) {
          const [currentLetter, ...restLetters] = letters;
          setEmailLabel((prevLabels) => [
            ...prevLabels,
            <span
              key={prevLabels.length}
              style={{ transitionDelay: `${currentLetter.delay}ms` }}
            >
              {currentLetter.letter}
            </span>,
          ]);
          letters.splice(0, 1);
        } else {
          clearInterval(timer);
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, []);

  useEffect(() => {
    if (messageLabelRef.current) {
      const label = messageLabelRef.current;
      const text = label.innerText;
      const letters = text.split('').map((letter, idx) => ({
        letter,
        delay: idx * 50,
      }));

      const timer = setInterval(() => {
        if (letters.length > 0) {
          const [currentLetter, ...restLetters] = letters;
          setMessageLabel((prevLabels) => [
            ...prevLabels,
            <span
              key={prevLabels.length}
              style={{ transitionDelay: `${currentLetter.delay}ms` }}
            >
              {currentLetter.letter}
            </span>,
          ]);
          letters.splice(0, 1);
        } else {
          clearInterval(timer);
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, []);

  return (
    <animated.div
      ref={myRef}
      className="contactContainer"
      style={{
        ...springs,
        // Glassmorphism background that shows 3D scene
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: springs.backdropFilter,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="formContainer">
        {/* Top Border Exit Bar */}
        <div 
          className="exit-border-top" 
          onClick={handleExitClick}
          aria-label="Close contact form (ESC)"
          title="Tap anywhere here to close the contact form"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleExitClick();
            }
          }}
        >
          <span className="exit-border-top-text">Tap anywhere here to close</span>
          <div className="exit-border-top-icon">
            <MdClose />
          </div>
        </div>

        <div className="formHeader">
          <span className="formHeaderText">We'd Love to Hear From You!</span>
        </div>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="form-control">
            <input
              autoComplete="off"
              name="name"
              ref={nameInputRef}
              type="text"
              required
              placeholder=" "
            />
            <label ref={nameLabelRef}>
              {nameLabel.length > 1 ? nameLabel : 'Name'}
            </label>
          </div>

          <div className="form-control">
            <input
              autoComplete="off"
              name="email"
              ref={emailInputRef}
              type="email"
              required
              placeholder=" "
            />
            <label ref={emailLabelRef}>
              {emailLabel.length > 1 ? emailLabel : 'Email'}
            </label>
          </div>

          <div className="form-control">
            <textarea
              autoComplete="off"
              name="message"
              ref={messageInputRef}
              required
              placeholder=" "
              rows="4"
            />
            <label ref={messageLabelRef}>
              {messageLabel.length > 1 ? messageLabel : 'Message'}
            </label>
          </div>

          <button className="btn">
            <span className="btn-text">Get in Touch</span>
          </button>
        </form>
        <a href="https://www.facebook.com/DougsFoundWood/" target="_blank">
          <span className="facebookText">Follow us on</span>{' '}
          <FaFacebook className="facebookIcon" />
        </a>
      </div>
    </animated.div>
  );
}
