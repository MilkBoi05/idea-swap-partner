import { useUser } from "@clerk/clerk-react";
import { uploadProfileImage } from "./storageService";

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

  const updateUserProfile = async (profile: Partial<UserProfile>, profilePicture?: File | null) => {
    if (!user) return null;
    
    const currentProfile = getUserProfile();
    let updatedProfile = {
      ...currentProfile,
      ...profile,
    };
    
    // If a new profile picture was provided, upload it to Supabase storage
    if (profilePicture) {
      try {
        const profileImageUrl = await uploadProfileImage(user.id, profilePicture);
        if (profileImageUrl) {
          updatedProfile.profileImage = profileImageUrl;
        } else {
          console.warn("Profile image upload failed, using existing image");
        }
      } catch (error) {
        console.error("Failed to upload profile image:", error);
        // Continue with the update but keep the existing profile image
      }
    }
    
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
