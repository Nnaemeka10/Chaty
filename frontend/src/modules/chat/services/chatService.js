import { axiosInstance } from "../../../lib/axios";

export const chatService = {
  getAllContacts: async () => {
    const response = await axiosInstance.get("/messages/contacts");
    return response.data;
  },

  getMyChatPartners: async () => {
    const response = await axiosInstance.get("/messages/chats");
    return response.data;
  },

  getMessagesByUserId: async (userId) => {
    const response = await axiosInstance.get(`/messages/${userId}`);
    return response.data;
  },

  sendMessage: async (userId, messageData) => {
    const response = await axiosInstance.post(`/messages/send/${userId}`, messageData);
    return response.data;
  },

  getGroupMessages: async (groupId) => {
    const response = await axiosInstance.get(`/messages/group/${groupId}`);
    return response.data;
  },

  sendGroupMessage: async (groupId, messageData) => {
    const response = await axiosInstance.post(`/messages/group/${groupId}`, messageData);
    return response.data;
  },

  reactToMessage: async (groupId, messageId, emoji) => {
    const response = await axiosInstance.post(`/messages/group/${groupId}/${messageId}/react`, { emoji });
    return response.data;
  },

  editGroupMessage: async (groupId, messageId, text) => {
    const response = await axiosInstance.put(`/messages/group/${groupId}/${messageId}`, { text });
    return response.data;
  },

  deleteGroupMessage: async (groupId, messageId) => {
    const response = await axiosInstance.delete(`/messages/group/${groupId}/${messageId}`);
    return response.data;
  },

  togglePinMessage: async (groupId, messageId, isPinned) => {
    const response = await axiosInstance.post(`/messages/group/${groupId}/${messageId}/pin`, { isPinned });
    return response.data;
  },

  markMessageAsRead: async (groupId, messageId) => {
    const response = await axiosInstance.post(`/messages/group/${groupId}/${messageId}/read`);
    return response.data;
  },
};
