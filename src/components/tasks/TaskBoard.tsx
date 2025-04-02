
import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskColumn from "./TaskColumn";
import TaskFormDialog from "./TaskFormDialog";
import { useTasks } from "@/hooks/useTasks";
import { Task, TaskStatus } from "@/types/task";

type TaskBoardProps = {
  projectId?: string;
};

const TaskBoard = ({ projectId }: TaskBoardProps) => {
  const { tasksByStatus, addTask, updateTask, deleteTask, loading } = useTasks(projectId);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskFormSubmit = (taskData: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else if (projectId) {
      addTask({
        title: taskData.title || "",
        description: taskData.description || "",
        status: taskData.status || "backlog",
        priority: taskData.priority || "medium",
        assigneeId: taskData.assigneeId,
        assigneeName: taskData.assigneeName,
        assigneeAvatar: taskData.assigneeAvatar,
        dueDate: taskData.dueDate,
        projectId: projectId,
        tags: taskData.tags || []
      });
    }
    setIsTaskFormOpen(false);
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  const columns: { status: TaskStatus; title: string }[] = [
    { status: "backlog", title: "Backlog" },
    { status: "todo", title: "To Do" },
    { status: "in-progress", title: "In Progress" },
    { status: "review", title: "Review" },
    { status: "done", title: "Done" }
  ];

  if (loading) {
    return <div className="flex justify-center p-8">Loading tasks...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tasks</h2>
        <Button onClick={handleAddTask} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <div className="flex h-full gap-4 pb-4" style={{ minWidth: "1000px" }}>
          {columns.map(column => (
            <TaskColumn
              key={column.status}
              title={column.title}
              status={column.status}
              tasks={tasksByStatus[column.status]}
              onTaskClick={handleEditTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>

      <TaskFormDialog
        open={isTaskFormOpen}
        onOpenChange={setIsTaskFormOpen}
        task={editingTask}
        onSubmit={handleTaskFormSubmit}
        onDelete={editingTask ? () => {
          deleteTask(editingTask.id);
          setIsTaskFormOpen(false);
        } : undefined}
      />
    </div>
  );
};

export default TaskBoard;
