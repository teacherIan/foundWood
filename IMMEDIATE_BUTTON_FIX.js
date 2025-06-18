// IMMEDIATE iPad Pro Button Fix - No Imports Required
// Copy and paste this entire script into browser console on iPad Pro

console.log('🚨 IMMEDIATE BUTTON FIX STARTING...');

// Detect iPad Pro Portrait
const detectIPadProPortrait = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isPortrait = height > width;
  const isIPadPro = isPortrait && width >= 768 && height >= 1000;

  console.log('📱 Device Detection:', {
    viewport: `${width}x${height}`,
    isPortrait,
    isIPadPro,
    userAgent: navigator.userAgent.includes('iPad') ? 'iPad' : 'Other',
  });

  return isIPadPro;
};

if (!detectIPadProPortrait()) {
  console.warn(
    '⚠️ Not iPad Pro portrait mode - script will still run for testing'
  );
}

// Step 1: Find ALL possible button elements
console.log('🔍 Step 1: Finding button elements...');
const buttonMap = new Map();

// Search for header
const header = document.querySelector('.header');
if (header) {
  buttonMap.set('header', header);
  console.log('✅ Found header:', header);
} else {
  console.error('❌ Header NOT found');
}

// Search for menu
const menu = document.querySelector('.menu');
if (menu) {
  buttonMap.set('menu', menu);
  console.log('✅ Found menu:', menu);
} else {
  console.error('❌ Menu NOT found');
}

// Search for menu items
const menuItems = document.querySelectorAll('.menu-item');
console.log(`🔍 Found ${menuItems.length} .menu-item elements`);
menuItems.forEach((item, index) => {
  buttonMap.set(`menu-item-${index}`, item);
  console.log(`✅ Menu item ${index}:`, item.textContent?.trim(), item);
});

// Search for ANY elements containing Gallery or Contact
const allElements = document.querySelectorAll('*');
let galleryCount = 0;
let contactCount = 0;

allElements.forEach((el, index) => {
  const text = el.textContent?.trim();
  if (text === 'Gallery') {
    galleryCount++;
    buttonMap.set(`gallery-${galleryCount}`, el);
    console.log(`✅ Gallery element ${galleryCount}:`, el);
  }
  if (text === 'Contact') {
    contactCount++;
    buttonMap.set(`contact-${contactCount}`, el);
    console.log(`✅ Contact element ${contactCount}:`, el);
  }
});

console.log(`📊 Total elements found: ${buttonMap.size}`);
console.log(
  `📊 Gallery elements: ${galleryCount}, Contact elements: ${contactCount}`
);

// Step 2: Analyze current state
console.log('🔬 Step 2: Analyzing current visibility...');
buttonMap.forEach((element, key) => {
  const computed = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  const analysis = {
    display: computed.display,
    opacity: computed.opacity,
    visibility: computed.visibility,
    pointerEvents: computed.pointerEvents,
    zIndex: computed.zIndex,
    position: computed.position,
    transform: computed.transform,
    isolation: computed.isolation,
    contain: computed.contain,
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
  };

  console.log(`📋 ${key} analysis:`, analysis);

  // Identify issues
  const issues = [];
  if (computed.display === 'none') issues.push('display: none');
  if (computed.opacity === '0') issues.push('opacity: 0');
  if (computed.visibility === 'hidden') issues.push('visibility: hidden');
  if (computed.pointerEvents === 'none') issues.push('pointer-events: none');
  if (rect.width === 0 || rect.height === 0) issues.push('zero dimensions');
  if (rect.top < -100 || rect.left < -100) issues.push('off-screen');

  if (issues.length > 0) {
    console.warn(`⚠️ ${key} issues:`, issues);
  } else {
    console.log(`✅ ${key} appears visible`);
  }
});

