
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Idea, Comment } from "@/types/idea";
import {
  fetchIdeasFromApi,
  saveIdeaToApi,
  unsaveIdeaFromApi,
  addCommentToApi,
  deleteCommentFromApi,
  createIdeaInApi
} from "@/services/ideaService";

// Re-export types from the types file for backward compatibility
export type { IdeaAuthor, Comment, Collaborator, Idea } from "@/types/idea";

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
      
      const transformedIdeas = await fetchIdeasFromApi(userId);
      
      // Log transformed ideas for debugging
      console.log("Transformed ideas with authors and comment counts:", transformedIdeas);
      
      setIdeas(transformedIdeas);
      setUserIdeas(transformedIdeas.filter(idea => idea.author.id === userId));
      setSavedIdeas(transformedIdeas.filter(idea => idea.isSaved));
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
      await saveIdeaToApi(ideaId, userId || '');
      
      // Update local state
      setIdeas(ideas.map(idea => 
        idea.id === ideaId ? { ...idea, isSaved: true } : idea
      ));
      
      // Update saved ideas list
      const ideaToSave = ideas.find(idea => idea.id === ideaId);
      if (ideaToSave) {
        setSavedIdeas([...savedIdeas, {...ideaToSave, isSaved: true}]);
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
      await unsaveIdeaFromApi(ideaId, userId || '');
      
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
      const newComment = await addCommentToApi(comment, userId || '');
      
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
      console.log(`useIdeas: Starting database delete for comment ${commentId}`);
      
      const success = await deleteCommentFromApi(commentId, userId || '');
      
      if (success) {
        console.log(`useIdeas: Database delete successful for comment ${commentId}`);
        
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
      }
      
      return success;
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      toast.error(error.message || "Failed to delete comment");
      return false;
    }
  };

  // Create a new idea
  const createIdea = async (idea: Pick<Idea, 'title' | 'description' | 'skills'>) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to post an idea");
      return null;
    }
    
    try {
      const newIdea = await createIdeaInApi(idea, userId || '', userName);
      
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
    deleteComment,
  };
};
