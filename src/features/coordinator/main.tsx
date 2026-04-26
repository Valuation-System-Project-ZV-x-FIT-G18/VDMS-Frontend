import { StrictMode } from 'react';        // enables extra dev-time checks
import { createRoot } from 'react-dom/client'; // React 19 root API
import App from './App';                       // root component
import './index.css';                          // global styles applied first

// Mount the React app into the #root div in index.html
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
