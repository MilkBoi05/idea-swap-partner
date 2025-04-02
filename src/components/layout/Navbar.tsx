
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageSquare, LayoutDashboard, User, LogOut } from "lucide-react";
import Logo from "@/components/branding/Logo";
import { SignInButton, SignUpButton, UserButton, useAuth, useUser } from "@clerk/clerk-react";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();

  const navItems = [
    { name: "Browse Ideas", path: "/browse", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Messages", path: "/messages", icon: <MessageSquare className="w-4 h-4" />, protected: true },
    { name: "Profile", path: "/profile", icon: <User className="w-4 h-4" />, protected: true },
    { name: "Post Idea", path: "/post-idea", protected: true },
  ];

  // Filter nav items based on auth status
  const filteredNavItems = navItems.filter(item => !item.protected || isSignedIn);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    await signOut();
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
              {isSignedIn ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {user?.fullName || user?.username}
                  </span>
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-9 h-9"
                      }
                    }}
                  />
                </div>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="text-gray-600 hover:text-primary">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button>Sign Up</Button>
                  </SignUpButton>
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
              {isSignedIn ? (
                <div className="flex flex-col items-center w-full py-2">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">
                      {user?.fullName || user?.username}
                    </span>
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-9 h-9"
                        }
                      }}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="w-full">Sign In</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="w-full">Sign Up</Button>
                  </SignUpButton>
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
