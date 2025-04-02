
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Calendar, Star } from "lucide-react";
import SkillTag from "@/components/skills/SkillTag";
import { Idea } from "@/hooks/useIdeas";
import { format } from "date-fns";

type IdeaDetailModalProps = {
  idea: Idea;
  isOpen: boolean;
  onClose: () => void;
  onMessageAuthor?: () => void;
};

const IdeaDetailModal = ({ idea, isOpen, onClose, onMessageAuthor }: IdeaDetailModalProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(idea.likes);

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={idea.author.avatar} alt={idea.author.name} />
                <AvatarFallback>{idea.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{idea.author.name}</p>
                <p className="text-sm text-muted-foreground">{formatDate(idea.createdAt)}</p>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center">
              <Users size={14} className="mr-1" />
              <span>{idea.collaborators} collaborator{idea.collaborators !== 1 ? "s" : ""}</span>
            </Badge>
          </div>
          <DialogTitle className="text-2xl">{idea.title}</DialogTitle>
          <DialogDescription className="text-base text-foreground mt-2">
            {idea.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5">
          {/* Skills */}
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Skills needed:</h4>
            <div className="flex flex-wrap gap-2">
              {idea.skills.map((skill, index) => (
                <SkillTag key={index} name={skill} />
              ))}
            </div>
          </div>
          
          {/* Current Collaborators */}
          <div>
            <h4 className="text-sm font-medium mb-2">Current collaborators:</h4>
            <div className="flex -space-x-2 overflow-hidden">
              {[...Array(idea.collaborators || 0)].map((_, i) => (
                <Avatar key={i} className="border-2 border-background">
                  <AvatarImage src={`/placeholder.svg`} />
                  <AvatarFallback>C{i+1}</AvatarFallback>
                </Avatar>
              ))}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-medium">
                +
              </div>
            </div>
          </div>
          
          {/* Comments Section Placeholder */}
          <div>
            <h4 className="text-sm font-medium mb-2">Recent comments:</h4>
            <div className="bg-muted/50 p-4 rounded-md">
              <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={toggleLike}
              >
                <Star size={16} className={isLiked ? "fill-yellow-400 text-yellow-400" : ""} />
                <span>{likeCount}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <MessageSquare size={16} />
                <span>{idea.comments}</span>
              </Button>
            </div>
            <div className="flex gap-2">
              {idea.isOwner ? (
                <Button variant="outline" size="sm">Edit Idea</Button>
              ) : (
                <Button variant="outline" size="sm">Apply to Collaborate</Button>
              )}
              {!idea.isOwner && (
                <Button onClick={onMessageAuthor} size="sm">
                  Message {idea.author.name.split(" ")[0]}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IdeaDetailModal;
