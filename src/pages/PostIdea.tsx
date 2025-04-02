
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import IdeaForm from "@/components/ideas/IdeaForm";
import { useIdeas } from "@/hooks/useIdeas";
import { useToast } from "@/hooks/use-toast";

const PostIdea = () => {
  const { createIdea } = useIdeas();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmitIdea = (formData: { title: string; description: string; skills: string[] }) => {
    const newIdea = createIdea({
      title: formData.title,
      description: formData.description,
      skills: formData.skills,
    });

    if (newIdea) {
      toast({
        title: "Idea Posted!",
        description: "Your idea has been successfully posted.",
      });
      
      // Add console log for debugging
      console.log("New idea created:", newIdea);
      console.log("Navigating to dashboard");
      
      navigate("/dashboard");
    } else {
      toast({
        title: "Error",
        description: "Failed to post your idea. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-2">Post Your Idea</h1>
        <p className="text-gray-600 mb-8">
          Share your startup idea and find skilled collaborators to help bring it to life.
        </p>
        
        <IdeaForm onSubmit={handleSubmitIdea} />
      </div>
    </div>
  );
};

export default PostIdea;
