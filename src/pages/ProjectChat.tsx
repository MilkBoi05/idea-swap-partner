
import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { LayoutDashboard, MessageSquare, Loader, Users, Clock, Settings, Send } from "lucide-react";

type Message = {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string | null;
  content: string;
  created_at: string;
};

type Collaborator = {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
};

const ProjectChat = () => {
  const { id } = useParams();
  const { userId, userName, userProfileImage } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Fetch project title
  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ["project-chat", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ideas")
        .select("title")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching project:", error);
        throw new Error("Failed to load project");
      }

      return data;
    },
    enabled: !!id,
  });
  
  // Fetch collaborators
  const { data: collaborators = [], isLoading: loadingCollaborators } = useQuery({
    queryKey: ["collaborators-chat", id],
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
  
  // Initialize messages with mock data for now
  // In a real app, you'd fetch these from a database
  useEffect(() => {
    if (project && collaborators.length > 0) {
      const initialMessages: Message[] = [
        {
          id: '1',
          sender_id: collaborators[0]?.id || '',
          sender_name: collaborators[0]?.name || 'Team Member',
          sender_avatar: collaborators[0]?.avatar || null,
          content: 'Welcome to the project chat! This is where we can discuss project progress and ideas.',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '2',
          sender_id: userId || '',
          sender_name: userName || 'You',
          sender_avatar: userProfileImage || null,
          content: 'Thanks for setting this up! I\'m excited to get started.',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
      
      setMessages(initialMessages);
    }
  }, [project, collaborators, userId, userName, userProfileImage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // In a real app, you'd send this to your database
    const newMessage: Message = {
      id: Date.now().toString(),
      sender_id: userId || '',
      sender_name: userName || 'You',
      sender_avatar: userProfileImage || null,
      content: message,
      created_at: new Date().toISOString(),
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Show a toast notification
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the team.",
    });
  };
  
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
  
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
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
                <SidebarMenuButton asChild tooltip="Tasks">
                  <Link to={`/project/${id}/tasks`}>
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Tasks</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Team Chat" isActive>
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
              <h1 className="text-2xl font-bold">{project?.title} - Team Chat</h1>
              <p className="text-gray-500">
                Collaborate with your team members in real-time
              </p>
            </div>
            
            <div className="flex flex-1 gap-4">
              <div className="flex-1 flex flex-col bg-white rounded-lg overflow-hidden border shadow-sm">
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[75%] ${
                            msg.sender_id === userId 
                              ? 'bg-primary text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                              : 'bg-gray-100 text-gray-800 rounded-tr-lg rounded-tl-lg rounded-br-lg'
                          } px-4 py-2`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={msg.sender_avatar || undefined} />
                              <AvatarFallback>
                                {msg.sender_name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className={`text-xs font-medium ${
                              msg.sender_id === userId ? 'text-white/80' : 'text-gray-600'
                            }`}>
                              {msg.sender_name}
                            </span>
                            <span className={`text-xs ${
                              msg.sender_id === userId ? 'text-white/60' : 'text-gray-500'
                            }`}>
                              {formatMessageDate(msg.created_at)}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="flex-1 resize-none"
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} className="self-end">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block w-64">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="font-medium mb-4">Team Members</h3>
                  <ul className="space-y-3">
                    {collaborators.map((collab) => (
                      <li key={collab.id} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={collab.avatar || undefined} />
                          <AvatarFallback>
                            {collab.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{collab.name}</p>
                          <p className="text-xs text-gray-500">{collab.role}</p>
                        </div>
                      </li>
                    ))}
                    
                    {collaborators.length === 0 && (
                      <li className="text-center text-sm text-gray-500">
                        No team members yet
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default ProjectChat;
