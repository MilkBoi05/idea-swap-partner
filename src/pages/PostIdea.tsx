
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import IdeaForm from "@/components/ideas/IdeaForm";
import { useIdeas } from "@/hooks/useIdeas";
import { useToast } from "@/hooks/use-toast";
import { uploadIdeaImage } from "@/services/storageService";

const PostIdea = () => {
  const { createIdea } = useIdeas();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmitIdea = async (formData: { 
    title: string; 
    description: string; 
    skills: string[]; 
    coverImage?: File | null 
  }) => {
    try {
      // Create the idea first
      const newIdea = createIdea({
        title: formData.title,
        description: formData.description,
        skills: formData.skills,
      });
      
      if (!newIdea) {
        throw new Error("Failed to create idea");
      }
      
      // If there's a cover image, upload it to Supabase storage
      let coverImageUrl = undefined;
      if (formData.coverImage) {
        try {
          coverImageUrl = await uploadIdeaImage(newIdea.id, formData.coverImage);
          
          if (coverImageUrl) {
            // Update the idea with the cover image URL
            newIdea.coverImage = coverImageUrl;
            
            // Update the idea in the store
            // In a production app, this would be done as part of the API call
            const storedIdeas = JSON.parse(localStorage.getItem('ideas') || '[]');
            const updatedIdeas = storedIdeas.map((idea: any) => 
              idea.id === newIdea.id ? { ...idea, coverImage: coverImageUrl } : idea
            );
            localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
          } else {
            console.warn('Cover image URL not returned from storage service');
          }
        } catch (error) {
          console.error("Error uploading cover image:", error);
          // Don't fail the entire operation if image upload fails
        }
      }

      toast({
        title: "Idea Posted!",
        description: "Your idea has been successfully posted.",
      });
      
      console.log("New idea created:", newIdea);
      console.log("Navigating to dashboard");
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating idea:", error);
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
