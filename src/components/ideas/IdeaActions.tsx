
import { Button } from "@/components/ui/button";
import { MessageSquare, Star } from "lucide-react";

type IdeaActionsProps = {
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  isOwner: boolean;
  authorName: string;
  onToggleLike: () => void;
  onMessageAuthor: () => void;
};

const IdeaActions = ({
  isLiked,
  likeCount,
  commentCount,
  isOwner,
  authorName,
  onToggleLike,
  onMessageAuthor
}: IdeaActionsProps) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onToggleLike}
        >
          <Star size={16} className={isLiked ? "fill-yellow-400 text-yellow-400" : ""} />
          <span>{likeCount}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <MessageSquare size={16} />
          <span>{commentCount}</span>
        </Button>
      </div>
      <div className="flex gap-2">
        {isOwner ? (
          <Button variant="outline" size="sm">Edit Idea</Button>
        ) : (
          <Button variant="outline" size="sm">Apply to Collaborate</Button>
        )}
        {!isOwner && (
          <Button
            onClick={onMessageAuthor}
            size="sm"
          >
            Message {authorName.split(" ")[0]}
          </Button>
        )}
      </div>
    </div>
  );
};

export default IdeaActions;
