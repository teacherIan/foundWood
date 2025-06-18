/**
 * iPad Touch Event Compatibility Analysis
 * 
 * This script analyzes potential touch event conflicts across all components
 * specifically targeting the dual click+touch handlers in AnimatedMenuItem
 * and other touch interaction patterns that may cause issues on iPad.
 */

console.log('🔍 iPad Touch Event Compatibility Analysis Starting...');

// Device Detection
function detectDevice() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isPortrait = height > width;
  const isIPad = width >= 768 && isPortrait;
  const isIPadPro = (width >= 1024 && height >= 1366) || (width >= 834 && height >= 1194);
  
  return {
    width,
    height,
    isPortrait,
    isIPad,
    isIPadPro,
    userAgent: navigator.userAgent,
    touchSupport: 'ontouchstart' in window,
    pointerSupport: 'onpointerdown' in window,
    devicePixelRatio: window.devicePixelRatio
  };
}

// Analyze AnimatedMenuItem Touch Event Conflicts
function analyzeAnimatedMenuItems() {
  console.log('\n🎯 Analyzing AnimatedMenuItem Touch Event Conflicts...');
  
  const findings = {
    potentialConflicts: [],
    touchHandlers: [],
    clickHandlers: [],
    recommendations: []
  };
  
  // Find all interactive elements that might be wrapped in AnimatedMenuItem
  const interactiveElements = document.querySelectorAll('.menu-item, .icon, [class*="menu"]');
  
  interactiveElements.forEach((element, index) => {
    const hasClick = element.onclick !== null || hasEventListener(element, 'click');
    const hasTouchStart = hasEventListener(element, 'touchstart');
    const hasTouchEnd = hasEventListener(element, 'touchend');
    const hasMouseEvents = hasEventListener(element, 'mousedown') || hasEventListener(element, 'mouseup');
    
    const elementInfo = {
      element,
      index: index + 1,
      text: element.textContent?.trim(),
      hasClick,
      hasTouchStart,
      hasTouchEnd,
      hasMouseEvents,
      classList: Array.from(element.classList),
      boundingRect: element.getBoundingClientRect()
    };
    
    // Check for potential conflicts (both touch and click handlers)
    if ((hasTouchStart || hasTouchEnd) && (hasClick || hasMouseEvents)) {
      findings.potentialConflicts.push({
        ...elementInfo,
        conflictType: 'touch_click_overlap',
        description: 'Element has both touch and click/mouse handlers which may cause double-firing on iPad'
      });
    }
    
    if (hasTouchStart || hasTouchEnd) {
      findings.touchHandlers.push(elementInfo);
    }
    
    if (hasClick || hasMouseEvents) {
      findings.clickHandlers.push(elementInfo);
    }
  });
  
  return findings;
}

// Check for event listener presence (simplified detection)
function hasEventListener(element, eventType) {
  // Check for inline handlers
  const inlineHandler = element[`on${eventType}`];
  if (inlineHandler) return true;
  
  // Check for React synthetic events (harder to detect, but look for React props)
  const reactProps = Object.keys(element).find(key => key.startsWith('__reactProps') || key.startsWith('__reactInternalInstance'));
  if (reactProps && element[reactProps]) {
    const props = element[reactProps].memoizedProps || element[reactProps].pendingProps;
    if (props && props[`on${eventType.charAt(0).toUpperCase() + eventType.slice(1)}`]) {
      return true;
    }
  }
  
  return false;
}

