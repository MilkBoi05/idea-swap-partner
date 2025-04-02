
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Rocket, PlusCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import IdeaCard from "@/components/ideas/IdeaCard";
import { Idea, Collaborator, Comment } from "@/hooks/useIdeas";

const featuredIdeas: Idea[] = [
  {
    id: "1",
    title: "AI-Powered Recipe Generator for Dietary Restrictions",
    description: "An app that creates personalized recipe recommendations based on dietary restrictions, allergies, and ingredient availability using AI.",
    author: {
      id: "user_1",
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    },
    skills: ["AI/ML", "UI/UX Design", "Mobile Development"],
    collaborators: [],
    comments: [],
    likes: 24,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Blockchain Solution for Supply Chain Verification",
    description: "A transparent, immutable system to track products from origin to consumer with blockchain technology.",
    author: {
      id: "user_2",
      name: "Jamie Smith",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    },
    skills: ["Blockchain", "Backend Development", "Product Management"],
    collaborators: [],
    comments: [],
    likes: 18,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Virtual Coworking Space for Remote Teams",
    description: "Creating a virtual environment that replicates the serendipitous interactions and collaborative atmosphere of physical offices for remote teams.",
    author: {
      id: "user_3",
      name: "Morgan Lee",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    },
    skills: ["Frontend Development", "UI/UX Design", "Marketing"],
    collaborators: [],
    comments: [],
    likes: 32,
    createdAt: new Date().toISOString(),
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section with Image */}
      <div className="hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2000&q=80" 
            alt="Hero background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full p-4">
                <Rocket className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              Connect Ideas with Talent
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Share your startup ideas, find collaborators with the skills you need, 
              and build something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="text-lg group animate-pulse hover:animate-none">
                <Link to="/post-idea" className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  <span>Post Your Idea</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg bg-white/10 hover:bg-white/20">
                <Link to="/browse">Find Ideas to Join</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-lg mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder="Search for ideas or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-lg"
            />
          </div>
        </div>
      </div>
      
      {/* Featured Ideas Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 text-center">Featured Ideas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link to="/browse">Explore All Ideas</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-primary text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Share Your Idea</h3>
              <p className="text-gray-600">
                Post your startup idea with details about what problem it solves and what skills you need.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-primary text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Find Collaborators</h3>
              <p className="text-gray-600">
                Connect with skilled individuals who are interested in your idea and want to help build it.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-primary text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Build Your Startup</h3>
              <p className="text-gray-600">
                Collaborate effectively, develop your product, and launch your startup to the world.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Bring Your Ideas to Life?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join our community of innovators and skilled professionals today.
          </p>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            <Link to="/post-idea" className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              <span>Get Started</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

