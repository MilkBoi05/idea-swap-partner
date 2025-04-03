
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import UserAvatar from "@/components/profiles/UserAvatar";
import { format } from "date-fns";
import { Comment } from "@/hooks/useIdeas";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`CommentItem: Delete button clicked for comment ${comment.id}`);
    onDeleteComment(comment.id);
    setIsPopoverOpen(false);
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
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 ml-auto absolute right-2 top-3"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-red-600"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Comment
              </Button>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <p className="text-sm">{comment.text}</p>
    </div>
  );
};

export default CommentItem;
