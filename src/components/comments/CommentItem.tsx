
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import UserAvatar from "@/components/profiles/UserAvatar";
import { format } from "date-fns";
import { Comment } from "@/hooks/useIdeas";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@/components/ui/context-menu";

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

  const handleDeleteComment = () => {
    onDeleteComment(comment.id);
  };

  return isAuthor ? (
    <ContextMenu>
      <ContextMenuTrigger>
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
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 ml-auto absolute right-2 top-3"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm">{comment.text}</p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem
          className="text-red-600 cursor-pointer"
          onClick={handleDeleteComment}
        >
          Delete Comment
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ) : (
    <div className="bg-muted/50 p-3 rounded-md">
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
      </div>
      <p className="text-sm">{comment.text}</p>
    </div>
  );
};

export default CommentItem;
