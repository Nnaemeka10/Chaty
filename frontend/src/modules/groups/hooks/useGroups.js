import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { groupQueryKeys } from "../lib/groupQueryKeys";
import { groupService } from "../services/groupService";
import { useGroupStore } from "../useGroupStore";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const GROUPS_STALE_TIME = 30 * 1000;

export const useGetMyGroups = ({ page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, enabled = true } = {}) =>
  useQuery({
    queryKey: groupQueryKeys.myGroups({ page, limit }),
    queryFn: () => groupService.getMyGroups({ page, limit }),
    enabled,
    staleTime: GROUPS_STALE_TIME,
  });

export const useGetDiscoveredGroups = ({ page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, enabled = true } = {}) =>
  useQuery({
    queryKey: groupQueryKeys.discoveredGroups({ page, limit }),
    queryFn: () => groupService.getDiscoveredGroups({ page, limit }),
    enabled,
    staleTime: GROUPS_STALE_TIME,
  });

export const useGetGroupInvites = ({ enabled = true } = {}) =>
  useQuery({
    queryKey: groupQueryKeys.invites(),
    queryFn: groupService.getGroupInvites,
    enabled,
    staleTime: GROUPS_STALE_TIME,
  });

export const useGetGroupSchedule = ({ enabled = true } = {}) =>
  useQuery({
    queryKey: groupQueryKeys.schedule(),
    queryFn: groupService.getGroupSchedule,
    enabled,
    staleTime: GROUPS_STALE_TIME,
  });

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupService.createGroup,
    onSuccess: (newGroup) => {
      queryClient.setQueryData(
        groupQueryKeys.myGroups({ page: DEFAULT_PAGE, limit: DEFAULT_LIMIT }),
        (currentGroups = []) => [newGroup, ...currentGroups.filter((group) => group._id !== newGroup._id)]
      );
      queryClient.invalidateQueries({ queryKey: groupQueryKeys.all });
      toast.success("Group created successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create group");
    },
  });
};

export const useJoinGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupService.joinGroup,
    onSuccess: (joinedGroup, groupId) => {
      queryClient.setQueryData(
        groupQueryKeys.myGroups({ page: DEFAULT_PAGE, limit: DEFAULT_LIMIT }),
        (currentGroups = []) => {
          if (currentGroups.some((group) => group._id === joinedGroup._id)) {
            return currentGroups;
          }

          return [...currentGroups, joinedGroup];
        }
      );
      queryClient.setQueryData(
        groupQueryKeys.discoveredGroups({ page: DEFAULT_PAGE, limit: DEFAULT_LIMIT }),
        (currentGroups = []) => currentGroups.filter((group) => group._id !== groupId)
      );
      queryClient.invalidateQueries({ queryKey: groupQueryKeys.all });
      toast.success("Group joined successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to join group");
    },
  });
};

export const useLeaveGroup = () => {
  const queryClient = useQueryClient();
  const setSelectedGroup = useGroupStore((state) => state.setSelectedGroup);

  return useMutation({
    mutationFn: groupService.leaveGroup,
    onMutate: async (groupId) => {
      await queryClient.cancelQueries({ queryKey: groupQueryKeys.myGroups({ page: DEFAULT_PAGE, limit: DEFAULT_LIMIT }) });
      const previousGroups =
        queryClient.getQueryData(groupQueryKeys.myGroups({ page: DEFAULT_PAGE, limit: DEFAULT_LIMIT })) || [];

      queryClient.setQueryData(
        groupQueryKeys.myGroups({ page: DEFAULT_PAGE, limit: DEFAULT_LIMIT }),
        (currentGroups = []) => currentGroups.filter((group) => group._id !== groupId)
      );

      return { previousGroups, groupId };
    },
    onError: (error, _groupId, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(
          groupQueryKeys.myGroups({ page: DEFAULT_PAGE, limit: DEFAULT_LIMIT }),
          context.previousGroups
        );
      }

      toast.error(error?.response?.data?.message || "Failed to leave group");
    },
    onSuccess: (_data, groupId) => {
      setSelectedGroup((currentGroup) => (currentGroup?._id === groupId ? null : currentGroup));
      queryClient.invalidateQueries({ queryKey: groupQueryKeys.all });
      toast.success("Left group successfully");
    },
  });
};

export const useAcceptInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupService.acceptInvite,
    onMutate: async (groupId) => {
      await queryClient.cancelQueries({ queryKey: groupQueryKeys.invites() });
      const previousInvites = queryClient.getQueryData(groupQueryKeys.invites()) || [];

      queryClient.setQueryData(groupQueryKeys.invites(), (currentInvites = []) =>
        currentInvites.filter((invite) => invite._id !== groupId)
      );

      return { previousInvites };
    },
    onError: (error, _groupId, context) => {
      if (context?.previousInvites) {
        queryClient.setQueryData(groupQueryKeys.invites(), context.previousInvites);
      }

      toast.error(error?.response?.data?.message || "Failed to accept invitation");
    },
    onSuccess: (acceptedGroup) => {
      queryClient.setQueryData(
        groupQueryKeys.myGroups({ page: DEFAULT_PAGE, limit: DEFAULT_LIMIT }),
        (currentGroups = []) => {
          if (currentGroups.some((group) => group._id === acceptedGroup._id)) {
            return currentGroups;
          }

          return [...currentGroups, acceptedGroup];
        }
      );
      queryClient.invalidateQueries({ queryKey: groupQueryKeys.all });
      toast.success("Invitation accepted!");
    },
  });
};

export const useRejectInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupService.rejectInvite,
    onMutate: async (groupId) => {
      await queryClient.cancelQueries({ queryKey: groupQueryKeys.invites() });
      const previousInvites = queryClient.getQueryData(groupQueryKeys.invites()) || [];

      queryClient.setQueryData(groupQueryKeys.invites(), (currentInvites = []) =>
        currentInvites.filter((invite) => invite._id !== groupId)
      );

      return { previousInvites };
    },
    onError: (error, _groupId, context) => {
      if (context?.previousInvites) {
        queryClient.setQueryData(groupQueryKeys.invites(), context.previousInvites);
      }

      toast.error(error?.response?.data?.message || "Failed to reject invitation");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupQueryKeys.invites() });
      toast.success("Invitation rejected");
    },
  });
};
