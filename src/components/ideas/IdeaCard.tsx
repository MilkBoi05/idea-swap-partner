
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star, Users } from "lucide-react";
import SkillTag from "../skills/SkillTag";
import IdeaDetailModal from "./IdeaDetailModal";
import { Idea } from "@/hooks/useIdeas";

type IdeaCardProps = {
  idea: Idea;
};

const IdeaCard = ({ idea }: IdeaCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(idea.likes);
  const [showDetailModal, setShowDetailModal] = useState(false);

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
    // In a future implementation, this would navigate to messaging
    console.log(`Messaging ${idea.author.name}`);
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
              <img 
                src={idea.author.avatar || "/placeholder.svg"} 
                alt={idea.author.name} 
                className="w-10 h-10 rounded-full object-cover" 
              />
              <div>
                <p className="text-sm font-medium">{idea.author.name}</p>
              </div>
            </div>
          </div>
          <CardTitle className="text-xl mt-3">{idea.title}</CardTitle>
          <CardDescription className="text-md line-clamp-2">
            {idea.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow mt-4">
          <div className="flex flex-wrap gap-1 mt-2">
            {idea.skills.map((skill, index) => (
              <SkillTag key={index} name={skill} />
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="flex space-x-4 text-gray-500 text-sm">
            <div className="flex items-center">
              <Users size={16} className="mr-1" />
              <span>{Array.isArray(idea.collaborators) ? idea.collaborators.length : 0}</span>
            </div>
            <div className="flex items-center">
              <MessageCircle size={16} className="mr-1" />
              <span>{Array.isArray(idea.comments) ? idea.comments.length : 0}</span>
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
        idea={idea}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onMessageAuthor={handleMessageAuthor}
      />
    </>
  );
};

export default IdeaCard;
