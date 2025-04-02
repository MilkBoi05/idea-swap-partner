
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from "@clerk/clerk-react";
import App from './App.tsx';
import './index.css';

// Get the Publishable Key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// If no key is present, use a development placeholder and warn the developer
if (!PUBLISHABLE_KEY) {
  console.warn(
    "⚠️ No Clerk Publishable Key found!\n" +
    "Set the VITE_CLERK_PUBLISHABLE_KEY environment variable.\n" +
    "You can get your key from https://dashboard.clerk.com/\n" +
    "Using development mode with limited functionality."
  );
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY || "pk_test_placeholder_key"}
    clerkJSVersion="5.56.0-snapshot.v20250312225817"
    signInUrl="/sign-in"
    signUpUrl="/sign-up"
    signInFallbackRedirectUrl="/dashboard"
    signUpFallbackRedirectUrl="/onboarding"
    afterSignOutUrl="/"
  >
    <App />
  </ClerkProvider>
);
