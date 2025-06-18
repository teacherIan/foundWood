/**
 * EMERGENCY iPad Pro Button Visibility Test Script
 *
 * This script should be run in the browser console immediately after opening
 * http://localhost:5177/ on an iPad Pro (or simulated iPad Pro viewport)
 */

console.log('🚨 EMERGENCY iPad Pro Button Test Starting...');

// Function to simulate iPad Pro portrait mode
function simulateIPadProPortrait() {
  console.log('📱 Simulating iPad Pro 12.9" Portrait Mode (1024x1366)');

  // Create a meta viewport element if it doesn't exist
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    document.head.appendChild(viewport);
  }
  viewport.content =
    'width=1024, height=1366, initial-scale=1.0, user-scalable=no';

  // Trigger window resize to iPad Pro dimensions
  Object.defineProperty(window, 'innerWidth', {
    value: 1024,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(window, 'innerHeight', {
    value: 1366,
    writable: true,
    configurable: true,
  });

  // Dispatch resize event
  window.dispatchEvent(new Event('resize'));

  console.log('✅ iPad Pro viewport simulated:', {
    width: window.innerWidth,
    height: window.innerHeight,
    isPortrait: window.innerHeight > window.innerWidth,
  });
}

// Function to force button visibility with nuclear CSS
function forceButtonsUltraVisible() {
  console.log('🚨 NUCLEAR OPTION: Forcing buttons to be ultra-visible...');

  const css = `
    /* NUCLEAR BUTTON FORCING CSS */
    .header {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 15vh !important;
      z-index: 9999999 !important;
      background: linear-gradient(45deg, red, yellow, lime, cyan) !important;
      border: 20px solid magenta !important;
      display: flex !important;
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: none !important;
    }
    
    .menu {
      display: flex !important;
      width: 100% !important;
      justify-content: space-around !important;
      align-items: center !important;
      pointer-events: auto !important;
    }
    
    .menu-item,
    div[class*="menu"],
    div:contains("Gallery"),
    div:contains("Contact") {
      position: relative !important;
      z-index: 9999998 !important;
      background: linear-gradient(45deg, orange, purple, blue) !important;
      color: white !important;
      border: 15px solid red !important;
      border-radius: 25px !important;
      padding: 30px 40px !important;
      margin: 20px !important;
      font-size: 5rem !important;
      font-weight: 900 !important;
      text-shadow: 5px 5px 0px black !important;
      box-shadow: 0 0 100px red, inset 0 0 50px yellow !important;
      opacity: 1 !important;
      visibility: visible !important;
      display: flex !important;
      pointer-events: auto !important;
      cursor: pointer !important;
      transform: scale(1.5) translateZ(999px) !important;
      animation: flashingButton 1s infinite alternate !important;
    }
    
    @keyframes flashingButton {
      0% { background: red; border-color: yellow; }
      100% { background: blue; border-color: lime; }
    }
    
    /* Force ANY element with Gallery or Contact text to be visible */
    *:contains("Gallery"),
    *:contains("Contact") {
      background: yellow !important;
      color: red !important;
      font-size: 6rem !important;
      z-index: 9999997 !important;
      position: relative !important;
      border: 10px solid green !important;
      padding: 50px !important;
      display: block !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
  `;

  // Remove any existing emergency styles
  const existingStyle = document.getElementById('emergency-button-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Add the emergency styles
  const style = document.createElement('style');
  style.id = 'emergency-button-styles';
  style.textContent = css;
  document.head.appendChild(style);

  console.log('✅ Nuclear CSS applied for button visibility');
}

// Function to force buttons via JavaScript DOM manipulation
function forceButtonsWithJavaScript() {
  console.log('🔧 Forcing buttons with JavaScript DOM manipulation...');

  // Find header and force its visibility
  const header = document.querySelector('.header');
  if (header) {
    const headerStyles = {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '100vw',
      height: '15vh',
      'z-index': '9999999',
      background: 'linear-gradient(45deg, red, yellow)',
      border: '20px solid cyan',
      display: 'flex',
      opacity: '1',
      visibility: 'visible',
    };

    Object.entries(headerStyles).forEach(([prop, value]) => {
      header.style.setProperty(prop, value, 'important');
    });

    console.log('🔧 Header forced visible:', header);
  } else {
    console.error('❌ Header element not found!');
  }

  // Find menu and force its visibility
  const menu = document.querySelector('.menu');
  if (menu) {
    const menuStyles = {
      display: 'flex',
      width: '100%',
      'justify-content': 'space-around',
      'align-items': 'center',
      'pointer-events': 'auto',
    };

    Object.entries(menuStyles).forEach(([prop, value]) => {
      menu.style.setProperty(prop, value, 'important');
    });

    console.log('🔧 Menu forced visible:', menu);
  } else {
    console.error('❌ Menu element not found!');
  }

  // Force all possible button elements
  const buttonSelectors = [
    '.menu-item',
    '[class*="menu"]',
    'div[class*="animated"]',
    '.header div',
    '.menu div',
  ];

  let buttonCount = 0;
  buttonSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (
        el.textContent &&
        (el.textContent.includes('Gallery') ||
          el.textContent.includes('Contact') ||
          el.classList.contains('menu-item'))
      ) {
        const buttonStyles = {
          position: 'relative',
          'z-index': '9999998',
          background: 'linear-gradient(45deg, orange, purple)',
          color: 'white',
          border: '15px solid red',
          'border-radius': '25px',
          padding: '30px 40px',
          margin: '20px',
          'font-size': '5rem',
          'font-weight': '900',
          opacity: '1',
          visibility: 'visible',
          display: 'flex',
          'pointer-events': 'auto',
          cursor: 'pointer',
          transform: 'scale(1.5)',
          'text-shadow': '5px 5px 0px black',
          'box-shadow': '0 0 100px red',
        };

        Object.entries(buttonStyles).forEach(([prop, value]) => {
          el.style.setProperty(prop, value, 'important');
        });

        buttonCount++;
        console.log(
          `🔧 Button ${buttonCount} forced visible:`,
          el.textContent?.trim(),
          el
        );
      }
    });
  });

  console.log(`✅ ${buttonCount} buttons forced visible via JavaScript`);
}

