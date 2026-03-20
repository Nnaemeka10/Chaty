import { useCallback } from "react";
import { useChatStore } from "../store/useChatStore";

export const useGroupChat = (groupId) => {
  const {
    groupMessages,
    getGroupMessages,
    isGroupMessagesLoading,
    sendGroupMessage,
    editGroupMessage,
    deleteGroupMessage,
    reactToMessage,
    togglePinMessage,
    markMessageAsRead,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
    emitTyping,
    typingUsers,
    groupMembers,
    setGroupMembers,
    initiateGroupChatWithUser,
  } = useChatStore();

  const loadMessages = useCallback(async () => {
    if (groupId) {
      await getGroupMessages(groupId);
    }
  }, [groupId, getGroupMessages]);

  const sendMessage = useCallback(
    async (messageData) => {
      if (groupId) {
        await sendGroupMessage(groupId, messageData);
      }
    },
    [groupId, sendGroupMessage]
  );

  const editMessage = useCallback(
    async (messageId, newText) => {
      if (groupId) {
        await editGroupMessage(groupId, messageId, newText);
      }
    },
    [groupId, editGroupMessage]
  );

  const deleteMessage = useCallback(
    async (messageId) => {
      if (groupId) {
        await deleteGroupMessage(groupId, messageId);
      }
    },
    [groupId, deleteGroupMessage]
  );

  const addReaction = useCallback(
    async (messageId, emoji) => {
      if (groupId) {
        await reactToMessage(groupId, messageId, emoji);
      }
    },
    [groupId, reactToMessage]
  );

  const pinMessage = useCallback(
    async (messageId, isPinned) => {
      if (groupId) {
        await togglePinMessage(groupId, messageId, isPinned);
      }
    },
    [groupId, togglePinMessage]
  );

  const markAsRead = useCallback(
    async (messageId) => {
      if (groupId) {
        await markMessageAsRead(groupId, messageId);
      }
    },
    [groupId, markMessageAsRead]
  );

  const emitUserTyping = useCallback(
    (username) => {
      if (groupId) {
        emitTyping(groupId, username);
      }
    },
    [groupId, emitTyping]
  );

  const startPersonalChat = useCallback(
    (userId, userData) => {
      initiateGroupChatWithUser(userId, userData);
    },
    [initiateGroupChatWithUser]
  );

  return {
    groupMessages,
    isGroupMessagesLoading,
    typingUsers,
    groupMembers,
    loadMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    pinMessage,
    markAsRead,
    emitUserTyping,
    setGroupMembers,
    startPersonalChat,
    subscribe: () => subscribeToGroupMessages(groupId),
    unsubscribe: () => unsubscribeFromGroupMessages(groupId),
  };
};