// Analyze Gallery Touch Handling
function analyzeGalleryTouchHandling() {
  console.log('\n🖼️ Analyzing Gallery Touch Handling...');
  
  const gallery = document.querySelector('.galleryContainer');
  if (!gallery) {
    return { status: 'not_found', message: 'Gallery not currently active' };
  }
  
  const findings = {
    touchImplementation: 'conditional',
    mobileDetection: 'window.innerWidth < window.innerHeight',
    touchActions: [],
    potentialIssues: []
  };
  
  // Check for draggable thumbnail containers
  const thumbnailContainer = document.querySelector('[class*="thumbnail"]');
  if (thumbnailContainer) {
    const styles = window.getComputedStyle(thumbnailContainer);
    findings.touchActions.push({
      element: 'thumbnail_container',
      touchAction: styles.touchAction,
      description: 'Thumbnail scrolling uses touch-action property'
    });
  }
  
  // Check for image touch handling
  const images = document.querySelectorAll('.masterImage, [class*="image"]');
  images.forEach((img, index) => {
    const rect = img.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      findings.touchActions.push({
        element: `image_${index + 1}`,
        description: 'Image panning implemented with conditional touch handlers'
      });
    }
  });
  
  return findings;
}

// Analyze Contact Component Touch Events
function analyzeContactTouchEvents() {
  console.log('\n📧 Analyzing Contact Component Touch Events...');
  
  const contact = document.querySelector('.contactContainer');
  if (!contact) {
    return { status: 'not_found', message: 'Contact not currently active' };
  }
  
  return {
    touchImplementation: 'swipe_gestures',
    description: 'Contact form uses touch events for mobile info panel swiping',
    findings: [
      'Vertical swipe gestures for info panel',
      'Touch start/move/end handlers for swipe detection',
      'No conflicts with form submission expected'
    ]
  };
}

// Analyze Types Component Touch Events  
function analyzeTypesTouchEvents() {
  console.log('\n🎨 Analyzing Types Component Touch Events...');
  
  const types = document.querySelector('.typesContainer');
  if (!types) {
    return { status: 'not_found', message: 'Types not currently active' };
  }
  
  // Check individual Type components
  const typeElements = document.querySelectorAll('.typeContainer');
  const findings = {
    touchImplementation: 'hover_only',
    elements: [],
    recommendations: []
  };
  
  typeElements.forEach((type, index) => {
    findings.elements.push({
      index: index + 1,
      text: type.querySelector('.typeHeader')?.textContent?.trim(),
      hasHoverEvents: hasEventListener(type, 'mouseenter') || hasEventListener(type, 'mouseleave'),
      hasTouchEvents: hasEventListener(type, 'touchstart') || hasEventListener(type, 'touchend'),
      recommendation: 'Consider adding touch event handlers for better iPad experience'
    });
  });
  
  if (findings.elements.some(el => el.hasHoverEvents && !el.hasTouchEvents)) {
    findings.recommendations.push('Type components only use hover events - may not provide feedback on touch devices');
  }
  
  return findings;
}

// Device-specific Touch Event Recommendations
function generateTouchEventRecommendations(findings) {
  console.log('\n💡 Touch Event Recommendations...');
  
  const device = detectDevice();
  const recommendations = [];
  
  if (device.isIPad) {
    recommendations.push({
      priority: 'HIGH',
      component: 'AnimatedMenuItem',
      issue: 'Dual touch and click handlers may cause double-firing',
      solution: 'Implement device-specific event handling or use pointer events'
    });
    
    if (findings.animatedMenuItems.potentialConflicts.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        component: 'Menu Items',
        issue: `${findings.animatedMenuItems.potentialConflicts.length} elements have conflicting touch/click handlers`,
        solution: 'Add preventDefault() in touch handlers or use conditional event binding'
      });
    }
    
    recommendations.push({
      priority: 'MEDIUM',
      component: 'Type Components',
      issue: 'Hover-only interactions may not provide feedback on iPad',
      solution: 'Add touch event handlers for active states on touch devices'
    });
    
    if (device.isIPadPro) {
      recommendations.push({
        priority: 'LOW',
        component: 'All Components',
        issue: 'iPad Pro may interpret touch differently than smaller iPads',
        solution: 'Test thoroughly on actual iPad Pro hardware'
      });
    }
  }
  
  return recommendations;
}

