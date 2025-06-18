// BROWSER CONSOLE DIAGNOSTIC SCRIPT FOR IPAD PRO BUTTON VISIBILITY
// Run this in the browser console when on iPad Pro portrait mode
console.log('🔍 IPAD PRO BUTTON VISIBILITY DIAGNOSTIC STARTING...');

function diagnoseiPadProButtonIssue() {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    isPortrait: window.innerHeight > window.innerWidth,
    devicePixelRatio: window.devicePixelRatio,
    orientation: window.screen?.orientation?.type || 'unknown',
  };

  console.log('📱 Viewport Info:', viewport);

  // Check iPad Pro detection
  const isIPadPro12 =
    viewport.isPortrait &&
    viewport.width >= 1024 &&
    viewport.width <= 1024 &&
    viewport.height >= 1366;
  const isIPadPro11 =
    viewport.isPortrait &&
    viewport.width >= 820 &&
    viewport.width <= 834 &&
    viewport.height >= 1180;
  const isLargeTabletPortrait =
    viewport.isPortrait && viewport.width >= 768 && viewport.width < 1025;
  const isIPadProPortrait = isIPadPro12 || isIPadPro11 || isLargeTabletPortrait;

  console.log('🎯 iPad Pro Detection:', {
    isIPadPro12,
    isIPadPro11,
    isLargeTabletPortrait,
    isIPadProPortrait,
  });

  // Analyze parent container (.appContainer)
  const appContainer = document.querySelector('.appContainer');
  if (appContainer) {
    const containerStyles = window.getComputedStyle(appContainer);
    console.log('📦 .appContainer Analysis:', {
      element: appContainer,
      position: containerStyles.position,
      transform: containerStyles.transform,
      contain: containerStyles.contain,
      isolation: containerStyles.isolation,
      overflow: containerStyles.overflow,
      zIndex: containerStyles.zIndex,
      willChange: containerStyles.willChange,
      filter: containerStyles.filter,
      createsStackingContext:
        containerStyles.position !== 'static' ||
        containerStyles.transform !== 'none' ||
        containerStyles.isolation === 'isolate' ||
        parseFloat(containerStyles.opacity) < 1 ||
        containerStyles.filter !== 'none' ||
        containerStyles.zIndex !== 'auto' ||
        containerStyles.willChange !== 'auto',
    });
  }

  // Analyze header element
  const header =
    document.querySelector('.header') || document.querySelector('header');
  if (header) {
    const headerStyles = window.getComputedStyle(header);
    const headerRect = header.getBoundingClientRect();

    console.log('🎯 Header Analysis:', {
      element: header,
      position: headerStyles.position,
      top: headerStyles.top,
      left: headerStyles.left,
      zIndex: headerStyles.zIndex,
      visibility: headerStyles.visibility,
      opacity: headerStyles.opacity,
      display: headerStyles.display,
      pointerEvents: headerStyles.pointerEvents,
      boundingRect: {
        top: headerRect.top,
        left: headerRect.left,
        right: headerRect.right,
        bottom: headerRect.bottom,
        width: headerRect.width,
        height: headerRect.height,
      },
      isVisible:
        headerRect.top >= 0 &&
        headerRect.left >= 0 &&
        headerRect.top < viewport.height,
      isOffScreen:
        headerRect.top < 0 ||
        headerRect.left < 0 ||
        headerRect.top > viewport.height,
    });
  }

  // Analyze menu items
  const menuItems = document.querySelectorAll('.menu-item');
  console.log(`🔍 Found ${menuItems.length} menu items`);

  menuItems.forEach((item, index) => {
    const itemStyles = window.getComputedStyle(item);
    const itemRect = item.getBoundingClientRect();

    console.log(`📱 Menu Item ${index + 1} (${item.textContent}):`, {
      element: item,
      visibility: itemStyles.visibility,
      opacity: itemStyles.opacity,
      display: itemStyles.display,
      zIndex: itemStyles.zIndex,
      position: itemStyles.position,
      boundingRect: {
        top: itemRect.top,
        left: itemRect.left,
        width: itemRect.width,
        height: itemRect.height,
      },
      isVisible:
        itemRect.top >= 0 &&
        itemRect.left >= 0 &&
        itemRect.top < viewport.height,
      isOffScreen:
        itemRect.top < 0 || itemRect.left < 0 || itemRect.top > viewport.height,
    });
  });

  // Analyze canvas elements
  const canvases = document.querySelectorAll('canvas');
  console.log(`🎨 Found ${canvases.length} canvas elements`);

  canvases.forEach((canvas, index) => {
    const canvasStyles = window.getComputedStyle(canvas);
    const canvasRect = canvas.getBoundingClientRect();

    console.log(`🎨 Canvas ${index + 1}:`, {
      element: canvas,
      position: canvasStyles.position,
      top: canvasStyles.top,
      left: canvasStyles.left,
      zIndex: canvasStyles.zIndex,
      width: canvasStyles.width,
      height: canvasStyles.height,
      boundingRect: {
        top: canvasRect.top,
        left: canvasRect.left,
        width: canvasRect.width,
        height: canvasRect.height,
      },
    });
  });

  // Check for any elements with z-index higher than header
  const allElements = document.querySelectorAll('*');
  const highZIndexElements = [];

  allElements.forEach((el) => {
    const styles = window.getComputedStyle(el);
    const zIndex = parseInt(styles.zIndex);
    if (!isNaN(zIndex) && zIndex > 999998) {
      highZIndexElements.push({
        element: el,
        zIndex: zIndex,
        tagName: el.tagName,
        className: el.className,
        id: el.id,
      });
    }
  });

  console.log('⚡ Elements with z-index > 999998:', highZIndexElements);

  // Recommendations
  console.log('🔧 RECOMMENDATIONS:');

  if (header && header.getBoundingClientRect().top < 0) {
    console.log('❌ Header is positioned above viewport');
    console.log('💡 Solution: Check parent container stacking context');
  }

  if (appContainer) {
    const containerStyles = window.getComputedStyle(appContainer);
    const createsStackingContext =
      containerStyles.position !== 'static' ||
      containerStyles.transform !== 'none' ||
      containerStyles.isolation === 'isolate' ||
      parseFloat(containerStyles.opacity) < 1 ||
      containerStyles.filter !== 'none' ||
      containerStyles.zIndex !== 'auto' ||
      containerStyles.willChange !== 'auto';

    if (createsStackingContext) {
      console.log('❌ .appContainer creates stacking context');
      console.log(
        '💡 Solution: Move header outside .appContainer or remove stacking context properties'
      );
    }
  }

  return {
    viewport,
    isIPadProPortrait,
    appContainer,
    header,
    menuItems: Array.from(menuItems),
    canvases: Array.from(canvases),
    highZIndexElements,
  };
}

