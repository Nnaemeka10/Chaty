import { useGroupStore } from "../useGroupStore";

const TabsNavigation = () => {
  const { activeTab, setActiveTab, inviteCount, scheduleCount } = useGroupStore();

  return (
    <div className="flex items-center justify-center sm:justify-between sm:gap-8 gap-4 mb-6 border-b border-slate-700/50 pb-0">
      {/* My Groups Tab */}
      <button
        onClick={() => setActiveTab("my-groups")}
        className={`pb-3 px-2 font-medium text-xs sm:text-sm transition-all ${
          activeTab === "my-groups"
            ? "text-indigo-400 border-b-2 border-indigo-500"
            : "text-slate-400 hover:text-slate-300"
        }`}
      >
        My Groups
      </button>

      {/* Discover Tab */}
      <button
        onClick={() => setActiveTab("discover")}
        className={`pb-3 px-2 font-medium text-xs sm:text-sm transition-all ${
          activeTab === "discover"
            ? "text-indigo-400 border-b-2 border-indigo-500"
            : "text-slate-400 hover:text-slate-300"
        }`}
      >
        Discover
      </button>

      {/* Invites Tab */}
      <button
        onClick={() => setActiveTab("invites")}
        className={`pb-3 px-2 font-medium text-xs sm:text-sm transition-all relative ${
          activeTab === "invites"
            ? "text-indigo-400 border-b-2 border-indigo-500"
            : "text-slate-400 hover:text-slate-300"
        }`}
      >
        Invites
        {inviteCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {inviteCount}
          </span>
        )}
      </button>

      {/* Schedule Tab */}
      <button
        onClick={() => setActiveTab("schedule")}
        className={`pb-3 px-2 font-medium text-xs sm:text-sm transition-all relative ${
          activeTab === "schedule"
            ? "text-indigo-400 border-b-2 border-indigo-500"
            : "text-slate-400 hover:text-slate-300"
        }`}
      >
        Schedule
        {scheduleCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {scheduleCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default TabsNavigation;
