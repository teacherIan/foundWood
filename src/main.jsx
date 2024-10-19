import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import NewApp from './NewApp';

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
  </React.StrictMode>
);
