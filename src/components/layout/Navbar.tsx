
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageSquare, LayoutDashboard, User, LogOut } from "lucide-react";
import Logo from "@/components/branding/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, userName, userProfileImage, handleSignOut } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { name: "Browse Ideas", path: "/browse", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Messages", path: "/messages", icon: <MessageSquare className="w-4 h-4" />, protected: true },
    { name: "Profile", path: "/profile", icon: <User className="w-4 h-4" />, protected: true },
    { name: "Post Idea", path: "/post-idea", protected: true },
  ];

  // Filter nav items based on auth status
  const filteredNavItems = navItems.filter(item => !item.protected || isAuthenticated);

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
              {filteredNavItems.map((item) => (
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
            </div>
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
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
            {filteredNavItems.map((item) => (
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
