
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userProfileImage: string | null;
  handleSignOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if Clerk is initialized
const isClerkInitialized = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Only use Clerk hooks if Clerk is initialized
  const clerkAuth = isClerkInitialized ? useClerkAuth() : { isSignedIn: false, isLoaded: true, signOut: async () => {} };
  const clerkUser = isClerkInitialized ? useUser() : { user: null };
  
  const { isSignedIn, isLoaded, signOut } = clerkAuth;
  const { user } = clerkUser;

  useEffect(() => {
    if (isLoaded || !isClerkInitialized) {
      setIsLoading(false);
    }
  }, [isLoaded]);

  const handleSignOut = async () => {
    if (isClerkInitialized) {
      await signOut();
    }
    navigate("/");
  };

  const value = {
    isAuthenticated: !!isSignedIn && isClerkInitialized,
    isLoading,
    userId: user?.id || null,
    userName: user?.fullName || user?.username || null,
    userEmail: user?.primaryEmailAddress?.emailAddress || null,
    userProfileImage: user?.imageUrl || null,
    handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
