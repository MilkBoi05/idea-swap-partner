
// Types for the ideas feature
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
