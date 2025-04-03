
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import UserAvatar from "@/components/profiles/UserAvatar";
import { format } from "date-fns";
import { Comment } from "@/hooks/useIdeas";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

type CommentItemProps = {
  comment: Comment;
  userId?: string | null;
  onDeleteComment: (commentId: string) => void;
};

const CommentItem = ({ comment, userId, onDeleteComment }: CommentItemProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const isAuthor = comment.author.id === userId;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Unknown date";
    }
  };

  const handleDelete = () => {
    // Close popover first for better UX
    setIsPopoverOpen(false);
    
    // Show immediate feedback
    toast.info("Deleting comment...");
    
    try {
      // Call delete directly - no confirmation, just do it
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
            {/* Changed to a direct button instead of popover for simplicity */}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleDelete}
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
