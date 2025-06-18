// Ultra High Z-Index Test for iPad Pro Menu Visibility
console.log('🔍 TESTING ULTRA HIGH Z-INDEX AND PARENT CONTAINER ISSUES...');

const testMenuVisibility = () => {
  // Check if we're on iPad Pro
  const isIPadPro =
    /iPad/.test(navigator.userAgent) &&
    (window.screen.width === 1024 || window.screen.width === 834);
  const isPortrait = window.innerHeight > window.innerWidth;

  console.log('📱 Device Detection:', {
    isIPadPro,
    isPortrait,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    userAgent: navigator.userAgent,
  });

  if (isIPadPro && isPortrait) {
    console.log('🎯 iPad Pro Portrait detected - checking menu visibility...');

    // Find menu elements
    const appContainer = document.querySelector('.appContainer');
    const header = document.querySelector('.header');
    const menu = document.querySelector('.menu');
    const menuItems = document.querySelectorAll('.menu-item');
    const galleryButton = Array.from(document.querySelectorAll('*')).find(
      (el) => el.textContent?.trim() === 'Gallery'
    );
    const contactButton = Array.from(document.querySelectorAll('*')).find(
      (el) => el.textContent?.trim() === 'Contact'
    );

    console.log('🔍 Menu Elements Found:', {
      appContainer: !!appContainer,
      header: !!header,
      menu: !!menu,
      menuItems: menuItems.length,
      galleryButton: !!galleryButton,
      contactButton: !!contactButton,
    });

    // 🚨 CHECK PARENT CONTAINER POSITIONING - This is likely the issue!
    if (appContainer) {
      const containerStyles = window.getComputedStyle(appContainer);
      console.log('🚨 PARENT CONTAINER (.appContainer) Styles:', {
        position: containerStyles.position,
        transform: containerStyles.transform,
        contain: containerStyles.contain,
        isolation: containerStyles.isolation,
        overflow: containerStyles.overflow,
        zIndex: containerStyles.zIndex,
        width: containerStyles.width,
        height: containerStyles.height,
        top: containerStyles.top,
        left: containerStyles.left,
      });

      // Check if parent creates stacking context
      const createsStackingContext =
        containerStyles.isolation !== 'auto' ||
        containerStyles.transform !== 'none' ||
        containerStyles.contain.includes('layout') ||
        containerStyles.contain.includes('paint') ||
        containerStyles.position === 'fixed' ||
        containerStyles.position === 'sticky' ||
        containerStyles.zIndex !== 'auto';

      console.log(
        '🚨 Parent Container Creates Stacking Context:',
        createsStackingContext
      );

      const containerRect = appContainer.getBoundingClientRect();
      console.log('🚨 Parent Container Position (getBoundingClientRect):', {
        top: containerRect.top,
        left: containerRect.left,
        width: containerRect.width,
        height: containerRect.height,
        isAtTopLeft: containerRect.top <= 5 && containerRect.left <= 5,
      });
    }

    // Check z-index values and positioning
    if (header) {
      const headerStyles = window.getComputedStyle(header);
      console.log('📊 Header Positioning & Z-Index:', {
        position: headerStyles.position,
        top: headerStyles.top,
        left: headerStyles.left,
        width: headerStyles.width,
        height: headerStyles.height,
        zIndex: headerStyles.zIndex,
        opacity: headerStyles.opacity,
        visibility: headerStyles.visibility,
      });

      // Check if header is properly positioned at top-left
      const headerRect = header.getBoundingClientRect();
      console.log('📊 Header Position (getBoundingClientRect):', {
        top: headerRect.top,
        left: headerRect.left,
        width: headerRect.width,
        height: headerRect.height,
        isAtTopLeft: headerRect.top <= 5 && headerRect.left <= 5,
        isVisible: headerRect.width > 0 && headerRect.height > 0,
      });

      // Check if header is off-screen
      const isOffScreen =
        headerRect.top < -100 ||
        headerRect.left < -100 ||
        headerRect.top > window.innerHeight ||
        headerRect.left > window.innerWidth;
      console.log('🚨 Header Off-Screen Status:', {
        isOffScreen,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        headerPosition: `${headerRect.top}, ${headerRect.left}`,
      });
    }

    if (menu) {
      const menuStyles = window.getComputedStyle(menu);
      console.log('📊 Menu Z-Index:', {
        zIndex: menuStyles.zIndex,
        position: menuStyles.position,
        opacity: menuStyles.opacity,
        visibility: menuStyles.visibility,
      });
    }

    // Check individual menu items
    menuItems.forEach((item, index) => {
      const itemStyles = window.getComputedStyle(item);
      const text = item.textContent?.trim();
      const itemRect = item.getBoundingClientRect();
      console.log(`📊 Menu Item ${index + 1} (${text}):`, {
        zIndex: itemStyles.zIndex,
        position: itemStyles.position,
        opacity: itemStyles.opacity,
        visibility: itemStyles.visibility,
        display: itemStyles.display,
        pointerEvents: itemStyles.pointerEvents,
        rect: {
          top: itemRect.top,
          left: itemRect.left,
          width: itemRect.width,
          height: itemRect.height,
          isVisible: itemRect.width > 0 && itemRect.height > 0,
        },
      });
    });

    // Check Gallery and Contact buttons specifically
    if (galleryButton) {
      const galleryStyles = window.getComputedStyle(galleryButton);
      const galleryRect = galleryButton.getBoundingClientRect();
      console.log('📊 Gallery Button Styles:', {
        zIndex: galleryStyles.zIndex,
        opacity: galleryStyles.opacity,
        visibility: galleryStyles.visibility,
        display: galleryStyles.display,
        pointerEvents: galleryStyles.pointerEvents,
        background: galleryStyles.background,
        transform: galleryStyles.transform,
        rect: {
          top: galleryRect.top,
          left: galleryRect.left,
          width: galleryRect.width,
          height: galleryRect.height,
          isVisible: galleryRect.width > 0 && galleryRect.height > 0,
          isOnScreen:
            galleryRect.top >= 0 &&
            galleryRect.left >= 0 &&
            galleryRect.top <= window.innerHeight &&
            galleryRect.left <= window.innerWidth,
        },
      });
    }

    if (contactButton) {
      const contactStyles = window.getComputedStyle(contactButton);
      const contactRect = contactButton.getBoundingClientRect();
      console.log('📊 Contact Button Styles:', {
        zIndex: contactStyles.zIndex,
        opacity: contactStyles.opacity,
        visibility: contactStyles.visibility,
        display: contactStyles.display,
        pointerEvents: contactStyles.pointerEvents,
        background: contactStyles.background,
        transform: contactStyles.transform,
        rect: {
          top: contactRect.top,
          left: contactRect.left,
          width: contactRect.width,
          height: contactRect.height,
          isVisible: contactRect.width > 0 && contactRect.height > 0,
          isOnScreen:
            contactRect.top >= 0 &&
            contactRect.left >= 0 &&
            contactRect.top <= window.innerHeight &&
            contactRect.left <= window.innerWidth,
        },
      });
    }

    // Check if canvas is interfering
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const canvasStyles = window.getComputedStyle(canvas);
      console.log('📊 Canvas Z-Index:', {
        zIndex: canvasStyles.zIndex,
        position: canvasStyles.position,
        isolation: canvasStyles.isolation,
      });
    }

    console.log('✅ Ultra high z-index test complete!');

    // Visual test - try to click buttons
    console.log('🖱️ Testing button clickability...');
    if (galleryButton) {
      console.log(
        'Gallery button clickable:',
        galleryButton.style.pointerEvents !== 'none'
      );
    }
    if (contactButton) {
      console.log(
        'Contact button clickable:',
        contactButton.style.pointerEvents !== 'none'
      );
    }
  } else {
    console.log('ℹ️ Not iPad Pro portrait - ultra high z-index not applicable');
  }
};

// Run the test
testMenuVisibility();

console.log(
  '💡 TIP: If buttons still not visible, check Elements tab in DevTools'
);
console.log(
  '💡 Look for z-index: 999999 on .header, .menu, and .menu-item elements'
);
console.log('💡 Header should be position: fixed with top: 0, left: 0');
console.log(
  '💡 🚨 CRITICAL: Check if .appContainer parent is creating stacking context!'
);
console.log(
  '💡 If parent has transform, isolation, or contain properties, it may trap fixed positioning'
);

// Additional test for header positioning
setTimeout(() => {
  const header = document.querySelector('.header');
  if (header) {
    const rect = header.getBoundingClientRect();
    console.log('🔍 DELAYED CHECK - Header position after page load:', {
      top: rect.top,
      left: rect.left,
      visible:
        rect.top >= 0 && rect.left >= 0 && rect.width > 0 && rect.height > 0,
      onScreen:
        rect.top <= window.innerHeight && rect.left <= window.innerWidth,
    });
  }
}, 2000);
