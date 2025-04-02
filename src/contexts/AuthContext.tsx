
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, isLoaded, signOut } = useClerkAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
    }
  }, [isLoaded]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const value = {
    isAuthenticated: !!isSignedIn,
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
