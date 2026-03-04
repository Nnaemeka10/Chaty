import { useState } from "react";
import { XIcon, SearchIcon, CopyIcon, CheckIcon, UserCheckIcon, UserPlusIcon } from "lucide-react";
import toast from "react-hot-toast";

const AddMembersModal = ({ isOpen, onClose, groupId }) => {
  const [activeTab, setActiveTab] = useState("search"); // "search", "link"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [copied, setCopied] = useState(false);

  // Mock users for search
  const mockUsers = [
    { id: "1", username: "alex_tech", email: "alex@email.com", avatar: null },
    { id: "2", username: "jane_code", email: "jane@email.com", avatar: null },
    { id: "3", username: "mike_study", email: "mike@email.com", avatar: null },
    { id: "4", username: "sarah_learner", email: "sarah@email.com", avatar: null },
    { id: "5", username: "david_mind", email: "david@email.com", avatar: null },
  ];

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const inviteLink = `${window.location.origin}/group/${groupId}/invite`;

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Invite link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInviteSelected = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    try {
      // TODO: Call API to invite users
      toast.success(`Invited ${selectedUsers.length} member${selectedUsers.length > 1 ? "s" : ""}!`);
      setSelectedUsers([]);
    } catch {
      toast.error("Failed to send invites");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="w-full max-w-md max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden flex flex-col create-group-modal-content">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/30 bg-gradient-to-r from-slate-800 to-slate-900">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                🎉 Group Created!
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Add members to get started
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-700/30">
            <button
              onClick={() => setActiveTab("search")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                activeTab === "search"
                  ? "text-indigo-400 border-b-2 border-indigo-500"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <SearchIcon className="w-4 h-4 inline mr-2" />
              Search Members
            </button>
            <button
              onClick={() => setActiveTab("link")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                activeTab === "link"
                  ? "text-indigo-400 border-b-2 border-indigo-500"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <CopyIcon className="w-4 h-4 inline mr-2" />
              Invite Link
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "search" ? (
              <>
                {/* Search Input */}
                <div className="mb-4">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search by username or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* User List */}
                <div className="space-y-2 mb-4">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => toggleUser(user.id)}
                        className={`w-full p-3 rounded-lg border transition-all text-left ${
                          selectedUsers.includes(user.id)
                            ? "bg-indigo-500/10 border-indigo-500"
                            : "bg-slate-800/30 border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 border border-indigo-500/30">
                            {user.avatar ? (
                              <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                            ) : (
                              <span className="text-indigo-400 font-semibold">
                                {user.username[0].toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-100">
                              {user.username}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="w-5 h-5 rounded border-2 border-slate-600 flex items-center justify-center flex-shrink-0">
                            {selectedUsers.includes(user.id) && (
                              <CheckIcon className="w-3 h-3 text-indigo-400" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <UserPlusIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">
                        {searchQuery ? "No members found" : "Search to find members"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Selected Count */}
                {selectedUsers.length > 0 && (
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg mb-4">
                    <p className="text-sm text-indigo-100">
                      <span className="font-semibold">{selectedUsers.length}</span> member
                      {selectedUsers.length > 1 ? "s" : ""} selected
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Invite Link */}
                <div className="space-y-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-xs text-blue-200 mb-2">
                      ℹ️ Share this link with others to invite them to your group
                    </p>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="w-full pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 text-sm font-mono"
                    />
                    <button
                      onClick={copyInviteLink}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-slate-200"
                    >
                      {copied ? (
                        <CheckIcon className="w-4 h-4 text-green-400" />
                      ) : (
                        <CopyIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-200 rounded-lg text-sm font-medium transition-colors">
                      📧 Send via Email
                    </button>
                    <button className="w-full px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-200 rounded-lg text-sm font-medium transition-colors">
                      💬 Share on Social
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-slate-700/30 bg-gradient-to-t from-slate-900 to-slate-900/80">
            {activeTab === "search" ? (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-200 rounded-lg font-medium transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleInviteSelected}
                  disabled={selectedUsers.length === 0}
                  className="flex-1 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <UserCheckIcon className="w-4 h-4" />
                  Invite
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="w-full px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMembersModal;
