// Debug script to check loading spinner animation
function debugSpinner() {
  console.log('🔍 Debugging loading spinner animation...');

  const spinner = document.querySelector('.loading-spinner');
  if (!spinner) {
    console.log('❌ No loading spinner found in DOM');
    return;
  }

  console.log('✅ Loading spinner element found');

  // Check computed styles
  const computedStyle = window.getComputedStyle(spinner);
  console.log('📊 Computed styles:', {
    animation: computedStyle.getPropertyValue('animation'),
    animationName: computedStyle.getPropertyValue('animation-name'),
    animationDuration: computedStyle.getPropertyValue('animation-duration'),
    animationIterationCount: computedStyle.getPropertyValue(
      'animation-iteration-count'
    ),
    animationPlayState: computedStyle.getPropertyValue('animation-play-state'),
    transform: computedStyle.getPropertyValue('transform'),
    webkitAnimation: computedStyle.getPropertyValue('-webkit-animation'),
    webkitTransform: computedStyle.getPropertyValue('-webkit-transform'),
  });

  // Check if keyframes are defined
  const keyframes = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue('--debug-keyframes');
  console.log('🎨 Checking keyframes...');

  // Test if we can manually set the animation
  spinner.style.animation = 'none';
  setTimeout(() => {
    spinner.style.animation = 'spin-smooth 1s linear infinite';
    console.log('🔄 Manually reset animation');
  }, 100);

  // Monitor transform changes
  let lastTransform = '';
  const monitorInterval = setInterval(() => {
    const currentTransform = window
      .getComputedStyle(spinner)
      .getPropertyValue('transform');
    if (currentTransform !== lastTransform) {
      console.log('🔄 Transform changed:', currentTransform);
      lastTransform = currentTransform;
    }
  }, 200);

  // Stop monitoring after 5 seconds
  setTimeout(() => {
    clearInterval(monitorInterval);
    console.log('⏹️ Stopped monitoring spinner');
  }, 5000);
}

// Run debug when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', debugSpinner);
} else {
  debugSpinner();
}

// Also run when page is fully loaded
window.addEventListener('load', () => {
  setTimeout(debugSpinner, 1000);
});
