import { EllipsisVerticalIcon, Users, Folder, Flame } from "lucide-react";
import { useCallback, useState } from "react"; 
import useClickOutside from "../../../hooks/useClickOutside";
import { useRef } from "react";

export function GroupCard({
  group,
  onOpen,
  onJoin,
  isMember = false,
  isPending = false,
}) {
 
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const closeMenu = useCallback(() => setShowMenu(false), []);
  useClickOutside(menuRef, closeMenu, showMenu);

  if (!group) return null;

   const actionType = isPending
    ? "pending"
    : isMember
    ? "member"
    : "join";

  return (
    <div
    
      className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-105 scale-100
      }`}
    >
      {/* Top Row - Avatar, Name, Privacy Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden border border-indigo-500/30">
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

          {/* Name & Privacy */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-100 truncate line-clamp-2">
              {group.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  group.privacy === "public"
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "bg-slate-700/50 text-slate-300"
                }`}
              >
                {group.privacy === "public" ? "Public" : "Private"}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(prev => !prev)}
            className="p-1 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
            aria-haspopup="true"
            aria-expanded={showMenu}
          >
            <EllipsisVerticalIcon className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-slate-900 border border-slate-700 rounded-lg py-2 min-w-max z-10">
              <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 transition-colors">
                View Details
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 transition-colors">
                Report
              </button>
              {isMember && (
                <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-800 transition-colors">
                  Leave Group
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm line-clamp-2 mb-3">
        {group.description}
      </p>

      {/* Metadata Row */}
      <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          <span>{group.memberCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Folder className="w-3.5 h-3.5" />
          <span>{group.topicsCount} topics</span>
        </div>
        <div className="flex items-center gap-1">
          <Flame
            className={`w-3.5 h-3.5 ${
              group.isActive ? "text-orange-400" : "text-slate-600"
            }`}
          />
          <span>{group.isActive ? "Active" : "Inactive"}</span>
        </div>
      </div>

      {/* Action Button */}
      {actionType === "pending" && (
        <button disabled className="flex-1 px-4 py-2 bg-slate-700 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed">
          Requested
        </button>
      )}

      {actionType === "member" && (
        <button
          onClick={() => onOpen?.(group._id)}
          className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Open
        </button>
      )}

      {actionType === "join" && (
        <button
          onClick={() => onJoin?.(group._id)}
          className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Join
        </button>
      )}
          </div>
        );
      }