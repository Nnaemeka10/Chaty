import { useNavigate } from "react-router";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import { useRef, useState } from "react";
import useClickOutside from "../../../../hooks/useClickOutside";

const GroupChatHeader = ({ group, groupMembers }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const closeMenu = () => setShowMenu(false);
  useClickOutside(menuRef, closeMenu, showMenu);

  if (!group) return null;

  // Get active members count (mocked for now)
  const activeMembersCount = Math.floor(Math.random() * (group.memberCount || 0));

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Back button + Group info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={() => navigate("/")}
            className="flex-shrink-0 p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
            title="Back"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>

          {/* Group Avatar */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 overflow-hidden">
            {group.avatar ? (
              <img
                src={group.avatar}
                alt={group.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-indigo-400 font-semibold text-sm">
                {group.name[0].toUpperCase()}
              </span>
            )}
          </div>

          {/* Group Info */}
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-semibold text-slate-100 truncate">
              {group.name}
            </h1>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              {activeMembersCount} active
            </span>
          </div>
        </div>

        {/* Right: Members avatars + Menu */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Member Avatars */}
          <div className="flex -space-x-2 overflow-hidden">
            {groupMembers?.slice(0, 4).map((member) => (
              <div
                key={member._id}
                className="w-8 h-8 rounded-full border-2 border-slate-800 bg-indigo-500/20 flex items-center justify-center text-xs font-medium text-indigo-300 overflow-hidden"
                title={member.username}
              >
                {member.profilePic ? (
                  <img
                    src={member.profilePic}
                    alt={member.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  member.username[0].toUpperCase()
                )}
              </div>
            ))}
            {groupMembers?.length > 4 && (
              <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700/50 flex items-center justify-center text-xs font-medium text-slate-300">
                +{groupMembers.length - 4}
              </div>
            )}
          </div>

          {/* Options Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
              title="Options"
            >
              <MoreVerticalIcon className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700/50 rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => {
                    // TODO: View members
                    closeMenu();
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-slate-100 text-sm"
                >
                  View Members
                </button>
                <div className="border-t border-slate-700/50" />
                <button
                  onClick={() => {
                    // TODO: Mute notifications
                    closeMenu();
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-slate-100 text-sm"
                >
                  Mute Notifications
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChatHeader;
