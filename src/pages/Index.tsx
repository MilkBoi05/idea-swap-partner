
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import IdeaCard, { Idea } from "@/components/ideas/IdeaCard";

const featuredIdeas: Idea[] = [
  {
    id: "1",
    title: "AI-Powered Recipe Generator for Dietary Restrictions",
    description: "An app that creates personalized recipe recommendations based on dietary restrictions, allergies, and ingredient availability using AI.",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
    },
    skills: ["AI/ML", "UI/UX Design", "Mobile Development"],
    collaborators: 2,
    likes: 24,
    comments: 8,
  },
  {
    id: "2",
    title: "Blockchain Solution for Supply Chain Verification",
    description: "A transparent, immutable system to track products from origin to consumer with blockchain technology.",
    author: {
      name: "Jamie Smith",
      avatar: "/placeholder.svg",
    },
    skills: ["Blockchain", "Backend Development", "Product Management"],
    collaborators: 3,
    likes: 18,
    comments: 5,
  },
  {
    id: "3",
    title: "Virtual Coworking Space for Remote Teams",
    description: "Creating a virtual environment that replicates the serendipitous interactions and collaborative atmosphere of physical offices for remote teams.",
    author: {
      name: "Morgan Lee",
      avatar: "/placeholder.svg",
    },
    skills: ["Frontend Development", "UI/UX Design", "Marketing"],
    collaborators: 1,
    likes: 32,
    comments: 12,
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              Connect Ideas with Talent
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Share your startup ideas, find collaborators with the skills you need, 
              and build something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="text-lg">
                <Link to="/post-idea">Post Your Idea</Link>
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
            <Link to="/post-idea">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
