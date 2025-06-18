// iPad Pro Button Visibility Debug and Fix Utility
// This module provides targeted debugging and fixing for button visibility issues on iPad Pro

export const iPadProButtonDebugger = {
  // Detect iPad Pro portrait mode with high accuracy
  isIPadProPortrait() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;

    // iPad Pro 12.9" portrait: 1024x1366-1368
    const isIPadPro12 =
      isPortrait &&
      width >= 1024 &&
      width <= 1024 &&
      height >= 1366 &&
      height <= 1380;

    // iPad Pro 11" portrait: 834x1194 or similar
    const isIPadPro11 =
      isPortrait &&
      width >= 820 &&
      width <= 834 &&
      height >= 1180 &&
      height <= 1210;

    // General large tablet portrait detection
    const isLargeTabletPortrait = isPortrait && width >= 768 && height >= 1000;

    return isIPadPro12 || isIPadPro11 || isLargeTabletPortrait;
  },

  // Comprehensive button element detection
  findButtonElements() {
    const selectors = [
      '.header',
      '.menu',
      '.menu-item',
      '[class*="menu"]',
      '[class*="Menu"]',
      'div[class*="animated"]',
      '[role="button"]',
      'button',
      'a[href]',
      // React Spring animated components
      'div[style*="transform"]',
      'div[style*="opacity"]',
      'div[style*="scale"]',
    ];

    const elements = new Map();

    selectors.forEach((selector) => {
      try {
        const found = document.querySelectorAll(selector);
        found.forEach((el, index) => {
          const text = el.textContent?.trim();
          if (
            text &&
            (text.includes('Gallery') ||
              text.includes('Contact') ||
              text.includes('Home'))
          ) {
            elements.set(`${selector}[${index}]`, {
              element: el,
              selector,
              text,
              computedStyle: window.getComputedStyle(el),
              boundingRect: el.getBoundingClientRect(),
            });
          }
        });
      } catch (e) {
        console.warn(`Selector failed: ${selector}`, e);
      }
    });

    return elements;
  },

  // Analyze why buttons might be hidden
  analyzeButtonVisibility() {
    const elements = this.findButtonElements();
    const analysis = {
      found: elements.size,
      issues: [],
      elements: [],
    };

    elements.forEach((data, key) => {
      const { element, computedStyle, boundingRect } = data;
      const issues = [];

      // Check common visibility issues
      if (computedStyle.opacity === '0') issues.push('opacity: 0');
      if (computedStyle.visibility === 'hidden')
        issues.push('visibility: hidden');
      if (computedStyle.display === 'none') issues.push('display: none');
      if (computedStyle.pointerEvents === 'none')
        issues.push('pointer-events: none');
      if (parseInt(computedStyle.zIndex) < 0) issues.push('negative z-index');
      if (boundingRect.width === 0 || boundingRect.height === 0)
        issues.push('zero dimensions');
      if (boundingRect.top < -100 || boundingRect.left < -100)
        issues.push('positioned off-screen');

      // Check for stacking context issues
      if (computedStyle.isolation === 'isolate')
        issues.push('isolation: isolate');
      if (computedStyle.contain && computedStyle.contain !== 'none')
        issues.push(`contain: ${computedStyle.contain}`);
      if (computedStyle.transform && computedStyle.transform !== 'none')
        issues.push(`transform: ${computedStyle.transform}`);

      analysis.elements.push({
        key,
        element,
        text: data.text,
        issues,
        computedStyle: {
          position: computedStyle.position,
          opacity: computedStyle.opacity,
          visibility: computedStyle.visibility,
          display: computedStyle.display,
          zIndex: computedStyle.zIndex,
          transform: computedStyle.transform,
          isolation: computedStyle.isolation,
          contain: computedStyle.contain,
        },
        boundingRect,
      });

      if (issues.length > 0) {
        analysis.issues.push(`${key}: ${issues.join(', ')}`);
      }
    });

    return analysis;
  },

  // Emergency button fix with aggressive overrides
  emergencyButtonFix() {
    console.log('🚨 EMERGENCY: Applying iPad Pro button fix...');

    const analysis = this.analyzeButtonVisibility();
    console.log('📊 Button analysis:', analysis);

    // Create emergency CSS
    const emergencyCSS = `
      /* EMERGENCY iPad Pro Button Visibility CSS */
      @media (min-width: 768px) and (orientation: portrait) {
        /* Force header and menu visibility */
        .header {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: auto !important;
          min-height: 60px !important;
          z-index: 999999 !important;
          background: rgba(0, 0, 0, 0.8) !important;
          backdrop-filter: blur(10px) !important;
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
          isolation: auto !important;
          contain: none !important;
          transform: none !important;
        }

        /* Force ALL possible button selectors */
        .menu-item,
        .menu > div,
        .menu > div > div,
        [class*="menu"],
        [class*="Menu"],
        div[class*="animated"],
        [role="button"],
        div[style*="transform"],
        div[style*="opacity"] {
          display: flex !important;
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          z-index: auto !important;
          position: relative !important;
          isolation: auto !important;
          contain: none !important;
          transform: none !important;
          background: rgba(255, 255, 255, 0.2) !important;
          border: 2px solid rgba(255, 255, 255, 0.5) !important;
          border-radius: 8px !important;
          padding: 8px 16px !important;
          color: white !important;
          font-weight: bold !important;
          cursor: pointer !important;
          min-width: 80px !important;
          min-height: 40px !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
        }

        /* Force logo/emblem visibility */
        .menu img,
        .header img,
        [src*="emblem"],
        [src*="logo"] {
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
          max-width: 40px !important;
          max-height: 40px !important;
          z-index: auto !important;
        }
      }
    `;

    // Inject emergency CSS
    const styleId = 'emergency-ipad-button-fix';
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = emergencyCSS;

    // Force button elements via JavaScript
    setTimeout(() => {
      const elements = this.findButtonElements();
      console.log(`🔧 Forcing ${elements.size} button elements...`);

      elements.forEach((data, key) => {
        const { element } = data;

        // Override React Spring inline styles
        element.style.setProperty('opacity', '1', 'important');
        element.style.setProperty('visibility', 'visible', 'important');
        element.style.setProperty('display', 'flex', 'important');
        element.style.setProperty('pointer-events', 'auto', 'important');
        element.style.setProperty('z-index', 'auto', 'important');
        element.style.setProperty('transform', 'none', 'important');
        element.style.setProperty('isolation', 'auto', 'important');
        element.style.setProperty('contain', 'none', 'important');

        console.log(`✅ Forced visibility for: ${key}`);
      });
    }, 100);

    return analysis;
  },

  // Monitor for React Spring interference
  monitorReactSpringInterference() {
    if (!this.isIPadProPortrait()) return;

    console.log('👀 Monitoring React Spring interference...');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'style'
        ) {
          const element = mutation.target;
          const text = element.textContent?.trim();

          if (text && (text.includes('Gallery') || text.includes('Contact'))) {
            const style = element.getAttribute('style') || '';

            // Check for React Spring opacity/transform animations
            if (style.includes('opacity: 0') || style.includes('transform:')) {
              console.warn('🔍 React Spring interference detected:', {
                element,
                text,
                style,
              });

              // Override immediately
              element.style.setProperty('opacity', '1', 'important');
              element.style.setProperty('visibility', 'visible', 'important');
              element.style.setProperty('display', 'flex', 'important');
            }
          }
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: true,
    });

    return observer;
  },

  // Complete diagnostic report
  generateDiagnosticReport() {
    const report = {
      device: {
        isIPadProPortrait: this.isIPadProPortrait(),
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        devicePixelRatio: window.devicePixelRatio,
        userAgent: navigator.userAgent,
      },
      buttons: this.analyzeButtonVisibility(),
      dom: {
        headerElement: !!document.querySelector('.header'),
        menuElement: !!document.querySelector('.menu'),
        canvasElements: document.querySelectorAll('canvas').length,
        totalDivs: document.querySelectorAll('div').length,
      },
      react: {
        reactRoot: !!document.querySelector('#root'),
        reactDevTools: !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
      },
    };

    console.log('📋 iPad Pro Button Diagnostic Report:', report);
    return report;
  },
};

// Auto-run on iPad Pro
if (iPadProButtonDebugger.isIPadProPortrait()) {
  console.log('🎯 iPad Pro Portrait detected - running button debugger...');

  // Wait for React to mount
  setTimeout(() => {
    iPadProButtonDebugger.generateDiagnosticReport();
    iPadProButtonDebugger.emergencyButtonFix();
    iPadProButtonDebugger.monitorReactSpringInterference();
  }, 1000);
}

// Make available globally for console testing
window.iPadProButtonDebugger = iPadProButtonDebugger;
