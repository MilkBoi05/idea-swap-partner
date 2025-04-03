
import { useState } from "react";
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

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to comment");
      return;
    }
    
    if (newComment.trim()) {
      await onAddComment(newComment);
      setNewComment("");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to delete comments");
      return;
    }
    
    try {
      await onDeleteComment(commentId);
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
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
          disabled={!newComment.trim() || !isAuthenticated}
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CommentsSection;
