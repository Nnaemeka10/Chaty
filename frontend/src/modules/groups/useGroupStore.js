import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";

// Helper to navigate to group page
export const navigateToGroup = (navigate, groupId) => {
  navigate(`/group/${groupId}`);
};

export const useGroupStore = create((set, get) => ({
  // State
  groups: [],
  myGroups: [],
  discoveredGroups: [],
  groupInvites: [],
  inviteCount: 0,
  groupSchedule: [],
  scheduleCount: 0,
  selectedGroup: null,
  activeTab: "my-groups", // "my-groups", "discover", "invites", "schedule"
  isGroupsLoading: false,
  isDiscoveryLoading: false,
  isInvitesLoading: false,
  isScheduleLoading: false,
  
  // Search & Filter
  searchQuery: "",
  filters: {
    category: "all",
    memberCount: "all",
    activity: "all",
    privacy: "all",
  },
  sortBy: "recently-active",

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setFilters: (filters) => set({ filters }),
  
  setSortBy: (sort) => set({ sortBy: sort }),
  
  setSelectedGroup: (group) => set({ selectedGroup: group }),

  /**
   * Get all groups where user is a member
   * Calls: GET /api/groups/my-groups
   */
  getMyGroups: async (page = 1, limit = 50) => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups/my-groups", {
        params: { page, limit },
      });
      set({ myGroups: res.data.groups || res.data });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch your groups"
      );
      set({ myGroups: [] });
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  /**
   * Get public groups user can join
   * Calls: GET /api/groups/discover
   */
  getDiscoveredGroups: async (page = 1, limit = 50) => {
    set({ isDiscoveryLoading: true });
    try {
      const res = await axiosInstance.get("/groups/discover", {
        params: { page, limit },
      });
      set({ discoveredGroups: res.data.groups || res.data });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to discover groups"
      );
      set({ discoveredGroups: [] });
    } finally {
      set({ isDiscoveryLoading: false });
    }
  },

  /**
   * Get pending group invitations
   * Calls: GET /api/groups/invites
   */
  getGroupInvites: async () => {
    set({ isInvitesLoading: true });
    try {
      const res = await axiosInstance.get("/groups/invites");
      const invites = res.data.invites || res.data || [];
      set({
        groupInvites: invites,
        inviteCount: invites.length,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch invitations"
      );
      set({ groupInvites: [], inviteCount: 0 });
    } finally {
      set({ isInvitesLoading: false });
    }
  },

  /**
   * Get invite count
   * Calls: GET /api/groups/invites
   */
  getInviteCount: async () => {
    try {
      const res = await axiosInstance.get("/groups/invites");
      const invites = res.data.invites || res.data || [];
      set({ inviteCount: invites.length });
    } catch (error) {
      console.error("Failed to fetch invite count:", error);
    }
  },

  /**
   * Get scheduled sessions in user's groups
   * Calls: GET /api/groups/schedule
   */
  getGroupSchedule: async () => {
    set({ isScheduleLoading: true });
    try {
      const res = await axiosInstance.get("/groups/schedule");
      const schedules = res.data.schedules || res.data || [];
      set({
        groupSchedule: schedules,
        scheduleCount: schedules.length,
      });
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
      set({ groupSchedule: [], scheduleCount: 0 });
    } finally {
      set({ isScheduleLoading: false });
    }
  },

  /**
   * Get schedule count
   * Calls: GET /api/groups/schedule
   */
  getScheduleCount: async () => {
    try {
      const res = await axiosInstance.get("/groups/schedule");
      const schedules = res.data.schedules || res.data || [];
      set({ scheduleCount: schedules.length });
    } catch (error) {
      console.error("Failed to fetch schedule count:", error);
    }
  },

  /**
   * Create a new group
   * User creating the group becomes admin automatically
   * Calls: POST /api/groups
   */
  createGroup: async (groupData, navigate) => {
    try {
      const res = await axiosInstance.post("/groups", groupData);
      const newGroup = res.data;

      set((state) => ({ myGroups: [...state.myGroups, newGroup] }));
      toast.success("Group created successfully!");

      if (navigate) {
        navigateToGroup(navigate, newGroup._id);
      }

      return newGroup;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create group"
      );
      throw error;
    }
  },

  /**
   * Join a public group
   * Calls: POST /api/groups/:id/join
   */
  joinGroup: async (groupId, navigate) => {
    try {
      const res = await axiosInstance.post(`/groups/${groupId}/join`);
      const joinedGroup = res.data;

      // Update local state
      set((s) => ({
        myGroups: [...s.myGroups, joinedGroup],
        discoveredGroups: s.discoveredGroups.filter(g => g._id !== groupId),
      }));

      toast.success("Group joined successfully!");

      if (navigate) {
        navigateToGroup(navigate, groupId);
      }

      return joinedGroup;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to join group"
      );
      throw error;
    }
  },

  /**
   * Leave a group
   * Calls: POST /api/groups/:id/leave
   */
  leaveGroup: async (groupId) => {
    try {
      await axiosInstance.post(`/groups/${groupId}/leave`);

      // Update local state
      set((s) => ({
        myGroups: s.myGroups.filter(g => g._id !== groupId),
      }));

      toast.success("Left group successfully");
      
      // Refetch to ensure consistency
      await get().getMyGroups();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to leave group"
      );
      throw error;
    }
  },

  /**
   * Open group - navigate to group page
   */
  openGroup: (groupId, navigate) => {
    if (navigate) {
      navigateToGroup(navigate, groupId);
    }
  },

  /**
   * Accept a group invitation
   * Calls: POST /api/groups/:id/accept-invite
   */
  acceptInvite: async (groupId, navigate) => {
    try {
      const res = await axiosInstance.post(`/groups/${groupId}/accept-invite`);
      const acceptedGroup = res.data.group || res.data;

      // Update local state
      set((s) => ({
        myGroups: [...s.myGroups, acceptedGroup],
        groupInvites: s.groupInvites.filter(g => g._id !== groupId),
        inviteCount: Math.max(0, s.inviteCount - 1),
      }));

      toast.success("Invitation accepted!");

      if (navigate) {
        navigateToGroup(navigate, groupId);
      }

      return acceptedGroup;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to accept invitation"
      );
      throw error;
    }
  },

  /**
   * Reject a group invitation
   * Calls: POST /api/groups/:id/reject-invite
   */
  rejectInvite: async (groupId) => {
    try {
      await axiosInstance.post(`/groups/${groupId}/reject-invite`);

      // Update local state
      set((s) => ({
        groupInvites: s.groupInvites.filter(g => g._id !== groupId),
        inviteCount: Math.max(0, s.inviteCount - 1),
      }));

      toast.success("Invitation rejected");
      
      // Refetch to ensure consistency
      await get().getGroupInvites();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to reject invitation"
      );
      throw error;
    }
  },
}));
