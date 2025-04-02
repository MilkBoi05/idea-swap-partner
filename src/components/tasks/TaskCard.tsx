
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, AlertTriangle, AlertCircle, ArrowRight } from "lucide-react";
import { Task } from "@/types/task";
import { format } from "date-fns";

type TaskCardProps = {
  task: Task;
  onEdit?: (task: Task) => void;
};

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const getPriorityIcon = () => {
    switch (task.priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), "MMM d");
    } catch {
      return null;
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onEdit?.(task)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium line-clamp-2">{task.title}</h3>
          <div className="flex-shrink-0 ml-2">
            {getPriorityIcon()}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 px-4 pb-4 flex justify-between items-center">
        {task.assigneeId ? (
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assigneeAvatar} />
            <AvatarFallback>{task.assigneeName?.[0] || "?"}</AvatarFallback>
          </Avatar>
        ) : (
          <span className="text-xs text-gray-400">Unassigned</span>
        )}
        
        {task.dueDate && (
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="mr-1 h-3 w-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
