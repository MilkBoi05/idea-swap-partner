
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Check if Clerk is initialized
  const isClerkInitialized = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // If Clerk is not initialized, show a message
  if (!isClerkInitialized) {
    return (
      <div className="flex flex-col h-screen items-center justify-center p-4">
        <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-lg max-w-md w-full text-center">
          <h2 className="font-semibold text-yellow-800 text-lg mb-2">Authentication Required</h2>
          <p className="text-yellow-700 mb-4">
            This page requires authentication, but the authentication service is not properly configured.
          </p>
          <p className="text-sm text-yellow-600">
            Please set the VITE_CLERK_PUBLISHABLE_KEY environment variable to enable authentication.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to sign-in page but remember where they were going
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
