import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SkillTag from "@/components/skills/SkillTag";
import IdeaCard from "@/components/ideas/IdeaCard";
import { useIdeas } from "@/hooks/useIdeas";
import { Edit3, UploadCloud, Briefcase, Calendar, List } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/services/userService";
import { toast } from "sonner";
import UserSearch from "@/components/users/UserSearch";
import UserAvatar from "@/components/profiles/UserAvatar";

const allSkills = [
  "Web Development", "Mobile Development", "UI/UX Design", "Frontend", "Backend",
  "Full Stack", "DevOps", "Cloud", "Database", "AI/ML", "Blockchain",
  "IoT", "Marketing", "SEO", "Content Writing", "Social Media",
  "Product Management", "Project Management", "Business Development", "Sales",
  "Finance", "Accounting", "Legal", "HR", "Customer Support"
];

const Profile = () => {
  const navigate = useNavigate();
  const { userId, userEmail } = useAuth();
  const { getUserProfile, updateUserProfile, loading } = useUserProfile();
  const { userIdeas, collaboratingIdeas, loading: ideasLoading } = useIdeas();
  
  const [editMode, setEditMode] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    title: "",
    location: "",
    bio: "",
    email: "",
    website: "",
    github: "",
    twitter: "",
    linkedin: "",
    profileImage: ""
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProfile = async () => {
      if (userId) {
        const profile = await getUserProfile(userId);
        if (profile) {
          setProfileForm({
            name: profile.name || "",
            title: profile.title || "",
            location: profile.location || "",
            bio: profile.bio || "",
            email: profile.email || userEmail || "",
            website: profile.website || "",
            github: profile.github || "",
            twitter: profile.twitter || "",
            linkedin: profile.linkedin || "",
            profileImage: profile.profileImage || ""
          });
          
          setSelectedSkills(profile.skills || []);
          
          // Set existing profile image
          if (profile.profileImage) {
            setProfileImagePreview(profile.profileImage);
          }
        }
      }
    };
    
    loadProfile();
  }, [userId, getUserProfile, userEmail]);
  
  const handleProfileChange = (field: string, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  
  const handleSaveProfile = async () => {
    if (!userId) return;
    
    try {
      setIsSaving(true);
      await updateUserProfile(userId, {
        name: profileForm.name,
        title: profileForm.title,
        bio: profileForm.bio,
        location: profileForm.location,
        skills: selectedSkills,
        website: profileForm.website,
        github: profileForm.github,
        twitter: profileForm.twitter,
        linkedin: profileForm.linkedin
      }, profileImage);
      
      setEditMode(false);
      setProfileImage(null); // Clear file selection after upload
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false); // Make sure to reset the loading state
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
        <div className="mb-6 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <List size={16} />
            Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate('/project/1')} className="flex items-center gap-2">
            <Briefcase size={16} />
            Project Board
          </Button>
          <Button variant="outline" onClick={() => navigate('/project/1/tasks')} className="flex items-center gap-2">
            <Calendar size={16} />
            Project Tasks
          </Button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-5">
                <div className="flex-shrink-0 -mt-16">
                  <div className="relative group">
                    {editMode ? (
                      <>
                        {profileImagePreview ? (
                          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                            <img 
                              src={profileImagePreview} 
                              alt="Profile preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <UserAvatar 
                            name={profileForm.name} 
                            className="w-24 h-24 border-4 border-white" 
                            avatarUrl={profileForm.profileImage}
                          />
                        )}
                        <label
                          htmlFor="profile-image"
                          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all"
                        >
                          <UploadCloud className="h-5 w-5 text-white" />
                          <input
                            id="profile-image"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                          />
                        </label>
                      </>
                    ) : (
                      <UserAvatar 
                        name={profileForm.name} 
                        className="w-24 h-24 border-4 border-white" 
                        avatarUrl={profileForm.profileImage}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                  {editMode ? (
                    <Input
                      value={profileForm.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="font-bold text-xl mb-1 w-72"
                    />
                  ) : (
                    <p className="text-xl font-bold text-gray-900">{profileForm.name || "Your Name"}</p>
                  )}
                  
                  {editMode ? (
                    <Input
                      value={profileForm.title}
                      onChange={(e) => handleProfileChange('title', e.target.value)}
                      className="text-sm text-gray-500 mb-1 w-72"
                      placeholder="Your professional title"
                    />
                  ) : (
                    <p className="text-sm text-gray-500">{profileForm.title || "Add your professional title"}</p>
                  )}
                  
                  {editMode ? (
                    <Input
                      value={profileForm.location}
                      onChange={(e) => handleProfileChange('location', e.target.value)}
                      className="text-sm text-gray-500 w-72"
                      placeholder="Your location"
                    />
                  ) : (
                    <p className="text-sm text-gray-500">{profileForm.location || "Add your location"}</p>
                  )}
                </div>
              </div>
              <div className="mt-5 sm:mt-0">
                {editMode ? (
                  <div className="space-x-2">
                    <Button variant="ghost" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setEditMode(true)}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="flex-1">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ideas">My Ideas</TabsTrigger>
            <TabsTrigger value="collaborating">Collaborating</TabsTrigger>
            <TabsTrigger value="search">Search Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editMode ? (
                      <Textarea
                        value={profileForm.bio}
                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                        className="min-h-[150px]"
                      />
                    ) : (
                      <p>{profileForm.bio}</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editMode ? (
                      <div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {selectedSkills.map((skill) => (
                            <SkillTag
                              key={skill}
                              name={skill}
                              selected={true}
                              onClick={() => toggleSkill(skill)}
                            />
                          ))}
                        </div>
                        <div className="border-t pt-4">
                          <p className="text-sm mb-2 font-medium">Add more skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {allSkills
                              .filter(skill => !selectedSkills.includes(skill))
                              .map((skill) => (
                                <SkillTag
                                  key={skill}
                                  name={skill}
                                  selected={false}
                                  onClick={() => toggleSkill(skill)}
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedSkills.map((skill) => (
                          <SkillTag key={skill} name={skill} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editMode ? (
                      <>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            value={profileForm.email}
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={profileForm.website}
                            onChange={(e) => handleProfileChange('website', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="github">GitHub</Label>
                          <Input
                            id="github"
                            value={profileForm.github}
                            onChange={(e) => handleProfileChange('github', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="twitter">Twitter</Label>
                          <Input
                            id="twitter"
                            value={profileForm.twitter}
                            onChange={(e) => handleProfileChange('twitter', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={profileForm.linkedin}
                            onChange={(e) => handleProfileChange('linkedin', e.target.value)}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="font-medium w-24">Email:</span>
                          <a href={`mailto:${profileForm.email}`} className="text-blue-600 hover:underline">
                            {profileForm.email}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-24">Website:</span>
                          <a href={profileForm.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {profileForm.website}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-24">GitHub:</span>
                          <a href={`https://github.com/${profileForm.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {profileForm.github}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-24">Twitter:</span>
                          <a href={`https://twitter.com/${profileForm.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {profileForm.twitter}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-24">LinkedIn:</span>
                          <a href={`https://linkedin.com/in/${profileForm.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {profileForm.linkedin}
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ideas Posted</span>
                        <span className="font-semibold">{userIdeas.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Collaborating On</span>
                        <span className="font-semibold">{collaboratingIdeas.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Connections</span>
                        <span className="font-semibold">8</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ideas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userIdeas.length > 0 ? (
                userIdeas.map(idea => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No ideas yet</h3>
                  <p className="text-gray-500 mb-4">You haven't posted any ideas yet.</p>
                  <Button asChild>
                    <a href="/post-idea">Post Your First Idea</a>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="collaborating">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collaboratingIdeas.length > 0 ? (
                collaboratingIdeas.map(idea => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-xl font-medium mb-2">Not collaborating yet</h3>
                  <p className="text-gray-500 mb-4">You're not collaborating on any ideas yet.</p>
                  <Button asChild>
                    <a href="/browse">Find Ideas to Join</a>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>Find Users</CardTitle>
              </CardHeader>
              <CardContent>
                <UserSearch />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Email Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-message">New messages</Label>
                      <input
                        id="new-message"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-collaborator">New collaboration requests</Label>
                      <input
                        id="new-collaborator"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="idea-updates">Idea updates</Label>
                      <input
                        id="idea-updates"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="newsletter">Weekly newsletter</Label>
                      <input
                        id="newsletter"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Password</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Account Actions</h3>
                  <div className="space-y-4">
                    <Button variant="outline">Download My Data</Button>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
