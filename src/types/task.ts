
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "backlog" | "todo" | "in-progress" | "review" | "done";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  dueDate?: string;
  createdAt: string;
  projectId: string;
  tags: string[];
};
