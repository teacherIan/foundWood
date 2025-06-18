/**
 * iPad Touch Event Fix Validation Script
 *
 * Run this in the browser console to validate that the touch event fix
 * is working correctly for main navigation buttons.
 *
 * Usage: Copy and paste this entire script into browser console on iPad
 */

console.log('🔧 iPad Touch Event Fix Validation Starting...');
console.log('===============================================');

// Device Detection
function detectDevice() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isPortrait = height > width;
  const isIpad =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isTouchDevice =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return {
    width,
    height,
    isPortrait,
    isIpad,
    isTouchDevice,
    userAgent: navigator.userAgent,
    maxTouchPoints: navigator.maxTouchPoints,
    devicePixelRatio: window.devicePixelRatio,
  };
}

const device = detectDevice();

console.log('📱 Device Information:');
console.log('=====================');
console.log('Viewport:', `${device.width}x${device.height}`);
console.log('iPad detected:', device.isIpad ? '✅ YES' : '❌ NO');
console.log('Touch device:', device.isTouchDevice ? '✅ YES' : '❌ NO');
console.log('Portrait mode:', device.isPortrait ? '✅ YES' : '❌ NO');
console.log('Max touch points:', device.maxTouchPoints);
console.log('User agent:', device.userAgent.substring(0, 80) + '...');

// Check if we're in the ideal test environment
const isIdealTestEnvironment = device.isIpad && device.isTouchDevice;
console.log('\n🎯 Test Environment:');
console.log('===================');
if (isIdealTestEnvironment) {
  console.log('✅ PERFECT: iPad with touch support detected');
} else if (device.isTouchDevice) {
  console.log('⚠️ PARTIAL: Touch device detected (not iPad)');
} else {
  console.log('⚠️ LIMITED: No touch support detected');
}

// Find navigation elements
function findNavigationElements() {
  const elements = {
    header: document.querySelector('.header'),
    menu: document.querySelector('.menu'),
    menuItems: document.querySelectorAll('.menu-item'),
    animatedDivs: document.querySelectorAll('.menu > div'),
    logo: document.querySelector('.icon'),
    canvas: document.querySelector('canvas'),
  };

  return elements;
}

const elements = findNavigationElements();

console.log('\n🔍 Element Detection:');
console.log('====================');
console.log('Header:', elements.header ? '✅ Found' : '❌ Missing');
console.log('Menu:', elements.menu ? '✅ Found' : '❌ Missing');
console.log('Menu items:', `${elements.menuItems.length} found`);
console.log('Animated divs:', `${elements.animatedDivs.length} found`);
console.log('Logo:', elements.logo ? '✅ Found' : '❌ Missing');
console.log('Canvas:', elements.canvas ? '✅ Found' : '❌ Missing');

// Check Z-Index hierarchy
function checkZIndexHierarchy() {
  if (!elements.header || !elements.canvas) {
    console.log('❌ Cannot check z-index - missing elements');
    return false;
  }

  const headerZ =
    parseInt(window.getComputedStyle(elements.header).zIndex) || 0;
  const canvasZ =
    parseInt(window.getComputedStyle(elements.canvas).zIndex) || 0;

  console.log('\n📊 Z-Index Values:');
  console.log('==================');
  console.log('Header z-index:', headerZ);
  console.log('Canvas z-index:', canvasZ);

  const hierarchyCorrect = headerZ > canvasZ;
  console.log('Hierarchy correct:', hierarchyCorrect ? '✅ YES' : '❌ NO');

  if (!hierarchyCorrect) {
    console.log('⚠️ Header should have higher z-index than canvas');
    console.log(`   Expected: Header(${headerZ}) > Canvas(${canvasZ})`);
  }

  return hierarchyCorrect;
}

const zIndexOK = checkZIndexHierarchy();

