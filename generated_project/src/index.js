import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('display') || document.getElementById('root') || document.body.appendChild(document.createElement('div')));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
