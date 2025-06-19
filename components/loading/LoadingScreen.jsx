import React, { useState, useEffect, useRef } from 'react';
import './LoadingScreen.css';

const LoadingSpinner = () => (
  <div className="loading-spinner-container">
    <div className="loading-spinner" />
  </div>
);

const LoadingScreen = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const onCompleteRef = useRef(onComplete);

  // Keep the ref updated with the latest callback
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    console.log('LoadingScreen state:', {
      isExiting,
      currentStep,
    });
  }, [isExiting, currentStep]);

  useEffect(() => {
    console.log('🚀 LoadingScreen useEffect running - setting up timers');

    // Progressive animation steps with better spacing for readability
    const stepTimers = [
      setTimeout(() => {
        console.log('📝 Step 1: Title appears');
        setCurrentStep(1);
      }, 300),
      setTimeout(() => {
        console.log('📝 Step 2: Subtitle appears');
        setCurrentStep(2);
      }, 1000),
      setTimeout(() => {
        console.log('📝 Step 3: Tagline appears');
        setCurrentStep(3);
      }, 1700),
      setTimeout(() => {
        console.log('📝 Step 4: Spinner appears');
        setCurrentStep(4);
      }, 2400),
      setTimeout(() => {
        console.log('📝 Step 5: Status appears');
        setCurrentStep(5);
      }, 3100),
      setTimeout(() => {
        console.log('📝 Step 6: Quote appears');
        setCurrentStep(6);
      }, 3800),
    ];

    // Start exit animations after entrance sequence has time to complete and be read
    const exitTimer = setTimeout(() => {
      console.log('🚪 Starting exit animations at 6.0s');
      setIsExiting(true);
    }, 6000);

    // Wait for exit animations to COMPLETE before calling onComplete
    const completeTimer = setTimeout(() => {
      console.log('✅ Exit animations finished, calling onComplete at 8.2s');
      onCompleteRef.current();
    }, 8200); // 8.2s - exit starts at 6.0s + 2.2s for all animations to complete

    return () => {
      console.log('🧹 Cleaning up LoadingScreen timers');
      stepTimers.forEach(clearTimeout);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, []); // No dependencies - this should only run once

  return (
    <div className={`loading-screen ${isExiting ? 'exiting' : ''}`}>
      <div className="loading-container">
        {/* Title */}
        <h2
          className={`loading-title ${
            isExiting ? 'exit' : currentStep >= 1 ? 'enter' : ''
          }`}
        >
          Welcome to Doug's Found Wood
        </h2>

        {/* Subtitle */}
        <div
          className={`loading-subtitle ${
            isExiting ? 'exit' : currentStep >= 2 ? 'enter' : ''
          }`}
        >
          Preparing your handcrafted journey...
        </div>

        {/* Tagline */}
        <div
          className={`loading-tagline ${
            isExiting ? 'exit' : currentStep >= 3 ? 'enter' : ''
          }`}
        >
          Each piece tells a story
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
          🪵 Crafting your experience... 🪵
        </div>

        {/* Quote */}
        <div
          className={`loading-quote ${
            isExiting ? 'exit' : currentStep >= 6 ? 'enter' : ''
          }`}
        >
          <div className="quote-text">
            "Always Unique, Handcrafted in Maine"
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
