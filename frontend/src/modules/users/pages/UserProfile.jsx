import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../auth/useAuthStore";
import { useUserStore } from "../userStore";
import { ArrowLeftIcon } from "lucide-react";

const UserProfile = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { updateUserProfile, isUpdatingProfile } = useUserStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const [formData, setFormData] = useState({
    username: authUser?.username || "",
    email: authUser?.email || "",
    bio: authUser?.bio || "",
  });

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setSelectedImg(reader.result);
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    await updateUserProfile({
      ...formData,
      profilePic: selectedImg,
    });
    navigate("/settings");
    } catch (error) {
      // Error handling is done in the store, so we can just log here if needed
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/settings")}
          className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold text-slate-100">
            Edit Profile
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Update your profile information
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-6"
      >
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center pb-6 border-b border-slate-700/50">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative group mb-4"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/50">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-white text-sm font-medium">Change</span>
            </div>
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />

          <p className="text-xs text-slate-400 text-center">
            Click to upload a new profile picture
          </p>
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="Enter your username"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="Enter your email"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            placeholder="Tell us about yourself"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-700/50">
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="flex-1 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            {isUpdatingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
