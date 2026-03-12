import { useNavigate } from "react-router";
import { useSettingsStore } from "../useSettingsStore";
import ProfilePic from "../../users/components/ProfilePic";
import {
  ArrowLeftIcon,
  Moon,
  Sun,
  Bell,
  Music,
  Mail,
} from "lucide-react";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme, notifications, toggleNotification } =
    useSettingsStore();

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/")}
          className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold text-slate-100">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your account and preferences
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {/* Profile Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Profile</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ProfilePic navigateTo="/user-profile" />
              <div>
                <p className="text-sm text-slate-400">Edit your profile</p>
                <p className="text-xs text-slate-500 mt-1">
                  Update your information and picture
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/user-profile")}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            Appearance
          </h2>
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5 text-slate-400" />
                ) : (
                  <Sun className="w-5 h-5 text-slate-400" />
                )}
                <div>
                  <p className="text-sm text-slate-200">Theme</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose dark or light theme
                  </p>
                </div>
              </div>
              <div className="flex gap-2 bg-slate-700/50 rounded-lg p-1">
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-indigo-500 text-white"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setTheme("light")}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    theme === "light"
                      ? "bg-indigo-500 text-white"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  Light
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            Notifications
          </h2>
          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-200">Email Notifications</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Receive email updates
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleNotification("email")}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  notifications.email ? "bg-indigo-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    notifications.email ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-200">Push Notifications</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Get push alerts on your device
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleNotification("push")}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  notifications.push ? "bg-indigo-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    notifications.push ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Message Sounds */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-200">Message Sounds</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Play sound for new messages
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleNotification("messageSounds")}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  notifications.messageSounds ? "bg-indigo-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    notifications.messageSounds ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Placeholders for Future Features */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 border-dashed rounded-xl p-6 opacity-50">
          <h2 className="text-lg font-semibold text-slate-100 mb-2">
            Privacy & Security
          </h2>
          <p className="text-xs text-slate-500">
            Coming soon... More settings to be implemented
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 border-dashed rounded-xl p-6 opacity-50">
          <h2 className="text-lg font-semibold text-slate-100 mb-2">
            Account Management
          </h2>
          <p className="text-xs text-slate-500">
            Coming soon... Delete account, export data, etc.
          </p>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium transition-colors"
        >
          Back to Groups
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
