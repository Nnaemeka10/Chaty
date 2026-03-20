import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../../auth/useAuthStore";
import { useGroupStore } from "../../../groups/useGroupStore";
import GroupChatHeader from "./GroupChatHeader";
import GroupMessageInput from "./GroupMessageInput";
import MessagesLoadingSkeleton from "../single/MessagesLoadingSkeleton";
import GroupMessage from "./GroupMessage";
import TypingIndicator from "./TypingIndicator";
import PinnedMessagesBar from "./PinnedMessagesBar";
import MediaGallery from "./MediaGallery";
import { SearchIcon, ImageIcon } from "lucide-react";

const GroupChatContainer = ({ groupId }) => {
  const {
    groupMessages,
    getGroupMessages,
    isGroupMessagesLoading,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
    groupMembers,
    typingUsers,
  } = useChatStore();
  
  const { authUser } = useAuthStore();
  const { selectedGroup } = useGroupStore();
  const messageEndRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch messages on mount
  useEffect(() => {
    if (groupId) {
      getGroupMessages(groupId);
    }
  }, [groupId, getGroupMessages]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (groupId) {
      subscribeToGroupMessages(groupId);
      return () => unsubscribeFromGroupMessages(groupId);
    }
  }, [groupId, subscribeToGroupMessages, unsubscribeFromGroupMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupMessages]);

  // Filter messages on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = groupMessages.filter(
        (msg) =>
          msg.text?.toLowerCase().includes(query) ||
          msg.sender?.username?.toLowerCase().includes(query)
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(groupMessages);
    }
  }, [searchQuery, groupMessages]);

  const messagesDisplay = searchQuery.trim() ? filteredMessages : groupMessages;
//   const hasImages = messagesDisplay.some((msg) => msg.image);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowMediaGallery(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm">
      {/* Pinned Messages Bar */}
      {groupMessages.some((m) => m.isPinned) && (
        <PinnedMessagesBar messages={groupMessages} />
      )}

      {/* Header */}
      <GroupChatHeader group={selectedGroup} groupMembers={groupMembers} />

      {/* Search Bar */}
      {showSearch && (
        <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/30 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <SearchIcon className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoFocus
            />
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchQuery("");
              }}
              className="text-xs px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
          </div>
          {searchQuery.trim() && (
            <p className="text-xs text-slate-400 mt-2">
              Found {filteredMessages.length} message{filteredMessages.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isGroupMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messagesDisplay.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {messagesDisplay.map((message) => (
              <div
                key={message._id}
                onClick={() => {
                  if (message.image) {
                    const imageIndex = messagesDisplay.findIndex((m) => m.image && m._id === message._id);
                    handleImageClick(imageIndex);
                  }
                }}
              >
                <GroupMessage
                  message={message}
                  groupId={groupId}
                  isOwnMessage={message.senderId === authUser?._id}
                />
              </div>
            ))}

            {/* Typing Indicator */}
            {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}

            <div ref={messageEndRef} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20 mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-slate-400 text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <GroupMessageInput groupId={groupId} onShowSearch={() => setShowSearch(!showSearch)} />

      {/* Media Gallery Modal */}
      {showMediaGallery && (
        <MediaGallery
          messages={messagesDisplay}
          initialImageIndex={selectedImageIndex}
          onClose={() => setShowMediaGallery(false)}
        />
      )}
    </div>
  );
};

export default GroupChatContainer;
