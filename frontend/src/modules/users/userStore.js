import { create } from "zustand";
import toast from "react-hot-toast";

export const useUserStore = create((set) => ({
  userProfile: null,
  isUserLoading: false,
  isUpdatingProfile: false,

  // Get user profile
  getUserProfile: async (userId) => {
    set({ isUserLoading: true });
    try {
      // const res = await axiosInstance.get(`/users/${userId}`);
      // set({ userProfile: res.data });

      // Mock data for development
      set({
        userProfile: {
          _id: userId,
          username: "John Doe",
          email: "john@example.com",
          profilePic: "/avatar.png",
          bio: "passionate about learning and coding",
          joinedDate: new Date("2024-01-15"),
          groups: 12,
          friends: 45,
        },
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch user profile"
      );
    } finally {
      set({ isUserLoading: false });
    }
  },

  // Update user profile
  // eslint-disable-next-line no-unused-vars
  updateUserProfile: async (_profileData) => {
    set({ isUpdatingProfile: true });
    try {
      // const res = await axiosInstance.put("/users/profile", _profileData);
      // set({ userProfile: res.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update profile"
      );
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