// Step 3: Apply emergency CSS
console.log('💉 Step 3: Injecting emergency CSS...');
const emergencyCSS = `
/* EMERGENCY BUTTON VISIBILITY */
.header {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: auto !important;
  min-height: 60px !important;
  z-index: 999999 !important;
  background: rgba(255, 0, 0, 0.9) !important;
  border: 3px solid yellow !important;
  display: flex !important;
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: auto !important;
  isolation: auto !important;
  contain: none !important;
  transform: none !important;
  padding: 10px !important;
}

.menu {
  display: flex !important;
  width: 100% !important;
  justify-content: space-around !important;
  align-items: center !important;
  pointer-events: auto !important;
  z-index: inherit !important;
}

.menu-item,
.menu > *,
.header > * {
  display: flex !important;
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: auto !important;
  z-index: auto !important;
  position: relative !important;
  isolation: auto !important;
  contain: none !important;
  transform: none !important;
  background: rgba(0, 255, 0, 0.9) !important;
  border: 2px solid blue !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  color: black !important;
  font-weight: bold !important;
  cursor: pointer !important;
  min-width: 80px !important;
  min-height: 40px !important;
  align-items: center !important;
  justify-content: center !important;
}
`;

const style = document.createElement('style');
style.id = 'emergency-button-css';
style.textContent = emergencyCSS;
document.head.appendChild(style);
console.log('✅ Emergency CSS injected');

// Step 4: Force all elements via JavaScript
console.log('🔧 Step 4: Forcing elements via JavaScript...');
buttonMap.forEach((element, key) => {
  // Remove any problematic styles
  element.style.setProperty('display', 'flex', 'important');
  element.style.setProperty('opacity', '1', 'important');
  element.style.setProperty('visibility', 'visible', 'important');
  element.style.setProperty('pointer-events', 'auto', 'important');
  element.style.setProperty('z-index', 'auto', 'important');
  element.style.setProperty('transform', 'none', 'important');
  element.style.setProperty('isolation', 'auto', 'important');
  element.style.setProperty('contain', 'none', 'important');
  element.style.setProperty('position', 'relative', 'important');

  // Add visual indicators for debugging
  if (
    key.includes('gallery') ||
    key.includes('contact') ||
    key.includes('menu-item')
  ) {
    element.style.setProperty('background', 'lime', 'important');
    element.style.setProperty('border', '3px solid red', 'important');
    element.style.setProperty('padding', '10px', 'important');
    element.style.setProperty('font-size', '1.2rem', 'important');
    element.style.setProperty('color', 'black', 'important');
  }

  console.log(`🔧 Forced ${key}`);
});

// Step 5: Set up continuous monitoring
console.log('👀 Step 5: Setting up continuous monitoring...');
let monitoringActive = true;

const monitor = () => {
  if (!monitoringActive) return;

  buttonMap.forEach((element, key) => {
    const computed = window.getComputedStyle(element);

    // Check if element became hidden
    if (
      computed.opacity === '0' ||
      computed.display === 'none' ||
      computed.visibility === 'hidden'
    ) {
      console.warn(`🚨 ${key} became hidden! Re-forcing...`);

      // Re-apply forced styles
      element.style.setProperty('display', 'flex', 'important');
      element.style.setProperty('opacity', '1', 'important');
      element.style.setProperty('visibility', 'visible', 'important');
      element.style.setProperty('background', 'orange', 'important');
      element.style.setProperty('border', '3px solid purple', 'important');
    }
  });

  setTimeout(monitor, 1000); // Check every second
};

monitor();

// Store cleanup function globally
window.emergencyButtonCleanup = () => {
  monitoringActive = false;
  document.getElementById('emergency-button-css')?.remove();
  buttonMap.forEach((element) => {
    element.style.removeProperty('background');
    element.style.removeProperty('border');
    element.style.removeProperty('padding');
    element.style.removeProperty('font-size');
    element.style.removeProperty('color');
  });
  console.log('🧹 Emergency button fix cleanup complete');
};

console.log('🎉 EMERGENCY BUTTON FIX COMPLETE!');
console.log('📋 RESULTS:');
console.log(`- Header found: ${buttonMap.has('header')}`);
console.log(`- Menu found: ${buttonMap.has('menu')}`);
console.log(
  `- Menu items: ${
    Array.from(buttonMap.keys()).filter((k) => k.includes('menu-item')).length
  }`
);
console.log(`- Gallery elements: ${galleryCount}`);
console.log(`- Contact elements: ${contactCount}`);
console.log('🎯 CHECK NOW: Look for RED header with GREEN/LIME buttons!');
console.log('💡 To cleanup: Run window.emergencyButtonCleanup()');
