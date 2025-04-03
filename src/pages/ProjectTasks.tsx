
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import TaskBoard from '@/components/tasks/TaskBoard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from "@/components/ui/sidebar";
import { LayoutDashboard, MessageSquare, Loader, Users, Clock, Settings } from "lucide-react";

const ProjectTasks = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("board");
  
  // Fetch project title - modified the query to handle the relationship properly
  const { data: project, isLoading } = useQuery({
    queryKey: ["project-title", id],
    queryFn: async () => {
      // First, fetch the idea data
      const { data: ideaData, error: ideaError } = await supabase
        .from("ideas")
        .select("title, author_id")
        .eq("id", id)
        .single();

      if (ideaError) {
        console.error("Error fetching project:", ideaError);
        throw new Error("Failed to load project");
      }
      
      // Then, separately fetch the author's profile data
      if (ideaData.author_id) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", ideaData.author_id)
          .single();
          
        if (profileError) {
          console.error("Error fetching author profile:", profileError);
          // Return just the idea data without author name if profile fetch fails
          return {
            title: ideaData.title,
            authorName: "Unknown"
          };
        }
        
        // Return combined data
        return {
          title: ideaData.title,
          authorName: profileData.name
        };
      }
      
      // Fallback if no author_id
      return {
        title: ideaData.title,
        authorName: "Unknown"
      };
    },
    enabled: !!id,
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <SidebarProvider className="flex-1 flex w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <h2 className="text-lg font-bold truncate">{project?.title || "Project"}</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Overview">
                  <Link to={`/project/${id}`}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Tasks" isActive>
                  <Link to={`/project/${id}/tasks`}>
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Tasks</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Team Chat">
                  <Link to={`/project/${id}/chat`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Team Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Team Members">
                  <Link to={`/project/${id}/team`}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Team</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link to={`/project/${id}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{project?.title}</h1>
              <p className="text-gray-500">Manage your project tasks and track progress</p>
            </div>
            
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
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
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default ProjectTasks;
