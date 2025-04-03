
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Star, Send } from "lucide-react";
import SkillTag from "@/components/skills/SkillTag";
import { Idea, Comment, useIdeas } from "@/hooks/useIdeas";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type IdeaDetailModalProps = {
  idea: Idea;
  isOpen: boolean;
  onClose: () => void;
  onMessageAuthor?: () => void;
};

const IdeaDetailModal = ({ idea, isOpen, onClose, onMessageAuthor }: IdeaDetailModalProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(idea.likes);
  const [newComment, setNewComment] = useState("");
  const { userName, userId, isAuthenticated } = useAuth();
  const { addComment } = useIdeas();
  const [comments, setComments] = useState<Comment[]>(idea.comments || []);

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

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to comment");
      return;
    }
    
    if (newComment.trim()) {
      // Create comment data with required author property
      const commentData = {
        text: newComment,
        ideaId: idea.id,
        author: {
          id: userId || "anonymous",
          name: userName || "Anonymous User",
          avatar: "/placeholder.svg",
        }
      };
      
      // Add comment using the hook
      const savedComment = await addComment(commentData);
      
      if (savedComment) {
        // Update local state with the new comment
        setComments([...comments, savedComment]);
        
        // Clear input
        setNewComment("");
      }
    }
  };

  const handleMessageAuthor = () => {
    if (onMessageAuthor) {
      onMessageAuthor();
    } else {
      toast.info(`Messaging ${idea.author.name} is not available yet`);
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
              <span>{idea.collaborators.length} collaborator{idea.collaborators.length !== 1 ? "s" : ""}</span>
            </Badge>
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
          
          <div>
            <h4 className="text-sm font-medium mb-2">Comments:</h4>
            {comments.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-muted/50 p-3 rounded-md">
                    <div className="flex items-center space-x-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{comment.author.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
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
                <span>{comments.length}</span>
              </Button>
            </div>
            <div className="flex gap-2">
              {idea.isOwner ? (
                <Button variant="outline" size="sm">Edit Idea</Button>
              ) : (
                <Button variant="outline" size="sm">Apply to Collaborate</Button>
              )}
              {!idea.isOwner && (
                <Button onClick={handleMessageAuthor} size="sm">
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
