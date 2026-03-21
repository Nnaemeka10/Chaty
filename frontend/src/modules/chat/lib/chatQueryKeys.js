export const chatQueryKeys = {
  all: ["chat"],
  contacts: () => [...chatQueryKeys.all, "contacts"],
  partners: () => [...chatQueryKeys.all, "partners"],
  directMessages: (userId) => [...chatQueryKeys.all, "directMessages", userId],
  groupMessages: (groupId) => [...chatQueryKeys.all, "groupMessages", groupId],
};
