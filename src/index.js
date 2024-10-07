import React from 'react';
import ReactDOM from 'react-dom/client'; // 새로운 import
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement); // createRoot 사용
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
