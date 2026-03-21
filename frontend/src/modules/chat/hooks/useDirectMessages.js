import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { chatQueryKeys } from "../lib/chatQueryKeys";
import {
  normalizeDirectMessage,
  normalizeDirectMessages,
  upsertMessages,
} from "../lib/messageUtils";
import { chatService } from "../services/chatService";
import { useAuthStore } from "../../auth/useAuthStore";

export const useGetAllContacts = () =>
  useQuery({
    queryKey: chatQueryKeys.contacts(),
    queryFn: chatService.getAllContacts,
  });

export const useGetMyChatPartners = () =>
  useQuery({
    queryKey: chatQueryKeys.partners(),
    queryFn: chatService.getMyChatPartners,
  });

export const useGetMessagesByUserId = (userId) =>
  useQuery({
    queryKey: chatQueryKeys.directMessages(userId),
    queryFn: async () => {
      const messages = await chatService.getMessagesByUserId(userId);
      return normalizeDirectMessages(messages);
    },
    enabled: Boolean(userId),
  });

export const useSendMessage = (userId) => {
  const queryClient = useQueryClient();
  const authUser = useAuthStore((state) => state.authUser);

  return useMutation({
    mutationFn: async ({ text, image, clientTempId }) => {
      const response = await chatService.sendMessage(userId, {
        text,
        image,
        clientTempId: clientTempId || `temp-${Date.now()}`,
      });

      return {
        message: normalizeDirectMessage(response),
        clientTempId: clientTempId || response.clientTempId,
      };
    },
    onMutate: async (variables) => {
      if (!userId || !authUser?._id) return {};

      const clientTempId = variables.clientTempId || `temp-${Date.now()}`;
      variables.clientTempId = clientTempId;
      const optimisticMessage = normalizeDirectMessage({
        _id: clientTempId,
        clientTempId,
        senderId: authUser._id,
        receiverId: userId,
        text: variables.text,
        image: variables.image || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isOptimistic: true,
      });

      await queryClient.cancelQueries({ queryKey: chatQueryKeys.directMessages(userId) });
      const previousMessages = queryClient.getQueryData(chatQueryKeys.directMessages(userId)) || [];

      queryClient.setQueryData(chatQueryKeys.directMessages(userId), (currentMessages = []) => {
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
        queryClient.setQueryData(chatQueryKeys.directMessages(userId), context.previousMessages);
      }

      toast.error(error?.response?.data?.message || "Failed to send message");
    },
    onSuccess: ({ message }, variables, context) => {
      queryClient.setQueryData(chatQueryKeys.directMessages(userId), (currentMessages = []) => {
        const normalizedMessage = normalizeDirectMessage({
          ...message,
          clientTempId: context?.clientTempId || variables.clientTempId || message.clientTempId,
        });
        const { nextMessages } = upsertMessages(currentMessages, normalizedMessage);
        return nextMessages;
      });
    },
  });
};
