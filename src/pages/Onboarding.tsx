
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import SkillTag from "@/components/skills/SkillTag";
import { ArrowRight, CheckCircle, UploadCloud, Rocket } from "lucide-react";
import Logo from "@/components/branding/Logo";

const allSkills = [
  "Web Development", "Mobile Development", "UI/UX Design", "Frontend", "Backend",
  "Full Stack", "DevOps", "Cloud", "Database", "AI/ML", "Blockchain",
  "IoT", "Marketing", "SEO", "Content Writing", "Social Media",
  "Product Management", "Project Management", "Business Development", "Sales",
  "Finance", "Accounting", "Legal", "HR", "Customer Support"
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    location: "",
    selectedSkills: [] as string[],
    interests: [] as string[],
    profilePicture: null as File | null,
  });
  
  const toggleSkill = (skill: string) => {
    if (formData.selectedSkills.includes(skill)) {
      setFormData({
        ...formData,
        selectedSkills: formData.selectedSkills.filter(s => s !== skill),
      });
    } else {
      setFormData({
        ...formData,
        selectedSkills: [...formData.selectedSkills, skill],
      });
    }
  };
  
  const toggleInterest = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter(i => i !== interest),
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest],
      });
    }
  };
  
  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // In a real app, this would submit the data to the backend
      console.log("Onboarding complete:", formData);
      // Redirect to the dashboard
      navigate("/dashboard");
    }
  };
  
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        profilePicture: e.target.files[0],
      });
    }
  };
  
  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return !formData.name;
      case 2:
        return formData.selectedSkills.length === 0;
      case 3:
        return formData.interests.length === 0;
      default:
        return false;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-4 flex justify-center">
        <Logo />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <div className="flex justify-between items-center mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    s === step
                      ? "bg-blue-500 text-white"
                      : s < step
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {s < step ? <CheckCircle className="h-5 w-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-20 h-1 hidden sm:block ${
                      s < step ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          
          <Card className="w-full">
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome to JumpStart!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    Let's set up your profile so you can connect with other entrepreneurs and skilled professionals.
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">What's your name?</Label>
                    <Input
                      id="name"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Software Engineer, UI Designer, Marketing Specialist"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Short bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us a bit about yourself..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </CardContent>
              </>
            )}
            
            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl">What are your skills?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    Select the skills you have that would be valuable for collaboration.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {allSkills.map((skill) => (
                      <SkillTag
                        key={skill}
                        name={skill}
                        selected={formData.selectedSkills.includes(skill)}
                        onClick={() => toggleSkill(skill)}
                      />
                    ))}
                  </div>
                </CardContent>
              </>
            )}
            
            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl">What are you interested in?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    Select the areas you're interested in for potential projects.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      "SaaS", "E-commerce", "FinTech", "EdTech", "HealthTech", 
                      "AI", "Mobile Apps", "Web Apps", "Gaming", "Social Media",
                      "Climate Tech", "Hardware", "Marketplace", "B2B", "B2C",
                      "Consumer Products", "Enterprise Software"
                    ].map((interest) => (
                      <SkillTag
                        key={interest}
                        name={interest}
                        selected={formData.interests.includes(interest)}
                        onClick={() => toggleInterest(interest)}
                      />
                    ))}
                  </div>
                </CardContent>
              </>
            )}
            
            {step === 4 && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl">Add a profile picture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    Upload a profile picture to make your profile stand out.
                  </p>
                  
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-4">
                      {formData.profilePicture ? (
                        <div className="relative w-32 h-32">
                          <img
                            src={URL.createObjectURL(formData.profilePicture)}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute bottom-0 right-0 bg-white rounded-full"
                            onClick={() => setFormData({ ...formData, profilePicture: null })}
                          >
                            <Rocket className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50">
                          <UploadCloud className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Label
                        htmlFor="profilePicture"
                        className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-200"
                      >
                        {formData.profilePicture ? "Change Photo" : "Upload Photo"}
                      </Label>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      This step is optional. You can always add or change your profile picture later.
                    </p>
                  </div>
                </CardContent>
              </>
            )}
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep} disabled={step === 1}>
                Back
              </Button>
              <Button onClick={handleNextStep} disabled={isNextDisabled()}>
                {step < 4 ? "Next" : "Finish"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
