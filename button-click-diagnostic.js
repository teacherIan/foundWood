// IMMEDIATE BUTTON CLICK DIAGNOSTIC TOOL
// Run this in the browser console to diagnose why buttons aren't clickable

console.log('🔍 Button Click Diagnostic Tool Starting...');

// 1. Device Detection
const deviceInfo = {
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    userAgent: navigator.userAgent,
    isIPad: /iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
    isTouch: 'ontouchstart' in window,
    maxTouchPoints: navigator.maxTouchPoints
};

console.log('📱 Device Info:', deviceInfo);

// 2. Find all button-related elements
const buttonElements = {
    header: document.querySelector('.header'),
    menu: document.querySelector('.menu'),
    menuItems: document.querySelectorAll('.menu-item'),
    animatedMenuItems: document.querySelectorAll('[class*="animated"]'),
    canvas: document.querySelector('canvas'),
    allClickableElements: document.querySelectorAll('button, [onclick], .menu-item, [role="button"]')
};

console.log('🎯 Found Elements:', {
    header: !!buttonElements.header,
    menu: !!buttonElements.menu,
    menuItems: buttonElements.menuItems.length,
    animatedMenuItems: buttonElements.animatedMenuItems.length,
    canvas: !!buttonElements.canvas,
    allClickableElements: buttonElements.allClickableElements.length
});

// 3. Check visibility and pointer events for each menu item
if (buttonElements.menuItems.length > 0) {
    console.log('📊 Menu Item Analysis:');
    buttonElements.menuItems.forEach((item, index) => {
        const styles = window.getComputedStyle(item);
        const rect = item.getBoundingClientRect();
        
        const analysis = {
            index: index + 1,
            text: item.textContent?.trim(),
            visible: rect.width > 0 && rect.height > 0 && styles.visibility !== 'hidden' && styles.display !== 'none',
            position: {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            },
            styles: {
                zIndex: styles.zIndex,
                position: styles.position,
                pointerEvents: styles.pointerEvents,
                opacity: styles.opacity,
                visibility: styles.visibility,
                display: styles.display,
                transform: styles.transform,
                isolation: styles.isolation,
                contain: styles.contain
            },
            clickable: styles.pointerEvents !== 'none'
        };
        
        console.log(`Menu Item ${index + 1}:`, analysis);
        
        // Test if element is actually clickable by checking what's at its position
        if (rect.width > 0 && rect.height > 0) {
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const elementAtPoint = document.elementFromPoint(centerX, centerY);
            
            console.log(`Element at center of menu item ${index + 1}:`, {
                elementAtPoint: elementAtPoint?.tagName + (elementAtPoint?.className ? '.' + elementAtPoint.className : ''),
                isTheSameElement: elementAtPoint === item,
                isChildOfMenuItem: item.contains(elementAtPoint),
                parentOfActualElement: elementAtPoint?.closest('.menu-item') === item
            });
        }
    });
}

// 4. Check for overlapping elements with higher z-index
console.log('🔍 Checking for blocking elements...');
const allElements = document.querySelectorAll('*');
const highZIndexElements = [];
const overlappingElements = [];

// Get menu bounds for overlap detection
const menuBounds = buttonElements.menu?.getBoundingClientRect();

allElements.forEach(el => {
    const styles = window.getComputedStyle(el);
    const zIndex = parseInt(styles.zIndex);
    const rect = el.getBoundingClientRect();
    
    // Check for high z-index elements
    if (!isNaN(zIndex) && zIndex > 20000) {
        highZIndexElements.push({
            element: el,
            tagName: el.tagName,
            className: el.className,
            zIndex: zIndex,
            pointerEvents: styles.pointerEvents,
            position: styles.position
        });
    }
    
    // Check for elements overlapping menu area
    if (menuBounds && rect.width > 0 && rect.height > 0) {
        const overlaps = !(rect.right < menuBounds.left || 
                         rect.left > menuBounds.right || 
                         rect.bottom < menuBounds.top || 
                         rect.top > menuBounds.bottom);
        
        if (overlaps && el !== buttonElements.menu && !buttonElements.menu?.contains(el)) {
            overlappingElements.push({
                element: el,
                tagName: el.tagName,
                className: el.className,
                zIndex: zIndex || 'auto',
                pointerEvents: styles.pointerEvents,
                bounds: rect
            });
        }
    }
});