// Check button interactivity
function checkButtonInteractivity() {
  console.log('\n👆 Button Interactivity Check:');
  console.log('=============================');

  const interactiveElements = [];

  // Check menu items
  elements.menuItems.forEach((item, index) => {
    const styles = window.getComputedStyle(item);
    const rect = item.getBoundingClientRect();
    const isVisible =
      rect.width > 0 &&
      rect.height > 0 &&
      styles.opacity !== '0' &&
      styles.visibility !== 'hidden' &&
      styles.display !== 'none';
    const isClickable = styles.pointerEvents !== 'none';

    const info = {
      element: `Menu Item ${index + 1}`,
      text: item.textContent?.trim() || 'No text',
      visible: isVisible,
      clickable: isClickable,
      rect: {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
      },
      zIndex: styles.zIndex,
      pointerEvents: styles.pointerEvents,
    };

    interactiveElements.push(info);

    console.log(
      `${info.element} (${info.text}):`,
      info.visible && info.clickable ? '✅ GOOD' : '❌ ISSUE'
    );
    if (!info.visible || !info.clickable) {
      console.log(`   Visible: ${info.visible}, Clickable: ${info.clickable}`);
      console.log(`   Rect:`, info.rect);
      console.log(`   Pointer events: ${info.pointerEvents}`);
    }
  });

  // Check animated divs (AnimatedMenuItem wrappers)
  elements.animatedDivs.forEach((div, index) => {
    const styles = window.getComputedStyle(div);
    const rect = div.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0;
    const isClickable = styles.pointerEvents !== 'none';

    console.log(
      `Animated Div ${index + 1}:`,
      isVisible && isClickable ? '✅ GOOD' : '❌ ISSUE'
    );
    if (!isVisible || !isClickable) {
      console.log(`   Visible: ${isVisible}, Clickable: ${isClickable}`);
      console.log(`   Pointer events: ${styles.pointerEvents}`);
    }
  });

  return interactiveElements;
}

const buttonInfo = checkButtonInteractivity();

// Test touch event handling
function testTouchEventHandling() {
  console.log('\n🖐️ Touch Event Handling Test:');
  console.log('=============================');

  if (!device.isTouchDevice) {
    console.log('⚠️ Skipping touch test - no touch support detected');
    return;
  }

  // Check if elements have touch event listeners
  elements.animatedDivs.forEach((div, index) => {
    const hasOnTouchStart = typeof div.ontouchstart !== 'undefined';
    const hasOnTouchEnd = typeof div.ontouchend !== 'undefined';
    const hasOnClick = typeof div.onclick !== 'undefined';

    console.log(`Animated Div ${index + 1} event handlers:`);
    console.log(`   Touch start: ${hasOnTouchStart ? '✅' : '❌'}`);
    console.log(`   Touch end: ${hasOnTouchEnd ? '✅' : '❌'}`);
    console.log(`   Click: ${hasOnClick ? '✅' : '❌'}`);
  });

  // Simulate touch event to test responsiveness
  if (elements.animatedDivs.length > 0) {
    console.log('\n🧪 Simulating touch events...');
    const testDiv = elements.animatedDivs[0];

    try {
      // Create and dispatch touch events
      const touchStart = new TouchEvent('touchstart', {
        touches: [
          new Touch({
            identifier: 0,
            target: testDiv,
            clientX: 100,
            clientY: 100,
          }),
        ],
      });

      const touchEnd = new TouchEvent('touchend', {
        changedTouches: [
          new Touch({
            identifier: 0,
            target: testDiv,
            clientX: 100,
            clientY: 100,
          }),
        ],
      });

      console.log('   Dispatching touchstart...');
      testDiv.dispatchEvent(touchStart);

      setTimeout(() => {
        console.log('   Dispatching touchend...');
        testDiv.dispatchEvent(touchEnd);
        console.log('✅ Touch simulation completed');
      }, 100);
    } catch (error) {
      console.log('❌ Touch simulation failed:', error.message);
    }
  }
}

testTouchEventHandling();

