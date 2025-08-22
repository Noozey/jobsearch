import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/users";
import { NavBar } from "./navbar";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import {
  Search,
  Users,
  Mail,
  MapPin,
  ArrowLeft,
  UserPlus,
  UserCheck,
  Clock,
  Star,
  Award,
} from "lucide-react";

const Professionals = () => {
  const { user } = useUser();
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  console.log("pro", professionals);
  // Fetch all professionals (only those with skills)
  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/data");
      if (response.data && response.data.users) {
        // Filter to only include users who have skills
        const professionalsWithSkills = response.data.users.filter(
          (user) =>
            user.skills && Array.isArray(user.skills) && user.skills.length > 0,
        );
        setProfessionals(professionalsWithSkills);
        setFilteredProfessionals(professionalsWithSkills);
      }
    } catch (error) {
      console.error("Error fetching professionals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter professionals based on search
  useEffect(() => {
    const filtered = professionals.filter(
      (prof) =>
        prof.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.skills?.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
    setFilteredProfessionals(filtered);
  }, [searchTerm, professionals]);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  // Handle follow action
  const handleFollow = async (professionalId) => {
    if (!user?._id) return;

    setActionLoading(true);
    try {
      await api.post("/users/follow", {
        sendReqId: professionalId,
        userId: user._id,
      });

      // Refresh the selected professional's data
      if (selectedProfessional?._id === professionalId) {
        const response = await api.get("/users", {
          params: { id: professionalId },
        });
        setSelectedProfessional(response.data);
      }

      // Show success message or update UI
      console.log("Follow request sent successfully");
    } catch (error) {
      console.error("Error following professional:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle apply action
  const handleApply = async (professionalId) => {
    if (!user?._id) return;

    setActionLoading(true);
    try {
      await api.post("/users/apply", {
        sendReqId: user._id,
        userId: professionalId,
      });

      // Refresh the selected professional's data
      if (selectedProfessional?._id === professionalId) {
        const response = await api.get("/users", {
          params: { id: professionalId },
        });
        setSelectedProfessional(response.data);
      }

      console.log("Application sent successfully");
    } catch (error) {
      console.error("Error applying to professional:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Check relationship status
  const getRelationshipStatus = (professional) => {
    if (!user?._id || !professional) return null;

    const userId = user._id.toString();
    const isFollowing =
      professional.followerList && professional.followerList[userId];
    const hasApplied = professional.apply && professional.apply[userId];
    const isFollower =
      professional.followingList && professional.followingList[userId];

    return {
      isFollowing,
      hasApplied,
      isFollower,
    };
  };

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading professionals...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto p-4">
        {!selectedProfessional ? (
          // Main Professionals List View
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-4 flex items-center">
                <Users className="w-8 h-8" />
                Professionals Directory
              </h1>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search professionals by name, skills, or bio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-center">
              {filteredProfessionals.map((professional) => {
                const relationship = getRelationshipStatus(professional);
                const isCurrentUser =
                  user?._id === professional._id?.toString();

                return (
                  <Card
                    key={professional._id}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-200 h-[350px] flex flex-col items-center justify-center"
                    onClick={() => setSelectedProfessional(professional)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="w-16 h-16 mb-4">
                          <AvatarImage src={professional.avatar} />
                          <AvatarFallback className="text-lg">
                            {professional.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>

                        <h3 className="font-semibold text-lg mb-1">
                          {professional.name || "Unknown"}
                        </h3>

                        <p className="text-sm text-muted-foreground mb-3">
                          {professional.email}
                        </p>

                        {professional.bio && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {professional.bio}
                          </p>
                        )}

                        {/* Skills Preview - Always show since we filter for skills */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {professional.skills
                            .slice(0, 3)
                            .map((skill, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          {professional.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{professional.skills.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 text-center items-center justify-center w-full mb-4">
                          <div>
                            <div className="font-semibold text-sm">
                              {professional.posts || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Posts
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-sm">
                              {professional.followers?.length || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Followers
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-sm">
                              {professional.following || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Following
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {!isCurrentUser && relationship && (
                          <div className="mb-2 flex gap-2">
                            {relationship.isFollowing && (
                              <Badge variant="default" className="text-xs">
                                <UserCheck className="w-3 h-3 mr-1" />
                                Following
                              </Badge>
                            )}
                            {relationship.hasApplied && (
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                Applied
                              </Badge>
                            )}
                            {relationship.isFollower && (
                              <Badge variant="outline" className="text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                Follows You
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredProfessionals.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No professionals found
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "No professionals match your search criteria"
                    : "No professionals with skills are currently available"}
                </p>
              </div>
            )}
          </>
        ) : (
          // Professional Detail View
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setSelectedProfessional(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Professionals
            </Button>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-6 h-6" />
                    Professional Profile
                  </CardTitle>

                  {user?._id !== selectedProfessional._id?.toString() && (
                    <div className="flex gap-2">
                      {!getRelationshipStatus(selectedProfessional)
                        ?.isFollowing && (
                        <Button
                          onClick={() => handleFollow(selectedProfessional._id)}
                          disabled={actionLoading}
                          size="sm"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Follow
                        </Button>
                      )}

                      {!getRelationshipStatus(selectedProfessional)
                        ?.hasApplied && (
                        <Button
                          onClick={() => handleApply(selectedProfessional._id)}
                          disabled={actionLoading}
                          variant="outline"
                          size="sm"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Apply
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Profile Section */}
                  <div className="lg:w-1/3">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="w-24 h-24 mb-4">
                        <AvatarImage src={selectedProfessional.avatar} />
                        <AvatarFallback className="text-xl">
                          {selectedProfessional.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <h2 className="text-2xl font-bold mb-2">
                        {selectedProfessional.name}
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        {selectedProfessional.email}
                      </p>

                      {/* Stats */}
                      <div className="flex gap-6 text-center w-full mb-6">
                        <div>
                          <div className="font-semibold text-xl">
                            {selectedProfessional.posts || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Posts
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-xl">
                            {selectedProfessional.followers || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Followers
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-xl">
                            {selectedProfessional.following || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Following
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="lg:w-2/3 space-y-6">
                    {/* Bio */}
                    <div>
                      <h4 className="font-semibold text-lg mb-3">About</h4>
                      <p className="text-muted-foreground">
                        {selectedProfessional.bio || "No bio available."}
                      </p>
                    </div>

                    {/* Skills - Always available since we filter for skills */}
                    <div>
                      <h4 className="font-semibold text-lg mb-3">
                        Skills & Expertise
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfessional.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Network */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3">
                          Recent Followers
                        </h4>
                        {selectedProfessional.followersData &&
                        selectedProfessional.followersData.length > 0 ? (
                          <div className="space-y-2">
                            {selectedProfessional.followersData
                              .slice(0, 3)
                              .map((follower) => (
                                <div
                                  key={follower._id}
                                  className="flex items-center gap-2"
                                >
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={follower.avatar} />
                                    <AvatarFallback className="text-xs">
                                      {follower.name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("") || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">
                                    {follower.name}
                                  </span>
                                </div>
                              ))}
                            {selectedProfessional.followersData.length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                +{selectedProfessional.followersData.length - 3}{" "}
                                more followers
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No followers yet.
                          </p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold text-lg mb-3">
                          Applications
                        </h4>
                        {selectedProfessional.applyData &&
                        selectedProfessional.applyData.length > 0 ? (
                          <div className="space-y-2">
                            {selectedProfessional.applyData
                              .slice(0, 3)
                              .map((applicant) => (
                                <div
                                  key={applicant._id}
                                  className="flex items-center gap-2"
                                >
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={applicant.avatar} />
                                    <AvatarFallback className="text-xs">
                                      {applicant.name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("") || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">
                                    {applicant.name}
                                  </span>
                                </div>
                              ))}
                            {selectedProfessional.applyData.length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                +{selectedProfessional.applyData.length - 3}{" "}
                                more applications
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No applications received.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export { Professionals };
