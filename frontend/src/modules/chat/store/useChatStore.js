import { create } from "zustand";
import { socketManager } from "../../../lib/socketManager";

const typingTimeouts = new Map();

export const useChatStore = create((set, get) => ({
  activeTab: "chats",
  selectedUser: null,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
  groupMembers: [],
  typingUsers: [],
  activeGroupId: null,
  groupChatPartners: [],

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  setActiveDirectConversation: (userId) => {
    socketManager.setActiveDirectConversation(userId);
  },

  clearActiveDirectConversation: (userId) => {
    socketManager.clearActiveDirectConversation(userId);
  },

  setActiveGroupConversation: (groupId) => {
    set({ activeGroupId: groupId || null, typingUsers: [] });
    socketManager.setActiveGroupConversation(groupId);
  },

  clearActiveGroupConversation: (groupId) => {
    typingTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    typingTimeouts.clear();

    set({ activeGroupId: null, typingUsers: [] });
    socketManager.clearActiveGroupConversation(groupId);
  },

  emitTyping: (groupId, username) => {
    socketManager.emitGroupTyping({ groupId, username, timestamp: Date.now() });
  },

  applyIncomingGroupTyping: ({ userId, username, groupId }) => {
    if (groupId !== get().activeGroupId) return;

    set((state) => {
      if (state.typingUsers.some((user) => user.userId === userId)) {
        return state;
      }

      return {
        typingUsers: [...state.typingUsers, { userId, username }],
      };
    });

    const existingTimeout = typingTimeouts.get(userId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeoutId = setTimeout(() => {
      set((state) => ({
        typingUsers: state.typingUsers.filter((user) => user.userId !== userId),
      }));
      typingTimeouts.delete(userId);
    }, 3000);

    typingTimeouts.set(userId, timeoutId);
  },

  initiateGroupChatWithUser: (userId, user) => {
    const { groupChatPartners } = get();

    if (!groupChatPartners.find((existingUser) => existingUser._id === userId)) {
      set({ groupChatPartners: [...groupChatPartners, user] });
    }
  },

  removeGroupChatPartner: (userId) => {
    set((state) => ({
      groupChatPartners: state.groupChatPartners.filter((user) => user._id !== userId),
    }));
  },

  setGroupMembers: (members) => set({ groupMembers: members }),
  setTypingUsers: (users) => set({ typingUsers: users }),
}));

socketManager.registerChatStore(useChatStore);
