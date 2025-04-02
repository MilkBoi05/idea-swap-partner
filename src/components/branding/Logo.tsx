
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo = ({ className, showText = true }: LogoProps) => {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-md p-1">
        <Rocket className="h-5 w-5" />
      </div>
      {showText && <span className="text-xl font-bold text-primary">JumpStart</span>}
    </Link>
  );
};

export default Logo;
