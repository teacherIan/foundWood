// iPad Pro Button Visibility Emergency Fix Script
// Run this in the browser console on iPad Pro portrait mode

console.log('🚨 EMERGENCY iPad Pro Button Visibility Fix - Starting...');

function forceButtonVisibility() {
  console.log('🔍 Analyzing current page structure...');

  // Get viewport info
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: window.innerWidth / window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    orientation:
      window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
  };

  console.log('📱 Viewport Info:', viewport);

  // Detect iPad Pro
  const isIPadPro = viewport.width >= 1024 && viewport.height >= 1366;
  const isIPadProPortrait = isIPadPro && viewport.orientation === 'portrait';

  console.log('🎯 iPad Pro Detection:', {
    isIPadPro,
    isIPadProPortrait,
    shouldApplyFix: isIPadProPortrait,
  });

  if (!isIPadProPortrait) {
    console.log(
      '⚠️ Not iPad Pro portrait mode, but applying fixes anyway for testing...'
    );
  }

  // Find all elements
  const allElements = document.querySelectorAll('*');
  const headerElements = document.querySelectorAll(
    '.header, [class*="header"], [class*="Header"]'
  );
  const menuElements = document.querySelectorAll(
    '.menu, [class*="menu"], [class*="Menu"]'
  );
  const menuItems = document.querySelectorAll(
    '.menu-item, [class*="menu-item"], [class*="MenuItem"]'
  );
  const canvasElements = document.querySelectorAll('canvas');

  console.log('🔍 Elements Found:', {
    totalElements: allElements.length,
    headerElements: headerElements.length,
    menuElements: menuElements.length,
    menuItems: menuItems.length,
    canvasElements: canvasElements.length,
  });

  // Find elements by text content
  const galleryElements = [];
  const contactElements = [];

  allElements.forEach((el) => {
    if (el.textContent && el.textContent.trim() === 'Gallery') {
      galleryElements.push(el);
    }
    if (el.textContent && el.textContent.trim() === 'Contact') {
      contactElements.push(el);
    }
  });

  console.log('🔍 Text-based Elements Found:', {
    galleryElements: galleryElements.length,
    contactElements: contactElements.length,
  });

  // Force canvas to background
  console.log('🎨 Forcing canvas to background...');
  canvasElements.forEach((canvas, index) => {
    console.log(`Canvas ${index + 1}:`, {
      currentZIndex: window.getComputedStyle(canvas).zIndex,
      currentPosition: window.getComputedStyle(canvas).position,
    });

    canvas.style.setProperty('z-index', '1', 'important');
    canvas.style.setProperty('position', 'fixed', 'important');
    canvas.style.setProperty('top', '0', 'important');
    canvas.style.setProperty('left', '0', 'important');
    canvas.style.setProperty('right', '0', 'important');
    canvas.style.setProperty('bottom', '0', 'important');
    canvas.style.setProperty('width', '100vw', 'important');
    canvas.style.setProperty('height', '100vh', 'important');
  });

  // Force header visibility
  console.log('📄 Forcing header elements visibility...');
  headerElements.forEach((header, index) => {
    console.log(`Header ${index + 1}:`, {
      currentDisplay: window.getComputedStyle(header).display,
      currentOpacity: window.getComputedStyle(header).opacity,
      currentZIndex: window.getComputedStyle(header).zIndex,
    });

    header.style.setProperty('z-index', '10000', 'important');
    header.style.setProperty('position', 'fixed', 'important');
    header.style.setProperty('top', '0', 'important');
    header.style.setProperty('left', '0', 'important');
    header.style.setProperty('width', '100vw', 'important');
    header.style.setProperty('height', '10vh', 'important');
    header.style.setProperty('background', 'rgba(255, 0, 0, 0.9)', 'important');
    header.style.setProperty('border', '5px solid yellow', 'important');
    header.style.setProperty('display', 'flex', 'important');
    header.style.setProperty('opacity', '1', 'important');
    header.style.setProperty('visibility', 'visible', 'important');
    header.style.setProperty('pointer-events', 'none', 'important');
  });

  // Force menu elements visibility
  console.log('📋 Forcing menu elements visibility...');
  menuElements.forEach((menu, index) => {
    console.log(`Menu ${index + 1}:`, {
      currentDisplay: window.getComputedStyle(menu).display,
      currentOpacity: window.getComputedStyle(menu).opacity,
    });

    menu.style.setProperty('display', 'flex', 'important');
    menu.style.setProperty('opacity', '1', 'important');
    menu.style.setProperty('visibility', 'visible', 'important');
    menu.style.setProperty('pointer-events', 'auto', 'important');
    menu.style.setProperty('z-index', '10001', 'important');
    menu.style.setProperty('width', '100%', 'important');
    menu.style.setProperty('justify-content', 'space-around', 'important');
    menu.style.setProperty('align-items', 'center', 'important');
  });

  // Force menu items visibility
  console.log('🔘 Forcing menu items visibility...');
  menuItems.forEach((item, index) => {
    const styles = window.getComputedStyle(item);
    console.log(`Menu Item ${index + 1}:`, {
      text: item.textContent,
      currentDisplay: styles.display,
      currentOpacity: styles.opacity,
      currentZIndex: styles.zIndex,
      currentPosition: styles.position,
    });

    item.style.setProperty('z-index', '10002', 'important');
    item.style.setProperty('position', 'relative', 'important');
    item.style.setProperty('background', 'lime', 'important');
    item.style.setProperty('color', 'black', 'important');
    item.style.setProperty('border', '5px solid red', 'important');
    item.style.setProperty('font-size', '3rem', 'important');
    item.style.setProperty('font-weight', 'bold', 'important');
    item.style.setProperty('opacity', '1', 'important');
    item.style.setProperty('visibility', 'visible', 'important');
    item.style.setProperty('display', 'block', 'important');
    item.style.setProperty('pointer-events', 'auto', 'important');
    item.style.setProperty('padding', '1rem', 'important');
    item.style.setProperty('margin', '0.5rem', 'important');
    item.style.setProperty('border-radius', '10px', 'important');
  });

  // Force Gallery and Contact elements visibility
  console.log('📝 Forcing Gallery elements visibility...');
  galleryElements.forEach((el, index) => {
    console.log(`Gallery Element ${index + 1}:`, {
      tagName: el.tagName,
      currentDisplay: window.getComputedStyle(el).display,
      currentOpacity: window.getComputedStyle(el).opacity,
    });

    el.style.setProperty('background', 'yellow', 'important');
    el.style.setProperty('color', 'red', 'important');
    el.style.setProperty('font-size', '3rem', 'important');
    el.style.setProperty('z-index', '20000', 'important');
    el.style.setProperty('position', 'relative', 'important');
    el.style.setProperty('opacity', '1', 'important');
    el.style.setProperty('visibility', 'visible', 'important');
    el.style.setProperty('display', 'block', 'important');
    el.style.setProperty('pointer-events', 'auto', 'important');
    el.style.setProperty('border', '5px solid blue', 'important');
    el.style.setProperty('padding', '1rem', 'important');
    el.style.setProperty('margin', '0.5rem', 'important');
  });

  console.log('📧 Forcing Contact elements visibility...');
  contactElements.forEach((el, index) => {
    console.log(`Contact Element ${index + 1}:`, {
      tagName: el.tagName,
      currentDisplay: window.getComputedStyle(el).display,
      currentOpacity: window.getComputedStyle(el).opacity,
    });

    el.style.setProperty('background', 'orange', 'important');
    el.style.setProperty('color', 'blue', 'important');
    el.style.setProperty('font-size', '3rem', 'important');
    el.style.setProperty('z-index', '20001', 'important');
    el.style.setProperty('position', 'relative', 'important');
    el.style.setProperty('opacity', '1', 'important');
    el.style.setProperty('visibility', 'visible', 'important');
    el.style.setProperty('display', 'block', 'important');
    el.style.setProperty('pointer-events', 'auto', 'important');
    el.style.setProperty('border', '5px solid green', 'important');
    el.style.setProperty('padding', '1rem', 'important');
    el.style.setProperty('margin', '0.5rem', 'important');
  });

  // Add click handlers for testing
  [...galleryElements, ...contactElements, ...menuItems].forEach(
    (el, index) => {
      el.addEventListener('click', function () {
        console.log(`✅ Button ${index + 1} clicked successfully!`, {
          element: el,
          text: el.textContent,
          tagName: el.tagName,
        });
        alert(`Button clicked: ${el.textContent || el.tagName}`);
      });
    }
  );

  console.log('✅ Emergency button visibility fix applied!');
  console.log('🔍 Summary:', {
    canvasesFixed: canvasElements.length,
    headersFixed: headerElements.length,
    menusFixed: menuElements.length,
    menuItemsFixed: menuItems.length,
    galleryElementsFixed: galleryElements.length,
    contactElementsFixed: contactElements.length,
  });

  return {
    viewport,
    isIPadProPortrait,
    elementsFixed: {
      canvas: canvasElements.length,
      headers: headerElements.length,
      menus: menuElements.length,
      menuItems: menuItems.length,
      gallery: galleryElements.length,
      contact: contactElements.length,
    },
  };
}

// Run the fix
const result = forceButtonVisibility();

// Make it available globally for re-running
window.forceButtonVisibility = forceButtonVisibility;
window.ipadProFixResult = result;

console.log('🎯 iPad Pro Emergency Fix Complete!');
console.log('📋 Run window.forceButtonVisibility() to re-apply fixes');
console.log('📊 Results stored in window.ipadProFixResult');

// Auto-rerun on resize
window.addEventListener('resize', () => {
  console.log('📱 Viewport changed, re-applying fixes...');
  setTimeout(forceButtonVisibility, 100);
});

// Auto-rerun every 5 seconds for testing
setInterval(() => {
  console.log('🔄 Auto-reapplying fixes (every 5s for testing)...');
  forceButtonVisibility();
}, 5000);
