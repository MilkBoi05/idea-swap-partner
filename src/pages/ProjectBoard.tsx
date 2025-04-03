
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, MessageSquare, Loader, Users, Clock, Settings } from "lucide-react";

// Define types for project data
type Project = {
  id: string;
  title: string;
  description: string;
  author_id: string;
  authorName?: string;
  skills: string[];
  createdAt: string;
};

type Collaborator = {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
};

const ProjectBoard = () => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch project details
  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data: idea, error } = await supabase
        .from("ideas")
        .select("*, profiles(name)")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching project:", error);
        throw new Error("Failed to load project");
      }

      // Format project data
      return {
        id: idea.id,
        title: idea.title,
        description: idea.description,
        author_id: idea.author_id,
        authorName: idea.profiles?.name || "Unknown",
        skills: idea.skills || [],
        createdAt: new Date(idea.created_at).toLocaleDateString(),
      } as Project;
    },
    enabled: !!id,
  });

  // Fetch collaborators
  const { data: collaborators = [], isLoading: loadingCollaborators } = useQuery({
    queryKey: ["collaborators", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collaborators")
        .select("user_id, role, profiles:user_id(id, name, avatar)")
        .eq("idea_id", id);

      if (error) {
        console.error("Error fetching collaborators:", error);
        return [];
      }

      return data.map((collab: any) => ({
        id: collab.profiles?.id,
        name: collab.profiles?.name || "Unknown",
        avatar: collab.profiles?.avatar,
        role: collab.role,
      })) as Collaborator[];
    },
    enabled: !!id,
  });

  if (loadingProject || loadingCollaborators) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-xl font-bold mb-2">Project not found</h2>
            <p className="text-gray-500 mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
            <Button asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
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
            <h2 className="text-lg font-bold truncate">{project.title}</h2>
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
                <SidebarMenuButton asChild tooltip="Tasks">
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <p className="text-gray-500">Created by {project.authorName} on {project.createdAt}</p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="collaborators">Team</TabsTrigger>
                <TabsTrigger value="skills">Required Skills</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{project.description}</p>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button asChild className="w-full">
                        <Link to={`/project/${id}/tasks`}>
                          <Clock className="mr-2 h-4 w-4" />
                          View Tasks
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link to={`/project/${id}/chat`}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Team Chat
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Team</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center justify-between border-b pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                              {project.authorName.charAt(0).toUpperCase()}
                            </div>
                            <span>{project.authorName}</span>
                          </div>
                          <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Project Owner
                          </span>
                        </li>
                        
                        {collaborators.map((collaborator) => (
                          <li key={collaborator.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                {collaborator.avatar ? (
                                  <img 
                                    src={collaborator.avatar} 
                                    alt={collaborator.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    {collaborator.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <span>{collaborator.name}</span>
                            </div>
                            <span className="text-sm font-medium bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                              {collaborator.role}
                            </span>
                          </li>
                        ))}
                      </ul>
                      
                      {collaborators.length === 0 && (
                        <div className="text-center py-2">
                          <p className="text-gray-500">No collaborators yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="collaborators">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y">
                      <li className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                            {project.authorName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium">{project.authorName}</h4>
                            <p className="text-sm text-gray-500">Project Owner</p>
                          </div>
                        </div>
                      </li>
                      
                      {collaborators.map((collaborator) => (
                        <li key={collaborator.id} className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                              {collaborator.avatar ? (
                                <img 
                                  src={collaborator.avatar} 
                                  alt={collaborator.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                  {collaborator.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">{collaborator.name}</h4>
                              <p className="text-sm text-gray-500">{collaborator.role}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    {collaborators.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No collaborators yet</p>
                        <Button variant="outline" className="mt-4">
                          Invite Team Members
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="skills">
                <Card>
                  <CardHeader>
                    <CardTitle>Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                      
                      {project.skills.length === 0 && (
                        <p className="text-gray-500">No specific skills listed</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default ProjectBoard;
