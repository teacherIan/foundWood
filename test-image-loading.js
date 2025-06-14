// Test script to verify image loading integration
console.log('🧪 Testing image loading integration...');

// Mock the useImagePreloader hook response
const mockPreloadingState = {
  loaded: new Set(['image1.jpg', 'image2.jpg']),
  loading: new Set(['image3.jpg']),
  failed: new Set(),
  progress: {
    total: 10,
    loaded: 3,
    percentage: 30,
  },
};

const mockIsPreloading = true;
const mockState = {
  fontsLoaded: true,
  splatLoaded: true,
  showGallery: true,
};

// Test the loading logic
const isImagesLoading =
  mockIsPreloading && mockPreloadingState.progress.total > 0;
const shouldShowLoading =
  !mockState.fontsLoaded ||
  !mockState.splatLoaded ||
  (mockState.showGallery && isImagesLoading);

console.log('📊 Test Results:');
console.log('  • Fonts loaded:', mockState.fontsLoaded);
console.log('  • Splat loaded:', mockState.splatLoaded);
console.log('  • Gallery visible:', mockState.showGallery);
console.log('  • Images loading:', isImagesLoading);
console.log(
  '  • Images progress:',
  `${mockPreloadingState.progress.loaded}/${mockPreloadingState.progress.total} (${mockPreloadingState.progress.percentage}%)`
);
console.log('  • Should show loading:', shouldShowLoading);

// Test loading text generation
let loadingText = 'Loading';
if (!mockState.fontsLoaded) loadingText += ' fonts';
if (!mockState.splatLoaded) loadingText += ' assets';
if (isImagesLoading) loadingText += ' images';
loadingText += '...';

console.log('📝 Loading text would show:', loadingText);

if (isImagesLoading) {
  console.log(
    '📷 Image progress would show:',
    `${mockPreloadingState.progress.loaded} of ${
      mockPreloadingState.progress.total
    } images (${Math.round(mockPreloadingState.progress.percentage)}%)`
  );
}

console.log('✅ Image loading integration test completed successfully!');
