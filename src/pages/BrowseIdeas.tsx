
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import IdeaCard, { Idea } from "@/components/ideas/IdeaCard";
import SkillTag from "@/components/skills/SkillTag";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const sampleIdeas: Idea[] = [
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
  {
    id: "4",
    title: "Smart Home Energy Management System",
    description: "An IoT platform that optimizes energy usage in homes by learning from user habits and automating energy-saving measures.",
    author: {
      name: "Taylor Kim",
      avatar: "/placeholder.svg",
    },
    skills: ["IoT", "Backend Development", "Data Science"],
    collaborators: 0,
    likes: 14,
    comments: 3,
  },
  {
    id: "5",
    title: "Peer-to-Peer Skill Sharing Marketplace",
    description: "A platform where people can teach their skills to others and learn new skills in return, using time as currency.",
    author: {
      name: "Jordan Patel",
      avatar: "/placeholder.svg",
    },
    skills: ["Frontend Development", "Backend Development", "Marketing"],
    collaborators: 1,
    likes: 27,
    comments: 9,
  },
  {
    id: "6",
    title: "Mental Health Chatbot for Teens",
    description: "An AI-powered chatbot designed to provide mental health support and resources for teenagers in a friendly, non-judgmental way.",
    author: {
      name: "Casey Rivera",
      avatar: "/placeholder.svg",
    },
    skills: ["AI/ML", "UI/UX Design", "Psychology"],
    collaborators: 2,
    likes: 41,
    comments: 15,
  },
];

const allSkills = [
  "Frontend Development",
  "Backend Development",
  "Mobile Development",
  "UI/UX Design",
  "AI/ML",
  "Blockchain",
  "IoT",
  "Data Science",
  "DevOps",
  "Marketing",
  "Product Management",
  "Psychology",
];

const BrowseIdeas = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const filteredIdeas = sampleIdeas.filter((idea) => {
    // Filter by search query
    const matchesQuery =
      searchQuery === "" ||
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by selected skills
    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) => idea.skills.includes(skill));

    return matchesQuery && matchesSkills;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">Browse Ideas</h1>
        
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search ideas by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Filter by skills:</h3>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill) => (
                <SkillTag
                  key={skill}
                  name={skill}
                  selected={selectedSkills.includes(skill)}
                  onClick={() => toggleSkill(skill)}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Ideas Grid */}
        {filteredIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No ideas found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filters to find more ideas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseIdeas;
