
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SkillTag from "../skills/SkillTag";
import UserAvatar from "./UserAvatar";
import { Link } from "react-router-dom";

export type Profile = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  skills: string[];
  location: string;
  ideas: number;
  collaborations: number;
};

type ProfileCardProps = {
  profile: Profile;
};

const ProfileCard = ({ profile }: ProfileCardProps) => {
  return (
    <Card className="card-hover">
      <CardHeader className="text-center">
        <div className="flex flex-col items-center">
          <UserAvatar
            avatarUrl={profile.avatar}
            name={profile.name}
            className="w-20 h-20"
          />
          <h3 className="font-medium text-lg mt-2">{profile.name}</h3>
          <p className="text-sm text-gray-500">{profile.location}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3 mb-3">{profile.bio}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {profile.skills.map((skill, index) => (
            <SkillTag key={index} name={skill} />
          ))}
        </div>
        <div className="flex justify-between mt-4 text-sm text-gray-500">
          <div>
            <span className="font-semibold text-primary">{profile.ideas}</span> ideas
          </div>
          <div>
            <span className="font-semibold text-primary">{profile.collaborations}</span> collaborations
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/user/${profile.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
