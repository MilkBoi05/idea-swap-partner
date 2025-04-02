
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import SkillTag from "../skills/SkillTag";
import { UploadCloud } from "lucide-react";

const ideaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters"),
  skills: z.array(z.string()).min(1, "Select at least one required skill"),
  coverImage: z.any().optional(), // Optional cover image
});

type IdeaFormValues = z.infer<typeof ideaSchema>;

interface IdeaFormProps {
  onSubmit?: (data: IdeaFormValues) => void;
}

// Common skills for the demo
const commonSkills = [
  "Frontend Development",
  "Backend Development",
  "UI/UX Design",
  "Mobile Development",
  "DevOps",
  "Marketing",
  "Sales",
  "Product Management",
  "Data Science",
  "AI/ML",
  "Blockchain",
  "Finance",
  "Legal",
];

const IdeaForm = ({ onSubmit }: IdeaFormProps) => {
  const { toast } = useToast();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  const form = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      title: "",
      description: "",
      skills: [],
    },
  });

  // Fix: Use useEffect to update the form value when selectedSkills changes
  // instead of updating during render
  useEffect(() => {
    form.setValue("skills", selectedSkills);
  }, [selectedSkills, form]);
  
  useEffect(() => {
    form.setValue("coverImage", coverImage);
  }, [coverImage, form]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => {
      const isSelected = prev.includes(skill);
      return isSelected
        ? prev.filter((s) => s !== skill)
        : [...prev, skill];
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };
  
  const removeImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
    form.setValue("coverImage", null);
  };

  const handleSubmit = (data: IdeaFormValues) => {
    if (onSubmit) {
      onSubmit({
        ...data,
        coverImage: coverImage
      });
    } else {
      toast({
        title: "Idea Posted!",
        description: "Your idea has been successfully posted.",
      });
      console.log("Form submitted:", data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Idea Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a catchy title for your idea" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your idea in detail. What problem does it solve? What's unique about it?" 
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Cover Image Upload */}
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image (Optional)</FormLabel>
              <FormControl>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {coverImagePreview ? (
                    <div className="relative">
                      <img 
                        src={coverImagePreview} 
                        alt="Cover preview" 
                        className="w-full h-48 object-cover rounded-md" 
                      />
                      <Button 
                        type="button"
                        variant="destructive" 
                        size="sm" 
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-4">Upload a cover image for your idea</p>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="max-w-xs"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="skills"
          render={() => (
            <FormItem>
              <FormLabel>Skills Needed</FormLabel>
              <FormControl>
                <div className="border rounded-md p-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedSkills.length === 0 ? (
                      <p className="text-sm text-gray-500">No skills selected</p>
                    ) : (
                      selectedSkills.map((skill) => (
                        <SkillTag
                          key={skill}
                          name={skill}
                          selected={true}
                          onClick={() => toggleSkill(skill)}
                        />
                      ))
                    )}
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium mb-2">Available Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {commonSkills.map((skill) => (
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">Post Your Idea</Button>
      </form>
    </Form>
  );
};

export default IdeaForm;
