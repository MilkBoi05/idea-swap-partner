
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { supabase } from './integrations/supabase/client';

// Check if Supabase is properly initialized
if (supabase) {
  console.log('Supabase client initialized successfully');
} else {
  console.warn('Supabase client not initialized. App functionality will be limited.');
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
