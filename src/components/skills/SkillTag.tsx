
import { cn } from "@/lib/utils";

type SkillTagProps = {
  name: string;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
};

const SkillTag = ({ name, className, selected = false, onClick }: SkillTagProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
        selected
          ? "bg-primary text-primary-foreground"
          : "bg-blue-100 text-blue-800 hover:bg-blue-200",
        onClick && "cursor-pointer",
        className
      )}
    >
      {name}
    </div>
  );
};

export default SkillTag;
