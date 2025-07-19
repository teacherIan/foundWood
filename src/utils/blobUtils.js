/**
 * Vercel Blob utilities for Found Wood splat files
 * Provides utilities for working with Vercel Blob stored assets
 */

// Vercel Blob URLs for your splat files (update these after running upload script)
export const BLOB_SPLAT_URLS = {
  primary: '/assets/experience/fixed_model.splat', // Will be replaced with Blob URL
};

/**
 * Get the appropriate splat URL based on device capabilities
 * @param {Object} options - Configuration options
 * @param {boolean} options.preferHighQuality - Whether to prefer higher quality models
 * @param {number} options.memoryLimit - Device memory limit in GB
 * @returns {string} The appropriate splat URL
 */
export function getSplatUrl(options = {}) {
  // Since we only have one splat file now, always return the primary
  return BLOB_SPLAT_URLS.primary;
}

/**
 * Preload a splat file from Vercel Blob
 * @param {string} url - The blob URL to preload
 * @returns {Promise<boolean>} Promise that resolves when preloading is complete
 */
export async function preloadSplatBlob(url) {
  try {
    console.log(`🔄 Preloading splat from Vercel Blob: ${url}`);

    const response = await fetch(url, {
      method: 'HEAD', // Just check if the file exists
      cache: 'default',
    });

    if (response.ok) {
      console.log('✅ Splat file available on Vercel Blob');
      return true;
    } else {
      console.warn('⚠️ Splat file not found on Vercel Blob:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to preload splat from Vercel Blob:', error);
    return false;
  }
}

/**
 * Get device memory information (if available)
 * @returns {number} Estimated device memory in GB
 */
export function getDeviceMemory() {
  // Use Navigator.deviceMemory if available (Chrome/Edge)
  if ('deviceMemory' in navigator) {
    return navigator.deviceMemory;
  }

  // Fallback estimation based on other factors
  const userAgent = navigator.userAgent;

  // Mobile devices typically have less memory
  if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) {
    return 4; // Assume 4GB for mobile devices
  }

  // Desktop fallback
  return 8; // Assume 8GB for desktop devices
}

/**
 * Hook to get the optimal splat URL for the current device
 * @param {Object} options - Configuration options
 * @returns {string} The optimal splat URL
 */
export function useOptimalSplatUrl(options = {}) {
  const deviceMemory = getDeviceMemory();

  return getSplatUrl({
    ...options,
    memoryLimit: deviceMemory,
  });
}
