
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadProfileImage } from "./storageService";
import { toast } from "sonner";

// Types for user profile
export type UserProfile = {
  id: string;
  name: string;
  bio?: string;
  title?: string;
  skills?: string[];
  location?: string;
  email: string;
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  profileImage?: string;
};

export const useUserProfile = () => {
  const [loading, setLoading] = useState(false);

  const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    if (!userId) return null;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
      
      // Get user email from auth.users via Supabase function or API
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error fetching user data:", userError);
      }
      
      // If profile exists, return it with added fields
      if (data) {
        return {
          id: data.id,
          name: data.name || "",
          bio: data.bio || "",
          title: data.title || "",
          skills: data.skills || [],
          location: data.location || "",
          email: userData?.user?.email || "",
          website: data.website || "",
          github: data.github || "",
          twitter: data.twitter || "",
          linkedin: data.linkedin || "",
          profileImage: data.avatar || "",
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userId: string, profile: Partial<UserProfile>, profilePicture?: File | null): Promise<UserProfile | null> => {
    if (!userId) return null;
    
    try {
      setLoading(true);
      
      // If a new profile picture was provided, upload it to Supabase storage
      let avatarUrl = profile.profileImage;
      if (profilePicture) {
        try {
          const uploadedUrl = await uploadProfileImage(userId, profilePicture);
          if (uploadedUrl) {
            avatarUrl = uploadedUrl;
          } else {
            console.warn("Profile image upload failed, using existing image");
          }
        } catch (error) {
          console.error("Failed to upload profile image:", error);
        }
      }
      
      // Create update object with only supported fields
      // First, get the current profile to check which fields are present
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Create an update data object with just the fields we know exist
      const updateData: Record<string, any> = {
        name: profile.name,
        avatar: avatarUrl,
        updated_at: new Date().toISOString()
      };

      // Only include fields that exist in the current schema and are provided in the profile update
      if (profileData) {
        if ('bio' in profileData && profile.bio !== undefined) updateData['bio'] = profile.bio;
        if ('title' in profileData && profile.title !== undefined) updateData['title'] = profile.title;
        if ('skills' in profileData && profile.skills !== undefined) updateData['skills'] = profile.skills;
        if ('location' in profileData && profile.location !== undefined) updateData['location'] = profile.location;
        if ('website' in profileData && profile.website !== undefined) updateData['website'] = profile.website;
        if ('github' in profileData && profile.github !== undefined) updateData['github'] = profile.github;
        if ('twitter' in profileData && profile.twitter !== undefined) updateData['twitter'] = profile.twitter;
        if ('linkedin' in profileData && profile.linkedin !== undefined) updateData['linkedin'] = profile.linkedin;
      }
      
      // Update profile in Supabase
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();
        
      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
        return null;
      }
      
      toast.success("Profile updated successfully");
      
      // Return updated profile
      return await getUserProfile(userId);
    } catch (error) {
      console.error("Error in updateUserProfile:", error);
      toast.error("An error occurred while updating your profile");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getOnboardingStatus = async (userId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error || !data) {
        console.error("Error checking onboarding status:", error);
        return false;
      }
      
      // Check if onboarding_complete exists in the data
      if ('onboarding_complete' in data) {
        return data.onboarding_complete === true;
      }
      
      // If the field doesn't exist, default to false
      return false;
    } catch (error) {
      console.error("Error in getOnboardingStatus:", error);
      return false;
    }
  };

  const completeOnboarding = async (userId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      // First check if onboarding_complete column exists in the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("Error checking profile:", profileError);
        return false;
      }
      
      // Only update if the column exists
      if (profileData && 'onboarding_complete' in profileData) {
        const { error } = await supabase
          .from('profiles')
          .update({ onboarding_complete: true })
          .eq('id', userId);
          
        if (error) {
          console.error("Error completing onboarding:", error);
          return false;
        }
      } else {
        console.warn("onboarding_complete column does not exist in profiles table");
      }
      
      return true;
    } catch (error) {
      console.error("Error in completeOnboarding:", error);
      return false;
    }
  };

  return {
    getUserProfile,
    updateUserProfile,
    getOnboardingStatus,
    completeOnboarding,
    loading
  };
};
