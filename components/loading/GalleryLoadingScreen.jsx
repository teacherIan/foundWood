import React, { useState, useEffect, useRef } from 'react';
import './LoadingScreen.css'; // Reuse existing styles
import './GalleryLoadingScreen.css'; // Custom styles for gallery loading

const LoadingSpinner = () => (
  <div className="loading-spinner-container">
    <div className="loading-spinner" />
  </div>
);

// Gallery information for each type
const GALLERY_INFO = {
  chairs: {
    title: 'Chairs & Ottomans',
    subtitle: 'Handcrafted seating with character...',
    tagline: 'Built for comfort, designed to last',
    status: '🪑 Loading handcrafted seating... 🪑',
    quote: 'Every chair tells the story of Maine craftsmanship',
  },
  smallTable: {
    title: 'Coffee Tables & Plant Stands',
    subtitle: 'Functional art for your living space...',
    tagline: 'Where form meets function perfectly',
    status: '🌿 Loading functional furniture... 🌿',
    quote: 'Small pieces with big personality',
  },
  largeTable: {
    title: 'Tables',
    subtitle: 'Gathering places made from found wood...',
    tagline: 'Where memories are made around the table',
    status: '🍽️ Loading dining experiences... 🍽️',
    quote: 'Tables that bring people together',
  },
  structure: {
    title: 'Structures',
    subtitle: 'Architectural elements and custom builds...',
    tagline: 'Building dreams from reclaimed materials',
    status: '🏗️ Loading custom structures... 🏗️',
    quote: 'Creating spaces that inspire',
  },
  other: {
    title: 'Unique Creations',
    subtitle: 'One-of-a-kind pieces that defy categories...',
    tagline: 'Where imagination meets craftsmanship',
    status: '✨ Loading unique pieces... ✨',
    quote: 'Sometimes the best pieces are unexpected',
  },
};

const GalleryLoadingScreen = ({ galleryType, onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const onCompleteRef = useRef(onComplete);

  // Keep the ref updated with the latest callback
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Get gallery-specific information
  const galleryInfo = GALLERY_INFO[galleryType] || GALLERY_INFO.chairs;

  useEffect(() => {
    console.log('🖼️ GalleryLoadingScreen useEffect running for:', galleryType);

    // Progressive animation steps - shorter timing for gallery loading
    const stepTimers = [
      setTimeout(() => {
        console.log('📝 Gallery Step 1: Title appears');
        setCurrentStep(1);
      }, 200),
      setTimeout(() => {
        console.log('📝 Gallery Step 2: Subtitle appears');
        setCurrentStep(2);
      }, 800),
      setTimeout(() => {
        console.log('📝 Gallery Step 3: Tagline appears');
        setCurrentStep(3);
      }, 1400),
      setTimeout(() => {
        console.log('📝 Gallery Step 4: Spinner appears');
        setCurrentStep(4);
      }, 2000),
      setTimeout(() => {
        console.log('📝 Gallery Step 5: Status appears');
        setCurrentStep(5);
      }, 2600),
      setTimeout(() => {
        console.log('📝 Gallery Step 6: Quote appears');
        setCurrentStep(6);
      }, 3200),
    ];

    // Start exit animations - coordinated with CSS animation timing
    const exitTimer = setTimeout(() => {
      console.log('🚪 Starting gallery exit animations at 3.5s');
      setIsExiting(true);
    }, 3500);

    // Complete gallery loading - allows for 1.5s delay + 0.5s exit animation = 2s total
    const completeTimer = setTimeout(() => {
      console.log('✅ Gallery loading finished, entering gallery at 5.5s');
      onCompleteRef.current();
    }, 5500);

    return () => {
      console.log('🧹 Cleaning up GalleryLoadingScreen timers');
      stepTimers.forEach(clearTimeout);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [galleryType]); // Re-run if gallery type changes

  return (
    <div
      className={`loading-screen gallery-loading-screen ${
        isExiting ? 'exiting' : ''
      }`}
    >
      <div className="loading-container">
        {/* Title */}
        <h2
          className={`loading-title ${
            isExiting ? 'exit' : currentStep >= 1 ? 'enter' : ''
          }`}
        >
          {galleryInfo.title}
        </h2>

        {/* Subtitle */}
        <div
          className={`loading-subtitle ${
            isExiting ? 'exit' : currentStep >= 2 ? 'enter' : ''
          }`}
        >
          {galleryInfo.subtitle}
        </div>

        {/* Tagline */}
        <div
          className={`loading-tagline ${
            isExiting ? 'exit' : currentStep >= 3 ? 'enter' : ''
          }`}
        >
          {galleryInfo.tagline}
        </div>

        {/* Spinner */}
        <div
          className={`loading-spinner-wrapper ${
            isExiting ? 'exit' : currentStep >= 4 ? 'enter' : ''
          }`}
        >
          <LoadingSpinner />
        </div>

        {/* Status */}
        <div
          className={`loading-status ${
            isExiting ? 'exit' : currentStep >= 5 ? 'enter' : ''
          }`}
        >
          {galleryInfo.status}
        </div>

        {/* Quote */}
        <div
          className={`loading-quote ${
            isExiting ? 'exit' : currentStep >= 6 ? 'enter' : ''
          }`}
        >
          <div className="quote-text">"{galleryInfo.quote}"</div>
        </div>
      </div>
    </div>
  );
};

export default GalleryLoadingScreen;
