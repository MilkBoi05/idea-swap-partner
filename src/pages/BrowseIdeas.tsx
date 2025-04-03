
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import IdeaCard from "@/components/ideas/IdeaCard";
import SkillTag from "@/components/skills/SkillTag";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useIdeas } from "@/hooks/useIdeas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import UserSearch from "@/components/users/UserSearch";

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
  const { ideas, loading } = useIdeas();
  const [activeTab, setActiveTab] = useState("ideas");
  const navigate = useNavigate();

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const filteredIdeas = ideas.filter((idea) => {
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

  const handleCreateIdea = () => {
    navigate("/post-idea");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Discover</h1>
          <Button onClick={handleCreateIdea}>
            Post New Idea
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="ideas">Ideas</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ideas">
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
            {loading ? (
              <div className="text-center py-12">
                <p>Loading ideas...</p>
              </div>
            ) : filteredIdeas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIdeas.map((idea) => (
                  <IdeaCard 
                    key={idea.id} 
                    idea={{
                      ...idea,
                      // Ensure comments is always an array
                      comments: Array.isArray(idea.comments) ? idea.comments : []
                    }} 
                  />
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
          </TabsContent>
          
          <TabsContent value="people">
            <UserSearch />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BrowseIdeas;
