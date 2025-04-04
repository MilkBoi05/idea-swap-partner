
import { supabase } from "@/integrations/supabase/client";
import { Comment, Idea } from "@/types/idea";
import { toast } from "sonner";

// Fetch all ideas from the database
export const fetchIdeasFromApi = async (userId?: string | null) => {
  try {
    // Fetch all ideas
    const { data: ideasData, error: ideasError } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (ideasError) throw ideasError;
    
    // Fetch user's saved ideas if user is logged in
    let savedIdeaIds = new Set<string>();
    if (userId) {
      const { data: savedIdeasData, error: savedIdeasError } = await supabase
        .from('saved_ideas')
        .select('idea_id')
        .eq('user_id', userId);
      
      if (savedIdeasError) throw savedIdeasError;
      savedIdeaIds = new Set(savedIdeasData ? savedIdeasData.map(item => item.idea_id) : []);
    }
    
    // Fetch all profiles for authors
    console.log("Fetching profiles for authors");
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) throw profilesError;
    console.log("Profiles data:", profilesData);
    
    // Create a map of profiles by ID for quick lookup
    const profilesMap = new Map();
    if (profilesData) {
      profilesData.forEach(profile => {
        profilesMap.set(profile.id, profile);
        console.log(`Profile ${profile.id}:`, profile);
      });
    }
    
    // Fetch collaborators for all ideas
    const { data: collaboratorsData, error: collaboratorsError } = await supabase
      .from('collaborators')
      .select('*');
    
    if (collaboratorsError) throw collaboratorsError;
    
    // Create a map of collaborators by idea ID
    const collaboratorsMap = new Map();
    if (collaboratorsData) {
      for (const collab of collaboratorsData) {
        const ideaId = collab.idea_id;
        if (!collaboratorsMap.has(ideaId)) {
          collaboratorsMap.set(ideaId, []);
        }
        
        // Get profile for this collaborator
        const profile = profilesMap.get(collab.user_id);
        
        if (profile) {
          collaboratorsMap.get(ideaId).push({
            id: collab.id,
            name: profile.name || 'Unknown User',
            avatar: profile.avatar || '/placeholder.svg',
            role: collab.role
          });
        }
      }
    }
    
    // Fetch comments for all ideas at once for efficiency
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (commentsError) throw commentsError;
    
    console.log("All comments data:", commentsData);
    
    // Create a map of comments by idea ID
    const commentsMap = new Map();
    if (commentsData) {
      for (const comment of commentsData) {
        const ideaId = comment.idea_id;
        if (!commentsMap.has(ideaId)) {
          commentsMap.set(ideaId, []);
        }
        
        // Get profile for this comment author
        const author = profilesMap.get(comment.author_id);
        
        commentsMap.get(ideaId).push({
          id: comment.id,
          text: comment.text,
          createdAt: comment.created_at,
          ideaId: comment.idea_id,
          author: {
            id: comment.author_id,
            name: author ? author.name : 'Unknown User',
            avatar: author ? author.avatar : '/placeholder.svg'
          }
        });
      }
    }
    
    // Transform ideas data with extra logging for avatar URLs
    const transformedIdeas = ideasData ? ideasData.map(idea => {
      const author = profilesMap.get(idea.author_id);
      console.log(`Author for idea ${idea.id}:`, author);
      
      // Ensure comments array is populated for this idea
      const ideaComments = commentsMap.get(idea.id) || [];
      console.log(`Idea ${idea.id} has ${ideaComments.length} comments`);
      
      return {
        id: idea.id,
        title: idea.title,
        description: idea.description,
        author: {
          id: author?.id || idea.author_id,
          name: author?.name || 'Unknown User',
          avatar: author?.avatar || '/placeholder.svg'
        },
        skills: idea.skills || [],
        collaborators: collaboratorsMap?.get(idea.id) || [],
        comments: ideaComments,
        likes: idea.likes || 0,
        createdAt: idea.created_at,
        coverImage: idea.cover_image,
        isSaved: userId ? savedIdeaIds?.has(idea.id) : false,
        isOwner: idea.author_id === userId
      };
    }) : [];
    
    return transformedIdeas;
  } catch (error) {
    console.error("Error fetching ideas:", error);
    throw error;
  }
};

// Save an idea to the user's saved list
export const saveIdeaToApi = async (ideaId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('saved_ideas')
      .insert({ user_id: userId, idea_id: ideaId });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error saving idea:", error);
    throw error;
  }
};

// Remove an idea from the user's saved list
export const unsaveIdeaFromApi = async (ideaId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('saved_ideas')
      .delete()
      .match({ user_id: userId, idea_id: ideaId });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error unsaving idea:", error);
    throw error;
  }
};

// Add a comment to an idea
export const addCommentToApi = async (
  comment: Omit<Comment, 'id' | 'createdAt'>,
  userId: string
) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        idea_id: comment.ideaId,
        author_id: userId,
        text: comment.text
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Get profile for the comment author
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    // Transform the comment data
    return {
      id: data.id,
      text: data.text,
      ideaId: data.idea_id,
      createdAt: data.created_at,
      author: {
        id: userId,
        name: profileData?.name || 'Anonymous User',
        avatar: profileData?.avatar || '/placeholder.svg'
      }
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Delete a comment from an idea
export const deleteCommentFromApi = async (commentId: string, userId: string) => {
  try {
    console.log(`API: Starting database delete for comment ${commentId}`);
    
    const { error } = await supabase
      .from('comments')
      .delete()
      .match({ id: commentId, author_id: userId });
    
    if (error) throw error;
    
    console.log(`API: Database delete successful for comment ${commentId}`);
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// Create a new idea
export const createIdeaInApi = async (
  idea: Pick<Idea, 'title' | 'description' | 'skills'>,
  userId: string,
  userName: string | null
) => {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .insert({
        title: idea.title,
        description: idea.description,
        skills: idea.skills || [],
        author_id: userId
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Get author profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    // Create new idea object
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      skills: data.skills || [],
      author: {
        id: userId,
        name: profileData?.name || userName || "Anonymous User",
        avatar: profileData?.avatar || "/placeholder.svg",
      },
      collaborators: [],
      comments: [],
      likes: 0,
      createdAt: data.created_at,
      isOwner: true,
      isSaved: false,
    };
  } catch (error) {
    console.error("Error creating idea:", error);
    throw error;
  }
};
