import React, { useState } from 'react';
import ImageGallery from './ImageGallery';

/**
 * Example usage of the new ImageGallery component
 * This demonstrates how to integrate it into your existing app
 */
const ImageGalleryDemo = () => {
  const [showGallery, setShowGallery] = useState(false);
  const [galleryType, setGalleryType] = useState(0); // 0=chairs, 1=smallTable, 2=largeTable, 3=structure, 4=other

  const galleryTypeNames = {
    0: 'Chairs',
    1: 'Small Tables', 
    2: 'Large Tables',
    3: 'Structures',
    4: 'Other'
  };

  const handleOpenGallery = (type) => {
    setGalleryType(type);
    setShowGallery(true);
  };

  const handleCloseGallery = () => {
    setShowGallery(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Image Gallery Demo</h1>
      <p>Click on any button below to open the gallery for that category:</p>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {Object.entries(galleryTypeNames).map(([type, name]) => (
          <button
            key={type}
            onClick={() => handleOpenGallery(parseInt(type))}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            View {name}
          </button>
        ))}
        <button
          onClick={() => handleOpenGallery('all')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          View All Items
        </button>
      </div>

      {/* The new ImageGallery component */}
      {showGallery && (
        <ImageGallery
          galleryType={galleryType}
          showGallery={showGallery}
          showGalleryString={galleryType === 'all' ? 'All Items' : galleryTypeNames[galleryType]}
          onClose={handleCloseGallery}
        />
      )}
    </div>
  );
};

export default ImageGalleryDemo;
