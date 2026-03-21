export const groupQueryKeys = {
  all: ["groups"],
  myGroups: (params = {}) => [...groupQueryKeys.all, "myGroups", params],
  discoveredGroups: (params = {}) => [...groupQueryKeys.all, "discoveredGroups", params],
  invites: () => [...groupQueryKeys.all, "invites"],
  schedule: () => [...groupQueryKeys.all, "schedule"],
};
