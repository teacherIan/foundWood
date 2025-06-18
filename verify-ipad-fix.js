// iPad Menu Fix Verification Script
// Run this in the browser console to verify the fix is working correctly

console.log('🔍 iPad Menu Fix Verification');
console.log('============================');

// Check device
const width = window.innerWidth;
const height = window.innerHeight;
const isIPadPro = width >= 1024 && height >= 1366;
const isPortrait = height > width;
const isIPadProPortrait = isIPadPro && isPortrait;

console.log('📱 Device Check:', {
  viewport: `${width}x${height}`,
  isIPadPro,
  isPortrait,
  isIPadProPortrait,
  shouldApplyFix: isIPadProPortrait
});

if (!isIPadProPortrait) {
  console.log('ℹ️ Fix only applies to iPad Pro in portrait mode');
  console.log('✅ Current device uses standard layout');
} else {
  console.log('🎯 iPad Pro Portrait detected - checking z-index hierarchy...');
  
  // Check elements exist
  const header = document.querySelector('.header');
  const menu = document.querySelector('.menu');
  const menuItems = document.querySelectorAll('.menu-item');
  const canvas = document.querySelector('canvas');
  const appContainer = document.querySelector('.appContainer');

  console.log('🔍 Element Detection:', {
    header: header ? '✅ Found' : '❌ Missing',
    menu: menu ? '✅ Found' : '❌ Missing',
    menuItems: `${menuItems.length} items found`,
    canvas: canvas ? '✅ Found' : '❌ Missing',
    appContainer: appContainer ? '✅ Found' : '❌ Missing'
  });

  // Check z-index values
  if (header && menu && canvas) {
    const headerStyles = window.getComputedStyle(header);
    const menuStyles = window.getComputedStyle(menu);
    const canvasStyles = window.getComputedStyle(canvas);
    
    const headerZ = parseInt(headerStyles.zIndex) || 0;
    const menuZ = parseInt(menuStyles.zIndex) || 0;
    const canvasZ = parseInt(canvasStyles.zIndex) || 0;

    console.log('📊 Z-Index Values:', {
      canvas: canvasZ,
      header: headerZ,
      menu: menuZ,
      hierarchyCorrect: canvasZ < headerZ && headerZ <= menuZ
    });

    // Check if hierarchy is correct
    const isCorrectHierarchy = canvasZ < headerZ && headerZ <= menuZ;
    console.log(isCorrectHierarchy ? '✅ Z-Index hierarchy is correct' : '❌ Z-Index hierarchy needs fixing');

    // Check positioning
    console.log('📐 Positioning Check:', {
      headerPosition: headerStyles.position,
      headerTop: headerStyles.top,
      headerLeft: headerStyles.left,
      canvasPosition: canvasStyles.position,
      headerFixed: headerStyles.position === 'fixed',
      canvasFixed: canvasStyles.position === 'fixed'
    });

    // Check visibility
    const headerRect = header.getBoundingClientRect();
    const menuItemsVisible = Array.from(menuItems).every(item => {
      const rect = item.getBoundingClientRect();
      const styles = window.getComputedStyle(item);
      return rect.width > 0 && rect.height > 0 && 
             styles.opacity !== '0' && 
             styles.visibility !== 'hidden';
    });

    console.log('👁️ Visibility Check:', {
      headerVisible: headerRect.width > 0 && headerRect.height > 0,
      headerOpacity: headerStyles.opacity,
      menuItemsVisible,
      allMenuItemsRendered: menuItems.length >= 2
    });

    // Check for stacking context issues
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

      console.log('🏗️ Stacking Context Check:', {
        appContainerCreatesContext: createsStackingContext,
        containerPosition: containerStyles.position,
        containerTransform: containerStyles.transform,
        containerIsolation: containerStyles.isolation,
        contextFixed: !createsStackingContext
      });

      if (createsStackingContext) {
        console.log('⚠️ App container still creates stacking context - this may cause issues');
      } else {
        console.log('✅ App container does not create stacking context');
      }
    }

    // Overall assessment
    const allChecksPass = isCorrectHierarchy && 
                          headerStyles.position === 'fixed' && 
                          canvasStyles.position === 'fixed' &&
                          menuItemsVisible;

    console.log('\n📋 Fix Verification Summary:');
    console.log('===========================');
    if (allChecksPass) {
      console.log('✅ iPad menu fix is working correctly!');
      console.log('✅ Menu should properly overlay the canvas');
      console.log('✅ All elements are positioned and visible');
    } else {
      console.log('❌ Some issues detected with the fix');
      console.log('💡 Check the individual test results above');
    }

    // Quick visual test suggestion
    console.log('\n🧪 Quick Visual Test:');
    console.log('====================');
    console.log('1. You should see the canvas (3D scene) in the background');
    console.log('2. Header menu should be semi-transparent overlay on top');
    console.log('3. Menu items should be clickable and styled');
    console.log('4. Opening Gallery/Contact should show overlay above menu');
  } else {
    console.log('❌ Missing required elements - cannot verify fix');
  }
}

// Test menu item clicking
if (isIPadProPortrait) {
  console.log('\n🖱️ Testing menu interaction...');
  const firstMenuItem = document.querySelector('.menu-item');
  if (firstMenuItem) {
    const rect = firstMenuItem.getBoundingClientRect();
    const styles = window.getComputedStyle(firstMenuItem);
    console.log('📊 First menu item:', {
      text: firstMenuItem.textContent?.trim(),
      clickable: styles.pointerEvents !== 'none',
      position: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      zIndex: styles.zIndex,
      background: styles.background
    });
  }
}

console.log('\n🔧 Need to debug further? Use:');
console.log('document.querySelector(".header").style.border = "3px solid red"');
console.log('document.querySelector("canvas").style.border = "3px solid blue"');
console.log('Array.from(document.querySelectorAll(".menu-item")).forEach(item => item.style.background = "lime")');
