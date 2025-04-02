
import { useUser } from "@clerk/clerk-react";

// Types for user profile
export type UserProfile = {
  id: string;
  name: string;
  bio: string;
  title: string;
  skills: string[];
  location: string;
  email: string;
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  profileImage?: string;
};

export const useUserProfile = () => {
  const { user } = useUser();

  const getUserProfile = (): UserProfile | null => {
    if (!user) return null;

    // In a real app, you would fetch this from a database
    // For now, we'll construct from Clerk user data + local storage
    const storedProfile = localStorage.getItem(`user_profile_${user.id}`);
    
    if (storedProfile) {
      return JSON.parse(storedProfile);
    }
    
    // Default profile from Clerk data
    return {
      id: user.id,
      name: user.fullName || user.username || "",
      bio: "",
      title: "",
      skills: [],
      location: "",
      email: user.primaryEmailAddress?.emailAddress || "",
      website: "",
      github: "",
      twitter: "",
      linkedin: "",
      profileImage: user.imageUrl || "",
    };
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (!user) return null;
    
    const currentProfile = getUserProfile();
    const updatedProfile = {
      ...currentProfile,
      ...profile,
    };
    
    // In a real app, this would be an API call
    localStorage.setItem(`user_profile_${user.id}`, JSON.stringify(updatedProfile));
    
    return updatedProfile;
  };

  const getOnboardingStatus = (): boolean => {
    if (!user) return false;
    return localStorage.getItem(`onboarding_complete_${user.id}`) === "true";
  };

  const completeOnboarding = () => {
    if (!user) return;
    localStorage.setItem(`onboarding_complete_${user.id}`, "true");
  };

  return {
    getUserProfile,
    updateUserProfile,
    getOnboardingStatus,
    completeOnboarding,
  };
};
