// Production iPad Pro Fix - Final Implementation
// This script removes emergency styling and applies clean permanent fixes

console.log('🚀 APPLYING PRODUCTION IPAD PRO FIXES...');

const productionIPadProFix = () => {
  // 1. Clean up any emergency styles first
  console.log('🧹 Cleaning emergency styles...');

  // Remove emergency CSS injections
  [
    'emergency-button-css',
    'emergency-ipad-button-fix',
    'ipad-emergency-debug',
  ].forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.remove();
      console.log(`✅ Removed ${id}`);
    }
  });

  // Stop emergency monitors
  if (window.emergencyButtonObserver) {
    window.emergencyButtonObserver.disconnect();
    delete window.emergencyButtonObserver;
    console.log('✅ Stopped emergency observer');
  }

  // Remove emergency visual styling from elements
  const allElements = document.querySelectorAll('*');
  allElements.forEach((el) => {
    const text = el.textContent?.trim();
    if (text === 'Gallery' || text === 'Contact') {
      // Remove emergency visual indicators
      el.style.removeProperty('background');
      el.style.removeProperty('background-color');
      el.style.removeProperty('border');
      el.style.removeProperty('transform');
      el.style.removeProperty('padding');
      el.style.removeProperty('font-size');
      el.style.removeProperty('color');
    }
  });

  // Remove emergency header styles
  document.querySelectorAll('header, .header').forEach((header) => {
    header.style.removeProperty('background');
    header.style.removeProperty('background-color');
  });

  console.log('✅ Emergency styles cleaned');

  // 2. Apply production-grade iPad Pro fixes
  console.log('🔧 Applying production fixes...');

  // Detect iPad Pro
  const isIPadPro =
    /iPad/.test(navigator.userAgent) &&
    ((window.screen.width === 1024 && window.screen.height === 1366) ||
      (window.screen.width === 834 && window.screen.height === 1194));
  const isPortrait = window.innerHeight > window.innerWidth;

  if (isIPadPro && isPortrait) {
    console.log('📱 iPad Pro portrait detected - applying production fixes');

    // Create production CSS fix
    const productionCSS = document.createElement('style');
    productionCSS.id = 'production-ipad-pro-fixes';
    productionCSS.textContent = `
      /* Production iPad Pro Portrait Fixes */
      @media screen and (orientation: portrait) and 
             ((width: 1024px) or (width: 834px)) {
        
        /* Override React Spring opacity animations for navigation */
        .header *,
        [class*="header"] *,
        [class*="navigation"] *,
        [class*="menu"] *,
        .menu-item,
        button,
        a {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
        }
        
        /* Specific button targeting by content */
        *:contains("Gallery"),
        *:contains("Contact") {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
        }
        
        /* Ensure proper stacking context */
        .header, header {
          z-index: 100 !important;
          position: relative !important;
          isolation: auto !important;
        }
        
        /* Canvas positioning constraints */
        canvas {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 1 !important;
          isolation: auto !important;
        }
        
        /* Prevent container stacking context issues */
        .app-container,
        .appContainer,
        [class*="app"] {
          isolation: auto !important;
          transform: none !important;
        }
      }
    `;

    // Remove existing production fixes if any
    const existing = document.getElementById('production-ipad-pro-fixes');
    if (existing) existing.remove();

    document.head.appendChild(productionCSS);
    console.log('✅ Production CSS applied');

    // Apply direct element fixes for immediate visibility
    const ensureButtonVisibility = () => {
      const buttons = document.querySelectorAll('*');
      buttons.forEach((el) => {
        const text = el.textContent?.trim();
        if (text === 'Gallery' || text === 'Contact') {
          el.style.setProperty('opacity', '1', 'important');
          el.style.setProperty('visibility', 'visible', 'important');
          el.style.setProperty('pointer-events', 'auto', 'important');
        }
      });
    };

    ensureButtonVisibility();
    console.log('✅ Direct button visibility applied');

    // Set up production-grade monitoring
    const productionObserver = new MutationObserver((mutations) => {
      let needsUpdate = false;
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          (mutation.attributeName === 'style' ||
            mutation.attributeName === 'class')
        ) {
          const target = mutation.target;
          const text = target.textContent?.trim();
          if (text === 'Gallery' || text === 'Contact') {
            needsUpdate = true;
          }
        }
      });

      if (needsUpdate) {
        ensureButtonVisibility();
      }
    });

    productionObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    // Store observer for cleanup if needed
    window.productionIPadObserver = productionObserver;
    console.log('✅ Production monitoring started');
  } else {
    console.log('ℹ️ Not iPad Pro portrait - no fixes needed');
  }
};

// Execute the production fix
productionIPadProFix();

console.log('🎉 PRODUCTION IPAD PRO FIX COMPLETE!');
console.log('📋 VERIFICATION:');
console.log('1. Emergency styling removed (no lime buttons, no red headers)');
console.log('2. Production CSS rules applied for iPad Pro');
console.log('3. Button visibility monitoring active');
console.log('4. Test Gallery and Contact button functionality');

// Verification helper
const verifyFix = () => {
  const galleryBtn = Array.from(document.querySelectorAll('*')).find(
    (el) => el.textContent?.trim() === 'Gallery'
  );
  const contactBtn = Array.from(document.querySelectorAll('*')).find(
    (el) => el.textContent?.trim() === 'Contact'
  );

  console.log('🔍 BUTTON VERIFICATION:');
  console.log('Gallery button:', galleryBtn ? 'Found' : 'NOT FOUND');
  console.log('Contact button:', contactBtn ? 'Found' : 'NOT FOUND');

  if (galleryBtn) {
    const styles = window.getComputedStyle(galleryBtn);
    console.log('Gallery opacity:', styles.opacity);
    console.log('Gallery visibility:', styles.visibility);
  }

  if (contactBtn) {
    const styles = window.getComputedStyle(contactBtn);
    console.log('Contact opacity:', styles.opacity);
    console.log('Contact visibility:', styles.visibility);
  }
};

// Run verification after a brief delay
setTimeout(verifyFix, 1000);
