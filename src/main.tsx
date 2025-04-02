
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';
import { initializeStorage, supabase } from './services/storageService';

// Get the Clerk publishable key
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if Supabase is properly initialized
if (supabase) {
  // Only initialize storage if Supabase client is available
  initializeStorage().catch(console.error);
} else {
  console.warn('Supabase client not initialized. Storage features will be limited.');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up">
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);