// Run the diagnostic
const diagnosticResult = diagnoseiPadProButtonIssue();

// Also provide helper functions
window.fixiPadProButtons = function () {
  console.log('🔧 ATTEMPTING TO FIX IPAD PRO BUTTONS...');

  // Force header positioning
  const header =
    document.querySelector('.header') || document.querySelector('header');
  if (header) {
    header.style.setProperty('position', 'fixed', 'important');
    header.style.setProperty('top', '0px', 'important');
    header.style.setProperty('left', '0px', 'important');
    header.style.setProperty('z-index', '999999', 'important');
    header.style.setProperty('width', '100vw', 'important');
    header.style.setProperty('height', '10vh', 'important');
    console.log('✅ Header positioning forced');
  }

  // Fix parent container stacking context
  const appContainer = document.querySelector('.appContainer');
  if (appContainer) {
    appContainer.style.setProperty('position', 'static', 'important');
    appContainer.style.setProperty('transform', 'none', 'important');
    appContainer.style.setProperty('contain', 'none', 'important');
    appContainer.style.setProperty('isolation', 'auto', 'important');
    appContainer.style.setProperty('filter', 'none', 'important');
    appContainer.style.setProperty('will-change', 'auto', 'important');
    console.log('✅ .appContainer stacking context removed');
  }

  // Force menu item visibility
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach((item, index) => {
    item.style.setProperty('opacity', '1', 'important');
    item.style.setProperty('visibility', 'visible', 'important');
    item.style.setProperty('pointer-events', 'auto', 'important');
    item.style.setProperty('z-index', '999999', 'important');
  });
  console.log(`✅ ${menuItems.length} menu items forced visible`);

  // Re-run diagnostic
  setTimeout(() => {
    console.log('🔍 RE-RUNNING DIAGNOSTIC AFTER FIX...');
    diagnoseiPadProButtonIssue();
  }, 500);
};

console.log('💡 Run "fixiPadProButtons()" to attempt automatic fix');
console.log('🔍 DIAGNOSTIC COMPLETE');
