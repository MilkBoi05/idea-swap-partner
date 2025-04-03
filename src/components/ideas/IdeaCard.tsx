
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star, Users } from "lucide-react";
import SkillTag from "../skills/SkillTag";
import UserAvatar from "../profiles/UserAvatar";
import IdeaDetailModal from "./IdeaDetailModal";
import { Idea } from "@/hooks/useIdeas";

type IdeaCardProps = {
  idea: Idea;
};

const IdeaCard = ({ idea }: IdeaCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(idea.likes);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<Idea>(idea);

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

  return (
    <>
      <Card 
        className="card-hover cursor-pointer h-full flex flex-col" 
        onClick={() => setShowDetailModal(true)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <UserAvatar
                avatarUrl={currentIdea.author.avatar}
                name={currentIdea.author.name}
                className="w-10 h-10"
              />
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
            {currentIdea.skills.map((skill, index) => (
              <SkillTag key={index} name={skill} />
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="flex space-x-4 text-gray-500 text-sm">
            <div className="flex items-center">
              <Users size={16} className="mr-1" />
              <span>{Array.isArray(currentIdea.collaborators) ? currentIdea.collaborators.length : 0}</span>
            </div>
            <div 
              className="flex items-center cursor-pointer hover:text-gray-700"
              onClick={handleCommentClick}
            >
              <MessageCircle size={16} className="mr-1" />
              <span>{Array.isArray(currentIdea.comments) ? currentIdea.comments.length : 0}</span>
            </div>
          </div>
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={toggleLike}
            >
              <Star 
                size={16} 
                className={isLiked ? "fill-yellow-400 text-yellow-400" : ""} 
              />
              <span>{likeCount}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <IdeaDetailModal
        idea={currentIdea}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onMessageAuthor={handleMessageAuthor}
      />
    </>
  );
};

export default IdeaCard;
