import { create } from "zustand";
import toast from "react-hot-toast";

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
  sortBy: "recently-active", // "recently-active", "newest", "largest", "alphabetical"

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setFilters: (filters) => set({ filters }),
  
  setSortBy: (sort) => set({ sortBy: sort }),
  
  setSelectedGroup: (group) => set({ selectedGroup: group }),

  // API calls (to be implemented with actual endpoints)
  getMyGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      // const res = await axiosInstance.get("/groups/my-groups");
      // set({ myGroups: res.data });
      
      // Mock data for development
      set({
        myGroups: [
          {
            _id: "1",
            name: "Computer Science Group",
            description: "Discussions about CS fundamentals and algorithms",
            avatar: null,
            memberCount: 24,
            topicsCount: 5,
            privacy: "public",
            isActive: true,
            createdAt: new Date("2024-01-15"),
          },
          {
            _id: "2",
            name: "Medicine Study Circle",
            description: "Collaborative learning for medical students",
            avatar: "https://via.placeholder.com/200?text=MED",
            memberCount: 18,
            topicsCount: 3,
            privacy: "private",
            isActive: true,
            createdAt: new Date("2024-02-01"),
          },
          {
            _id: "3",
            name: "Law Review Sessions",
            description: "Preparation for law exams and case studies",
            avatar: "https://via.placeholder.com/200?text=LAW",
            memberCount: 12,
            topicsCount: 4,
            privacy: "public",
            isActive: false,
            createdAt: new Date("2024-01-20"),
          },
        ],
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  getDiscoveredGroups: async () => {
    set({ isDiscoveryLoading: true });
    try {
      // const res = await axiosInstance.get("/groups/discover");
      // set({ discoveredGroups: res.data });

      // Mock data
      set({
        discoveredGroups: [
          {
            _id: "4",
            name: "Engineering Hub",
            description: "All about mechanical, electrical, and civil engineering",
            avatar: "https://via.placeholder.com/200?text=ENG",
            memberCount: 156,
            topicsCount: 12,
            privacy: "public",
            isActive: true,
            createdAt: new Date("2023-12-01"),
          },
          {
            _id: "5",
            name: "Mathematics Mastery",
            description: "From calculus to linear algebra and beyond",
            avatar: "https://via.placeholder.com/200?text=MATH",
            memberCount: 89,
            topicsCount: 8,
            privacy: "public",
            isActive: true,
            createdAt: new Date("2023-11-15"),
          },
          {
            _id: "6",
            name: "Physics Discussion",
            description: "Quantum mechanics, thermodynamics, and more",
            avatar: "https://via.placeholder.com/200?text=PHY",
            memberCount: 67,
            topicsCount: 6,
            privacy: "public",
            isActive: true,
            createdAt: new Date("2023-10-20"),
          },
          {
            _id: "7",
            name: "Chemistry Lab Partners",
            description: "Collaborate on experiments and theory",
            avatar: "https://via.placeholder.com/200?text=CHEM",
            memberCount: 43,
            topicsCount: 5,
            privacy: "public",
            isActive: true,
            createdAt: new Date("2023-09-10"),
          },
          {
            _id: "8",
            name: "Business Strategy Club",
            description: "Case studies and business problem solving",
            avatar: "https://via.placeholder.com/200?text=BIZ",
            memberCount: 92,
            topicsCount: 7,
            privacy: "public",
            isActive: true,
            createdAt: new Date("2023-08-05"),
          },
          {
            _id: "9",
            name: "History & Humanities",
            description: "Explore history, literature, and philosophy",
            avatar: "https://via.placeholder.com/200?text=HIST",
            memberCount: 54,
            topicsCount: 9,
            privacy: "public",
            isActive: true,
            createdAt: new Date("2023-07-15"),
          },
        ],
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch groups");
    } finally {
      set({ isDiscoveryLoading: false });
    }
  },

  getGroupInvites: async () => {
    set({ isInvitesLoading: true });
    try {
      // const res = await axiosInstance.get("/groups/invites");
      // set({ groupInvites: res.data });

      // Mock data
      const invites = [
          {
            _id: "10",
            name: "Advanced Python Course",
            description: "Deep dive into Python for data science",
            avatar: "https://via.placeholder.com/200?text=PY",
            memberCount: 34,
            invitedBy: "Alex Johnson",
            invitedByAvatar: null,
            createdAt: new Date("2024-02-20"),
            joinPolicy: "requires approval",
          },
          {
            _id: "11",
            name: "Web Development Bootcamp",
            description: "Frontend, backend, and full-stack development",
            avatar: "https://via.placeholder.com/200?text=WEB",
            memberCount: 78,
            invitedBy: "Sarah Chen",
            invitedByAvatar: "https://via.placeholder.com/50?text=SC",
            createdAt: new Date("2024-02-18"),
            joinPolicy: "instant join",
          },
        ];
      set({
        groupInvites: invites,
        inviteCount: invites.length,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch invites");
    } finally {
      set({ isInvitesLoading: false });
    }
  },

  getInviteCount: async () => {
    try {
      // const res = await axiosInstance.get("/groups/invites/count");
      // set({ inviteCount: res.data.count });

      // Mock data
      const mockInvites = [
      { _id: "10" },
      { _id: "11" },
    ];

    set({ inviteCount: mockInvites.length });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch invite count");
    }
  },

  getGroupSchedule: async () => {
    set({ isScheduleLoading: true });
    try {
      // const res = await axiosInstance.get("/groups/schedule");
      // set({ groupSchedule: res.data });

      // Mock data
      const schedules = [
          {
            _id: "12",
            name: "Weekly Math Review",
            description: "Review of key concepts and practice problems",
            avatar: "https://via.placeholder.com/200?text=MATH",
            scheduledTime: new Date("2024-03-15T18:00"),
            duration: 60,
            attendeesCount: 45,
          },
          {
            _id: "13",
            name: "Physics Lab Session",
            description: "Hands-on experiments and data analysis",
            avatar: "https://via.placeholder.com/200?text=PHY",
            scheduledTime: new Date("2024-03-16T19:30"),
            duration: 90,
            attendeesCount: 32,
          },
        ];
      set({
        groupSchedule: schedules,
        scheduleCount: schedules.length,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch schedule");
    } finally {
      set({ isScheduleLoading: false });
    }
  },

  getScheduleCount: async () => {
    try {
      // const res = await axiosInstance.get("/groups/schedule/count");
      // set({ scheduleCount: res.data.count });

      // Mock data
      const mockSchedule = [
        { _id: "12" },
        { _id: "13" },
      ];

      set({ scheduleCount: mockSchedule.length });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch schedule count");
    }
  },

  

  // eslint-disable-next-line no-unused-vars
  createGroup: async (_groupData) => {
    try {
      // const res = await axiosInstance.post("/groups", _groupData);
      // set((state) => ({ myGroups: [...state.myGroups, res.data] }));
      toast.success("Group created successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create group");
    }
  },

  // eslint-disable-next-line no-unused-vars
  joinGroup: async (_groupId) => {
    try {
      // await axiosInstance.post(`/groups/${_groupId}/join`);
      toast.success("Group joined successfully!");
      // Refetch to update UI
      get().getDiscoveredGroups();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to join group");
    }
  },

  // eslint-disable-next-line no-unused-vars
  leaveGroup: async (_groupId) => {
    try {
      // await axiosInstance.post(`/groups/${_groupId}/leave`);
      toast.success("Left group successfully");
      get().getMyGroups();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to leave group");
    }
  },

  // eslint-disable-next-line no-unused-vars
  acceptInvite: async (_groupId) => {
    try {
      // await axiosInstance.post(`/groups/${_groupId}/accept-invite`);
      toast.success("Invite accepted!");
      get().getGroupInvites();
      get().getMyGroups();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to accept invite");
    }
  },

  // eslint-disable-next-line no-unused-vars
  rejectInvite: async (_groupId) => {
    try {
      // await axiosInstance.post(`/groups/${_groupId}/reject-invite`);
      toast.success("Invite rejected");
      get().getGroupInvites();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reject invite");
    }
  },
}));