// Function to check current button state
function checkButtonState() {
  console.log('🔍 Checking current button state...');

  const header = document.querySelector('.header');
  const menu = document.querySelector('.menu');
  const menuItems = document.querySelectorAll('.menu-item');

  console.log('Header element:', {
    found: !!header,
    visible: header ? window.getComputedStyle(header).visibility : 'not found',
    display: header ? window.getComputedStyle(header).display : 'not found',
    zIndex: header ? window.getComputedStyle(header).zIndex : 'not found',
  });

  console.log('Menu element:', {
    found: !!menu,
    visible: menu ? window.getComputedStyle(menu).visibility : 'not found',
    display: menu ? window.getComputedStyle(menu).display : 'not found',
  });

  console.log('Menu items:', {
    count: menuItems.length,
    items: Array.from(menuItems).map((item, i) => ({
      index: i,
      text: item.textContent?.trim(),
      visible: window.getComputedStyle(item).visibility,
      display: window.getComputedStyle(item).display,
      opacity: window.getComputedStyle(item).opacity,
    })),
  });
}

// Main test function
function runEmergencyButtonTest() {
  console.log('🚨 RUNNING EMERGENCY BUTTON TEST FOR IPAD PRO');

  // Step 1: Simulate iPad Pro if not already
  if (window.innerWidth !== 1024 || window.innerHeight !== 1366) {
    simulateIPadProPortrait();
  }

  // Step 2: Check initial state
  console.log('🔍 STEP 1: Checking initial button state...');
  checkButtonState();

  // Step 3: Force buttons with CSS
  console.log('🎨 STEP 2: Applying nuclear CSS...');
  forceButtonsUltraVisible();

  // Step 4: Force buttons with JavaScript
  console.log('🔧 STEP 3: Forcing with JavaScript...');
  setTimeout(() => {
    forceButtonsWithJavaScript();

    // Step 5: Final check
    setTimeout(() => {
      console.log('✅ STEP 4: Final button state check...');
      checkButtonState();
      console.log('🏁 EMERGENCY BUTTON TEST COMPLETE');
    }, 1000);
  }, 500);
}

// Auto-run if on localhost
if (window.location.hostname === 'localhost') {
  console.log(
    '🏠 Localhost detected - running emergency button test automatically in 2 seconds...'
  );
  setTimeout(runEmergencyButtonTest, 2000);
} else {
  console.log('🌐 To run test manually, call: runEmergencyButtonTest()');
}

// Make functions available globally
window.emergencyButtonTest = {
  runEmergencyButtonTest,
  simulateIPadProPortrait,
  forceButtonsUltraVisible,
  forceButtonsWithJavaScript,
  checkButtonState,
};

console.log(
  '🎯 Emergency button test functions available at: window.emergencyButtonTest'
);
