
import { supabase } from '@/integrations/supabase/client';

// Storage bucket names
const BUCKETS = {
  PROFILES: 'profiles',
  IDEAS: 'ideas',
  ATTACHMENTS: 'attachments',
};

// Initialize storage buckets - this should be called once when the app starts
export const initializeStorage = async () => {
  if (!supabase) {
    console.error('Supabase client not initialized. Storage operations will not work.');
    return;
  }
  
  try {
    // Create profile images bucket
    const { error: profileError } = await supabase.storage.createBucket(
      BUCKETS.PROFILES,
      { public: true }
    );
    if (profileError && profileError.message !== 'Bucket already exists') {
      console.error('Error creating profiles bucket:', profileError);
    }

    // Create ideas images bucket
    const { error: ideasError } = await supabase.storage.createBucket(
      BUCKETS.IDEAS,
      { public: true }
    );
    if (ideasError && ideasError.message !== 'Bucket already exists') {
      console.error('Error creating ideas bucket:', ideasError);
    }

    // Create attachments bucket
    const { error: attachmentsError } = await supabase.storage.createBucket(
      BUCKETS.ATTACHMENTS,
      { public: false } // Private by default
    );
    if (attachmentsError && attachmentsError.message !== 'Bucket already exists') {
      console.error('Error creating attachments bucket:', attachmentsError);
    }

    console.log('Storage buckets initialized successfully');
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
  }
};

// Function to upload a profile image
export const uploadProfileImage = async (userId: string, file: File) => {
  if (!supabase) {
    console.error('Supabase client not initialized. Cannot upload profile image.');
    return null;
  }
  
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/profile.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(BUCKETS.PROFILES)
      .upload(filePath, file, {
        upsert: true,
      });
      
    if (error) {
      throw error;
    }
    
    // Get the public URL for the uploaded file
    const { data: publicURL } = supabase.storage
      .from(BUCKETS.PROFILES)
      .getPublicUrl(filePath);
      
    return publicURL.publicUrl;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return null; // Return null instead of throwing the error
  }
};

// Function to upload an idea image
export const uploadIdeaImage = async (ideaId: string, file: File) => {
  if (!supabase) {
    console.error('Supabase client not initialized. Cannot upload idea image.');
    return null;
  }
  
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${ideaId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(BUCKETS.IDEAS)
      .upload(filePath, file, {
        upsert: true,
      });
      
    if (error) {
      throw error;
    }
    
    // Get the public URL for the uploaded file
    const { data: publicURL } = supabase.storage
      .from(BUCKETS.IDEAS)
      .getPublicUrl(filePath);
      
    return publicURL.publicUrl;
  } catch (error) {
    console.error('Error uploading idea image:', error);
    return null; // Return null instead of throwing the error
  }
};

// Function to upload an attachment for a task or comment
export const uploadAttachment = async (userId: string, file: File, type: 'task' | 'comment', itemId: string) => {
  if (!supabase) {
    console.error('Supabase client not initialized. Cannot upload attachment.');
    return null;
  }
  
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = file.name.split('.')[0];
    const filePath = `${userId}/${type}/${itemId}/${fileName}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(BUCKETS.ATTACHMENTS)
      .upload(filePath, file);
      
    if (error) {
      throw error;
    }
    
    // For private files, we need to generate a signed URL with an expiration
    const { data: signedData, error: signedError } = await supabase.storage
      .from(BUCKETS.ATTACHMENTS)
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiration
      
    if (signedError) {
      throw signedError;
    }
    
    return {
      url: signedData.signedUrl,
      path: filePath,
      name: file.name,
      type: file.type,
      size: file.size,
    };
  } catch (error) {
    console.error('Error uploading attachment:', error);
    return null; // Return null instead of throwing the error
  }
};

// Function to get a file by path
export const getFileUrl = async (bucket: string, filePath: string) => {
  if (!supabase) {
    console.error('Supabase client not initialized. Cannot get file URL.');
    return null;
  }
  
  try {
    if (bucket === BUCKETS.PROFILES || bucket === BUCKETS.IDEAS) {
      // Public buckets - return public URL
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return data.publicUrl;
    } else {
      // Private buckets - return signed URL
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiration
        
      if (error) {
        throw error;
      }
      
      return data.signedUrl;
    }
  } catch (error) {
    console.error('Error getting file URL:', error);
    return null; // Return null instead of throwing the error
  }
};

// Function to delete a file
export const deleteFile = async (bucket: string, filePath: string) => {
  if (!supabase) {
    console.error('Supabase client not initialized. Cannot delete file.');
    return false;
  }
  
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false; // Return false instead of throwing the error
  }
};
