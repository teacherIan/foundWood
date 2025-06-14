// Gallery Image Preloader Hook
import { useState, useEffect, useCallback, useRef } from 'react';
import imgData from './imgData';

/**
 * Hook for preloading gallery images with priority-based loading
 * @param {string} activeGalleryType - Currently active gallery type
 * @param {boolean} showGallery - Whether gallery is currently shown
 * @returns {object} preloading state and controls
 */
export const useImagePreloader = (activeGalleryType, showGallery) => {
  const [preloadingState, setPreloadingState] = useState({
    loaded: new Set(),
    loading: new Set(),
    failed: new Set(),
    progress: {
      total: 0,
      loaded: 0,
      percentage: 0,
    },
  });

  const isPreloadingRef = useRef(false);
  const abortControllerRef = useRef(null);

  // Get images by gallery type
  const getImagesByType = useCallback((galleryType) => {
    return imgData.filter((item) => item.type === galleryType);
  }, []);

  // Create image preloader with promise support
  const preloadImage = useCallback((src) => {
    return new Promise((resolve, reject) => {
      // Skip if already loaded or failed
      if (preloadingState.loaded.has(src) || preloadingState.failed.has(src)) {
        resolve(src);
        return;
      }

      // Mark as loading
      setPreloadingState(prev => ({
        ...prev,
        loading: new Set([...prev.loading, src])
      }));

      const img = new Image();
      
      img.onload = () => {
        setPreloadingState(prev => ({
          ...prev,
          loaded: new Set([...prev.loaded, src]),
          loading: new Set([...prev.loading].filter(url => url !== src)),
          progress: {
            ...prev.progress,
            loaded: prev.progress.loaded + 1,
            percentage: Math.round(((prev.progress.loaded + 1) / prev.progress.total) * 100)
          }
        }));
        resolve(src);
      };

      img.onerror = () => {
        setPreloadingState(prev => ({
          ...prev,
          failed: new Set([...prev.failed, src]),
          loading: new Set([...prev.loading].filter(url => url !== src))
        }));
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });
  }, [preloadingState.loaded, preloadingState.failed]);

  // Batch preload images with concurrency control
  const batchPreloadImages = useCallback(async (imageSrcs, maxConcurrent = 3) => {
    if (imageSrcs.length === 0) return;

    console.log(`🖼️ Preloading batch of ${imageSrcs.length} images (max ${maxConcurrent} concurrent)`);

    // Update total count
    setPreloadingState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        total: Math.max(prev.progress.total, imageSrcs.length)
      }
    }));

    // Process images in batches to avoid overwhelming the browser
    for (let i = 0; i < imageSrcs.length; i += maxConcurrent) {
      const batch = imageSrcs.slice(i, i + maxConcurrent);
      
      // Check if we should abort
      if (abortControllerRef.current?.signal.aborted) {
        console.log('🛑 Preloading aborted');
        break;
      }

      try {
        await Promise.allSettled(batch.map(preloadImage));
        
        // Small delay between batches to prevent blocking
        if (i + maxConcurrent < imageSrcs.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.warn('Batch preloading error:', error);
      }
    }
  }, [preloadImage]);

  // Check if a specific image is loaded
  const isImageLoaded = useCallback((src) => {
    return preloadingState.loaded.has(src);
  }, [preloadingState.loaded]);

  // Check if a gallery type is fully loaded
  const isGalleryTypeLoaded = useCallback((galleryType) => {
    const images = getImagesByType(galleryType);
    return images.every(item => preloadingState.loaded.has(item.img));
  }, [getImagesByType, preloadingState.loaded]);

  // Preload images for a specific gallery type
  const preloadGalleryType = useCallback(async (galleryType) => {
    if (isPreloadingRef.current) return;
    
    const images = getImagesByType(galleryType);
    const imageSrcs = images.map(item => item.img);
    
    isPreloadingRef.current = true;
    
    try {
      console.log(`🎯 Fast-track preloading: ${galleryType} (${imageSrcs.length} images)`);
      await batchPreloadImages(imageSrcs, 4); // Higher concurrency for priority loading
    } finally {
      isPreloadingRef.current = false;
    }
  }, [getImagesByType, batchPreloadImages]);

  // Cancel preloading
  const cancelPreloading = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      isPreloadingRef.current = false;
      console.log('🛑 Gallery preloading cancelled');
    }
  }, []);

  // Auto-preload current gallery type when it changes
  useEffect(() => {
    if (showGallery && activeGalleryType) {
      preloadGalleryType(activeGalleryType);
    }
  }, [activeGalleryType, showGallery, preloadGalleryType]);

  // Background preload other gallery types
  useEffect(() => {
    if (!showGallery || !activeGalleryType) return;

    const backgroundPreload = async () => {
      // Get all unique gallery types
      const allTypes = [...new Set(imgData.map(item => item.type))];
      const otherTypes = allTypes.filter(type => type !== activeGalleryType);

      // Preload other types in background with lower priority
      for (const type of otherTypes) {
        if (!isGalleryTypeLoaded(type)) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Delay between types
          if (showGallery) { // Check if still needed
            await preloadGalleryType(type);
          }
        }
      }
    };

    // Start background preloading after a delay
    const timeoutId = setTimeout(backgroundPreload, 2000);
    return () => clearTimeout(timeoutId);
  }, [activeGalleryType, showGallery, preloadGalleryType, isGalleryTypeLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelPreloading();
    };
  }, [cancelPreloading]);

  return {
    preloadingState,
    isImageLoaded,
    isGalleryTypeLoaded,
    preloadGalleryType,
    cancelPreloading,
    isPreloading: isPreloadingRef.current,
  };
};
