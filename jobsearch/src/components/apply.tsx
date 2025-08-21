import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, UserX, Clock, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useUser } from "@/context/users";
import { api } from "@/lib/axios";
import type { User as people } from "@/types/types";
import { NavBar } from "./navbar";

const Apply = () => {
  const [userData, setUserData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchUserData = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const res = await api.get("/users", {
        params: { id: user._id },
      });
      console.log("User data with applicants:", res.data);
      setUserData(res.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user?._id]);

  const [acceptedApplicants, setAcceptedApplicants] = useState<Set<string>>(
    new Set(),
  );
  const [rejectedApplicants, setRejectedApplicants] = useState<Set<string>>(
    new Set(),
  );

  const handleAcceptApplication = async (applicantId: string) => {
    try {
      await api.post("/users/accept-application", {
        userId: user._id,
        applicantId: applicantId,
      });

      // Mark as accepted (don't remove from UI, just change button)
      setAcceptedApplicants((prev) => new Set(prev).add(applicantId));
    } catch (err) {
      console.error("Error accepting application:", err);
    }
  };

  const handleRejectApplication = async (applicantId: string) => {
    try {
      await api.post("/users/reject-application", {
        userId: user._id,
        applicantId: applicantId,
      });

      // Mark as rejected (will be filtered out from display)
      setRejectedApplicants((prev) => new Set(prev).add(applicantId));
    } catch (err) {
      console.error("Error rejecting application:", err);
    }
  };

  const handleMessage = (applicant: people) => {
    // Navigate to message page or open chat
    console.log("Opening message with:", applicant.name);
    // You can implement navigation to message page here
    // For example: navigate(`/message/${applicant._id}`)
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-10">
        <NavBar />
        <div className="flex items-center justify-center p-10">
          <div className="text-center">
            <Clock className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p>Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <NavBar />

      <Card className="mx-10">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Application Requests ({userData?.applyData?.length || 0})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your pending requests
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {!userData?.applyData || userData.applyData.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No pending requests</p>
              <p className="text-sm text-muted-foreground">
                You don't have any requests at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userData.applyData
                .filter(
                  (applicant: people) => !rejectedApplicants.has(applicant._id),
                )
                .map((applicant: people) => {
                  const isAccepted = acceptedApplicants.has(applicant._id);

                  return (
                    <Card
                      key={applicant._id}
                      className={`border-l-4 ${isAccepted ? "border-l-green-500" : "border-l-blue-500"}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={applicant.avatar || "/default-avatar.png"}
                              alt={applicant.name}
                            />
                            <AvatarFallback className="text-sm">
                              {applicant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">
                                {applicant.name}
                              </h3>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  isAccepted
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {isAccepted ? "Accepted" : "Pending"}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate mb-2">
                              {applicant.email}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{applicant.posts || 0} posts</span>
                              <span>
                                {userData.followersData?.length || 0} followers
                              </span>
                              <span>
                                {userData.followingData?.length || 0} following
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {isAccepted ? (
                              <Button
                                size="sm"
                                variant="default"
                                className="border-blue-600 hover:bg-blue-700"
                                onClick={() => handleMessage(applicant)}
                              >
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Message
                              </Button>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() =>
                                    handleAcceptApplication(applicant._id)
                                  }
                                >
                                  <UserCheck className="w-4 h-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleRejectApplication(applicant._id)
                                  }
                                >
                                  <UserX className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Apply;
