
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, CheckCircle2, Clock, Plus, MoreVertical, MessageSquare } from "lucide-react";

type Task = {
  id: string;
  title: string;
  description: string;
  status: "backlog" | "todo" | "in-progress" | "done";
  dueDate?: Date;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  priority: "low" | "medium" | "high";
  comments: number;
};

type Column = {
  id: "backlog" | "todo" | "in-progress" | "done";
  title: string;
  tasks: Task[];
};

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Create wireframes for landing page",
    description: "Design the initial wireframes for the app's landing page following our brand guidelines.",
    status: "backlog",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    assignee: {
      id: "user1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
    },
    priority: "medium",
    comments: 3,
  },
  {
    id: "2",
    title: "Implement user authentication",
    description: "Set up user authentication using Firebase Auth with email/password and Google sign-in options.",
    status: "backlog",
    priority: "high",
    comments: 0,
  },
  {
    id: "3",
    title: "Market research for target audience",
    description: "Conduct market research to identify key demographics and user needs for our product.",
    status: "todo",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
    assignee: {
      id: "user2",
      name: "Jamie Smith",
      avatar: "/placeholder.svg",
    },
    priority: "high",
    comments: 5,
  },
  {
    id: "4",
    title: "Define MVP features",
    description: "Create a list of essential features for the minimum viable product launch.",
    status: "todo",
    priority: "medium",
    comments: 2,
  },
  {
    id: "5",
    title: "Setup development environment",
    description: "Install necessary tools and configure the development environment for the team.",
    status: "in-progress",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
    assignee: {
      id: "user3",
      name: "Morgan Lee",
      avatar: "/placeholder.svg",
    },
    priority: "low",
    comments: 1,
  },
  {
    id: "6",
    title: "Logo design",
    description: "Create the final logo for the product based on approved sketches.",
    status: "in-progress",
    priority: "medium",
    comments: 8,
  },
  {
    id: "7",
    title: "Competitive analysis report",
    description: "Complete analysis of key competitors in the market.",
    status: "done",
    assignee: {
      id: "user1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
    },
    priority: "high",
    comments: 0,
  },
  {
    id: "8",
    title: "Project brief document",
    description: "Finalize the project brief outlining goals, timeline and resources.",
    status: "done",
    priority: "medium",
    comments: 4,
  },
];

const initialColumns: Column[] = [
  { id: "backlog", title: "Backlog", tasks: mockTasks.filter(t => t.status === "backlog") },
  { id: "todo", title: "To Do", tasks: mockTasks.filter(t => t.status === "todo") },
  { id: "in-progress", title: "In Progress", tasks: mockTasks.filter(t => t.status === "in-progress") },
  { id: "done", title: "Done", tasks: mockTasks.filter(t => t.status === "done") },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const ProjectBoard = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "backlog",
    priority: "medium",
  });
  
  const handleDragStart = (e: React.DragEvent, taskId: string, sourceColumnId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumnId", sourceColumnId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId");
    
    if (sourceColumnId === targetColumnId) return;
    
    setColumns(prev => {
      const newColumns = [...prev];
      
      // Find the task in the source column
      const sourceColumnIndex = newColumns.findIndex(col => col.id === sourceColumnId);
      const sourceColumn = newColumns[sourceColumnIndex];
      const taskIndex = sourceColumn.tasks.findIndex(t => t.id === taskId);
      const task = sourceColumn.tasks[taskIndex];
      
      // Remove the task from the source column
      newColumns[sourceColumnIndex].tasks = sourceColumn.tasks.filter(t => t.id !== taskId);
      
      // Add the task to the target column with updated status
      const targetColumnIndex = newColumns.findIndex(col => col.id === targetColumnId);
      newColumns[targetColumnIndex].tasks.push({
        ...task,
        status: targetColumnId as "backlog" | "todo" | "in-progress" | "done",
      });
      
      return newColumns;
    });
  };
  
  const handleAddTask = () => {
    if (!newTask.title) return;
    
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9), // generate a random ID
      title: newTask.title,
      description: newTask.description || "",
      status: newTask.status as "backlog" | "todo" | "in-progress" | "done",
      priority: newTask.priority as "low" | "medium" | "high",
      comments: 0,
    };
    
    setColumns(prev => {
      const newColumns = [...prev];
      const columnIndex = newColumns.findIndex(col => col.id === task.status);
      newColumns[columnIndex].tasks.push(task);
      return newColumns;
    });
    
    // Reset the form
    setNewTask({
      title: "",
      description: "",
      status: "backlog",
      priority: "medium",
    });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Project Board</h1>
            <p className="text-gray-600">Track and manage your project tasks</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={newTask.status}
                      onChange={(e) => setNewTask({...newTask, status: e.target.value as any})}
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddTask}>Add Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="kanban" className="mb-6">
          <TabsList>
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="kanban" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {columns.map((column) => (
                <div
                  key={column.id}
                  className="bg-gray-50 rounded-md p-4"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">{column.title}</h3>
                    <div className="bg-gray-200 text-xs font-medium px-2 py-1 rounded-full">
                      {column.tasks.length}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {column.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white p-3 rounded-md shadow-sm cursor-move"
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <button className="text-gray-500">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {task.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                            {task.assignee ? (
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={task.assignee.avatar} />
                                <AvatarFallback className="text-xs">
                                  {task.assignee.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-dashed border-gray-300" />
                            )}
                            
                            {task.comments > 0 && (
                              <div className="flex items-center text-xs text-gray-500">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                {task.comments}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {task.dueDate && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDate(task.dueDate)}
                              </div>
                            )}
                            <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border-b last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className={`h-3 w-3 rounded-full ${getPriorityColor(task.priority)}`} />
                        <div>
                          <h4 className="font-medium">{task.title}</h4>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>{task.status}</span>
                            {task.assignee && <span>Assigned to {task.assignee.name}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {task.dueDate && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(task.dueDate)}
                          </div>
                        )}
                        {task.status === "done" && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectBoard;
