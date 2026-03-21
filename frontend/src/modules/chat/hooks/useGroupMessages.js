import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "../../auth/useAuthStore";
import { chatQueryKeys } from "../lib/chatQueryKeys";
import {
  normalizeGroupMessage,
  normalizeGroupMessages,
  normalizeGroupReactions,
  normalizeReadBy,
  upsertMessages,
} from "../lib/messageUtils";
import { chatService } from "../services/chatService";

export const useGetGroupMessages = (groupId) =>
  useQuery({
    queryKey: chatQueryKeys.groupMessages(groupId),
    queryFn: async () => {
      const response = await chatService.getGroupMessages(groupId);
      return normalizeGroupMessages(response.messages || []);
    },
    enabled: Boolean(groupId),
  });

export const useSendGroupMessage = (groupId) => {
  const queryClient = useQueryClient();
  const authUser = useAuthStore((state) => state.authUser);

  return useMutation({
    mutationFn: async ({ text, image, file, clientTempId }) => {
      const response = await chatService.sendGroupMessage(groupId, {
        text,
        image,
        file,
        clientTempId: clientTempId || `temp-${Date.now()}`,
      });

      return {
        message: normalizeGroupMessage(response),
        clientTempId: clientTempId || response.clientTempId,
      };
    },
    onMutate: async (variables) => {
      if (!groupId || !authUser?._id) return {};

      const clientTempId = variables.clientTempId || `temp-${Date.now()}`;
      variables.clientTempId = clientTempId;
      const optimisticMessage = normalizeGroupMessage({
        _id: clientTempId,
        clientTempId,
        groupId,
        senderId: authUser._id,
        sender: authUser,
        text: variables.text,
        image: variables.image || null,
        file: variables.file || null,
        reactions: [],
        readBy: [authUser._id],
        isPinned: false,
        isEdited: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isOptimistic: true,
      });

      await queryClient.cancelQueries({ queryKey: chatQueryKeys.groupMessages(groupId) });
      const previousMessages = queryClient.getQueryData(chatQueryKeys.groupMessages(groupId)) || [];

      queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) => {
        const { nextMessages } = upsertMessages(currentMessages, optimisticMessage);
        return nextMessages;
      });

      return {
        previousMessages,
        clientTempId,
      };
    },
    onError: (error, _variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), context.previousMessages);
      }

      toast.error(error?.response?.data?.message || "Failed to send message");
    },
    onSuccess: ({ message }, variables, context) => {
      queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) => {
        const normalizedMessage = normalizeGroupMessage({
          ...message,
          clientTempId: context?.clientTempId || variables.clientTempId || message.clientTempId,
        });
        const { nextMessages } = upsertMessages(currentMessages, normalizedMessage);
        return nextMessages;
      });
    },
  });
};

export const useReactToMessage = (groupId) => {
  const queryClient = useQueryClient();
  const authUser = useAuthStore((state) => state.authUser);

  return useMutation({
    mutationFn: ({ messageId, emoji }) => chatService.reactToMessage(groupId, messageId, emoji),
    onMutate: async ({ messageId, emoji }) => {
      await queryClient.cancelQueries({ queryKey: chatQueryKeys.groupMessages(groupId) });
      const previousMessages = queryClient.getQueryData(chatQueryKeys.groupMessages(groupId)) || [];

      queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) =>
        currentMessages.map((message) => {
          if (message._id !== messageId) return message;

          const existingReaction = message.reactions?.find((reaction) => reaction.emoji === emoji);
          if (!existingReaction) {
            return {
              ...message,
              reactions: [...(message.reactions || []), { emoji, users: [authUser._id] }],
            };
          }

          const hasReacted = existingReaction.users?.includes(authUser._id);

          return {
            ...message,
            reactions: message.reactions
              .map((reaction) => {
                if (reaction.emoji !== emoji) return reaction;

                const users = hasReacted
                  ? reaction.users.filter((userId) => userId !== authUser._id)
                  : [...(reaction.users || []), authUser._id];

                return {
                  ...reaction,
                  users: [...new Set(users)],
                };
              })
              .filter((reaction) => reaction.users.length > 0),
          };
        })
      );

      return { previousMessages };
    },
    onError: (error, _variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), context.previousMessages);
      }

      toast.error(error?.response?.data?.message || "Failed to react to message");
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) =>
        currentMessages.map((message) =>
          message._id === variables.messageId
            ? { ...message, reactions: normalizeGroupReactions(data.reactions) }
            : message
        )
      );
    },
  });
};

