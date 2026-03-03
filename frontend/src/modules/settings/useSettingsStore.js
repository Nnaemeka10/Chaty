import { create } from "zustand";
import toast from "react-hot-toast";

export const useSettingsStore = create((set) => ({
  // Settings state
  theme: localStorage.getItem("theme") || "dark", // "dark" or "light"
  notifications: {
    email: JSON.parse(localStorage.getItem("emailNotifications") ?? "true"),
    push: JSON.parse(localStorage.getItem("pushNotifications") ?? "true"),
    messageSounds: JSON.parse(localStorage.getItem("messageSounds") ?? "true"),
  },

  // Actions
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
    // Apply theme to document root here later
  },

  toggleNotification: (type) => {
    set((state) => {
      const updated = {
        ...state.notifications,
        [type]: !state.notifications[type],
      };
      localStorage.setItem(
        type === "email"
          ? "emailNotifications"
          : type === "push"
            ? "pushNotifications"
            : "messageSounds",
        JSON.stringify(updated[type])
      );
      return { notifications: updated };
    });
    toast.success("Settings updated!");
  },

  // Placeholder for future settings
  // eslint-disable-next-line no-unused-vars
  saveSettings: async (_settings) => {
    try {
      // const res = await axiosInstance.put("/settings", _settings);
      toast.success("Settings saved successfully!");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Failed to save settings");
    }
  },
}));
