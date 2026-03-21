import { queryClient } from "./queryClient";
import { chatQueryKeys } from "../modules/chat/lib/chatQueryKeys";
import {
  getEntityId,
  normalizeDirectMessage,
  normalizeGroupMessage,
  normalizeGroupReactions,
  normalizeReadBy,
  upsertMessages,
} from "../modules/chat/lib/messageUtils";

class SocketManager {
  constructor() {
    this.socket = null;
    this.authStore = null;
    this.chatStore = null;
    this.activeDirectUserId = null;
    this.activeGroupId = null;
    this.notificationAudio = null;

    this.boundHandlers = {
      onlineUsers: (userIds) => {
        this.authStore?.setState({ onlineUsers: userIds });
      },
      newMessage: (payload) => {
        const message = payload?.message || payload;
        if (!message || !this.chatStore) return;

        const normalizedMessage = normalizeDirectMessage(message);
        const selectedUserId = this.chatStore.getState().selectedUser?._id;
        const authUserId = this.authStore?.getState().authUser?._id;
        const conversationUserId = normalizedMessage.senderId === authUserId
          ? normalizedMessage.receiverId
          : normalizedMessage.senderId;

        let didInsert = false;

        queryClient.setQueryData(chatQueryKeys.directMessages(conversationUserId), (currentMessages = []) => {
          const result = upsertMessages(currentMessages, normalizedMessage);
          didInsert = result.inserted;
          return result.nextMessages;
        });

        if (selectedUserId !== conversationUserId) return;
        if (didInsert) {
          this.playNotificationSound(normalizedMessage.senderId);
        }
      },
      newGroupMessage: ({ message, groupId }) => {
        if (!message || !groupId || !this.chatStore) return;

        let didInsert = false;
        const normalizedMessage = normalizeGroupMessage({ ...message, groupId });

        queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) => {
          const result = upsertMessages(currentMessages, normalizedMessage);
          didInsert = result.inserted;
          return result.nextMessages;
        });

        if (didInsert) {
          this.playNotificationSound(normalizedMessage.senderId);
        }
      },
      messageReaction: (payload) => {
        const { messageId, reactions, groupId } = payload;

        queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) =>
          currentMessages.map((message) =>
            message._id === messageId
              ? { ...message, reactions: normalizeGroupReactions(reactions) }
              : message
          )
        );
      },
      messageEdited: (payload) => {
        const { messageId, message, groupId } = payload;

        queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) =>
          currentMessages.map((existingMessage) =>
            existingMessage._id === messageId
              ? normalizeGroupMessage({ ...existingMessage, ...message })
              : existingMessage
          )
        );
      },
      messageDeleted: (payload) => {
        const { messageId, groupId } = payload;

        queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) =>
          currentMessages.filter((message) => message._id !== messageId)
        );
      },
      messagePinned: (payload) => {
        const { messageId, isPinned, groupId } = payload;

        queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) =>
          currentMessages.map((message) =>
            message._id === messageId ? { ...message, isPinned } : message
          )
        );
      },
      messageRead: (payload) => {
        const { messageId, readBy, groupId } = payload;

        queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) =>
          currentMessages.map((message) =>
            message._id === messageId
              ? { ...message, readBy: normalizeReadBy(readBy) }
              : message
          )
        );
      },
      userTyping: (payload) => {
        if (!this.chatStore) return;
        this.chatStore.getState().applyIncomingGroupTyping(payload);
      },
    };
  }

  registerAuthStore(store) {
    this.authStore = store;
  }

  registerChatStore(store) {
    this.chatStore = store;
  }

  attachSocket(socket) {
    if (!socket) return;
    if (this.socket === socket) return;

    this.detachSocket();
    this.socket = socket;

    Object.entries(this.boundHandlers).forEach(([eventName, handler]) => {
      this.socket.on(eventName, handler);
    });

    this.syncActiveRooms();
  }

  detachSocket() {
    if (!this.socket) return;

    Object.entries(this.boundHandlers).forEach(([eventName, handler]) => {
      this.socket.off(eventName, handler);
    });

    this.socket = null;
  }

  syncActiveRooms() {
    if (!this.socket) return;

    if (this.activeDirectUserId) {
      this.socket.emit("join-dm", this.activeDirectUserId);
    }

    if (this.activeGroupId) {
      this.socket.emit("join-group", this.activeGroupId);
    }
  }

  setActiveDirectConversation(userId) {
    if (this.activeDirectUserId === userId) return;

    if (this.socket && this.activeDirectUserId) {
      this.socket.emit("leave-dm", this.activeDirectUserId);
    }

    this.activeDirectUserId = userId || null;

    if (this.socket && this.activeDirectUserId) {
      this.socket.emit("join-dm", this.activeDirectUserId);
    }
  }

  clearActiveDirectConversation(userId) {
    if (!this.activeDirectUserId) return;
    if (userId && this.activeDirectUserId !== userId) return;

    if (this.socket) {
      this.socket.emit("leave-dm", this.activeDirectUserId);
    }

    this.activeDirectUserId = null;
  }

  setActiveGroupConversation(groupId) {
    if (this.activeGroupId === groupId) return;

    if (this.socket && this.activeGroupId) {
      this.socket.emit("leave-group", this.activeGroupId);
    }

    this.activeGroupId = groupId || null;

    if (this.socket && this.activeGroupId) {
      this.socket.emit("join-group", this.activeGroupId);
    }
  }

  clearActiveGroupConversation(groupId) {
    if (!this.activeGroupId) return;
    if (groupId && this.activeGroupId !== groupId) return;

    if (this.socket) {
      this.socket.emit("leave-group", this.activeGroupId);
    }

    this.activeGroupId = null;
  }

  emitGroupTyping(payload) {
    if (!this.socket) return;
    this.socket.emit("group-typing", payload);
  }

  playNotificationSound(senderId) {
    const authUserId = this.authStore?.getState().authUser?._id;
    const isSoundEnabled = this.chatStore?.getState().isSoundEnabled;
    const normalizedSenderId = getEntityId(senderId);

    if (!isSoundEnabled || !normalizedSenderId || normalizedSenderId === authUserId) return;

    if (!this.notificationAudio) {
      this.notificationAudio = new Audio("/notification_sound.mp3");
    }

    this.notificationAudio.currentTime = 0;
    this.notificationAudio.play().catch((error) => {
      console.error("Failed to play notification sound:", error);
    });
  }
}

export const socketManager = new SocketManager();
