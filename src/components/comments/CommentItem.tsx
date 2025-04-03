
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import UserAvatar from "@/components/profiles/UserAvatar";
import { Comment } from "@/hooks/useIdeas";
import { toast } from "sonner";

type CommentItemProps = {
  comment: Comment;
  userId?: string | null;
  onDeleteComment: (commentId: string) => void;
};

const CommentItem = ({ comment, userId, onDeleteComment }: CommentItemProps) => {
  const isAuthor = comment.author.id === userId;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Unknown date";
    }
  };

  const handleDelete = () => {
    // Show immediate feedback
    toast.info("Deleting comment...");
    
    try {
      onDeleteComment(comment.id);
    } catch (err) {
      console.error("Failed to delete comment:", err);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="bg-muted/50 p-3 rounded-md relative">
      <div className="flex items-center space-x-2 mb-1">
        <UserAvatar
          avatarUrl={comment.author.avatar}
          name={comment.author.name}
          className="h-6 w-6"
        />
        <span className="text-sm font-medium">{comment.author.name}</span>
        <span className="text-xs text-muted-foreground">
          {formatDate(comment.createdAt)}
        </span>
        
        {isAuthor && (
          <div className="ml-auto absolute right-2 top-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
              onClick={handleDelete}
              aria-label="Delete comment"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        )}
      </div>
      <p className="text-sm">{comment.text}</p>
    </div>
  );
};

export default CommentItem;
