// Button Functionality Test Script
// Run this in browser console to test if the buttons actually work

console.log('🧪 BUTTON FUNCTIONALITY TEST STARTING...');

// Find the visible buttons
const testButtons = () => {
  console.log('🔍 Looking for visible Gallery and Contact buttons...');

  // Find all elements that might be buttons
  const allElements = document.querySelectorAll('*');
  const buttons = [];

  allElements.forEach((el) => {
    const text = el.textContent?.trim();
    if (text === 'Gallery' || text === 'Contact') {
      const computed = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      // Check if actually visible
      if (
        computed.opacity !== '0' &&
        computed.visibility !== 'hidden' &&
        computed.display !== 'none' &&
        rect.width > 0 &&
        rect.height > 0
      ) {
        buttons.push({
          element: el,
          text,
          rect,
          clickable: computed.pointerEvents !== 'none',
        });
      }
    }
  });

  console.log(`✅ Found ${buttons.length} visible buttons:`, buttons);

  return buttons;
};

// Test button clicks
const testClicks = (buttons) => {
  console.log('🖱️ Testing button clicks...');

  buttons.forEach((btn, index) => {
    console.log(`🎯 Testing ${btn.text} button...`);

    // Add click event listener to monitor
    const originalClick = btn.element.onclick;
    let clickDetected = false;

    // Monitor for click events
    const clickListener = (e) => {
      clickDetected = true;
      console.log(`✅ Click detected on ${btn.text} button!`, e);
    };

    btn.element.addEventListener('click', clickListener);

    // Try programmatic click
    try {
      btn.element.click();
      console.log(`🔄 Programmatic click attempted on ${btn.text}`);
    } catch (error) {
      console.error(`❌ Click failed on ${btn.text}:`, error);
    }

    // Clean up listener after a short delay
    setTimeout(() => {
      btn.element.removeEventListener('click', clickListener);
      if (clickDetected) {
        console.log(`✅ ${btn.text} button click was successful!`);
      } else {
        console.warn(`⚠️ ${btn.text} button click may not have worked`);
      }
    }, 1000);
  });
};

// Add visual feedback for manual testing
const addVisualFeedback = (buttons) => {
  console.log('👀 Adding visual feedback for manual testing...');

  buttons.forEach((btn) => {
    // Add hover effect
    btn.element.addEventListener('mouseenter', () => {
      btn.element.style.setProperty('background', 'yellow', 'important');
      btn.element.style.setProperty('transform', 'scale(1.1)', 'important');
      console.log(`🖱️ Hover on ${btn.text} button`);
    });

    btn.element.addEventListener('mouseleave', () => {
      btn.element.style.setProperty('background', 'lime', 'important');
      btn.element.style.setProperty('transform', 'scale(1)', 'important');
    });

    // Add click feedback
    btn.element.addEventListener('mousedown', () => {
      btn.element.style.setProperty('background', 'orange', 'important');
      console.log(`👆 Manual click detected on ${btn.text} button`);
    });

    btn.element.addEventListener('mouseup', () => {
      btn.element.style.setProperty('background', 'lime', 'important');
    });
  });
};

// Run the tests
const buttons = testButtons();

if (buttons.length > 0) {
  console.log('🎉 Buttons found! Running functionality tests...');
  testClicks(buttons);
  addVisualFeedback(buttons);

  console.log('📋 TEST INSTRUCTIONS:');
  console.log(
    '1. Try hovering over the Gallery button - it should turn yellow'
  );
  console.log(
    '2. Try clicking the Gallery button - it should turn orange briefly'
  );
  console.log(
    '3. Try hovering over the Contact button - it should turn yellow'
  );
  console.log(
    '4. Try clicking the Contact button - it should turn orange briefly'
  );
  console.log('5. Check if clicking actually opens the Gallery/Contact pages');
  console.log('');
  console.log('📊 REPORT BACK:');
  console.log('✅ or ❌ Buttons change color on hover');
  console.log('✅ or ❌ Buttons change color on click');
  console.log('✅ or ❌ Gallery button opens gallery page');
  console.log('✅ or ❌ Contact button opens contact page');
} else {
  console.error(
    '❌ No visible buttons found! The emergency fix may not have worked.'
  );
  console.log('🔄 Try running the IMMEDIATE_BUTTON_FIX.js script again');
}

console.log('🧪 Button functionality test setup complete!');
