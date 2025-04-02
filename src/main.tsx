
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

// Check if Clerk publishable key is available
if (!CLERK_PUBLISHABLE_KEY) {
  console.error('Missing Clerk publishable key. Authentication features will be disabled.');
  
  // Render the app without ClerkProvider when no key is available
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <div className="p-4 max-w-md mx-auto my-8 bg-yellow-50 border border-yellow-100 rounded-md">
        <p className="text-yellow-700 font-medium">Authentication Disabled</p>
        <p className="text-yellow-600 text-sm mt-1">
          Clerk publishable key not found. Set the VITE_CLERK_PUBLISHABLE_KEY environment variable to enable authentication.
        </p>
      </div>
      <App />
    </React.StrictMode>,
  );
} else {
  // Render the app with ClerkProvider when key is available
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
}
