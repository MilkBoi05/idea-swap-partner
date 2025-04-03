
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send } from "lucide-react";
import { toast } from "sonner";

type Message = {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  read: boolean;
};

type Conversation = {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
};

const mockConversations: Conversation[] = [
  {
    id: "1",
    participantId: "user1",
    participantName: "Alex Johnson",
    participantAvatar: "/placeholder.svg",
    lastMessage: "I'm interested in collaborating on your AI recipe app idea",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unreadCount: 2,
  },
  {
    id: "2",
    participantId: "user2",
    participantName: "Jamie Smith",
    participantAvatar: "/placeholder.svg",
    lastMessage: "When would you be available for a call to discuss the blockchain project?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    unreadCount: 0,
  },
  {
    id: "3",
    participantId: "user3",
    participantName: "Morgan Lee",
    participantAvatar: "/placeholder.svg",
    lastMessage: "Thanks for connecting! I'd love to join your team",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 0,
  },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      senderId: "user1",
      recipientId: "currentUser",
      content: "Hi there! I saw your idea about the AI recipe app and I'm really interested in it.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: true,
    },
    {
      id: "m2",
      senderId: "currentUser",
      recipientId: "user1",
      content: "Thanks for reaching out! What skills do you bring to the project?",
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      read: true,
    },
    {
      id: "m3",
      senderId: "user1",
      recipientId: "currentUser",
      content: "I'm a machine learning engineer with experience in NLP. I've worked on several recommendation systems before.",
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      read: true,
    },
    {
      id: "m4",
      senderId: "user1",
      recipientId: "currentUser",
      content: "I'm interested in collaborating on your AI recipe app idea",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false,
    },
  ],
  "2": [
    {
      id: "m5",
      senderId: "user2",
      recipientId: "currentUser",
      content: "Hello! I'm interested in your blockchain project.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      read: true,
    },
    {
      id: "m6",
      senderId: "currentUser",
      recipientId: "user2",
      content: "Great! Let's set up a call to discuss details.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      read: true,
    },
    {
      id: "m7",
      senderId: "user2",
      recipientId: "currentUser",
      content: "When would you be available for a call to discuss the blockchain project?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      read: true,
    },
  ],
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

const Messages = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const authorId = searchParams.get('authorId');
  const authorName = searchParams.get('authorName');
  
  const [activeConversation, setActiveConversation] = useState<string | null>("1");
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  
  // Handle incoming author from IdeaDetailModal
  useEffect(() => {
    if (authorId && authorName) {
      // Check if a conversation with this author already exists
      const existingConversation = conversations.find(conv => conv.participantId === authorId);
      
      if (existingConversation) {
        // If conversation exists, set it as active
        setActiveConversation(existingConversation.id);
        toast.info(`Showing conversation with ${authorName}`);
      } else {
        // Create a new conversation
        const newConversationId = `new-${authorId}`;
        const newConversation: Conversation = {
          id: newConversationId,
          participantId: authorId,
          participantName: authorName,
          participantAvatar: "/placeholder.svg",
          lastMessage: "New conversation",
          lastMessageTime: new Date(),
          unreadCount: 0,
        };
        
        // Add the new conversation to the list
        setConversations([newConversation, ...conversations]);
        
        // Set it as the active conversation
        setActiveConversation(newConversationId);
        
        // Initialize empty messages for this conversation
        mockMessages[newConversationId] = [];
        
        toast.success(`Started a new conversation with ${authorName}`);
      }
      
      // Clean up the URL to remove the query parameters
      window.history.replaceState({}, document.title, "/messages");
    }
  }, [authorId, authorName]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !activeConversation) return;
    
    // Get the current conversation
    const conversation = conversations.find(conv => conv.id === activeConversation);
    if (!conversation) return;
    
    // Create a new message
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: "currentUser",
      recipientId: conversation.participantId,
      content: newMessage,
      timestamp: new Date(),
      read: false,
    };
    
    // Add the message to the conversation
    if (!mockMessages[activeConversation]) {
      mockMessages[activeConversation] = [];
    }
    mockMessages[activeConversation] = [...mockMessages[activeConversation], newMsg];
    
    // Update the conversation's last message and time
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          lastMessage: newMessage,
          lastMessageTime: new Date(),
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    
    // Clear the input
    setNewMessage("");
    
    // Simulate a reply after a short delay
    setTimeout(() => {
      if (conversation) {
        const replyMsg: Message = {
          id: `m${Date.now() + 1}`,
          senderId: conversation.participantId,
          recipientId: "currentUser",
          content: `Thanks for your message! This is an automated reply from ${conversation.participantName}.`,
          timestamp: new Date(),
          read: false,
        };
        
        mockMessages[activeConversation] = [...mockMessages[activeConversation], replyMsg];
        
        // Update the UI to show the new message
        const updatedConversationsWithReply = conversations.map(conv => {
          if (conv.id === activeConversation) {
            return {
              ...conv,
              lastMessage: replyMsg.content,
              lastMessageTime: replyMsg.timestamp,
              unreadCount: conv.unreadCount + 1,
            };
          }
          return conv;
        });
        
        setConversations(updatedConversationsWithReply);
      }
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        
        <Tabs defaultValue="direct" className="w-full flex-1">
          <TabsList>
            <TabsTrigger value="direct">Direct Messages</TabsTrigger>
            <TabsTrigger value="team">Team Chats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="direct" className="flex-1 h-[calc(100vh-220px)]">
            <div className="flex h-full border rounded-lg overflow-hidden">
              {/* Conversations List */}
              <div className="w-1/3 border-r">
                <div className="p-3 border-b">
                  <Input placeholder="Search conversations..." className="w-full" />
                </div>
                <div className="overflow-y-auto h-[calc(100%-60px)]">
                  {conversations.map((conversation) => (
                    <div 
                      key={conversation.id}
                      onClick={() => setActiveConversation(conversation.id)}
                      className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                        activeConversation === conversation.id ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="relative">
                        <img 
                          src={conversation.participantAvatar} 
                          alt={conversation.participantName}
                          className="w-12 h-12 rounded-full"
                        />
                        {conversation.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="ml-3 flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-sm truncate">{conversation.participantName}</h3>
                          <span className="text-xs text-gray-500">{formatTime(conversation.lastMessageTime)}</span>
                        </div>
                        <p className={`text-sm truncate ${conversation.unreadCount > 0 ? "font-semibold" : "text-gray-600"}`}>
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Message View */}
              <div className="w-2/3 flex flex-col">
                {activeConversation ? (
                  <>
                    <div className="p-4 border-b flex items-center">
                      <img 
                        src={conversations.find(c => c.id === activeConversation)?.participantAvatar} 
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-3">
                        <h3 className="font-medium">
                          {conversations.find(c => c.id === activeConversation)?.participantName}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4 overflow-y-auto">
                      {mockMessages[activeConversation]?.map((message) => (
                        <div 
                          key={message.id} 
                          className={`mb-4 flex ${message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                              message.senderId === 'currentUser'
                                ? 'bg-primary text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className={`text-xs mt-1 ${message.senderId === 'currentUser' ? 'text-primary-foreground/75' : 'text-gray-500'}`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 border-t">
                      <div className="flex">
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button onClick={handleSendMessage} className="ml-2">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="font-medium text-lg mb-2">Select a conversation</h3>
                      <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="team" className="h-[calc(100vh-220px)]">
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center p-6">
                <h3 className="text-xl font-medium mb-2">Team Chat Coming Soon</h3>
                <p className="text-gray-600">
                  Team chat functionality will allow you to create project-specific group chats for your collaborators.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Messages;
