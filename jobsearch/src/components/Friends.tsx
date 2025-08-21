import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useUser } from "@/context/users";
import { api } from "@/lib/axios";
import type { User as people } from "@/types/types";
import { NavBar } from "./navbar";
import { followUser } from "@/lib/follow";

const FriedsTab = () => {
  const [suggestedFriends, setSuggestedFriends] = useState<people[]>([]);
  const [userData, setUserData] = useState<any>();
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

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get("/users", {
          params: { id: user._id },
        });
        console.log(res.data.followersData); // full follower info
        setUserData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getUser();
  }, [user._id]);

  console.log(userData);

  return (
    <div className="flex flex-col gap-10">
      <NavBar />

      {/* Followers Section */}
      <Card className="mx-10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4" />
            Followers ({userData?.followersData?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {!userData?.followersData || userData.followersData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">
                No followers yet.
              </p>
            ) : (
              userData.followersData.map((follower: people) => (
                <div key={follower._id} className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={follower.avatar || "/default-avatar.png"}
                    />
                    <AvatarFallback className="text-xs">
                      {follower.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {follower.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {follower.email}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Follower
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Following Section */}
      <Card className="mx-10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4" />
            Following ({userData?.followingData?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {!userData?.followingData || userData.followingData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">
                Not following anyone yet.
              </p>
            ) : (
              userData.followingData.map((following: people) => (
                <div key={following._id} className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={following.avatar || "/default-avatar.png"}
                    />
                    <AvatarFallback className="text-xs">
                      {following.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {following.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {following.email}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Following
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Friends Section */}
      <Card className="mx-10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Suggested Friends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {suggestedFriends.filter((f) => f.email !== user?.email).length ===
            0 ? (
              <p className="text-sm text-muted-foreground text-center">
                No friend suggestions available.
              </p>
            ) : (
              suggestedFriends.map((friend, index) =>
                user?.email !== friend.email ? (
                  <div key={friend._id} className="flex items-center gap-3">
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
                      <p className="text-xs text-muted-foreground truncate">
                        {friend.email}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        followUser(user._id, suggestedFriends[index]._id)
                      }
                    >
                      Follow
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
    </div>
  );
};

export { FriedsTab };
