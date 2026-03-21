import { axiosInstance } from "../../../lib/axios";

export const groupService = {
  getMyGroups: async (params = {}) => {
    const response = await axiosInstance.get("/groups/my-groups", {
      params,
    });

    return response.data.groups || response.data || [];
  },

  getDiscoveredGroups: async (params = {}) => {
    const response = await axiosInstance.get("/groups/discover", {
      params,
    });

    return response.data.groups || response.data || [];
  },

  getGroupInvites: async () => {
    const response = await axiosInstance.get("/groups/invites");
    return response.data.invites || response.data || [];
  },

  getGroupSchedule: async () => {
    const response = await axiosInstance.get("/groups/schedule");
    return response.data.schedules || response.data || [];
  },

  createGroup: async (groupData) => {
    const response = await axiosInstance.post("/groups", groupData);
    return response.data;
  },

  joinGroup: async (groupId) => {
    const response = await axiosInstance.post(`/groups/${groupId}/join`);
    return response.data;
  },

  leaveGroup: async (groupId) => {
    const response = await axiosInstance.post(`/groups/${groupId}/leave`);
    return response.data;
  },

  acceptInvite: async (groupId) => {
    const response = await axiosInstance.post(`/groups/${groupId}/accept-invite`);
    return response.data.group || response.data;
  },

  rejectInvite: async (groupId) => {
    const response = await axiosInstance.post(`/groups/${groupId}/reject-invite`);
    return response.data;
  },
};
