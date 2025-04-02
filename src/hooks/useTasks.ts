
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Task, TaskStatus, TaskPriority } from "@/types/task";

// Mock data for tasks
const mockTasks: Task[] = [
  {
    id: "task_1",
    title: "Create wireframes for homepage",
    description: "Design the initial wireframes for the landing page and get feedback from the team",
    status: "todo",
    priority: "high",
    assigneeId: "user_123",
    assigneeName: "Alex Johnson",
    assigneeAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    dueDate: "2023-06-15",
    createdAt: "2023-06-01",
    projectId: "1",
    tags: ["design", "UI/UX"]
  },
  {
    id: "task_2",
    title: "Setup database schema",
    description: "Create the initial database schema for user profiles and projects",
    status: "in-progress",
    priority: "medium",
    assigneeId: "user_456",
    assigneeName: "Taylor Smith",
    assigneeAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    dueDate: "2023-06-20",
    createdAt: "2023-06-02",
    projectId: "1",
    tags: ["backend", "database"]
  },
  {
    id: "task_3",
    title: "Implement authentication flow",
    description: "Create login, registration, and password reset functionality",
    status: "backlog",
    priority: "high",
    createdAt: "2023-06-03",
    projectId: "1",
    tags: ["backend", "auth"]
  },
  {
    id: "task_4",
    title: "Create component library",
    description: "Build reusable UI components that follow our design system",
    status: "review",
    priority: "medium",
    assigneeId: "user_789",
    assigneeName: "Morgan Lee",
    assigneeAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    dueDate: "2023-06-18",
    createdAt: "2023-06-04",
    projectId: "1",
    tags: ["frontend", "UI"]
  },
  {
    id: "task_5",
    title: "Implement API endpoints",
    description: "Create the REST API endpoints for user management",
    status: "done",
    priority: "high",
    assigneeId: "user_456",
    assigneeName: "Taylor Smith",
    assigneeAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    dueDate: "2023-06-10",
    createdAt: "2023-06-05",
    projectId: "1",
    tags: ["backend", "API"]
  }
];

export const useTasks = (projectId?: string) => {
  const { userId } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      let filteredTasks = mockTasks;
      
      // Filter by project if projectId is provided
      if (projectId) {
        filteredTasks = mockTasks.filter(task => task.projectId === projectId);
      }
      
      setTasks(filteredTasks);
      setLoading(false);
    }, 500);
  }, [projectId]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      ...task,
      createdAt: new Date().toISOString()
    };
    
    setTasks(prevTasks => [newTask, ...prevTasks]);
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  // Group tasks by status
  const tasksByStatus = {
    backlog: tasks.filter(task => task.status === "backlog"),
    todo: tasks.filter(task => task.status === "todo"),
    "in-progress": tasks.filter(task => task.status === "in-progress"),
    review: tasks.filter(task => task.status === "review"),
    done: tasks.filter(task => task.status === "done")
  };

  return {
    tasks,
    tasksByStatus,
    loading,
    addTask,
    updateTask,
    deleteTask
  };
};
