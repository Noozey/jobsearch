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
import { Pencil, Check, X, Plus, Trash2, Camera, Upload } from "lucide-react";
import type { User } from "@/types/user";
const Profile = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<User>();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [newSkill, setNewSkill] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUpdateError("Please select a valid image file");
        setTimeout(() => setUpdateError(""), 3000);
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUpdateError("Image size must be less than 5MB");
        setTimeout(() => setUpdateError(""), 3000);
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile || !user?._id) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const res = await api.post(`/users/upload-avatar/${user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        // Update both userData and editData with new avatar URL
        const newAvatarUrl = res.data.avatarUrl;
        setUserData((prev) => ({ ...prev, avatar: newAvatarUrl }));
        setEditData((prev) => ({ ...prev, avatar: newAvatarUrl }));

        setUpdateSuccess("Avatar uploaded successfully!");
        setTimeout(() => setUpdateSuccess(""), 3000);

        // Clear file selection and preview
        setSelectedFile(null);
        setPreviewUrl("");

        // Clear file input
        const fileInput = document.getElementById("avatar-upload");
        if (fileInput) fileInput.value = "";
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to upload image";
      setUpdateError(errorMessage);
      setTimeout(() => setUpdateError(""), 5000);
    } finally {
      setUploadingImage(false);
    }
  };

  const clearImageSelection = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    const fileInput = document.getElementById("avatar-upload");
    if (fileInput) fileInput.value = "";
  };

  const updateProfile = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const updatePayload = {};

      if (editData.name !== userData.name && editData.name.trim()) {
        updatePayload.name = editData.name.trim();
      }

      if (editData.email !== userData.email && editData.email.trim()) {
        updatePayload.email = editData.email.trim();
      }

      if (editData.avatar !== userData.avatar) {
        updatePayload.avatar = editData.avatar;
      }

      if (editData.bio !== userData.bio) {
        updatePayload.bio = editData.bio;
      }

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
    clearImageSelection(); // Clear any pending image selection
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
          <CardContent className="p-6 flex items-center justify-center w-full">
            <div className="flex flex-col items-center justify-center gap-6 w-full">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center justify-center text-center w-full">
                {/* Avatar Section */}
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={
                        previewUrl ||
                        (isEditing ? editData.avatar : userData.avatar)
                      }
                    />
                    <AvatarFallback className="text-xl">
                      {(isEditing ? editData.name : userData.name)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2">
                      <label htmlFor="avatar-upload">
                        <div className="bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                          <Camera className="w-4 h-4" />
                        </div>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Image Upload Controls */}
                {isEditing && selectedFile && (
                  <div className="mb-4 p-3 border border-dashed border-gray-300 rounded-lg bg-secondary">
                    <div className="text-sm text-gray-600 mb-2">
                      Selected: {selectedFile.name}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={uploadImage}
                        disabled={uploadingImage}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        {uploadingImage ? "Uploading..." : "Upload"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearImageSelection}
                        disabled={uploadingImage}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                    </div>
                  </div>
                )}

                {isEditing ? (
                  <div className="w-[70%] space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Avatar URL (optional)
                      </label>
                      <Input
                        placeholder="Or paste an image URL here"
                        value={editData.avatar}
                        onChange={(e) =>
                          handleInputChange("avatar", e.target.value)
                        }
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Upload an image above or paste a URL here
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Full Name *
                      </label>
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
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Email *
                      </label>
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
              <div className="flex-1 space-y-6 flex flex-col items-center justify-center w-full">
                {/* Bio Section */}
                <div className="w-full flex flex-col items-center justify-center">
                  <h4 className="font-semibold mb-3 w-full text-center">
                    About
                  </h4>
                  {isEditing ? (
                    <div className="space-y-1 w-full flex flex-col items-center justify-center">
                      <Textarea
                        placeholder="Tell us about yourself..."
                        value={editData.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        rows={4}
                        className="resize-none w-[70%] "
                      />
                      <p className="text-xs text-gray-500">
                        Leave empty to remove bio
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {userData.bio || "No bio available yet."}
                    </p>
                  )}
                </div>

                {/* Skills Section */}
                <div>
                  <div className="flex items-center justify-between mb-3 gap-4">
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
                  <div className="flex flex-wrap gap-2 justify-center">
                    {(isEditing ? editData.skills : userData.skills || []).map(
                      (skill, index) => (
                        <div key={index} className="relative group">
                          <Badge
                            variant="secondary"
                            className={isEditing ? "pr-8" : ""}
                          >
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
