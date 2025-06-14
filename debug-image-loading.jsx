// Debug component to test image loading integration
import React, { useState, useEffect } from 'react';
import { useImagePreloader } from './components/galleries/useImagePreloader';

function DebugImageLoading() {
  const [showGallery, setShowGallery] = useState(false);
  const [activeGalleryType, setActiveGalleryType] = useState('chairs');

  const {
    preloadingState,
    isImageLoaded,
    isGalleryTypeLoaded,
    preloadGalleryType,
    cancelPreloading,
    isPreloading,
  } = useImagePreloader(activeGalleryType, showGallery);

  useEffect(() => {
    console.log('🔬 Debug - Preloader state:', {
      isPreloading,
      progressTotal: preloadingState.progress.total,
      progressLoaded: preloadingState.progress.loaded,
      progressPercentage: preloadingState.progress.percentage,
      showGallery,
      activeGalleryType,
    });
  }, [isPreloading, preloadingState, showGallery, activeGalleryType]);

  const testImageLoading = () => {
    console.log('🧪 Testing image loading...');
    setShowGallery(true);
  };

  const isImagesLoading = isPreloading && preloadingState.progress.total > 0;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🧪 Image Loading Debug</h2>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={testImageLoading}>Test Image Loading</button>
        <button onClick={() => setShowGallery(false)}>Stop Gallery</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Gallery Type: </label>
        <select
          value={activeGalleryType}
          onChange={(e) => setActiveGalleryType(e.target.value)}
        >
          <option value="chairs">Chairs</option>
          <option value="smallTable">Small Tables</option>
          <option value="largeTable">Large Tables</option>
          <option value="structure">Structures</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div
        style={{
          backgroundColor: '#f0f0f0',
          padding: '15px',
          borderRadius: '5px',
        }}
      >
        <h3>Current State:</h3>
        <p>Show Gallery: {showGallery ? '✅' : '❌'}</p>
        <p>Active Type: {activeGalleryType}</p>
        <p>Is Preloading: {isPreloading ? '✅' : '❌'}</p>
        <p>Images Loading: {isImagesLoading ? '✅' : '❌'}</p>
        <p>
          Progress: {preloadingState.progress.loaded}/
          {preloadingState.progress.total} (
          {preloadingState.progress.percentage}%)
        </p>
      </div>

      {isImagesLoading && (
        <div
          style={{
            backgroundColor: '#e6f3ff',
            padding: '15px',
            borderRadius: '5px',
            marginTop: '15px',
            border: '2px solid #007acc',
          }}
        >
          <h3>🖼️ Loading Images...</h3>
          <p>
            {preloadingState.progress.loaded} of{' '}
            {preloadingState.progress.total} images (
            {Math.round(preloadingState.progress.percentage)}%)
          </p>
          <div
            style={{
              width: '100%',
              height: '20px',
              backgroundColor: '#ddd',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${preloadingState.progress.percentage}%`,
                height: '100%',
                backgroundColor: '#007acc',
                transition: 'width 0.3s ease',
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DebugImageLoading;
