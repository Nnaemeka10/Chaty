import { useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import {
  useDeleteMessage,
  useEditMessage,
  useGetGroupMessages,
  useMarkMessageRead,
  useReactToMessage,
  useSendGroupMessage,
  useTogglePinMessage,
} from "./useGroupMessages";

export const useGroupChat = (groupId) => {
  const {
    setActiveGroupConversation,
    clearActiveGroupConversation,
    emitTyping,
    typingUsers,
    groupMembers,
    setGroupMembers,
    initiateGroupChatWithUser,
  } = useChatStore();

  const { data: groupMessages = [], isLoading: isGroupMessagesLoading, refetch: loadMessages } = useGetGroupMessages(groupId);
  const sendGroupMessageMutation = useSendGroupMessage(groupId);
  const editMessageMutation = useEditMessage(groupId);
  const deleteMessageMutation = useDeleteMessage(groupId);
  const reactToMessageMutation = useReactToMessage(groupId);
  const togglePinMessageMutation = useTogglePinMessage(groupId);
  const markMessageReadMutation = useMarkMessageRead(groupId);

  const sendMessage = useCallback(
    async (messageData) => {
      if (groupId) {
        await sendGroupMessageMutation.mutateAsync(messageData);
      }
    },
    [groupId, sendGroupMessageMutation]
  );

  const editMessage = useCallback(
    async (messageId, newText) => {
      if (groupId) {
        await editMessageMutation.mutateAsync({ messageId, newText });
      }
    },
    [groupId, editMessageMutation]
  );

  const deleteMessage = useCallback(
    async (messageId) => {
      if (groupId) {
        await deleteMessageMutation.mutateAsync(messageId);
      }
    },
    [groupId, deleteMessageMutation]
  );

  const addReaction = useCallback(
    async (messageId, emoji) => {
      if (groupId) {
        await reactToMessageMutation.mutateAsync({ messageId, emoji });
      }
    },
    [groupId, reactToMessageMutation]
  );

  const pinMessage = useCallback(
    async (messageId, isPinned) => {
      if (groupId) {
        await togglePinMessageMutation.mutateAsync({ messageId, isPinned });
      }
    },
    [groupId, togglePinMessageMutation]
  );

  const markAsRead = useCallback(
    async (messageId) => {
      if (groupId) {
        await markMessageReadMutation.mutateAsync(messageId);
      }
    },
    [groupId, markMessageReadMutation]
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
    subscribe: () => setActiveGroupConversation(groupId),
    unsubscribe: () => clearActiveGroupConversation(groupId),
  };
};
