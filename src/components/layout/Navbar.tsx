
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, MessageSquare, User, LogOut, ChevronDown } from "lucide-react";
import Logo from "@/components/branding/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, userName, userProfileImage, userId, handleSignOut } = useAuth();
  const { toast } = useToast();

  // Fetch user's collaborating projects for the dropdown
  const { data: collaboratingProjects = [] } = useQuery({
    queryKey: ['collaboratingProjects', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Fetch ideas where the user is a collaborator
      const { data: collaborations, error } = await supabase
        .from('collaborators')
        .select('idea_id, role')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching collaborations:', error);
        return [];
      }
      
      // Get the details of those ideas
      if (collaborations && collaborations.length > 0) {
        const ideaIds = collaborations.map(collab => collab.idea_id);
        const { data: ideas, error: ideasError } = await supabase
          .from('ideas')
          .select('id, title')
          .in('id', ideaIds);
          
        if (ideasError) {
          console.error('Error fetching collaboration ideas:', ideasError);
          return [];
        }
        
        return ideas.map(idea => ({
          id: idea.id,
          title: idea.title,
          role: collaborations.find(c => c.idea_id === idea.id)?.role || 'Collaborator'
        }));
      }
      
      return [];
    },
    enabled: !!userId && isAuthenticated
  });

  const navItems = [
    { name: "Browse Ideas", path: "/browse", icon: <LayoutDashboard className="w-4 h-4" /> }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const onSignOut = async () => {
    await handleSignOut();
    setIsMenuOpen(false);
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account.",
    });
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  {item.icon && item.icon}
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated && (
                <Link
                  to="/post-idea"
                  className="px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 text-gray-600 hover:text-primary"
                >
                  Post Idea
                </Link>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                          {userProfileImage ? (
                            <img
                              src={userProfileImage}
                              alt={userName || 'User'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-full h-full p-2" />
                          )}
                        </div>
                        <span className="text-sm text-gray-600 hidden sm:inline">
                          {userName}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="w-full cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="w-full cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/messages" className="w-full cursor-pointer">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Messages</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    
                    {collaboratingProjects && collaboratingProjects.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>My Projects</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          {collaboratingProjects.map((project) => (
                            <DropdownMenuItem key={project.id} asChild>
                              <Link to={`/project/${project.id}`} className="w-full cursor-pointer">
                                <span className="truncate">{project.title}</span>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/sign-in">
                    <Button variant="ghost" className="text-gray-600 hover:text-primary">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/sign-up">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon && item.icon}
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated && (
              <>
                <Link
                  to="/post-idea"
                  className="block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 text-gray-600 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Post Idea
                </Link>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 text-gray-600 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 text-gray-600 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link
                  to="/messages"
                  className="block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 text-gray-600 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </Link>
                
                {collaboratingProjects && collaboratingProjects.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500">My Projects</div>
                    {collaboratingProjects.map((project) => (
                      <Link
                        key={project.id}
                        to={`/project/${project.id}`}
                        className="block px-6 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {project.title}
                      </Link>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-4 flex items-center justify-center space-x-2">
              {isAuthenticated ? (
                <div className="flex flex-col items-center w-full py-2">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">
                      {userName}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden">
                      {userProfileImage ? (
                        <img
                          src={userProfileImage}
                          alt={userName || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-full h-full p-2" />
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={onSignOut}
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/sign-in" className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/sign-up" className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
