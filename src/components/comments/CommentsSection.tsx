
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "@/hooks/useIdeas";
import { toast } from "sonner";
import CommentItem from "./CommentItem";

type CommentsSectionProps = {
  comments: Comment[];
  userId?: string | null;
  ideaId: string;
  isAuthenticated: boolean;
  onAddComment: (text: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
};

const CommentsSection = ({
  comments,
  userId,
  ideaId,
  isAuthenticated,
  onAddComment,
  onDeleteComment
}: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  
  // Update local comments whenever prop comments change
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to comment");
      return;
    }
    
    if (newComment.trim()) {
      setIsSubmitting(true);
      try {
        await onAddComment(newComment);
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
        toast.error("Failed to add comment");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to delete comments");
      return;
    }
    
    console.log(`CommentsSection: Handling delete for comment ${commentId}`);
    
    // Optimistically update UI
    setLocalComments(currentComments => 
      currentComments.filter(c => c.id !== commentId)
    );
    
    // Show success toast
    toast.promise(
      onDeleteComment(commentId), 
      {
        loading: 'Deleting comment...',
        success: 'Comment deleted',
        error: (err) => {
          // Restore the comment if deletion fails
          setLocalComments(comments);
          return 'Failed to delete comment';
        },
      }
    );
  };

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Comments:</h4>
      {localComments.length > 0 ? (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {localComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              userId={userId}
              onDeleteComment={handleDeleteComment}
            />
          ))}
        </div>
      ) : (
        <div className="bg-muted/50 p-4 rounded-md">
          <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      )}
      
      <div className="mt-4 flex gap-2">
        <Textarea 
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[60px]"
        />
        <Button 
          onClick={handleAddComment} 
          className="self-end"
          disabled={!newComment.trim() || !isAuthenticated || isSubmitting}
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CommentsSection;
