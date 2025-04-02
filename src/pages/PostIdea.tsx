
import Navbar from "@/components/layout/Navbar";
import IdeaForm from "@/components/ideas/IdeaForm";

const PostIdea = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-2">Post Your Idea</h1>
        <p className="text-gray-600 mb-8">
          Share your startup idea and find skilled collaborators to help bring it to life.
        </p>
        
        <IdeaForm />
      </div>
    </div>
  );
};

export default PostIdea;
