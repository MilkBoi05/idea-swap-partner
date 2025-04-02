
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from "@clerk/clerk-react";
import App from './App.tsx';
import './index.css';

// Use the provided Clerk Publishable Key
const PUBLISHABLE_KEY = "pk_test_ZGl2ZXJzZS1sZW1taW5nLTI5LmNsZXJrLmFjY291bnRzLmRldiQ";

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
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
