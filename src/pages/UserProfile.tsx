
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SkillTag from "@/components/skills/SkillTag";
import IdeaCard from "@/components/ideas/IdeaCard";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type UserProfileData = {
  id: string;
  name: string;
  avatar: string | null;
  title: string | null;
  bio: string | null;
  location: string | null;
  skills: string[] | null;
  website: string | null;
  github: string | null;
  twitter: string | null;
  linkedin: string | null;
};

type Idea = {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  skills: string[];
  collaborators: any[];
  comments: any[];
  likes: number;
  createdAt: string;
  coverImage?: string;
};

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as UserProfileData;
    },
    enabled: !!userId,
  });
  
  const { data: ideas, isLoading: ideasLoading } = useQuery({
    queryKey: ["userIdeas", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('author_id', userId);
      
      if (error) throw error;
      
      // Get profile for the author
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      // Transform ideas data
      return data.map(idea => ({
        id: idea.id,
        title: idea.title,
        description: idea.description,
        author: {
          id: userId,
          name: profileData?.name || 'Unknown User',
          avatar: profileData?.avatar || '/placeholder.svg'
        },
        skills: idea.skills || [],
        collaborators: [],
        comments: [],
        likes: idea.likes || 0,
        createdAt: idea.created_at,
        coverImage: idea.cover_image,
      })) as Idea[];
    },
    enabled: !!userId,
  });
  
  if (profileLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <p className="mb-6">The user profile you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button asChild>
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
        <Button variant="ghost" asChild className="self-start mb-4">
          <Link to="/profile" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to your profile
          </Link>
        </Button>
      
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-5">
                <div className="flex-shrink-0 -mt-16">
                  <Avatar className="w-24 h-24 border-4 border-white">
                    <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                  <p className="text-xl font-bold text-gray-900">{profile.name}</p>
                  {profile.title && <p className="text-sm text-gray-500">{profile.title}</p>}
                  {profile.location && <p className="text-sm text-gray-500">{profile.location}</p>}
                </div>
              </div>
              <div className="mt-5 sm:mt-0">
                <Button variant="outline">Send Message</Button>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="flex-1">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ideas">Ideas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{profile.bio || "This user hasn't added a bio yet."}</p>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile.skills && profile.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill) => (
                          <SkillTag key={skill} name={skill} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">This user hasn't added any skills yet.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profile.website && (
                      <div className="flex items-center">
                        <span className="font-medium w-24">Website:</span>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {profile.website}
                        </a>
                      </div>
                    )}
                    {profile.github && (
                      <div className="flex items-center">
                        <span className="font-medium w-24">GitHub:</span>
                        <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {profile.github}
                        </a>
                      </div>
                    )}
                    {profile.twitter && (
                      <div className="flex items-center">
                        <span className="font-medium w-24">Twitter:</span>
                        <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {profile.twitter}
                        </a>
                      </div>
                    )}
                    {profile.linkedin && (
                      <div className="flex items-center">
                        <span className="font-medium w-24">LinkedIn:</span>
                        <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {profile.linkedin}
                        </a>
                      </div>
                    )}
                    {!profile.website && !profile.github && !profile.twitter && !profile.linkedin && (
                      <p className="text-sm text-muted-foreground">This user hasn't added any social links yet.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ideas">
            {ideasLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : ideas && ideas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No ideas yet</h3>
                <p className="text-gray-500">This user hasn't posted any ideas yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