export const useEditMessage = (groupId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, newText }) => chatService.editGroupMessage(groupId, messageId, newText),
    onMutate: async ({ messageId, newText }) => {
      await queryClient.cancelQueries({ queryKey: chatQueryKeys.groupMessages(groupId) });
      const previousMessages = queryClient.getQueryData(chatQueryKeys.groupMessages(groupId)) || [];

      queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) =>
        currentMessages.map((message) =>
          message._id === messageId
            ? { ...message, text: newText, isEdited: true, updatedAt: new Date().toISOString() }
            : message
        )
      );

      return { previousMessages };
    },
    onError: (error, _variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), context.previousMessages);
      }

      toast.error(error?.response?.data?.message || "Failed to edit message");
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) =>
        currentMessages.map((message) =>
          message._id === variables.messageId
            ? normalizeGroupMessage(data)
            : message
        )
      );
    },
  });
};

export const useDeleteMessage = (groupId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId) => chatService.deleteGroupMessage(groupId, messageId),
    onMutate: async (messageId) => {
      await queryClient.cancelQueries({ queryKey: chatQueryKeys.groupMessages(groupId) });
      const previousMessages = queryClient.getQueryData(chatQueryKeys.groupMessages(groupId)) || [];

      queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) =>
        currentMessages.filter((message) => message._id !== messageId)
      );

      return { previousMessages };
    },
    onError: (error, _variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), context.previousMessages);
      }

      toast.error(error?.response?.data?.message || "Failed to delete message");
    },
  });
};

export const useTogglePinMessage = (groupId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, isPinned }) =>
      chatService.togglePinMessage(groupId, messageId, !isPinned),
    onMutate: async ({ messageId, isPinned }) => {
      await queryClient.cancelQueries({ queryKey: chatQueryKeys.groupMessages(groupId) });
      const previousMessages = queryClient.getQueryData(chatQueryKeys.groupMessages(groupId)) || [];

      queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) =>
        currentMessages.map((message) =>
          message._id === messageId ? { ...message, isPinned: !isPinned } : message
        )
      );

      return { previousMessages };
    },
    onError: (error, _variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), context.previousMessages);
      }

      toast.error(error?.response?.data?.message || "Failed to pin message");
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) =>
        currentMessages.map((message) =>
          message._id === variables.messageId ? { ...message, isPinned: data.isPinned } : message
        )
      );
    },
  });
};

export const useMarkMessageRead = (groupId) => {
  const queryClient = useQueryClient();
  const authUser = useAuthStore((state) => state.authUser);

  return useMutation({
    mutationFn: (messageId) => chatService.markMessageAsRead(groupId, messageId),
    onMutate: async (messageId) => {
      await queryClient.cancelQueries({ queryKey: chatQueryKeys.groupMessages(groupId) });
      const previousMessages = queryClient.getQueryData(chatQueryKeys.groupMessages(groupId)) || [];

      queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) =>
        currentMessages.map((message) =>
          message._id === messageId && !message.readBy?.includes(authUser._id)
            ? { ...message, readBy: [...(message.readBy || []), authUser._id] }
            : message
        )
      );

      return { previousMessages };
    },
    onError: (error, _variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), context.previousMessages);
      }

      toast.error(error?.response?.data?.message || "Failed to mark message as read");
    },
    onSuccess: (data, messageId) => {
      if (!data?.readBy) return;

      queryClient.setQueryData(chatQueryKeys.groupMessages(groupId), (currentMessages = []) =>
        currentMessages.map((message) =>
          message._id === messageId
            ? { ...message, readBy: normalizeReadBy(data.readBy) }
            : message
        )
      );
    },
  });
};
