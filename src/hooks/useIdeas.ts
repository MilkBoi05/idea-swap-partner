import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

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

// Get stored comments from localStorage
const getStoredComments = (): Comment[] => {
  const storedComments = localStorage.getItem('idea_comments');
  if (storedComments) {
    return JSON.parse(storedComments);
  }
  
  // Default comments if none stored
  return [];
};

// Get stored ideas from localStorage or use default mock ideas
const getStoredIdeas = (): Idea[] => {
  const storedIdeas = localStorage.getItem('ideas');
  if (storedIdeas) {
    return JSON.parse(storedIdeas);
  }
  
  // Default collaborators
  const defaultCollaborators: Collaborator[] = [
    {
      id: "collab_1",
      name: "Jordan Lee",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
      role: "Frontend Developer"
    },
    {
      id: "collab_2",
      name: "Casey Kim",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
      role: "UI/UX Designer"
    },
    {
      id: "collab_3",
      name: "Riley Johnson",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
      role: "Data Scientist"
    }
  ];
  
  // Default comments
  const defaultComments: Comment[] = [
    {
      id: "comment_1",
      author: {
        id: "user_456",
        name: "Taylor Smith",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
      },
      text: "This is a fantastic idea! I'd love to collaborate on this project.",
      createdAt: new Date().toISOString(),
      ideaId: "1"
    },
    {
      id: "comment_2",
      author: {
        id: "user_789",
        name: "Morgan Lee",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
      },
      text: "Have you considered integrating with existing dietary apps?",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      ideaId: "1"
    },
    {
      id: "comment_3",
      author: {
        id: "user_123",
        name: "Alex Johnson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
      },
      text: "I've worked on similar blockchain projects. The key challenge will be ensuring transaction speed while maintaining security.",
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      ideaId: "2"
    },
    {
      id: "comment_4",
      author: {
        id: "user_456",
        name: "Taylor Smith",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
      },
      text: "Looking forward to seeing how this virtual space develops! We need better remote collaboration tools.",
      createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      ideaId: "3"
    }
  ];
  
  // Save default comments
  localStorage.setItem('idea_comments', JSON.stringify(defaultComments));
  
  // Default mock ideas if none stored
  const defaultIdeas: Idea[] = [
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
      collaborators: [defaultCollaborators[0], defaultCollaborators[1]],
      comments: defaultComments.filter(comment => comment.ideaId === "1"),
      likes: 24,
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
      collaborators: [defaultCollaborators[2], defaultCollaborators[0], defaultCollaborators[1]],
      comments: defaultComments.filter(comment => comment.ideaId === "2"),
      likes: 18,
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
      collaborators: [defaultCollaborators[1], defaultCollaborators[2]],
      comments: defaultComments.filter(comment => comment.ideaId === "3"),
      likes: 32,
      createdAt: new Date().toISOString(),
    },
  ];
  
  return defaultIdeas;
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
    const storedComments = getStoredComments();
    
    // Process ideas to add user-specific flags and ensure comments are up to date
    const processedIdeas = storedIdeas.map(idea => ({
      ...idea,
      isOwner: idea.author.id === userId,
      isSaved: getSavedIdeaIds().includes(idea.id),
      comments: storedComments.filter(comment => comment.ideaId === idea.id),
    }));
    
    setIdeas(processedIdeas);
    
    // Filter for user ideas
    setUserIdeas(processedIdeas.filter(idea => idea.author.id === userId));
    
    // Get saved ideas from local storage
    const savedIdeaIds = getSavedIdeaIds();
    setSavedIdeas(processedIdeas.filter(idea => savedIdeaIds.includes(idea.id)));
    
    // Get collaborating ideas - in a real app this would come from an API
    setCollaboratingIdeas(processedIdeas.filter(idea => 
      idea.collaborators.some(collab => collab.id === userId)
    ));
    
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

  // Add a comment to an idea
  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    if (!userId) return null;
    
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      author: {
        id: userId,
        name: "You", // In real app, get from user profile
        avatar: "/placeholder.svg",
      },
      text: comment.text,
      ideaId: comment.ideaId,
      createdAt: new Date().toISOString(),
    };
    
    // Get current comments
    const storedComments = getStoredComments();
    const updatedComments = [...storedComments, newComment];
    
    // Store comments in localStorage
    localStorage.setItem('idea_comments', JSON.stringify(updatedComments));
    
    // Update ideas with new comment
    const updatedIdeas = ideas.map(idea => 
      idea.id === comment.ideaId 
        ? { ...idea, comments: [...idea.comments, newComment] } 
        : idea
    );
    
    // Update states
    setIdeas(updatedIdeas);
    setUserIdeas(updatedIdeas.filter(idea => idea.author.id === userId));
    setSavedIdeas(updatedIdeas.filter(idea => getSavedIdeaIds().includes(idea.id)));
    
    return newComment;
  };

  // Create a new idea
  const createIdea = (idea: Omit<Idea, 'id' | 'author' | 'collaborators' | 'comments' | 'likes' | 'createdAt' | 'isOwner' | 'isSaved' | 'coverImage'>) => {
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
      collaborators: [],
      comments: [],
      likes: 0,
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
    addComment,
    createIdea,
  };
};
