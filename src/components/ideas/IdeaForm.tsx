
import { useState } from "react";
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

const ideaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters"),
  skills: z.array(z.string()).min(1, "Select at least one required skill"),
});

type IdeaFormValues = z.infer<typeof ideaSchema>;

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

const IdeaForm = () => {
  const { toast } = useToast();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const form = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      title: "",
      description: "",
      skills: [],
    },
  });

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => {
      const isSelected = prev.includes(skill);
      const updatedSkills = isSelected
        ? prev.filter((s) => s !== skill)
        : [...prev, skill];
      
      form.setValue("skills", updatedSkills);
      return updatedSkills;
    });
  };

  const onSubmit = (data: IdeaFormValues) => {
    toast({
      title: "Idea Posted!",
      description: "Your idea has been successfully posted.",
    });
    console.log("Form submitted:", data);
    // In a real app, we would send this to an API
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
