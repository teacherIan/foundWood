/**
 * iPad Pro Portrait Mode - Quick Test Script
 *
 * Run this in the browser console on http://localhost:5176/
 * to immediately test iPad Pro portrait mode button visibility
 */

console.log('🎯 iPad Pro Quick Test Script - Starting...');

// Simulate iPad Pro portrait dimensions
const simulateIPadProPortrait = () => {
  console.log('📱 Simulating iPad Pro Portrait Mode (1024x1366)');

  // Force viewport to iPad Pro portrait dimensions
  const metaViewport = document.querySelector('meta[name="viewport"]');
  if (metaViewport) {
    metaViewport.setAttribute(
      'content',
      'width=1024, height=1366, initial-scale=1.0'
    );
  }

  // Manually trigger resize to iPad Pro dimensions
  Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
  Object.defineProperty(window, 'innerHeight', { value: 1366, writable: true });

  // Dispatch resize event
  window.dispatchEvent(new Event('resize'));

  console.log('📏 Viewport set to:', {
    width: window.innerWidth,
    height: window.innerHeight,
  });
};

// Check button visibility
const checkButtonVisibility = () => {
  console.log('🔍 Checking Button Visibility...');

  const elements = {
    header: document.querySelector('.header'),
    menu: document.querySelector('.menu'),
    menuItems: document.querySelectorAll('.menu-item'),
    canvas: document.querySelector('canvas'),
    galleryButtons: document.querySelectorAll(
      '*[text="Gallery"], *:contains("Gallery")'
    ),
    contactButtons: document.querySelectorAll(
      '*[text="Contact"], *:contains("Contact")'
    ),
  };

  Object.entries(elements).forEach(([name, element]) => {
    if (
      name === 'menuItems' ||
      name === 'galleryButtons' ||
      name === 'contactButtons'
    ) {
      console.log(`${name}: ${element.length} found`);
      element.forEach((el, i) => {
        const styles = window.getComputedStyle(el);
        console.log(`  ${name}[${i}]:`, {
          zIndex: styles.zIndex,
          opacity: styles.opacity,
          visibility: styles.visibility,
          display: styles.display,
          position: styles.position,
        });
      });
    } else if (element) {
      const styles = window.getComputedStyle(element);
      console.log(`${name}:`, {
        found: true,
        zIndex: styles.zIndex,
        opacity: styles.opacity,
        visibility: styles.visibility,
        display: styles.display,
        position: styles.position,
        background: styles.background,
      });
    } else {
      console.warn(`${name}: NOT FOUND`);
    }
  });
};

// Force button visibility with emergency styling
const forceButtonVisibility = () => {
  console.log('🚨 EMERGENCY: Forcing button visibility...');

  // Ultra-aggressive header styling
  const header = document.querySelector('.header');
  if (header) {
    Object.assign(header.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '10vh',
      zIndex: '99999',
      background: 'rgba(255, 0, 0, 0.9)',
      border: '5px solid yellow',
      display: 'flex',
      opacity: '1',
      visibility: 'visible',
    });
    console.log('✅ Header forced visible');
  }

  // Force all menu items visible
  document.querySelectorAll('.menu-item').forEach((item, i) => {
    Object.assign(item.style, {
      zIndex: '99998',
      background: 'cyan',
      border: '3px solid blue',
      opacity: '1',
      visibility: 'visible',
      display: 'flex',
    });
    console.log(`✅ Menu item ${i} forced visible`);
  });

  // Find and force Gallery/Contact text visible
  const textElements = document.querySelectorAll('*');
  let galleryFound = 0,
    contactFound = 0;

  textElements.forEach((el) => {
    if (el.textContent.trim() === 'Gallery') {
      galleryFound++;
      Object.assign(el.style, {
        background: 'yellow',
        color: 'red',
        fontSize: '3rem',
        zIndex: '99997',
        position: 'relative',
      });
    }
    if (el.textContent.trim() === 'Contact') {
      contactFound++;
      Object.assign(el.style, {
        background: 'orange',
        color: 'blue',
        fontSize: '3rem',
        zIndex: '99997',
        position: 'relative',
      });
    }
  });

  console.log(
    `✅ Forced ${galleryFound} Gallery elements, ${contactFound} Contact elements visible`
  );
};

// Test canvas positioning
const testCanvasPositioning = () => {
  console.log('🎨 Testing Canvas Positioning...');

  const canvas = document.querySelector('canvas');
  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    const styles = window.getComputedStyle(canvas);

    console.log('Canvas state:', {
      position: styles.position,
      top: styles.top,
      left: styles.left,
      width: styles.width,
      height: styles.height,
      zIndex: styles.zIndex,
      isolation: styles.isolation,
      transform: styles.transform,
      boundingRect: {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      isOffScreen:
        rect.right > window.innerWidth || rect.bottom > window.innerHeight,
    });
  } else {
    console.warn('❌ Canvas element not found');
  }
};

// Run all tests
const runAllTests = () => {
  console.log('🧪 Running Full iPad Pro Test Suite...');
  simulateIPadProPortrait();
  setTimeout(() => {
    checkButtonVisibility();
    testCanvasPositioning();
    forceButtonVisibility();
    console.log('✅ iPad Pro test suite completed');
  }, 1000);
};

// Auto-run if on localhost
if (window.location.hostname === 'localhost') {
  console.log('🏠 Localhost detected - running tests automatically');
  runAllTests();
} else {
  console.log('🌐 To run tests manually, call: runAllTests()');
}

// Export functions for manual testing
window.iPadProTest = {
  simulateIPadProPortrait,
  checkButtonVisibility,
  forceButtonVisibility,
  testCanvasPositioning,
  runAllTests,
};

console.log('🎯 iPad Pro test functions available at: window.iPadProTest');
