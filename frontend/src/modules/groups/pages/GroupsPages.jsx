import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useGroupStore } from "../useGroupStore";
import GroupsHeader from "../components/GroupsHeader";
import SearchFilterBar from "../components/SearchFilterBar";
import TabsNavigation from "../components/TabsNavigation";
import GroupsList from "../components/GroupsList";
import InviteCard from "../components/InviteCard";
import ScheduleCard from "../components/ScheduleCard";
import GroupsLoadingSkeleton from "../components/GroupsLoadingSkeleton";
import EmptyStates from "../components/EmptyStates";
import CreateGroupModal from "../components/createGroupModal/CreateGroupModal";

const GroupsPages = () => {
  const navigate = useNavigate();
  const {
    // State
    myGroups,
    discoveredGroups,
    groupInvites,
    groupSchedule,
    activeTab,
    searchQuery,
    filters,
    sortBy,

    // Loading states
    isGroupsLoading,
    isDiscoveryLoading,
    isInvitesLoading,
    isScheduleLoading,

    // API calls
    getMyGroups,
    getDiscoveredGroups,
    getGroupInvites,
    getInviteCount,
    getGroupSchedule,
    getScheduleCount,
    joinGroup,
    acceptInvite,
    rejectInvite,
    openGroup,
  } = useGroupStore();

  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  // Fetch data on mount and when tab changes
  //later seperate the use effects for each tab and also for the counts and remove the eccess dependencies aside from active tab since zustand fxns are stable and do not trigger re-renders, there is no need to add them as dependencies, we can just disable the eslint warning for that line
  useEffect(() => {
    getInviteCount();
    getScheduleCount();

    if (activeTab === "my-groups") {
      getMyGroups();
    } else if (activeTab === "discover") {
      getDiscoveredGroups();
    } else if (activeTab === "invites") {
      getGroupInvites();
    } else if (activeTab === "schedule") {
      getGroupSchedule();
    }
  }, [activeTab, getMyGroups, getDiscoveredGroups, getGroupInvites, getGroupSchedule, getInviteCount, getScheduleCount]);

  // Filter and sort groups based on search and filters
  const filteredGroups = (groups) => {
    return groups.filter((group) => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPrivacy =
        filters.privacy === "all" || group.privacy === filters.privacy;

      const matchesMemberCount = (() => {
        if (filters.memberCount === "all") return true;
        if (filters.memberCount === "small") return group.memberCount <= 10;
        if (filters.memberCount === "medium")
          return group.memberCount > 10 && group.memberCount <= 50;
        if (filters.memberCount === "large") return group.memberCount > 50;
        return true;
      })();

      const matchesActivity =
        filters.activity === "all" ||
        (filters.activity === "active" && group.isActive) ||
        (filters.activity === "inactive" && !group.isActive);

      return (
        matchesSearch &&
        matchesPrivacy &&
        matchesMemberCount &&
        matchesActivity
      );
    });
  };

  const sortGroups = (groups) => {
    const sorted = [...groups];
    switch (sortBy) {
      case "recently-active":
        // In real app, sort by last activity
        return sorted;
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "largest":
        return sorted.sort((a, b) => b.memberCount - a.memberCount);
      case "alphabetical":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };

  const getDisplayGroups = () => {
    let groups = [];

    if (activeTab === "my-groups") {
      groups = myGroups;
    } else if (activeTab === "discover") {
      groups = discoveredGroups;
    }

    return sortGroups(filteredGroups(groups));
  };

  const displayGroups = getDisplayGroups();


  const isLoading =
    activeTab === "my-groups"
      ? isGroupsLoading
      : activeTab === "discover"
        ? isDiscoveryLoading
        : activeTab === "invites"
          ? isInvitesLoading
          : activeTab === "schedule"
            ? isScheduleLoading
            : false;

  const cardActions = {
    onOpen: (groupId) => {
      openGroup(groupId, navigate);
    },
    onJoin: (groupId) => {
      joinGroup(groupId, navigate);
    },
    onAccept: (groupId) => {
      acceptInvite(groupId, navigate);
    },
    isMember: (groupId) => myGroups.some((g) => g._id === groupId),
    isInvited: (groupId) =>
      groupInvites.some((g) => g._id === groupId),
  };

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen transition-all duration-300 p-4">
      {/* Header */}
      <GroupsHeader
        onCreateClick={() => setShowCreateModal(true)}
      />

      {/* Only show search/filters for My Groups and Discover */}
      {activeTab !== "invites" && activeTab !== "schedule" && <SearchFilterBar />}

      {/* Tabs */}
      <TabsNavigation />

      {/* Content based on active tab */}
      <div className="mt-6">
        {activeTab === "my-groups" && (
          <GroupsList
            groups={displayGroups}
            isLoading={isLoading}
            emptyStateType={
              displayGroups.length === 0 && !searchQuery
                ? "no-groups"
                : "no-search-results"
            }
            onCardAction={cardActions}
          />
        )}

        {activeTab === "discover" && (
          <GroupsList
            groups={displayGroups}
            isLoading={isLoading}
            emptyStateType="no-search-results"
            onCardAction={cardActions}
          />
        )}

        {activeTab === "invites" && (
          <>
            {isLoading ? (
              <GroupsLoadingSkeleton />
            ) : groupInvites.length === 0 ? (
              <EmptyStates type="no-invites" activeTab={activeTab} />
            ) : (
              <div className="space-y-4">
                {groupInvites.map((invite) => (
                  <InviteCard
                    key={invite._id}
                    invite={invite}
                    onAccept={acceptInvite}
                    onReject={rejectInvite}
                  />
                ))}
              </div>
            )}
          </>
        )}


        {activeTab === "schedule" && (
          <>
            {isLoading ? (
              <GroupsLoadingSkeleton />
            ) : groupSchedule.length === 0 ? (
              <EmptyStates type="no-schedule" />
            ) : (
              <div className="space-y-4">
                {groupSchedule.map((schedule) => (
                  <ScheduleCard key={schedule._id} schedule={schedule} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}

export default GroupsPages;