import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define the types for our idea data
export type IdeaAuthor = {
  id: string;
  name: string;
  avatar: string;
};

export type Comment = {
  id: string;
  author: IdeaAuthor;
  text: string;
  createdAt: string;
  ideaId: string;
};

export type Collaborator = {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
};

export type Idea = {
  id: string;
  title: string;
  description: string;
  author: IdeaAuthor;
  skills: string[];
  collaborators: Collaborator[];
  comments: Comment[];
  likes: number;
  createdAt: string;
  coverImage?: string;
  isSaved?: boolean;
  isOwner?: boolean;
};

export const useIdeas = () => {
  const { userId, userName, isAuthenticated } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [userIdeas, setUserIdeas] = useState<Idea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);
  const [collaboratingIdeas, setCollaboratingIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch ideas from Supabase
  const fetchIdeas = async () => {
    if (!isAuthenticated) {
      setIdeas([]);
      setUserIdeas([]);
      setSavedIdeas([]);
      setCollaboratingIdeas([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Fetch all ideas
      const { data: ideasData, error: ideasError } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (ideasError) throw ideasError;
      
      // Fetch user's saved ideas
      const { data: savedIdeasData, error: savedIdeasError } = await supabase
        .from('saved_ideas')
        .select('idea_id')
        .eq('user_id', userId);
      
      if (savedIdeasError) throw savedIdeasError;
      
      // Create a set of saved idea IDs for quick lookup
      const savedIdeaIds = new Set(savedIdeasData ? savedIdeasData.map(item => item.idea_id) : []);
      
      // Fetch all profiles for authors with debugging
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
      
      // Fetch comments for all ideas
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (commentsError) throw commentsError;
      
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
          comments: commentsMap?.get(idea.id) || [],
          likes: idea.likes || 0,
          createdAt: idea.created_at,
          coverImage: idea.cover_image,
          isSaved: savedIdeaIds?.has(idea.id),
          isOwner: idea.author_id === userId
        };
      }) : [];
      
      // Log transformed ideas for debugging
      console.log("Transformed ideas with authors:", transformedIdeas);
      
      setIdeas(transformedIdeas);
      setUserIdeas(transformedIdeas.filter(idea => idea.author.id === userId));
      setSavedIdeas(transformedIdeas.filter(idea => savedIdeaIds?.has(idea.id)));
      setCollaboratingIdeas(transformedIdeas.filter(idea => 
        idea.collaborators.some(collab => collab.id === userId)
      ));
      
    } catch (error) {
      console.error("Error loading ideas:", error);
      toast.error("Failed to load ideas");
    } finally {
      setLoading(false);
    }
  };

  // Load ideas on component mount and when auth state changes
  useEffect(() => {
    fetchIdeas();
  }, [userId, isAuthenticated]);

  // Save idea to user's saved list
  const saveIdea = async (ideaId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save ideas");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('saved_ideas')
        .insert({ user_id: userId, idea_id: ideaId });
      
      if (error) throw error;
      
      // Update local state
      setIdeas(ideas.map(idea => 
        idea.id === ideaId ? { ...idea, isSaved: true } : idea
      ));
      
      // Update saved ideas list
      const ideaToSave = ideas.find(idea => idea.id === ideaId);
      if (ideaToSave) {
        setSavedIdeas([...savedIdeas, ideaToSave]);
      }
      
      toast.success("Idea saved successfully");
    } catch (error: any) {
      console.error("Error saving idea:", error);
      toast.error(error.message || "Failed to save idea");
    }
  };

  // Remove idea from user's saved list
  const unsaveIdea = async (ideaId: string) => {
    if (!isAuthenticated) return;
    
    try {
      const { error } = await supabase
        .from('saved_ideas')
        .delete()
        .match({ user_id: userId, idea_id: ideaId });
      
      if (error) throw error;
      
      // Update local state
      setIdeas(ideas.map(idea => 
        idea.id === ideaId ? { ...idea, isSaved: false } : idea
      ));
      
      // Update saved ideas list
      setSavedIdeas(savedIdeas.filter(idea => idea.id !== ideaId));
      
      toast.success("Idea removed from saved list");
    } catch (error: any) {
      console.error("Error unsaving idea:", error);
      toast.error(error.message || "Failed to remove idea from saved list");
    }
  };

  // Add a comment to an idea
  const addComment = async (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to comment");
      return null;
    }
    
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
      const newComment: Comment = {
        id: data.id,
        text: data.text,
        ideaId: data.idea_id,
        createdAt: data.created_at,
        author: {
          id: userId || '',
          name: profileData?.name || userName || 'Anonymous User',
          avatar: profileData?.avatar || '/placeholder.svg'
        }
      };
      
      // Update local state
      const updatedIdeas = ideas.map(idea => {
        if (idea.id === comment.ideaId) {
          return {
            ...idea,
            comments: [...idea.comments, newComment]
          };
        }
        return idea;
      });
      
      setIdeas(updatedIdeas);
      setUserIdeas(updatedIdeas.filter(idea => idea.author.id === userId));
      setSavedIdeas(updatedIdeas.filter(idea => idea.isSaved));
      
      return newComment;
    } catch (error: any) {
      console.error("Error adding comment:", error);
      toast.error(error.message || "Failed to add comment");
      return null;
    }
  };

  const deleteComment = async (commentId: string, ideaId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to delete comments");
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .match({ id: commentId });
      
      if (error) throw error;
      
      // Update local state
      const updatedIdeas = ideas.map(idea => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            comments: idea.comments.filter(comment => comment.id !== commentId)
          };
        }
        return idea;
      });
      
      setIdeas(updatedIdeas);
      setUserIdeas(updatedIdeas.filter(idea => idea.author.id === userId));
      setSavedIdeas(updatedIdeas.filter(idea => idea.isSaved));
      
      toast.success("Comment deleted successfully");
      return true;
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      toast.error(error.message || "Failed to delete comment");
      return false;
    }
  };

  // Create a new idea
  const createIdea = async (idea: Omit<Idea, 'id' | 'author' | 'collaborators' | 'comments' | 'likes' | 'createdAt' | 'isOwner' | 'isSaved' | 'coverImage'>) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to post an idea");
      return null;
    }
    
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
      const newIdea: Idea = {
        id: data.id,
        title: data.title,
        description: data.description,
        skills: data.skills || [],
        author: {
          id: userId || '',
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
      
      // Update local state
      setIdeas([newIdea, ...ideas]);
      setUserIdeas([newIdea, ...userIdeas]);
      
      return newIdea;
    } catch (error: any) {
      console.error("Error creating idea:", error);
      toast.error(error.message || "Failed to create idea");
      return null;
    }
  };

  return {
    ideas,
    userIdeas,
    savedIdeas,
    collaboratingIdeas,
    loading,
    saveIdea,
    unsaveIdea,
    addComment,
    createIdea,
    refreshIdeas: fetchIdeas,
  };
};
