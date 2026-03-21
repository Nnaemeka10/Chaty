import { create } from "zustand";

// Helper to navigate to group page
export const navigateToGroup = (navigate, groupId) => {
  navigate(`/group/${groupId}`);
};

export const useGroupStore = create((set) => ({
  // State
  selectedGroup: null,
  activeTab: "my-groups", // "my-groups", "discover", "invites", "schedule"
  
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
  
  setSelectedGroup: (group) =>
    set((state) => ({
      selectedGroup: typeof group === "function" ? group(state.selectedGroup) : group,
    })),
}));
