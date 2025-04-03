
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star, Users, MoreVertical } from "lucide-react";
import SkillTag from "../skills/SkillTag";
import UserAvatar from "../profiles/UserAvatar";
import IdeaDetailModal from "./IdeaDetailModal";
import { Idea, useIdeas } from "@/hooks/useIdeas";
import { toast } from "sonner";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useAuth } from "@/contexts/AuthContext";

type IdeaCardProps = {
  idea: Idea;
};

const IdeaCard = ({
  idea
}: IdeaCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(idea.likes);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<Idea>(idea);
  
  // Initialize comment count from idea comments array - ensuring it's only set once on mount
  const [commentCount, setCommentCount] = useState(
    Array.isArray(idea.comments) ? idea.comments.length : 0
  );
  
  const {
    userId
  } = useAuth();
  const {
    refreshIdeas
  } = useIdeas();

  // Only update currentIdea without resetting the comment count when idea prop changes
  useEffect(() => {
    setCurrentIdea(idea);
  }, [idea]);

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleMessageAuthor = () => {
    console.log(`Messaging ${currentIdea.author.name}`);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    setShowDetailModal(true);
  };

  const handleDeleteIdea = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering

    try {
      // In a real app, you would call an API to delete the idea
      console.log(`Deleting idea with id: ${currentIdea.id}`);
      toast.success("Idea deleted successfully");

      // Refresh ideas after deletion
      await refreshIdeas();
    } catch (error) {
      console.error("Error deleting idea:", error);
      toast.error("Failed to delete idea");
    }
  };

  // Called when a comment is added or deleted in the modal
  const handleCommentCountChange = (newCount: number) => {
    console.log(`Updating comment count to ${newCount}`);
    setCommentCount(newCount);
  };

  // Check if user is the owner of the idea
  const isOwner = currentIdea.author.id === userId;
  
  return <ContextMenu>
      <ContextMenuTrigger>
        <Card className="card-hover cursor-pointer h-full flex flex-col" onClick={() => setShowDetailModal(true)}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <UserAvatar avatarUrl={currentIdea.author.avatar} name={currentIdea.author.name} className="w-10 h-10" />
                <div>
                  <p className="text-sm font-medium">{currentIdea.author.name}</p>
                </div>
              </div>
              
            </div>
            <CardTitle className="text-xl mt-3">{currentIdea.title}</CardTitle>
            <CardDescription className="text-md line-clamp-2">
              {currentIdea.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow mt-4">
            <div className="flex flex-wrap gap-1 mt-2">
              {currentIdea.skills.map((skill, index) => <SkillTag key={index} name={skill} />)}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <div className="flex space-x-4 text-gray-500 text-sm">
              
              <div className="flex items-center cursor-pointer hover:text-gray-700" onClick={handleCommentClick}>
                <MessageCircle size={16} className="mr-1" />
                <span>{commentCount}</span>
              </div>
            </div>
            <div>
              <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={toggleLike}>
                <Star size={16} className={isLiked ? "fill-yellow-400 text-yellow-400" : ""} />
                <span>{likeCount}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-48">
        {isOwner && <ContextMenuItem className="text-red-600 cursor-pointer" onClick={handleDeleteIdea}>
            Delete Idea
          </ContextMenuItem>}
        <ContextMenuItem onClick={() => setShowDetailModal(true)}>
          View Details
        </ContextMenuItem>
      </ContextMenuContent>
      
      <IdeaDetailModal 
        idea={currentIdea} 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)} 
        onMessageAuthor={handleMessageAuthor} 
        onCommentCountChange={handleCommentCountChange}
      />
    </ContextMenu>;
};

export default IdeaCard;
