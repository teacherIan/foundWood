import { useSpring, animated } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { MdExitToApp } from 'react-icons/md';
import emailjs from '@emailjs/browser';
import './form.css';
import bg_image_long from '../../src/assets/poly-snapshot_long.JPG';
import bg_image_cell_3 from '../../src/assets/poly-snapshot_3.JPG';
import { isIOSSafari } from '../new_experience/WebGLCleanup.js';

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
    // iOS Safari specific - trigger cleanup before closing contact page
    if (isIOSSafari() && window.globalWebGLCleanup) {
      console.log('📱 iOS Safari: Triggering cleanup from Contact exit button');
      window.globalWebGLCleanup.cleanup();
    }

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

      // iOS Safari specific - trigger cleanup after successful form submission
      if (isIOSSafari() && window.globalWebGLCleanup) {
        console.log(
          '📱 iOS Safari: Triggering cleanup after Contact form submission'
        );
        window.globalWebGLCleanup.cleanup();
      }

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
        backgroundImage:
          window.innerWidth > window.innerHeight
            ? `url(${bg_image_long})`
            : `url(${bg_image_cell_3})`,
      }}
    >
      <div className="formContainer">
        <div className="formHeader">
          <span className="formHeaderText">We'd Love to Hear From You!</span>
          <button
            className="exit-icon"
            onClick={handleExitClick}
            aria-label="Close form"
          >
            <MdExitToApp />
          </button>
        </div>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="form-control">
            <input
              autoComplete="off"
              name="name"
              ref={nameInputRef}
              type="text"
              required
            />
            <label ref={nameLabelRef}>
              {nameLabel.length > 1 ? nameLabel : 'Name:'}
            </label>
          </div>

          <div className="form-control">
            <input
              autoComplete="off"
              name="email"
              ref={emailInputRef}
              type="email"
              required
            />
            <label ref={emailLabelRef}>
              {emailLabel.length > 1 ? emailLabel : 'Email:'}
            </label>
          </div>

          <div className="form-control">
            <input
              autoComplete="off"
              name="message"
              ref={messageInputRef}
              type="text"
              required
            />
            <label ref={messageLabelRef}>
              {messageLabel.length > 1 ? messageLabel : 'Message:'}
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
