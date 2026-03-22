import { useEffect, useRef } from "react";
import { useGroupStore } from "../useGroupStore";
import { useGetGroupInvites, useGetGroupSchedule } from "../hooks/useGroups";

const GROUP_TABS = [
  { id: "my-groups", label: "My Groups" },
  { id: "discover", label: "Discover" },
  { id: "invites", label: "Invites" },
  { id: "schedule", label: "Schedule" },
];

const TabsNavigation = ({ onTabChange }) => {
  const activeTab = useGroupStore((state) => state.activeTab);
  const setActiveTab = useGroupStore((state) => state.setActiveTab);
  const { data: groupInvites = [] } = useGetGroupInvites();
  const { data: groupSchedule = [] } = useGetGroupSchedule();
  const tabsContainerRef = useRef(null);
  const inviteCount = groupInvites.length;
  const scheduleCount = groupSchedule.length;
  const handleTabChange = (nextTab) => {
    if (nextTab === activeTab) return;

    if (onTabChange) {
      onTabChange(nextTab);
      return;
    }

    setActiveTab(nextTab);
  };

  useEffect(() => {
    const activeTabButton = tabsContainerRef.current?.querySelector(
      `[data-tab-id="${activeTab}"]`
    );

    activeTabButton?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeTab]);

  return (
    <div
      ref={tabsContainerRef}
      className="groups-tabs-scroll mb-6 flex items-center gap-3 overflow-x-auto border-b border-slate-700/50 pb-1 sm:justify-between sm:gap-8"
    >
      {GROUP_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const badgeCount = tab.id === "invites"
          ? inviteCount
          : tab.id === "schedule"
            ? scheduleCount
            : 0;

        return (
          <button
            key={tab.id}
            type="button"
            data-tab-id={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`groups-tab-pill relative shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-all sm:rounded-none sm:border-0 sm:border-b-2 sm:px-2 sm:py-3 sm:text-sm ${
              isActive
                ? "border-indigo-500/40 bg-indigo-500/15 text-indigo-300 sm:border-indigo-500 sm:bg-transparent"
                : "border-transparent bg-slate-800/40 text-slate-400 hover:border-slate-700/70 hover:bg-slate-800/70 hover:text-slate-300 sm:hover:border-slate-700/50 sm:hover:bg-transparent"
            }`}
          >
            {tab.label}
            {badgeCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {badgeCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TabsNavigation;
