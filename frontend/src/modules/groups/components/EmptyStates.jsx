import { SearchIcon, InboxIcon, UsersIcon, CalendarIcon } from "lucide-react";
import { useGroupStore } from "../useGroupStore";

const EmptyStates = ({ type }) => {
  const { setActiveTab } = useGroupStore();

  if (type === "no-groups") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/20">
          <UsersIcon className="w-10 h-10 text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-200 mb-2">No groups yet</h3>
        <p className="text-slate-400 text-center mb-6 max-w-sm">
          Create your first study group and invite others, or discover existing groups to join.
        </p>
        <button
          onClick={() => setActiveTab("discover")}
          className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
        >
          Discover Groups
        </button>
      </div>
    );
  }

  if (type === "no-search-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-slate-700/30 rounded-2xl flex items-center justify-center mb-4 border border-slate-700/50">
          <SearchIcon className="w-10 h-10 text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-200 mb-2">
          No matching groups
        </h3>
        <p className="text-slate-400 text-center mb-4 max-w-sm">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  if (type === "no-invites") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4 border border-green-500/20">
          <InboxIcon className="w-10 h-10 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-200 mb-2">
          Your inbox is clear 
        </h3>
        <p className="text-slate-400 text-center mb-6 max-w-sm">
          No pending invitations. Discover new groups or create your own.
        </p>
        <button
          onClick={() => setActiveTab("discover")}
          className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
        >
          Discover Groups
        </button>
      </div>
    );
  }

  if (type === "no-schedule") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
          <CalendarIcon className="w-10 h-10 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-200 mb-2">
          No scheduled events
        </h3>
        <p className="text-slate-400 text-center mb-6 max-w-sm">
          No upcoming study sessions scheduled. Check back soon or create one!
        </p>
        <button
          onClick={() => setActiveTab("my-groups")}
          className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
        >
          View Groups
        </button>
      </div>
    );
  }

  return null;
};

export default EmptyStates;
