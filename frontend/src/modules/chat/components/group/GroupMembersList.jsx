import InitiateChatButton from "./InitiateChatButton";
import { CrownIcon, XIcon } from "lucide-react";

const GroupMembersList = ({
  members,
  groupId,
  currentUserIsAdmin,
  creatorId,
  currentUserId,
  onRemoveMember,
  onMakeAdmin,
}) => {
  if (!members || members.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No members yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member) => {
        const isCreator = member._id === creatorId;
        const isCurrentUser = member._id === currentUserId;
        const canManage = currentUserIsAdmin && !isCreator && !isCurrentUser;

        return (
          <div
            key={member._id}
            className="flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors group"
          >
            {/* Member Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Avatar */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 overflow-hidden">
                {member.profilePic ? (
                  <img
                    src={member.profilePic}
                    alt={member.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-indigo-400 font-semibold text-sm">
                    {member.username[0].toUpperCase()}
                  </span>
                )}
              </div>

              {/* Member Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {member.username}
                  </p>
                  
                  {/* Role Badge */}
                  {isCreator && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 rounded-full flex-shrink-0">
                      <CrownIcon className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs font-medium text-yellow-300">Admin</span>
                    </div>
                  )}
                  {member.isAdmin && !isCreator && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/20 rounded-full flex-shrink-0">
                      <CrownIcon className="w-3 h-3 text-indigo-400" />
                      <span className="text-xs font-medium text-indigo-300">Moderator</span>
                    </div>
                  )}
                  
                  {/* Current User Badge */}
                  {isCurrentUser && (
                    <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full">
                      You
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">Joined on {new Date(member.joinedAt || member.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
              {/* Message Button */}
              {!isCurrentUser && (
                <InitiateChatButton member={member} groupId={groupId} />
              )}

              {/* Admin Actions - Only for group admin */}
              {canManage && (
                <>
                  {/* Make Admin Button */}
                  {!member.isAdmin && (
                    <button
                      onClick={() => onMakeAdmin?.(member._id)}
                      className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors text-yellow-400 hover:text-yellow-300"
                      title="Make admin"
                    >
                      <CrownIcon className="w-4 h-4" />
                    </button>
                  )}

                  {/* Remove Member Button */}
                  <button
                    onClick={() => onRemoveMember?.(member._id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                    title="Remove member"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GroupMembersList;
