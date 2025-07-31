import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  UserPlus,
  Bell,
  Settings,
  Home as HomeIcon,
  User,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUser } from "@/context/users";
import { api } from "@/lib/axios";

import type { User as people } from "@/types/types";

const Home = () => {
  return (
    <div className={`min-h-screen`}>
      <nav className="flex justify-between items-center p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-primary">JobSearch</h1>
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
  const { user } = useUser();
  console.log(user);
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

            <div className="flex gap-4 text-center w-full items-center justify-center">
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

type Post = {
  author: string;
  username: string;
  content: string;
  jobType: string;
  avatar: string;
};

const MainFeed = () => {
  const [postData, setPostData] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchData, setSearchData] = useState("");
  const [jobType, setJobType] = useState("ReactJS");
  const { user } = useUser();
  const getPost = async () => {
    try {
      const response = await api.get("/job/jobdetail");
      setPosts(response.data.jobdetail);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const handlePost = async () => {
    if (postData === "") return;
    try {
      await api.post("/job/create", {
        postData,
        user,
        jobType,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await api.get("/job/jobdetail", {
        params: { query: searchData },
      });
      setPosts(response.data.jobdetail);
    } catch (err) {
      console.error("Error during search:", err);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (!searchData) {
      getPost();
      interval = setInterval(() => {
        getPost();
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [searchData]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div
            className="flex gap-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          >
            <Input
              placeholder="Search posts, people, or topics..."
              className="flex-1"
              value={searchData}
              onChange={(e) => {
                setSearchData(e.target.value);
                handleSearch();
              }}
            />
            <Button variant="outline" size="icon" onClick={handleSearch}>
              <Search size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Post */}
      <Card>
        <h3 className="text-lg font-semibold px-4">Create a Post</h3>
        <CardContent className="px-4">
          <div>
            <Textarea
              placeholder="What's on your mind?"
              value={postData}
              onChange={(e) => setPostData(e.target.value)}
              className="min-h-20 resize-none"
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2 py-4 items-center justify-center">
                <PostVisibilityDropdown setJobType={setJobType} /> {jobType}
              </div>
              <Button onClick={handlePost}>Post</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No posts found. Try creating a post or adjusting your search.
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card>
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
                    </div>
                    <p className="text-sm mb-3 leading-relaxed">
                      {post.content}
                    </p>
                    <div className="border-t border-gray-100 pt-3 mb-3 w-full flex justify-between items-center">
                      <div>
                        <span className="text-sm uppercase tracking-wide font-medium">
                          Position
                        </span>
                        <p className="text-sm mt-1">{post.jobType}</p>
                      </div>
                      <Button>Apply</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

const RightSidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedFriends, setSuggestedFriends] = useState<people[]>([]);
  const { user } = useUser();

  const fetchUserData = async () => {
    try {
      const allUsers = await api.get("/users/data");
      console.log(allUsers);
      setSuggestedFriends(allUsers.data.users);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  console.log(suggestedFriends);

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
            {suggestedFriends.filter((f) => f.email !== user?.email).length ===
            0 ? (
              <p className="text-sm text-muted-foreground text-center">
                No friend suggestions available.
              </p>
            ) : (
              suggestedFriends.map((friend) =>
                user?.email !== friend.email ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={friend.avatar || "/default-avatar.png"}
                      />
                      <AvatarFallback className="text-xs">
                        {friend.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {friend.name}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      follow
                    </Button>
                  </div>
                ) : null,
              )
            )}
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

export function PostVisibilityDropdown({
  setJobType,
}: {
  setJobType: (jobType: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Job Topic</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup onValueChange={setJobType}>
          <DropdownMenuRadioItem value="ReactJs">ReactJS</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="NodeJs">NodeJS</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Python">Python</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="JavaScript">
            JavaScript
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Java">Java</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="C++">C++</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Home;
