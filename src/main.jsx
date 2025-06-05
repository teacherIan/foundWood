import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import NewApp from './NewApp';
import { Analytics } from '@vercel/analytics/react';

document.addEventListener(
  'touchmove',
  function (event) {
    event.preventDefault();
  },
  false
);

window.addEventListener('resize', () => {
  // location.reload();
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NewApp />
    <Analytics />
  </React.StrictMode>
);
