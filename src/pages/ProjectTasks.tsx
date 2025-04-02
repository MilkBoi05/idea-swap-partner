
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import TaskBoard from '@/components/tasks/TaskBoard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProjectTasks = () => {
  const { id } = useParams();
  const [projectName] = useState("AI-Powered Recipe Generator");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{projectName}</h1>
          <p className="text-gray-500">Manage your project tasks and track progress</p>
        </div>
        
        <Tabs defaultValue="board" className="flex-1 flex flex-col">
          <div className="border-b">
            <TabsList>
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="board" className="flex-1 mt-4">
            <TaskBoard projectId={id} />
          </TabsContent>
          
          <TabsContent value="list" className="flex-1">
            <div className="p-8 text-center text-gray-500">
              List view will be implemented in a future update.
            </div>
          </TabsContent>
          
          <TabsContent value="calendar" className="flex-1">
            <div className="p-8 text-center text-gray-500">
              Calendar view will be implemented in a future update.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectTasks;