// Test Touch Event Response
function testTouchEventResponse() {
  console.log('\n🧪 Testing Touch Event Response...');
  
  const testResults = [];
  const menuItems = document.querySelectorAll('.menu-item');
  
  menuItems.forEach((item, index) => {
    if (item.getBoundingClientRect().width > 0) {
      const result = {
        element: `menu_item_${index + 1}`,
        text: item.textContent?.trim(),
        tests: []
      };
      
      // Test click responsiveness
      const clickStart = performance.now();
      const clickEvent = new MouseEvent('click', { bubbles: true });
      item.dispatchEvent(clickEvent);
      const clickEnd = performance.now();
      
      result.tests.push({
        event: 'click',
        responseTime: clickEnd - clickStart,
        status: clickEnd - clickStart < 100 ? 'good' : 'slow'
      });
      
      // Test touch responsiveness (if supported)
      if ('TouchEvent' in window) {
        const touchStart = performance.now();
        const touchEvent = new TouchEvent('touchstart', { bubbles: true });
        item.dispatchEvent(touchEvent);
        const touchEnd = performance.now();
        
        result.tests.push({
          event: 'touchstart',
          responseTime: touchEnd - touchStart,
          status: touchEnd - touchStart < 100 ? 'good' : 'slow'
        });
      }
      
      testResults.push(result);
    }
  });
  
  return testResults;
}

// Main Analysis Function
function runTouchEventAnalysis() {
  const device = detectDevice();
  
  console.log('📱 Device Information:', device);
  
  if (!device.isIPad) {
    console.warn('⚠️ Not running on iPad - some tests may not be relevant');
  }
  
  const findings = {
    device,
    animatedMenuItems: analyzeAnimatedMenuItems(),
    gallery: analyzeGalleryTouchHandling(),
    contact: analyzeContactTouchEvents(),
    types: analyzeTypesTouchEvents(),
    touchTests: testTouchEventResponse()
  };
  
  const recommendations = generateTouchEventRecommendations(findings);
  
  // Summary Report
  console.log('\n📋 Touch Event Analysis Summary:');
  console.log('=====================================');
  
  console.log(`\n🎯 AnimatedMenuItem Analysis:`);
  console.log(`- Potential conflicts found: ${findings.animatedMenuItems.potentialConflicts.length}`);
  console.log(`- Elements with touch handlers: ${findings.animatedMenuItems.touchHandlers.length}`);
  console.log(`- Elements with click handlers: ${findings.animatedMenuItems.clickHandlers.length}`);
  
  if (findings.animatedMenuItems.potentialConflicts.length > 0) {
    console.log('\n⚠️ CONFLICTS DETECTED:');
    findings.animatedMenuItems.potentialConflicts.forEach(conflict => {
      console.log(`- ${conflict.text}: ${conflict.description}`);
    });
  }
  
  console.log(`\n🖼️ Gallery Touch Handling: ${findings.gallery.status || 'conditional_mobile_only'}`);
  console.log(`📧 Contact Touch Handling: ${findings.contact.status || 'swipe_gestures'}`);
  console.log(`🎨 Types Touch Handling: ${findings.types.status || 'hover_only'}`);
  
  console.log('\n💡 Recommendations:');
  recommendations.forEach(rec => {
    console.log(`${rec.priority}: ${rec.component} - ${rec.issue}`);
    console.log(`   Solution: ${rec.solution}`);
  });
  
  // Store results globally for further inspection
  window.touchEventAnalysisResults = findings;
  window.touchEventRecommendations = recommendations;
  
  return { findings, recommendations };
}

// Auto-run analysis
const analysisResults = runTouchEventAnalysis();

// Export for manual testing
window.touchEventAnalysis = {
  run: runTouchEventAnalysis,
  detectDevice,
  analyzeAnimatedMenuItems,
  analyzeGalleryTouchHandling,
  analyzeContactTouchEvents,
  analyzeTypesTouchEvents,
  testTouchEventResponse,
  results: analysisResults
};

console.log('\n✅ Touch Event Analysis Complete!');
console.log('📝 Results stored in window.touchEventAnalysisResults');
console.log('🔧 Manual functions available in window.touchEventAnalysis');
