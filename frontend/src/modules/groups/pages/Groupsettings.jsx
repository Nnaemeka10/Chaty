import { useParams, useNavigate } from "react-router";
import { ArrowLeftIcon, SettingsIcon, UsersIcon, MessageSquareIcon } from "lucide-react";
import { useGroupStore } from "../useGroupStore";
import { useEffect } from "react";

const GroupSettings = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { selectedGroup, myGroups } = useGroupStore();

  // Find the group from the store
  // change this later to fetch the group details using the groupId from the backend in case the user refreshes the page or directly lands on the group page via a link, since in those cases the selectedGroup in the store would be null and we won't have the group details to display, so we need to fetch it using the groupId from the URL, and we can keep the selectedGroup in the store for quick access when navigating within the app without refreshing
  const group = selectedGroup || myGroups.find((g) => g._id === groupId);

  useEffect(() => {
    // Redirect if group not found
    if (!group && !selectedGroup) {
      navigate("/");
    }
  }, [group, selectedGroup, navigate]);

  if (!group) {
    return (
      <div className="w-full max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-slate-400">Loading group...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen p-4">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-slate-100 transition-all mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Lobby
        </button>
      </div>

      {/* Group Header Card */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          {/* Group Avatar */}
          <div className="sm:w-24 sm:h-24 w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden border border-indigo-500/30">
            {group.avatar ? (
              <img
                src={group.avatar}
                alt={group.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-indigo-400 font-semibold text-4xl">
                {group.name[0].toUpperCase()}
              </span>
            )}
          </div>

          {/* Group Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <h1 className="sm:text-3xl text-lg font-bold text-slate-100 truncate">
                {group.name}
              </h1>
              <span
                className={`text-[0.6rem] sm:text-xs font-medium px-2 sm:px-3 py-1 rounded-full whitespace-nowrap ${
                  group.privacy === "public"
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "bg-slate-700/50 text-slate-300"
                }`}
              >
                {group.privacy === "public" ? "Public" : "Private"}
              </span>
            </div>
            <p className="text-slate-400 mb-4">
              {group.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4" />
                <span>{group.memberCount} members</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquareIcon className="w-4 h-4" />
                <span>{group.topicsCount} topics</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="text-sm sm:text-md px-4 sm:px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notice Board */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">
              Notice Board
            </h2>
            <p className="text-slate-400 leading-relaxed">
              { group.noticeBoard.length > 0 ? (
                group.noticeBoard.map(notice => (
                  <div key={notice._id} className="mb-2 last:mb-0">
                    {notice.content}
                  </div>
                ))
              ) : (
                "No notices yet. Group admins can post important updates here."
              )}
            </p>
            <p className="text-slate-500 text-sm mt-4">
              Created on {new Date(group.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Discussions Placeholder */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">
              Discussions
            </h2>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquareIcon className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-slate-400">
                No discussions yet. Start one to get the conversation going!
              </p>
            </div>
          </div>

          {/* Resources Placeholder */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">
              Resources
            </h2>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl">📚</span>
              </div>
              <p className="text-slate-400">
                No resources shared yet. Share study materials with members.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Members Placeholder */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">
              Members
            </h2>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <span className="text-sm font-semibold text-indigo-400">
                      M{i + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200">
                      Member {i + 1}
                    </p>
                    <p className="text-xs text-slate-500">Placeholder</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors">
              View All Members
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-3">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg text-sm font-medium transition-colors">
                Invite Members
              </button>
              <button className="w-full px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors">
                Notifications
              </button>
              <button className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg text-sm font-medium transition-colors">
                Leave Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSettings;
