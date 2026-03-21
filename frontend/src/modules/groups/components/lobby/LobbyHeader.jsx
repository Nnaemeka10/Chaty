import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeftIcon,
  SearchIcon,
  MoreVerticalIcon,
  SettingsIcon,
  LogOutIcon,
  UsersIcon,
} from "lucide-react";
import useClickOutside from "../../../../hooks/useClickOutside";
import { useAuthStore } from "../../../auth/useAuthStore";

const TAB_SEARCH_CONFIG = {
  chat: {
    label: "Chat",
    placeholder: "Search messages...",
    searchButtonLabel: "Search messages",
    showSearch: true,
  },
  inbox: {
    label: "Inbox",
    placeholder: "Search inbox conversations...",
    searchButtonLabel: "Search inbox",
    showSearch: true,
  },
  call: {
    label: "Call",
    showSearch: false,
  },
  resources: {
    label: "Resources",
    placeholder: "Search resources...",
    searchButtonLabel: "Search resources",
    showSearch: true,
  },
  schedule: {
    label: "Schedule",
    placeholder: "Search schedule...",
    searchButtonLabel: "Search schedule",
    showSearch: true,
  },
  settings: {
    label: "Settings",
    showSearch: false,
  },
};

const LobbyHeader = ({ group, activeTab, searchQuery, onSearchQueryChange }) => {
  const navigate = useNavigate();
  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const [showMenu, setShowMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef(null);
  const closeMenu = () => setShowMenu(false);
  useClickOutside(menuRef, closeMenu, showMenu);

  const activeTabConfig = TAB_SEARCH_CONFIG[activeTab] || TAB_SEARCH_CONFIG.chat;
  const membersCount = group?.memberCount || group?.members?.length || 0;
  const activeMembersCount = useMemo(() => {
    if (!group?.members?.length) {
      return membersCount;
    }

    return group.members.reduce((count, member) => {
      if (onlineUsers.includes(member.userId)) {
        return count + 1;
      }

      return count;
    }, 0);
  }, [group?.members, membersCount, onlineUsers]);

  const activeSummary = useMemo(() => {
    if (activeTab === "chat") {
      return `${activeMembersCount} active now`;
    }

    if (activeTab === "inbox") {
      return "Private chats";
    }

    return activeTabConfig.label;
  }, [activeMembersCount, activeTab, activeTabConfig.label]);

  const handleToggleSearch = () => {
    if (!activeTabConfig.showSearch) return;

    setIsSearchOpen((currentValue) => {
      const nextValue = !currentValue;
      if (!nextValue) {
        onSearchQueryChange("");
      }
      return nextValue;
    });
  };

  if (!group) return null;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-0 sm:px-6 py-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
        {/* Left: Back button + Group info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={() => navigate("/")}
            className="flex-shrink-0 p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
            title="Back to Groups"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>

          {/* Group Avatar */}
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 overflow-hidden">
            {group.avatar ? (
              <img
                src={group.avatar}
                alt={group.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-indigo-400 font-semibold text-lg">
                {group.name[0].toUpperCase()}
              </span>
            )}
          </div>

          {/* Group Info */}
            <div className="min-w-0 flex-1">
            <h1 className="text-xs sm:text-lg font-semibold text-slate-100 truncate">
              {group.name}
            </h1>
            <div className="flex items-center gap-2">
              <span
                className={`text-[0.6rem] sm:text-xs px-2 py-0.5 rounded-full ${
                  group.privacy === "public"
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "bg-slate-700/50 text-slate-300"
                }`}
              >
                {group.privacy === "public" ? "Public" : "Private"}
              </span>
              <span className="text-[0.6rem] sm:text-xs text-slate-400 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                {activeSummary}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Search, Members, Options */}
          <div className="flex items-center gap-1 flex-shrink-0">
          {/* Search Button */}
            {activeTabConfig.showSearch && (
              <button
                onClick={handleToggleSearch}
                className={`p-1 sm:p-2.5 rounded-lg transition-colors ${
                  isSearchOpen || searchQuery
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                }`}
                title={activeTabConfig.searchButtonLabel}
              >
                <SearchIcon className="w-5 h-5" />
              </button>
            )}

          {/* Active Members Button */}
            <button
              className="hidden sm:flex items-center gap-2 px-3 py-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200 text-sm"
              title="Members"
            >
              <UsersIcon className="w-4 h-4" />
              <span>{activeTab === "chat" ? activeMembersCount : membersCount}</span>
            </button>

          {/* Options Menu Button */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 sm:p-2.5 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
                title="Options"
              >
                <MoreVerticalIcon className="w-5 h-5" />
              </button>

            {/* Dropdown Menu */}
              {showMenu && (
                <div className="lobby-header-menu absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700/50 rounded-lg shadow-lg overflow-hidden z-50">
                  <button
                    onClick={() => {
                      navigate(`/group/${group._id}/settings`);
                      closeMenu();
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-slate-100 text-sm"
                  >
                    <SettingsIcon className="w-4 h-4" />
                    Group Settings
                  </button>
                  <div className="border-t border-slate-700/50" />
                  <button
                    onClick={() => {
                      // TODO: Implement leave group
                      closeMenu();
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-500/10 transition-colors text-red-300 hover:text-red-200 text-sm"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    Leave Group
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {activeTabConfig.showSearch && isSearchOpen && (
          <div className="pl-2 sm:pl-0">
            <div className="flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-900/50 px-3 py-2">
              <SearchIcon className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
                placeholder={activeTabConfig.placeholder}
                className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LobbyHeader;
