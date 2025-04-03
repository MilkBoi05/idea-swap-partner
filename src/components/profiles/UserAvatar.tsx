
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserAvatarProps = {
  avatarUrl?: string | null;
  name: string;
  className?: string;
};

const UserAvatar = ({ avatarUrl, name, className = "" }: UserAvatarProps) => {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  // Debug avatar URL issues
  console.log(`Avatar for ${name}:`, { avatarUrl, initials });

  return (
    <Avatar className={className}>
      <AvatarImage src={avatarUrl || undefined} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
