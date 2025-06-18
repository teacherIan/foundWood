// iPad Menu Z-Index Debug Tool
// Run this in browser console on iPad to see current z-index values

console.log('🔍 iPad Menu Z-Index Debug Tool');
console.log('====================================');

// Check if we're on iPad in portrait mode
const isIPad = window.innerWidth >= 1024 && window.innerHeight >= 1366;
const isPortrait = window.innerHeight > window.innerWidth;
const isIPadPortrait = isIPad && isPortrait;

console.log('📱 Device Info:', {
  viewport: `${window.innerWidth}x${window.innerHeight}`,
  isIPad,
  isPortrait,
  isIPadPortrait,
  userAgent: navigator.userAgent
});

if (!isIPadPortrait) {
  console.log('⚠️ This debug tool is designed for iPad Pro in portrait mode');
}

// Function to get computed z-index and stacking context info
function getElementInfo(selector, name) {
  const element = document.querySelector(selector);
  if (!element) {
    console.log(`❌ ${name}: Element not found`);
    return null;
  }

  const styles = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  
  // Check if element creates stacking context
  const createsStackingContext = 
    styles.position !== 'static' ||
    styles.transform !== 'none' ||
    styles.isolation === 'isolate' ||
    parseFloat(styles.opacity) < 1 ||
    styles.filter !== 'none' ||
    styles.zIndex !== 'auto' ||
    styles.willChange !== 'auto' ||
    styles.contain !== 'none';

  const info = {
    element: name,
    found: true,
    zIndex: styles.zIndex,
    position: styles.position,
    opacity: styles.opacity,
    visibility: styles.visibility,
    display: styles.display,
    transform: styles.transform,
    isolation: styles.isolation,
    contain: styles.contain,
    willChange: styles.willChange,
    filter: styles.filter,
    pointerEvents: styles.pointerEvents,
    createsStackingContext,
    rect: {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      visible: rect.width > 0 && rect.height > 0
    }
  };

  console.log(`📊 ${name}:`, info);
  return info;
}

// Check all key elements
const elements = [
  ['.appContainer', 'App Container'],
  ['.header', 'Header'],
  ['.menu', 'Menu'],
  ['.menu-item', 'Menu Item (first)'],
  ['.icon', 'Icon'],
  ['canvas', 'Canvas'],
  ['.typesContainer', 'Types Container'],
  ['.galleryContainer', 'Gallery Container'],
  ['.contactContainer', 'Contact Container']
];

console.log('\n🔍 Element Analysis:');
console.log('===================');

const results = elements.map(([selector, name]) => getElementInfo(selector, name));

// Check for stacking context issues
console.log('\n⚠️ Stacking Context Issues:');
console.log('============================');

results.forEach(result => {
  if (result && result.createsStackingContext) {
    console.log(`❌ ${result.element} creates stacking context:`, {
      position: result.position !== 'static' ? result.position : null,
      transform: result.transform !== 'none' ? result.transform : null,
      isolation: result.isolation === 'isolate' ? result.isolation : null,
      opacity: parseFloat(result.opacity) < 1 ? result.opacity : null,
      filter: result.filter !== 'none' ? result.filter : null,
      zIndex: result.zIndex !== 'auto' ? result.zIndex : null,
      willChange: result.willChange !== 'auto' ? result.willChange : null,
      contain: result.contain !== 'none' ? result.contain : null
    });
  }
});

// Check z-index hierarchy
console.log('\n📊 Z-Index Hierarchy:');
console.log('=====================');

const zIndexElements = results
  .filter(r => r && r.zIndex !== 'auto')
  .sort((a, b) => parseInt(b.zIndex) - parseInt(a.zIndex));

zIndexElements.forEach(element => {
  console.log(`${element.element}: z-index ${element.zIndex}`);
});

// Menu item visibility check
console.log('\n👁️ Menu Item Visibility:');
console.log('========================');

const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach((item, index) => {
  const rect = item.getBoundingClientRect();
  const styles = window.getComputedStyle(item);
  const isVisible = rect.width > 0 && rect.height > 0 && 
                   styles.opacity !== '0' && 
                   styles.visibility !== 'hidden' &&
                   styles.display !== 'none';
  
  console.log(`Menu Item ${index + 1} (${item.textContent?.trim()}):`, {
    visible: isVisible,
    rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
    opacity: styles.opacity,
    visibility: styles.visibility,
    display: styles.display,
    zIndex: styles.zIndex,
    pointerEvents: styles.pointerEvents
  });
});

// Recommendations
console.log('\n💡 Recommendations:');
console.log('===================');

const headerInfo = results.find(r => r && r.element === 'Header');
const canvasInfo = results.find(r => r && r.element === 'Canvas');
const appContainerInfo = results.find(r => r && r.element === 'App Container');

if (headerInfo && canvasInfo) {
  const headerZ = parseInt(headerInfo.zIndex) || 0;
  const canvasZ = parseInt(canvasInfo.zIndex) || 0;
  
  if (headerZ <= canvasZ) {
    console.log('❌ Header z-index should be higher than canvas');
    console.log(`   Current: Header(${headerZ}) vs Canvas(${canvasZ})`);
    console.log('   Recommended: Header(10000) vs Canvas(1)');
  } else {
    console.log('✅ Z-index hierarchy is correct');
  }
}

if (appContainerInfo && appContainerInfo.createsStackingContext) {
  console.log('❌ App container creates stacking context - this traps header z-index');
  console.log('   Solution: Move header outside appContainer or remove stacking context properties');
}

console.log('\n🛠️ Quick Fix (paste in console):');
console.log('=================================');
console.log(`
// Emergency fix for iPad menu visibility
if (window.innerWidth >= 1024 && window.innerHeight >= 1366 && window.innerHeight > window.innerWidth) {
  const header = document.querySelector('.header');
  const menu = document.querySelector('.menu');
  const menuItems = document.querySelectorAll('.menu-item');
  const canvas = document.querySelector('canvas');
  
  if (header) {
    header.style.setProperty('z-index', '10000', 'important');
    header.style.setProperty('position', 'fixed', 'important');
  }
  
  if (menu) {
    menu.style.setProperty('z-index', '10001', 'important');
  }
  
  menuItems.forEach(item => {
    item.style.setProperty('z-index', '10002', 'important');
    item.style.setProperty('background', 'rgba(255,255,255,0.95)', 'important');
    item.style.setProperty('border', '2px solid #77481c', 'important');
  });
  
  if (canvas) {
    canvas.style.setProperty('z-index', '1', 'important');
  }
  
  console.log('✅ Emergency fix applied');
}
`);
