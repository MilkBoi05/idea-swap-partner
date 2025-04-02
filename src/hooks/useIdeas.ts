
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Define the types for our idea data
export type IdeaAuthor = {
  id: string;
  name: string;
  avatar: string;
};

export type Idea = {
  id: string;
  title: string;
  description: string;
  author: IdeaAuthor;
  skills: string[];
  collaborators: number;
  likes: number;
  comments: number;
  createdAt: string;
  isSaved?: boolean;
  isOwner?: boolean;
};

// Get stored ideas from localStorage or use default mock ideas
const getStoredIdeas = (): Idea[] => {
  const storedIdeas = localStorage.getItem('ideas');
  if (storedIdeas) {
    return JSON.parse(storedIdeas);
  }
  
  // Default mock ideas if none stored
  return [
    {
      id: "1",
      title: "AI-Powered Recipe Generator for Dietary Restrictions",
      description: "An app that creates personalized recipe recommendations based on dietary restrictions, allergies, and ingredient availability using AI.",
      author: {
        id: "user_123",
        name: "Alex Johnson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
      },
      skills: ["AI/ML", "UI/UX Design", "Mobile Development"],
      collaborators: 2,
      likes: 24,
      comments: 8,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Blockchain Solution for Supply Chain Verification",
      description: "A transparent, immutable system to track products from origin to consumer with blockchain technology.",
      author: {
        id: "user_456",
        name: "Taylor Smith",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
      },
      skills: ["Blockchain", "Backend Development", "Product Management"],
      collaborators: 3,
      likes: 18,
      comments: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Virtual Coworking Space for Remote Teams",
      description: "Creating a virtual environment that replicates the serendipitous interactions and collaborative atmosphere of physical offices for remote teams.",
      author: {
        id: "user_789",
        name: "Morgan Lee",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
      },
      skills: ["Frontend Development", "UI/UX Design", "Marketing"],
      collaborators: 3,
      likes: 32,
      comments: 12,
      createdAt: new Date().toISOString(),
    },
  ];
};

export const useIdeas = () => {
  const { userId } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [userIdeas, setUserIdeas] = useState<Idea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);
  const [collaboratingIdeas, setCollaboratingIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  // Load ideas on component mount
  useEffect(() => {
    // Get ideas from localStorage
    const storedIdeas = getStoredIdeas();
    
    // Process ideas to add user-specific flags
    const processedIdeas = storedIdeas.map(idea => ({
      ...idea,
      isOwner: idea.author.id === userId,
      isSaved: getSavedIdeaIds().includes(idea.id),
    }));
    
    setIdeas(processedIdeas);
    
    // Filter for user ideas
    setUserIdeas(processedIdeas.filter(idea => idea.author.id === userId));
    
    // Get saved ideas from local storage
    const savedIdeaIds = getSavedIdeaIds();
    setSavedIdeas(processedIdeas.filter(idea => savedIdeaIds.includes(idea.id)));
    
    // Get collaborating ideas - in a real app this would come from an API
    // For demo, just use a fixed one
    setCollaboratingIdeas(processedIdeas.filter(idea => idea.id === "3"));
    
    setLoading(false);
  }, [userId]);

  // Save idea to user's saved list
  const saveIdea = (ideaId: string) => {
    const savedIds = getSavedIdeaIds();
    
    if (!savedIds.includes(ideaId)) {
      const newSavedIds = [...savedIds, ideaId];
      localStorage.setItem(`saved_ideas_${userId}`, JSON.stringify(newSavedIds));
      
      // Update state
      const updatedIdeas = ideas.map(idea => 
        idea.id === ideaId ? { ...idea, isSaved: true } : idea
      );
      
      setIdeas(updatedIdeas);
      setSavedIdeas(updatedIdeas.filter(idea => [...savedIds, ideaId].includes(idea.id)));
    }
  };

  // Remove idea from user's saved list
  const unsaveIdea = (ideaId: string) => {
    const savedIds = getSavedIdeaIds();
    
    if (savedIds.includes(ideaId)) {
      const newSavedIds = savedIds.filter(id => id !== ideaId);
      localStorage.setItem(`saved_ideas_${userId}`, JSON.stringify(newSavedIds));
      
      // Update state
      const updatedIdeas = ideas.map(idea => 
        idea.id === ideaId ? { ...idea, isSaved: false } : idea
      );
      
      setIdeas(updatedIdeas);
      // Fix: Filter the updated ideas to get only the saved ones
      setSavedIdeas(updatedIdeas.filter(idea => newSavedIds.includes(idea.id)));
    }
  };

  // Create a new idea
  const createIdea = (idea: Omit<Idea, 'id' | 'author' | 'collaborators' | 'likes' | 'comments' | 'createdAt' | 'isOwner' | 'isSaved'>) => {
    if (!userId) return null;
    
    const newIdea: Idea = {
      id: `idea_${Date.now()}`,
      title: idea.title,
      description: idea.description,
      skills: idea.skills,
      author: {
        id: userId,
        name: "You", // In real app, get from user profile
        avatar: "/placeholder.svg",
      },
      collaborators: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      isOwner: true,
      isSaved: false,
    };
    
    // In a real app, this would be an API call
    const updatedIdeas = [newIdea, ...ideas];
    
    // Store ideas in localStorage
    localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
    
    // Update states
    setIdeas(updatedIdeas);
    setUserIdeas([newIdea, ...userIdeas]);
    
    return newIdea;
  };

  // Helper to get saved idea IDs from local storage
  const getSavedIdeaIds = (): string[] => {
    if (!userId) return [];
    
    const savedIdsString = localStorage.getItem(`saved_ideas_${userId}`);
    return savedIdsString ? JSON.parse(savedIdsString) : [];
  };

  return {
    ideas,
    userIdeas,
    savedIdeas,
    collaboratingIdeas,
    loading,
    saveIdea,
    unsaveIdea,
    createIdea,
  };
};
