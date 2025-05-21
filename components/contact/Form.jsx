import { useState, useEffect, useRef } from 'react';
import './form.css';
import { FaFacebook } from 'react-icons/fa6';
import emailjs from '@emailjs/browser';

export default function Form({ setShowContactPage, handleExitClick }) {
  const [nameLabel, setNameLabel] = useState(['']);
  const [emailLabel, setEmailLabel] = useState(['']);
  const [messageLabel, setMessageLabel] = useState(['']);
  const nameInputRef = useRef(null);
  const nameLabelRef = useRef(null);
  const emailInputRef = useRef(null);
  const emailLabelRef = useRef(null);
  const messageInputRef = useRef(null);
  const messageLabelRef = useRef(null);

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
    <div className="formContainer">
      <span
        onClick={() => {
          handleExitClick();
        }}
        className="exit-icon"
      >
        {'X'}
      </span>
      <div className="formHeader">We'd Love to Hear From You!</div>
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
            {nameLabel.length > 1 ? nameLabel : 'Name'}
          </label>
        </div>

        <div className="form-control">
          <input
            autoComplete="off"
            name="email"
            ref={emailInputRef}
            type="text"
            required
          />
          <label ref={emailLabelRef}>
            {emailLabel.length > 1 ? emailLabel : 'Email'}
          </label>
        </div>

        <div className="form-control" style={{ width: '50vw' }}>
          <input
            autoComplete="off"
            name="message"
            ref={messageInputRef}
            type="text"
            required
          />
          <label ref={messageLabelRef}>
            {messageLabel.length > 1 ? messageLabel : 'Message'}
          </label>
        </div>

        <button className="btn">
          <span class="btn-text">Get in Touch</span>
        </button>
      </form>
      <a href="https://www.facebook.com/DougsFoundWood/" target="_blank">
        <span className="facebookText">Follow us on</span>{' '}
        <FaFacebook className="facebookIcon" />
      </a>
    </div>
  );
}
