import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useUser } from "@/context/users";
import { api } from "@/lib/axios";

import type { User as people } from "@/types/types";
import { NavBar } from "./navbar";

const FriedsTab = () => {
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

  return (
    <div className="flex flex-col gap-10">
      <NavBar />
      <Card className="mx-10">
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
    </div>
  );
};

export { FriedsTab };
