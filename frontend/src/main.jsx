import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/theme.css';

try {
  for (const key of ['token', 'user', 'lb_token', 'lb_user']) {
    const val = localStorage.getItem(key);
    if (val === 'undefined' || val === 'null') {
      localStorage.removeItem(key);
    }
  }
} catch {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
