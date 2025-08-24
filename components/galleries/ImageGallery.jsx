import React, { useState, useEffect, useMemo } from 'react';
import ImageGallery from 'react-image-gallery';
import imgData from './imgData';
import './imageGallery.css';
import 'react-image-gallery/styles/css/image-gallery.css';

const ImageGalleryComponent = ({
  galleryType,
  showGallery,
  showGalleryString,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter images based on gallery type
  const filteredImages = useMemo(() => {
    if (!galleryType || galleryType === 'all') {
      return imgData;
    }
    
    // galleryType is now the string value like 'chairs', 'smallTable', etc.
    // No need for mapping since we're receiving the correct string directly
    return imgData.filter(item => item.type === galleryType);
  }, [galleryType]);

  // Transform image data for react-image-gallery format
  const galleryImages = useMemo(() => {
    return filteredImages.map((item, index) => ({
      original: item.img,
      thumbnail: item.img,
      description: (
        <div className="image-description">
          <h3 className="image-title">{item.name}</h3>
          <p className="image-details">{item.description}</p>
          <div className="image-metadata">
            <span className="order-number">Order #{item.orderNumber}</span>
            {item.price && <span className="price">{item.price}</span>}
          </div>
        </div>
      ),
      alt: item.name,
      originalAlt: item.name,
      thumbnailAlt: item.name,
    }));
  }, [filteredImages]);

  // Handle slide change
  const handleSlideChange = (currentIndex) => {
    setCurrentIndex(currentIndex);
  };

  // Handle image click for fullscreen
  const handleImageClick = (event) => {
    // You can add custom fullscreen logic here if needed
    console.log('Image clicked:', currentIndex);
  };

  // Custom render function for thumbnails
  const renderThumbInner = (item) => {
    return (
      <div className="image-gallery-thumbnail-inner">
        <img 
          src={item.thumbnail} 
          alt={item.thumbnailAlt}
          loading="lazy"
        />
      </div>
    );
  };

  // Custom render function for left nav button
  const renderLeftNav = (onClick, disabled) => {
    return (
      <button
        className="image-gallery-icon image-gallery-left-nav"
        disabled={disabled}
        onClick={onClick}
        aria-label="Previous Image"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
    );
  };

  // Custom render function for right nav button
  const renderRightNav = (onClick, disabled) => {
    return (
      <button
        className="image-gallery-icon image-gallery-right-nav"
        disabled={disabled}
        onClick={onClick}
        aria-label="Next Image"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>
    );
  };

  // Custom render function for play/pause button
  const renderPlayPauseButton = (onClick, isPlaying) => {
    return (
      <button
        type="button"
        className="image-gallery-icon image-gallery-play-button"
        onClick={onClick}
        aria-label={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
      >
        {isPlaying ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>
    );
  };

  // Custom render function for fullscreen button
  const renderFullscreenButton = (onClick, isFullscreen) => {
    return (
      <button
        type="button"
        className="image-gallery-icon image-gallery-fullscreen-button"
        onClick={onClick}
        aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {isFullscreen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
          </svg>
        )}
      </button>
    );
  };

  if (!showGallery || galleryImages.length === 0) {
    return null;
  }

  return (
    <div className="image-gallery-wrapper">
      <div className="image-gallery-header">
        <h2 className="gallery-title">
          {showGalleryString || 'Gallery'}
          <span className="image-count">
            ({galleryImages.length} item{galleryImages.length !== 1 ? 's' : ''})
          </span>
        </h2>
        <button 
          className="gallery-close-button"
          onClick={onClose}
          aria-label="Close Gallery"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <div className="image-gallery-container">
        <ImageGallery
          items={galleryImages}
          startIndex={currentIndex}
          onSlide={handleSlideChange}
          onClick={handleImageClick}
          showThumbnails={true}
          showFullscreenButton={true}
          showPlayButton={true}
          showBullets={false}
          showIndex={true}
          thumbnailPosition="bottom"
          slideDuration={450}
          slideInterval={3000}
          slideOnThumbnailOver={false}
          renderThumbInner={renderThumbInner}
          renderLeftNav={renderLeftNav}
          renderRightNav={renderRightNav}
          renderPlayPauseButton={renderPlayPauseButton}
          renderFullscreenButton={renderFullscreenButton}
          lazyLoad={true}
          infinite={true}
          showNav={true}
          additionalClass="custom-image-gallery"
        />
      </div>
    </div>
  );
};

export default ImageGalleryComponent;
