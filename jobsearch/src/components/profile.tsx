import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/users";
import { NavBar } from "./navbar";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Pencil, Check, X, Plus, Trash2 } from "lucide-react";

const Profile = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [newSkill, setNewSkill] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [updateError, setUpdateError] = useState("");

  const getUser = async () => {
    if (!user?._id) return;
    try {
      const res = await api.get("/users", {
        params: { id: user._id },
      });
      console.log(res.data);
      const userData = res.data;
      setUserData(userData);
      setEditData({
        name: userData.name || "",
        email: userData.email || "",
        avatar: userData.avatar || "",
        bio: userData.bio || "",
        skills: userData.skills || [],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfile = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      // Only send fields that have changed and are not empty
      const updatePayload = {};

      // Check each field for changes and non-empty values
      if (editData.name !== userData.name && editData.name.trim()) {
        updatePayload.name = editData.name.trim();
      }

      if (editData.email !== userData.email && editData.email.trim()) {
        updatePayload.email = editData.email.trim();
      }

      if (editData.avatar !== userData.avatar) {
        updatePayload.avatar = editData.avatar; // Can be empty to clear avatar
      }

      if (editData.bio !== userData.bio) {
        updatePayload.bio = editData.bio; // Can be empty to clear bio
      }

      // Always send skills if they changed (backend will handle empty array)
      const originalSkills = userData.skills || [];
      const newSkills = editData.skills || [];
      if (
        JSON.stringify(originalSkills.sort()) !==
        JSON.stringify(newSkills.sort())
      ) {
        updatePayload.skills = newSkills;
      }

      // If no changes detected
      if (Object.keys(updatePayload).length === 0) {
        setIsEditing(false);
        return;
      }

      const res = await api.put(`/users/${user._id}`, updatePayload);

      if (res.data.success) {
        // Update local state with the returned user data
        setUserData(res.data.data);
        setEditData({
          name: res.data.data.name || "",
          email: res.data.data.email || "",
          avatar: res.data.data.avatar || "",
          bio: res.data.data.bio || "",
          skills: res.data.data.skills || [],
        });
        setIsEditing(false);

        // Show success message with updated fields
        if (res.data.updatedFields) {
          setUpdateSuccess(
            `Successfully updated: ${res.data.updatedFields.join(", ")}`,
          );
          setTimeout(() => setUpdateSuccess(""), 3000); // Clear after 3 seconds
        }
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      // Show error message to user
      const errorMessage =
        err.response?.data?.message || "Failed to update profile";
      setUpdateError(errorMessage);
      setTimeout(() => setUpdateError(""), 5000); // Clear after 5 seconds
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !editData.skills.includes(newSkill.trim())) {
      setEditData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
      setIsAddingSkill(false);
    }
  };

  const removeSkill = (skillToRemove) => {
    setEditData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setUpdateError(""); // Clear any error messages
    setUpdateSuccess(""); // Clear any success messages
    setEditData({
      name: userData.name || "",
      email: userData.email || "",
      avatar: userData.avatar || "",
      bio: userData.bio || "",
      skills: userData.skills || [],
    });
    setNewSkill("");
    setIsAddingSkill(false);
  };

  useEffect(() => {
    getUser();
  }, [user?._id]);

  if (!userData) {
    return (
      <div>
        <NavBar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  const followersCount = userData.followersData?.length || 0;
  const followingCount = userData.followingData?.length || 0;
  const postsCount = userData.posts || 0;

  return (
    <div>
      <NavBar />
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Success/Error Messages */}
        {updateSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {updateSuccess}
          </div>
        )}
        {updateError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {updateError}
          </div>
        )}

        {/* Main Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" onClick={updateProfile} disabled={loading}>
                  <Check className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelEdit}
                  disabled={loading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center  gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center justify-center  text-center ">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage
                    src={isEditing ? editData.avatar : userData.avatar}
                  />
                  <AvatarFallback className="text-xl">
                    {(isEditing ? editData.name : userData.name)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                {isEditing ? (
                  <div className="w-[300px] space-y-3">
                    <div>
                      <Input
                        placeholder="Avatar URL (leave empty to remove)"
                        value={editData.avatar}
                        onChange={(e) =>
                          handleInputChange("avatar", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Full Name"
                        value={editData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Email"
                        type="email"
                        value={editData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-xl">{userData.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {userData.email}
                    </p>
                  </>
                )}

                {/* Stats */}
                <div className="flex gap-6 justify-center items-center text-center w-full mt-4">
                  <div>
                    <div className="font-semibold text-lg">{postsCount}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      {followersCount}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Followers
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      {followingCount}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Following
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio and Skills */}
              <div className="flex-1 space-y-6 flex flex-col items-center justify-center ">
                {/* Bio Section */}
                <div>
                  <h4 className="font-semibold mb-3 w-full text-center">
                    About
                  </h4>
                  {isEditing ? (
                    <Textarea
                      placeholder="Tell us about yourself... (leave empty to remove)"
                      value={editData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                      className="resize-none w-[300px]"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {userData.bio || "No bio available yet."}
                    </p>
                  )}
                </div>

                {/* Skills Section */}
                <div>
                  <div className="flex items-center justify-between mb-3 ">
                    <h4 className="font-semibold text-center w-full">
                      Skills & Expertise
                    </h4>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddingSkill(true)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Skill
                      </Button>
                    )}
                  </div>

                  {/* Add New Skill Input */}
                  {isAddingSkill && (
                    <div className="flex gap-2 mb-3">
                      <Input
                        placeholder="Enter a skill..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      />
                      <Button size="sm" onClick={addSkill}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsAddingSkill(false);
                          setNewSkill("");
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Skills Display */}
                  <div className="flex flex-wrap gap-2">
                    {(isEditing ? editData.skills : userData.skills || []).map(
                      (skill, index) => (
                        <div key={index} className="relative group">
                          <Badge variant="secondary" className="pr-8">
                            {skill}
                            {isEditing && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-0 h-full w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeSkill(skill)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </Badge>
                        </div>
                      ),
                    )}
                    {(!userData.skills || userData.skills.length === 0) &&
                      !isEditing && (
                        <p className="text-sm text-muted-foreground">
                          No skills added yet.
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
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
              <Badge variant="secondary">+{followersCount}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { Profile };