console.log('⚡ High Z-Index Elements (> 20000):', highZIndexElements);
console.log('🚫 Elements Overlapping Menu Area:', overlappingElements);

// 5. Test click simulation
if (buttonElements.menuItems.length > 0) {
    console.log('🧪 Testing Click Simulation...');
    
    const firstMenuItem = buttonElements.menuItems[0];
    const rect = firstMenuItem.getBoundingClientRect();
    
    if (rect.width > 0 && rect.height > 0) {
        // Test what happens when we click the center of the first menu item
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        console.log('Testing click at:', { x: centerX, y: centerY });
        
        // Create and dispatch a click event
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            clientX: centerX,
            clientY: centerY
        });
        
        const touchEvent = new TouchEvent('touchstart', {
            bubbles: true,
            cancelable: true,
            touches: [{
                clientX: centerX,
                clientY: centerY
            }]
        });
        
        // Add event listeners to see if events are being received
        const clickListener = (e) => {
            console.log('✅ Click event received on:', e.target);
            firstMenuItem.removeEventListener('click', clickListener);
        };
        
        const touchListener = (e) => {
            console.log('✅ Touch event received on:', e.target);
            firstMenuItem.removeEventListener('touchstart', touchListener);
        };
        
        firstMenuItem.addEventListener('click', clickListener);
        firstMenuItem.addEventListener('touchstart', touchListener);
        
        // Dispatch events
        console.log('Dispatching click event...');
        firstMenuItem.dispatchEvent(clickEvent);
        
        if (deviceInfo.isTouch) {
            console.log('Dispatching touch event...');
            firstMenuItem.dispatchEvent(touchEvent);
        }
    }
}

// 6. Emergency Fix Function
window.emergencyButtonFix = function() {
    console.log('🚨 Applying Emergency Button Fix...');
    
    // Force menu items to be clickable
    buttonElements.menuItems.forEach((item, index) => {
        item.style.setProperty('z-index', '99999', 'important');
        item.style.setProperty('pointer-events', 'auto', 'important');
        item.style.setProperty('position', 'relative', 'important');
        item.style.setProperty('background', 'rgba(255, 0, 0, 0.5)', 'important');
        item.style.setProperty('border', '3px solid yellow', 'important');
        
        // Add direct click handler
        item.onclick = function(e) {
            alert(`Emergency click worked for: ${item.textContent}`);
            console.log('🆘 Emergency click handler fired for:', item.textContent);
        };
        
        console.log(`✅ Emergency fix applied to menu item ${index + 1}`);
    });
    
    // Force canvas to background
    if (buttonElements.canvas) {
        buttonElements.canvas.style.setProperty('z-index', '1', 'important');
        console.log('✅ Canvas forced to background');
    }
    
    console.log('🚨 Emergency fix complete! Try clicking the buttons now.');
};

// 7. Summary and Recommendations
console.log('\n📋 DIAGNOSTIC SUMMARY:');
console.log('======================');

if (buttonElements.menuItems.length === 0) {
    console.error('❌ No menu items found! Menu may not be rendered yet.');
} else {
    console.log(`✅ Found ${buttonElements.menuItems.length} menu items`);
}

if (highZIndexElements.length > 0) {
    console.warn(`⚠️ Found ${highZIndexElements.length} elements with z-index > 20000 that might block clicks`);
}

if (overlappingElements.length > 0) {
    console.warn(`⚠️ Found ${overlappingElements.length} elements overlapping the menu area`);
}

console.log('\n💡 NEXT STEPS:');
console.log('- If buttons are not clickable, run: emergencyButtonFix()');
console.log('- Check the element analysis above for pointer-events: none');
console.log('- Look for overlapping elements that might be blocking clicks');
console.log('- Check if z-index hierarchy is correct');

console.log('\n🔧 This diagnostic tool is complete. Check the logs above for details.');
