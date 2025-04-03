
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "@/components/profiles/UserAvatar";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  avatar: string | null;
  title: string | null;
  skills: string[] | null;
  location: string | null;
};

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["users", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      
      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, avatar, title, skills, location')
          .ilike('name', `%${searchTerm}%`)
          .limit(10);
        
        if (error) {
          console.error("Error fetching users:", error);
          toast.error("Failed to search users");
          throw error;
        }
        
        // Make sure each property exists even if it's null
        return (data || []).map(user => ({
          id: user.id,
          name: user.name || "",
          avatar: user.avatar,
          title: user.title || null,
          skills: user.skills || null,
          location: user.location || null
        })) as User[];
      } finally {
        setIsSearching(false);
      }
    },
    enabled: false
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      refetch();
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search users by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isSearching}>
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </form>
      
      {isLoading && <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
      
      {users && users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    avatarUrl={user.avatar}
                    name={user.name}
                    className="h-10 w-10"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    {user.title && <p className="text-sm text-muted-foreground truncate">{user.title}</p>}
                  </div>
                  <Button asChild size="sm">
                    <Link to={`/user/${user.id}`}>View</Link>
                  </Button>
                </div>
                
                {user.location && (
                  <p className="text-sm text-muted-foreground mt-2">{user.location}</p>
                )}
                
                {user.skills && user.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {user.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="bg-secondary px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                    {user.skills.length > 3 && (
                      <span className="bg-secondary px-2 py-1 rounded-full text-xs">
                        +{user.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        searchTerm && !isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users found matching "{searchTerm}"</p>
          </div>
        )
      )}
    </div>
  );
};

export default UserSearch;
