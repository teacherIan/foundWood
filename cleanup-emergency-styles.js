// Clean Emergency Styles Script
// Run this to remove all emergency styling and apply permanent fixes

console.log('🧹 CLEANING EMERGENCY STYLES...');

const cleanupEmergencyStyles = () => {
  console.log('🔄 Removing emergency visual indicators...');

  // Remove emergency CSS files
  const emergencyStyle = document.getElementById('emergency-button-css');
  if (emergencyStyle) {
    emergencyStyle.remove();
    console.log('✅ Removed emergency CSS');
  }

  const emergencyButtonStyle = document.getElementById(
    'emergency-ipad-button-fix'
  );
  if (emergencyButtonStyle) {
    emergencyButtonStyle.remove();
    console.log('✅ Removed emergency button CSS');
  }

  // Stop any running monitors
  if (window.emergencyButtonObserver) {
    window.emergencyButtonObserver.disconnect();
    console.log('✅ Stopped emergency button observer');
  }

  if (window.emergencyButtonCleanup) {
    window.emergencyButtonCleanup();
    console.log('✅ Ran emergency button cleanup');
  }

  // Remove emergency button styles
  const buttons = document.querySelectorAll('*');
  buttons.forEach((el) => {
    const text = el.textContent?.trim();
    if (text === 'Gallery' || text === 'Contact') {
      // Remove emergency lime background
      el.style.removeProperty('background');
      el.style.removeProperty('background-color');

      // Remove emergency borders and transforms
      el.style.removeProperty('border');
      el.style.removeProperty('transform');
      el.style.removeProperty('padding');
      el.style.removeProperty('font-size');
      el.style.removeProperty('color');

      console.log(`✅ Cleaned emergency styles from ${text} button`);
    }
  });

  // Remove emergency header styles
  const headers = document.querySelectorAll('header, .header');
  headers.forEach((header) => {
    header.style.removeProperty('background');
    header.style.removeProperty('background-color');
    console.log('✅ Cleaned emergency header styles');
  });

  // Remove emergency debug overlays
  const debugElements = document.querySelectorAll('[data-emergency-debug]');
  debugElements.forEach((el) => el.remove());

  console.log('✅ Emergency styles cleaned successfully!');
};

// Apply permanent iPad Pro button fixes
const applyPermanentFixes = () => {
  console.log('🔧 Applying permanent iPad Pro fixes...');

  // Check if we're on iPad Pro portrait
  const isIPadPro =
    /iPad/.test(navigator.userAgent) &&
    window.screen.width === 1024 &&
    window.screen.height === 1366;
  const isPortrait = window.innerHeight > window.innerWidth;

  if (isIPadPro && isPortrait) {
    console.log('📱 iPad Pro portrait detected - applying permanent fixes');

    // Create permanent style overrides for React Spring conflicts
    const permanentStyle = document.createElement('style');
    permanentStyle.id = 'ipad-pro-permanent-fixes';
    permanentStyle.textContent = `
      /* Permanent iPad Pro Portrait Fixes */
      @media screen and (width: 1024px) and (height: 1366px) and (orientation: portrait) {
        /* Override React Spring opacity animations for navigation buttons */
        [class*="header"] *[class*="nav"] *,
        [class*="navigation"] *,
        *[data-text="Gallery"],
        *[data-text="Contact"],
        button:has-text("Gallery"),
        button:has-text("Contact") {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
        }
        
        /* Specific button text targeting */
        *:contains("Gallery"),
        *:contains("Contact") {
          opacity: 1 !important;
          visibility: visible !important;
        }
        
        /* Ensure proper stacking context */
        .header, header {
          z-index: 100 !important;
          position: relative !important;
        }
        
        /* Canvas positioning constraints */
        canvas {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          z-index: 1 !important;
        }
        
        /* Prevent container isolation issues */
        .app-container,
        .appContainer,
        [class*="app"] {
          isolation: auto !important;
          transform: none !important;
        }
      }
    `;

    // Remove existing permanent fixes if they exist
    const existing = document.getElementById('ipad-pro-permanent-fixes');
    if (existing) existing.remove();

    document.head.appendChild(permanentStyle);
    console.log('✅ Permanent iPad Pro fixes applied');

    // Also apply direct element fixes to ensure visibility
    const ensureButtonVisibility = () => {
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el) => {
        const text = el.textContent?.trim();
        if (text === 'Gallery' || text === 'Contact') {
          el.style.setProperty('opacity', '1', 'important');
          el.style.setProperty('visibility', 'visible', 'important');
          el.style.setProperty('pointer-events', 'auto', 'important');
        }
      });
      console.log('✅ Applied direct button visibility fixes');
    };

    ensureButtonVisibility();

    // Monitor for React Spring interference
    const observer = new MutationObserver(() => {
      ensureButtonVisibility();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    console.log('✅ Started monitoring for React Spring interference');
  }
};

// Run cleanup and apply permanent fixes
cleanupEmergencyStyles();
applyPermanentFixes();

console.log('🎉 CLEANUP COMPLETE!');
console.log('📋 VERIFICATION STEPS:');
console.log('1. Check that buttons no longer have lime background');
console.log('2. Check that header no longer has red background');
console.log(
  '3. Verify Gallery and Contact buttons are still visible and clickable'
);
console.log('4. Test button navigation functionality');
