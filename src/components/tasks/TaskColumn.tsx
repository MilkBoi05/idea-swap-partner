
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskCard from "./TaskCard";
import { Task, TaskStatus } from "@/types/task";

type TaskColumnProps = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
};

const TaskColumn = ({ 
  title, 
  status, 
  tasks, 
  onTaskClick,
  onStatusChange
}: TaskColumnProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (onStatusChange) {
      onStatusChange(taskId, status);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  return (
    <Card 
      className="flex-1 max-w-xs flex flex-col" 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-gray-100">
            {tasks.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-2 space-y-2">
        {tasks.map(task => (
          <div 
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
          >
            <TaskCard task={task} onEdit={onTaskClick} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TaskColumn;
