import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Analytics } from '@vercel/analytics/react';

// Enhanced loading screen centering fallback
const ensureLoadingScreenCentering = () => {
  const loadingScreen = document.querySelector('.font-loading-screen');
  if (loadingScreen) {
    // Force perfect centering with JavaScript as ultimate fallback
    const centerElement = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Ensure the loading screen covers the full viewport
      loadingScreen.style.height = `${viewportHeight}px`;
      loadingScreen.style.width = `${viewportWidth}px`;

      // Additional centering check
      const spinner = loadingScreen.querySelector('.loading-spinner');
      const text = loadingScreen.querySelector('div:last-child');

      if (spinner && text) {
        // Ensure elements are properly centered
        loadingScreen.style.display = 'flex';
        loadingScreen.style.flexDirection = 'column';
        loadingScreen.style.justifyContent = 'center';
        loadingScreen.style.alignItems = 'center';
        loadingScreen.style.gap = '20px';
      }
    };

    // Run immediately and on resize
    centerElement();
    window.addEventListener('resize', centerElement);

    // Cleanup after a reasonable timeout
    setTimeout(() => {
      window.removeEventListener('resize', centerElement);
    }, 10000);
  }
};

// Touch event handling
document.addEventListener(
  'touchmove',
  function (event) {
    event.preventDefault();
  },
  false
);

// Loading screen centering check
document.addEventListener('DOMContentLoaded', ensureLoadingScreenCentering);

window.addEventListener('resize', () => {
  // location.reload();
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
