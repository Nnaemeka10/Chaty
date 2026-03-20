import { useState } from "react";
import { useChatStore }  from "../store/useChatStore";
// import { useAuthStore } from "../../../auth/useAuthStore";
import { XIcon, MessageCircleIcon } from "lucide-react";

const InboxTab = () => {
  const { groupChatPartners, removeGroupChatPartner, selectedUser, setSelectedUser } = useChatStore();
//   const { authUser } = useAuthStore();
  const [selectedInboxUser, setSelectedInboxUser] = useState(selectedUser);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSelectedInboxUser(user);
  };

  const handleRemoveChat = (userId, e) => {
    e.stopPropagation();
    removeGroupChatPartner(userId);
    if (selectedInboxUser?._id === userId) {
      setSelectedInboxUser(null);
      setSelectedUser(null);
    }
  };

  return (
    <div className="flex h-full bg-slate-900/50">
      {/* Inbox List */}
      <div className="w-full md:w-80 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-4 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-slate-100">Inbox</h2>
          <p className="text-xs text-slate-400 mt-1">
            {groupChatPartners.length} conversation{groupChatPartners.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {groupChatPartners.length > 0 ? (
            <div className="space-y-1 p-2">
              {groupChatPartners.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className={`w-full px-3 py-3 rounded-lg flex items-center gap-3 group transition-all duration-200 ${
                    selectedInboxUser?._id === user._id
                      ? "bg-indigo-600/20 border border-indigo-500/30"
                      : "hover:bg-slate-700/50 border border-transparent"
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 overflow-hidden">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-indigo-400 font-semibold text-sm">
                        {user.username[0].toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-slate-200 truncate">
                      {user.username}
                    </p>
                    <p className="text-xs text-slate-500">@{user.username}</p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemoveChat(user._id, e)}
                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-lg transition-all duration-200 text-red-400 hover:text-red-300"
                    title="Remove chat"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20 mb-4">
                <MessageCircleIcon className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-slate-400 text-sm">
                No conversations yet. Start a chat with a group member!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area - Hidden on mobile when no user selected */}
      {selectedInboxUser ? (
        <div className="hidden md:flex flex-1 flex-col">
          {/* Header */}
          <div className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 overflow-hidden">
                {selectedInboxUser.profilePic ? (
                  <img
                    src={selectedInboxUser.profilePic}
                    alt={selectedInboxUser.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-indigo-400 font-semibold">
                    {selectedInboxUser.username[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="text-slate-200 font-medium">{selectedInboxUser.username}</p>
                <p className="text-xs text-slate-400">Private chat</p>
              </div>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20 mb-4">
              <MessageCircleIcon className="w-8 h-8 text-indigo-400" />
            </div>
            <p className="text-slate-400">
              Personal chat coming soon. Messages will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-slate-900/50 text-center px-6">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20 mb-4">
            <MessageCircleIcon className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="text-slate-400">
            Select a conversation to start chatting
          </p>
        </div>
      )}
    </div>
  );
};

export default InboxTab;
