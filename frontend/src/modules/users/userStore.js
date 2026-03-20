import { create } from "zustand";
import toast from "react-hot-toast";
  import { axiosInstance } from "../../lib/axios.js";

export const useUserStore = create((set) => ({
  userProfile: null,
  isUserLoading: false,
  isUpdatingProfile: false,

  /**
   * Get user profile by ID
   * Calls: GET /api/users/:id
   */
  getUserProfile: async (userId) => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get(`/users/${userId}`);
      set({ userProfile: res.data });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch user profile"
      );
      set({ userProfile: null });
    } finally {
      set({ isUserLoading: false });
    }
  },

  /**
   * Update current user's profile
   * Calls: PUT /api/users/profile
   */
  updateUserProfile: async (profileData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/users/profile", profileData);
      set({ userProfile: res.data });
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
