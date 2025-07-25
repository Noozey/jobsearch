import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  UserPlus,
  Bell,
  Settings,
  Home as HomeIcon,
  User,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const Home = () => {
  return (
    <div className={`min-h-screen`}>
      <nav className="flex justify-between items-center p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-primary">SocialHub</h1>
          <ul className="flex gap-6 text-sm">
            <li className="flex items-center gap-2 text-primary cursor-pointer">
              <HomeIcon width={16} height={16} />
              Home
            </li>
            <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
              <Users size={16} />
              Friends
            </li>
            <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
              <User size={16} />
              Profile
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Bell size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings size={16} />
          </Button>
          <ThemeToggle />
        </div>
      </nav>

      <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto p-4">
        <section className="col-span-3">
          <LeftSidebar />
        </section>

        <section className="col-span-6">
          <MainFeed />
        </section>

        <section className="col-span-3">
          <RightSidebar />
        </section>
      </div>
    </div>
  );
};

const LeftSidebar = () => {
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    avatar: "",
    posts: 142,
    followers: 1205,
    following: 389,
  };

  return (
    <div className="space-y-4 sticky top-20">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-20 h-20 mb-4">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{user.email}</p>

            <div className="flex gap-4 text-center w-full">
              <div>
                <div className="font-semibold">{user.posts}</div>
                <div className="text-xs text-muted-foreground">Posts</div>
              </div>
              <div>
                <div className="font-semibold">{user.followers}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div>
                <div className="font-semibold">{user.following}</div>
                <div className="text-xs text-muted-foreground">Following</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm">Profile Views</span>
            <Badge variant="secondary">+12%</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Post Engagement</span>
            <Badge variant="secondary">+8%</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">New Followers</span>
            <Badge variant="secondary">+15</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MainFeed = () => {
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Sarah Chen",
      username: "@sarahchen",
      time: "2h ago",
      content:
        "Just finished an amazing React project! The new hooks make everything so much cleaner 🚀",
      likes: 24,
      comments: 8,
      shares: 3,
      avatar: "",
    },
    {
      id: 2,
      author: "Mike Rodriguez",
      username: "@mikerod",
      time: "4h ago",
      content:
        "Beautiful sunset at the beach today. Sometimes you need to step away from the code and enjoy nature 🌅",
      likes: 56,
      comments: 12,
      shares: 7,
      avatar: "",
    },
    {
      id: 3,
      author: "Emily Watson",
      username: "@emilyw",
      time: "6h ago",
      content:
        "New blog post is live! '10 Tips for Better Code Reviews' - link in my bio. What are your favorite code review practices?",
      likes: 43,
      comments: 18,
      shares: 12,
      avatar: "",
    },
  ]);

  const handlePost = () => {
    if (postText.trim()) {
      const newPost = {
        id: posts.length + 1,
        author: "Alex Johnson",
        username: "@alexj",
        time: "now",
        content: postText,
        likes: 0,
        comments: 0,
        shares: 0,
        avatar: "",
      };
      setPosts([newPost, ...posts]);
      setPostText("");
    }
  };

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search posts, people, or topics..."
              className="flex-1"
            />
            <Button variant="outline" size="icon">
              <Search size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Post */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="min-h-20 resize-none"
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  📷 Photo
                </Button>
                <Button variant="ghost" size="sm">
                  🎥 Video
                </Button>
                <Button variant="ghost" size="sm">
                  📍 Location
                </Button>
              </div>
              <Button
                onClick={handlePost}
                disabled={!postText.trim()}
                className="px-6"
              >
                Post
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={post.avatar} />
                  <AvatarFallback>
                    {post.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{post.author}</h4>
                    <span className="text-sm text-muted-foreground">
                      {post.username}
                    </span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {post.time}
                    </span>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <MoreHorizontal size={16} />
                    </Button>
                  </div>

                  <p className="text-sm mb-3 leading-relaxed">{post.content}</p>

                  <div className="flex items-center gap-6 text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-muted-foreground hover:text-red-500"
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart size={16} />
                      {post.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <MessageCircle size={16} />
                      {post.comments}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Share size={16} />
                      {post.shares}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const RightSidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedFriends] = useState([
    {
      id: 1,
      name: "David Kim",
      username: "@davidk",
      mutualFriends: 5,
      avatar: "",
    },
    {
      id: 2,
      name: "Lisa Park",
      username: "@lisap",
      mutualFriends: 3,
      avatar: "",
    },
    {
      id: 3,
      name: "James Wilson",
      username: "@jameswilson",
      mutualFriends: 8,
      avatar: "",
    },
    {
      id: 4,
      name: "Anna Martinez",
      username: "@annam",
      mutualFriends: 2,
      avatar: "",
    },
  ]);

  const [trendingTopics] = useState([
    { tag: "#ReactJS", posts: "12.5k posts" },
    { tag: "#WebDev", posts: "8.3k posts" },
    { tag: "#JavaScript", posts: "15.2k posts" },
    { tag: "#TechNews", posts: "6.1k posts" },
    { tag: "#OpenSource", posts: "4.8k posts" },
  ]);

  return (
    <div className="space-y-4 sticky top-20">
      {/* Add Friends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus size={16} />
            Add Friends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="space-y-3">
            {suggestedFriends.slice(0, 3).map((friend) => (
              <div key={friend.id} className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={friend.avatar} />
                  <AvatarFallback className="text-xs">
                    {friend.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{friend.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {friend.mutualFriends} mutual friends
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Add
                </Button>
              </div>
            ))}
          </div>

          <Button variant="ghost" className="w-full text-sm">
            See all suggestions
          </Button>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div
                key={index}
                className="flex justify-between items-center hover:bg-muted/50 p-2 rounded cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-primary">
                    {topic.tag}
                  </p>
                  <p className="text-xs text-muted-foreground">{topic.posts}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Alert */}
      <Alert>
        <Bell className="h-4 w-4" />
        <AlertDescription className="text-sm">
          You have 3 new notifications! Check your activity feed.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Home;
