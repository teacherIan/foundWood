// Gallery Image Preloader Hook
import { useState, useEffect, useCallback, useRef } from 'react';
import imgData from './imgData';

/**
 * Hook for preloading gallery images with priority-based loading
 * @param {string} activeGalleryType - Currently active gallery type
 * @param {boolean} showGallery - Whether gallery is currently shown
 * @param {boolean} preloadOnStartup - Whether to preload all images at startup
 * @returns {object} preloading state and controls
 */
export const useImagePreloader = (
  activeGalleryType,
  showGallery,
  preloadOnStartup = false
) => {
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

  const [isPreloading, setIsPreloading] = useState(false);
  const isPreloadingRef = useRef(false);
  const abortControllerRef = useRef(null);

  // Get images by gallery type
  const getImagesByType = useCallback((galleryType) => {
    return imgData.filter((item) => item.type === galleryType);
  }, []);

  // Create image preloader with promise support
  const preloadImage = useCallback(
    (src) => {
      return new Promise((resolve, reject) => {
        // Skip if already loaded or failed
        if (
          preloadingState.loaded.has(src) ||
          preloadingState.failed.has(src)
        ) {
          resolve(src);
          return;
        }

        // Mark as loading
        setPreloadingState((prev) => ({
          ...prev,
          loading: new Set([...prev.loading, src]),
        }));

        const img = new Image();

        img.onload = () => {
          setPreloadingState((prev) => ({
            ...prev,
            loaded: new Set([...prev.loaded, src]),
            loading: new Set([...prev.loading].filter((url) => url !== src)),
            progress: {
              ...prev.progress,
              loaded: prev.progress.loaded + 1,
              percentage: Math.round(
                ((prev.progress.loaded + 1) / prev.progress.total) * 100
              ),
            },
          }));
          resolve(src);
        };

        img.onerror = () => {
          setPreloadingState((prev) => ({
            ...prev,
            failed: new Set([...prev.failed, src]),
            loading: new Set([...prev.loading].filter((url) => url !== src)),
          }));
          reject(new Error(`Failed to load image: ${src}`));
        };

        img.src = src;
      });
    },
    [preloadingState.loaded, preloadingState.failed]
  );

  // Batch preload images with concurrency control
  const batchPreloadImages = useCallback(
    async (imageSrcs, maxConcurrent = 3) => {
      if (imageSrcs.length === 0) return;

      console.log(
        `🖼️ Preloading batch of ${imageSrcs.length} images (max ${maxConcurrent} concurrent)`
      );

      // Update total count
      setPreloadingState((prev) => ({
        ...prev,
        progress: {
          ...prev.progress,
          total: Math.max(prev.progress.total, imageSrcs.length),
        },
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
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.warn('Batch preloading error:', error);
        }
      }
    },
    [preloadImage]
  );

  // Check if a specific image is loaded
  const isImageLoaded = useCallback(
    (src) => {
      return preloadingState.loaded.has(src);
    },
    [preloadingState.loaded]
  );

  // Check if a gallery type is fully loaded
  const isGalleryTypeLoaded = useCallback(
    (galleryType) => {
      const images = getImagesByType(galleryType);
      return images.every((item) => preloadingState.loaded.has(item.img));
    },
    [getImagesByType, preloadingState.loaded]
  );

  // Preload images for a specific gallery type
  const preloadGalleryType = useCallback(
    async (galleryType) => {
      console.log(
        '🎯 preloadGalleryType called for:',
        galleryType,
        'currently preloading:',
        isPreloadingRef.current
      );

      if (isPreloadingRef.current) {
        console.log('⏸️ Already preloading, skipping...');
        return;
      }

      const images = getImagesByType(galleryType);
      const imageSrcs = images.map((item) => item.img);

      console.log(
        '📷 Found images to preload:',
        imageSrcs.length,
        'for type:',
        galleryType
      );

      isPreloadingRef.current = true;
      setIsPreloading(true);

      try {
        console.log(
          `🎯 Fast-track preloading: ${galleryType} (${imageSrcs.length} images)`
        );
        await batchPreloadImages(imageSrcs, 4); // Higher concurrency for priority loading
        console.log('✅ Completed preloading for:', galleryType);
      } catch (error) {
        console.error('❌ Error during preloading:', error);
      } finally {
        isPreloadingRef.current = false;
        setIsPreloading(false);
        console.log('🏁 Preloading finished for:', galleryType);
      }
    },
    [getImagesByType, batchPreloadImages]
  );

  // Preload all gallery types at startup
  const preloadAllGalleryTypes = useCallback(async () => {
    console.log('🚀 Starting preload of ALL gallery types at startup');

    if (isPreloadingRef.current) {
      console.log('⏸️ Already preloading, skipping startup preload...');
      return;
    }

    // Get all unique gallery types
    const allTypes = [...new Set(imgData.map((item) => item.type))];
    console.log('📚 Found gallery types to preload:', allTypes);

    isPreloadingRef.current = true;
    setIsPreloading(true);

    // Calculate total images across all types
    const allImages = imgData.map((item) => item.img);
    const uniqueImages = [...new Set(allImages)];

    console.log(
      `🎯 Startup preloading: ${uniqueImages.length} unique images across ${allTypes.length} gallery types`
    );

    // Update total count
    setPreloadingState((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        total: uniqueImages.length,
      },
    }));

    try {
      // Preload all images with moderate concurrency to avoid overwhelming
      await batchPreloadImages(uniqueImages, 3);
      console.log('✅ Completed startup preloading of all gallery types');
    } catch (error) {
      console.error('❌ Error during startup preloading:', error);
    } finally {
      isPreloadingRef.current = false;
      setIsPreloading(false);
      console.log('🏁 Startup preloading finished');
    }
  }, [batchPreloadImages]);

  // Cancel preloading
  const cancelPreloading = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      isPreloadingRef.current = false;
      setIsPreloading(false);
      console.log('🛑 Gallery preloading cancelled');
    }
  }, []);

  // Auto-preload based on startup flag or gallery interaction
  useEffect(() => {
    console.log('🎯 useImagePreloader effect triggered:', {
      preloadOnStartup,
      showGallery,
      activeGalleryType,
      isCurrentlyPreloading: isPreloadingRef.current,
    });

    if (preloadOnStartup) {
      console.log('🚀 Triggering startup preloading of all gallery types');
      preloadAllGalleryTypes();
    } else if (showGallery && activeGalleryType) {
      console.log(
        '✅ Starting gallery image preloading for:',
        activeGalleryType
      );
      preloadGalleryType(activeGalleryType);
    }
  }, [
    preloadOnStartup,
    activeGalleryType,
    showGallery,
    preloadGalleryType,
    preloadAllGalleryTypes,
  ]);

  // Background preload other gallery types (only when in gallery mode, not startup)
  useEffect(() => {
    if (preloadOnStartup || !showGallery || !activeGalleryType) return;

    const backgroundPreload = async () => {
      // Get all unique gallery types
      const allTypes = [...new Set(imgData.map((item) => item.type))];
      const otherTypes = allTypes.filter((type) => type !== activeGalleryType);

      // Preload other types in background with lower priority
      for (const type of otherTypes) {
        if (!isGalleryTypeLoaded(type)) {
          await new Promise((resolve) => setTimeout(resolve, 500)); // Delay between types
          if (showGallery) {
            // Check if still needed
            await preloadGalleryType(type);
          }
        }
      }
    };

    // Start background preloading after a delay
    const timeoutId = setTimeout(backgroundPreload, 2000);
    return () => clearTimeout(timeoutId);
  }, [
    preloadOnStartup,
    activeGalleryType,
    showGallery,
    preloadGalleryType,
    isGalleryTypeLoaded,
  ]);

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
    preloadAllGalleryTypes,
    cancelPreloading,
    isPreloading,
  };
};
