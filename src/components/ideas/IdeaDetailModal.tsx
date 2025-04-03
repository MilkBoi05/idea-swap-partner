
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import SkillTag from "@/components/skills/SkillTag";
import UserAvatar from "@/components/profiles/UserAvatar";
import { Idea, Comment, useIdeas } from "@/hooks/useIdeas";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import CommentsSection from "@/components/comments/CommentsSection";
import IdeaActions from "./IdeaActions";

type IdeaDetailModalProps = {
  idea: Idea;
  isOpen: boolean;
  onClose: () => void;
  onMessageAuthor?: () => void;
  onCommentCountChange?: (count: number) => void;
};

const IdeaDetailModal = ({ 
  idea, 
  isOpen, 
  onClose, 
  onMessageAuthor,
  onCommentCountChange 
}: IdeaDetailModalProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(idea.likes);
  const { userName, userId, isAuthenticated } = useAuth();
  const { addComment, deleteComment } = useIdeas();
  const [comments, setComments] = useState<Comment[]>([]);
  const navigate = useNavigate();
  
  // Initialize comments from idea when the modal opens
  useEffect(() => {
    if (isOpen && idea.comments) {
      setComments(idea.comments);
    }
  }, [isOpen, idea.comments]);

  // Update comment count in parent component when comments change
  useEffect(() => {
    if (onCommentCountChange) {
      onCommentCountChange(comments.length);
    }
  }, [comments.length, onCommentCountChange]);

  const toggleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Unknown date";
    }
  };

  const handleAddComment = async (text: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to comment");
      return;
    }
    
    if (text.trim()) {
      const commentData = {
        text: text,
        ideaId: idea.id,
        author: {
          id: userId || "anonymous",
          name: userName || "Anonymous User",
          avatar: "/placeholder.svg",
        }
      };
      
      const savedComment = await addComment(commentData);
      
      if (savedComment) {
        setComments(prev => [...prev, savedComment]);
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    console.log(`IdeaDetailModal: Deleting comment ${commentId} for idea ${idea.id}`);
    
    try {
      // Optimistically remove from local state first for immediate UI update
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      
      // Then attempt to delete from database
      await deleteComment(commentId, idea.id);
      console.log("Delete operation completed");
      return Promise.resolve();
    } catch (error) {
      console.error("Error in handleDeleteComment:", error);
      
      // If deletion fails, restore the comment (this is unlikely to happen as we already filtered it out)
      const deletedComment = idea.comments.find(comment => comment.id === commentId);
      if (deletedComment) {
        setComments(prev => [...prev, deletedComment]);
      }
      
      return Promise.reject(error);
    }
  };

  const handleMessageAuthor = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to message");
      onClose();
      setTimeout(() => {
        navigate("/sign-in");
      }, 0);
      return;
    }
    
    const messagePath = `/messages?authorId=${idea.author.id}&authorName=${encodeURIComponent(idea.author.name)}`;
    
    onClose();
    navigate(messagePath, { replace: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <UserAvatar 
                avatarUrl={idea.author.avatar} 
                name={idea.author.name} 
                className="h-12 w-12" 
              />
              <div>
                <p className="font-medium">{idea.author.name}</p>
                <p className="text-sm text-muted-foreground">{formatDate(idea.createdAt)}</p>
              </div>
            </div>
          </div>
          <DialogTitle className="text-2xl">{idea.title}</DialogTitle>
          <DialogDescription className="text-base text-foreground mt-2">
            {idea.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5">
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Skills needed:</h4>
            <div className="flex flex-wrap gap-2">
              {idea.skills.map((skill, index) => (
                <SkillTag key={index} name={skill} />
              ))}
            </div>
          </div>
          
          <CommentsSection 
            comments={comments}
            userId={userId}
            ideaId={idea.id}
            isAuthenticated={isAuthenticated}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
          />
          
          <IdeaActions 
            isLiked={isLiked}
            likeCount={likeCount}
            commentCount={comments.length}
            isOwner={idea.isOwner || false}
            authorName={idea.author.name}
            onToggleLike={toggleLike}
            onMessageAuthor={handleMessageAuthor}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IdeaDetailModal;
