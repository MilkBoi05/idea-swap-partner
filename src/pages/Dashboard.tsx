
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IdeaCard from "@/components/ideas/IdeaCard";
import ProfileCard from "@/components/profiles/ProfileCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox, Star, Users, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useIdeas } from "@/hooks/useIdeas";
import { useUserProfile } from "@/services/userService";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("my-ideas");
  const { isLoaded, user } = useUser();
  const { userIdeas, savedIdeas, collaboratingIdeas, loading } = useIdeas();
  const { getUserProfile, getOnboardingStatus } = useUserProfile();
  
  const userProfile = getUserProfile();
  const isOnboardingComplete = getOnboardingStatus();

  // Mock connection profiles (in a real app would come from API)
  const connectionProfiles = [
    {
      id: "1",
      name: "Sam Wilson",
      avatar: "/placeholder.svg",
      bio: "Full-stack developer with 5 years of experience. Passionate about building products that solve real problems.",
      skills: ["Frontend Development", "Backend Development", "DevOps"],
      location: "San Francisco, CA",
      ideas: 2,
      collaborations: 4,
    },
    {
      id: "2",
      name: "Priya Sharma",
      avatar: "/placeholder.svg",
      bio: "UX/UI designer specializing in user-centered design processes. Looking to collaborate on innovative products.",
      skills: ["UI/UX Design", "Product Design", "User Research"],
      location: "New York, NY",
      ideas: 1,
      collaborations: 3,
    },
  ];
  
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  // Show onboarding prompt if user hasn't completed onboarding
  if (!isOnboardingComplete && user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="max-w-md mx-auto my-16 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
          <p className="text-gray-600 mb-6">
            To get the most out of JumpStart, please complete your profile setup.
          </p>
          <Button asChild className="w-full">
            <Link to="/onboarding">Complete Profile Setup</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Manage your ideas and connections</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link to="/post-idea">Post New Idea</Link>
            </Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-primary mr-4">
                <Users size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">My Ideas</p>
                <p className="text-2xl font-bold">{userIdeas.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-primary mr-4">
                <Star size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Collaborations</p>
                <p className="text-2xl font-bold">{collaboratingIdeas.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-primary mr-4">
                <Inbox size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Messages</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="my-ideas">My Ideas</TabsTrigger>
            <TabsTrigger value="collaborating">Collaborating</TabsTrigger>
            <TabsTrigger value="saved">Saved Ideas</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-ideas">
            {userIdeas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
                <Card className="flex items-center justify-center border-dashed h-full min-h-[300px]">
                  <CardContent className="text-center">
                    <h3 className="text-xl font-medium mb-2">Add a New Idea</h3>
                    <p className="text-gray-500 mb-4">Share your next startup idea and find collaborators.</p>
                    <Button asChild>
                      <Link to="/post-idea">Post Idea</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No ideas yet</h3>
                <p className="text-gray-500 mb-4">You haven't posted any ideas yet.</p>
                <Button asChild>
                  <Link to="/post-idea">Post Your First Idea</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="collaborating">
            {collaboratingIdeas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collaboratingIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">Not collaborating yet</h3>
                <p className="text-gray-500 mb-4">You're not collaborating on any ideas yet.</p>
                <Button asChild>
                  <Link to="/browse">Find Ideas to Join</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            {savedIdeas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No saved ideas</h3>
                <p className="text-gray-500 mb-4">You haven't saved any ideas yet.</p>
                <Button asChild>
                  <Link to="/browse">Browse Ideas</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="connections">
            {connectionProfiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connectionProfiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No connections yet</h3>
                <p className="text-gray-500 mb-4">You haven't made any connections yet.</p>
                <Button asChild>
                  <Link to="/browse">Find Ideas to Join</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