// Overall assessment
function assessOverallFix() {
  console.log('\n📋 Overall Assessment:');
  console.log('======================');

  const checks = {
    deviceDetection: isIdealTestEnvironment,
    elementsFound:
      elements.header && elements.menu && elements.menuItems.length > 0,
    zIndexHierarchy: zIndexOK,
    buttonsVisible: buttonInfo.every((btn) => btn.visible),
    buttonsClickable: buttonInfo.every((btn) => btn.clickable),
    touchSupport: device.isTouchDevice,
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;

  console.log('Checks passed:', `${passedChecks}/${totalChecks}`);
  console.log('Device detection:', checks.deviceDetection ? '✅' : '⚠️');
  console.log('Elements found:', checks.elementsFound ? '✅' : '❌');
  console.log('Z-index hierarchy:', checks.zIndexHierarchy ? '✅' : '❌');
  console.log('Buttons visible:', checks.buttonsVisible ? '✅' : '❌');
  console.log('Buttons clickable:', checks.buttonsClickable ? '✅' : '❌');
  console.log('Touch support:', checks.touchSupport ? '✅' : '⚠️');

  if (passedChecks === totalChecks) {
    console.log(
      '\n🎉 ALL CHECKS PASSED - Touch event fix is working correctly!'
    );
  } else if (passedChecks >= totalChecks - 1) {
    console.log(
      '\n✅ MOSTLY WORKING - Minor issues detected but should be functional'
    );
  } else {
    console.log(
      '\n⚠️ ISSUES DETECTED - Touch event fix may not be working properly'
    );
  }

  // Recommendations
  console.log('\n💡 Recommendations:');
  console.log('==================');
  if (!checks.elementsFound) {
    console.log('❌ Elements missing - ensure page has fully loaded');
  }
  if (!checks.zIndexHierarchy) {
    console.log('❌ Fix z-index hierarchy - header should be above canvas');
  }
  if (!checks.buttonsVisible || !checks.buttonsClickable) {
    console.log(
      '❌ Check CSS styling - buttons may be hidden or non-interactive'
    );
  }
  if (!checks.deviceDetection && device.isTouchDevice) {
    console.log('⚠️ Test on actual iPad for best results');
  }

  return { passedChecks, totalChecks, checks };
}

const assessment = assessOverallFix();

// Interactive test function
function runInteractiveTest() {
  console.log('\n🖱️ Interactive Test Available:');
  console.log('==============================');
  console.log('Run: runButtonTest() to test button clicking');

  window.runButtonTest = function () {
    console.log('🧪 Starting interactive button test...');

    elements.animatedDivs.forEach((div, index) => {
      const text = div.textContent?.trim() || `Button ${index + 1}`;
      console.log(`Testing: ${text}`);

      // Add temporary click listener
      const testClick = (e) => {
        console.log(`✅ ${text} clicked successfully!`);
        div.removeEventListener('click', testClick);
      };

      div.addEventListener('click', testClick);

      // Simulate click
      setTimeout(() => {
        div.click();
      }, index * 500);
    });
  };

  console.log('✨ Function runButtonTest() is now available in global scope');
}

runInteractiveTest();

// Export results for further analysis
window.iPadTouchEventFixValidation = {
  device,
  elements,
  buttonInfo,
  assessment,
  rerun: () => {
    console.clear();
    eval(
      document.querySelector('script[data-ipad-validation]')?.textContent ||
        'console.log("Validation script not found")'
    );
  },
};

console.log('\n📁 Results exported to: window.iPadTouchEventFixValidation');
console.log(
  '🔄 To rerun validation: window.iPadTouchEventFixValidation.rerun()'
);
console.log('\n🎯 iPad Touch Event Fix Validation Complete!');

// Mark script for rerun capability
if (!document.querySelector('script[data-ipad-validation]')) {
  const script = document.createElement('script');
  script.setAttribute('data-ipad-validation', 'true');
  script.textContent = document.currentScript?.textContent || '';
  document.head.appendChild(script);
}
