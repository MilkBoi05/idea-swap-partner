
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "@/types/idea";
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

  const handleDeleteComment = async (commentId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error("Please sign in to delete comments");
      return false;
    }
    
    console.log(`CommentsSection: Handling delete for comment ${commentId}`);
    try {
      await onDeleteComment(commentId);
      return true;
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
      return false;
    }
  };

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Comments:</h4>
      {comments.length > 0 ? (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {comments.map((comment) => (
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
