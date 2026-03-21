import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../../auth/useAuthStore";
import GroupMessageInput from "./GroupMessageInput";
import MessagesLoadingSkeleton from "../single/MessagesLoadingSkeleton";
import GroupMessage from "./GroupMessage";
import TypingIndicator from "./TypingIndicator";
import PinnedMessagesBar from "./PinnedMessagesBar";
import MediaGallery from "./MediaGallery";
import { useGetGroupMessages } from "../../hooks/useGroupMessages";

const EMPTY_MESSAGES = [];

const GroupChatContainer = ({ groupId, searchQuery = "" }) => {
  const setActiveGroupConversation = useChatStore((state) => state.setActiveGroupConversation);
  const clearActiveGroupConversation = useChatStore((state) => state.clearActiveGroupConversation);
  const typingUsers = useChatStore((state) => state.typingUsers);
  const authUser = useAuthStore((state) => state.authUser);
  const { data, isLoading: isGroupMessagesLoading } = useGetGroupMessages(groupId);
  const groupMessages = data ?? EMPTY_MESSAGES;
  const messageEndRef = useRef(null);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Activate current group for socket room updates
  useEffect(() => {
    if (groupId) {
      setActiveGroupConversation(groupId);
      return () => clearActiveGroupConversation(groupId);
    }
  }, [groupId, setActiveGroupConversation, clearActiveGroupConversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupMessages]);

  const messagesDisplay = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return groupMessages;
    }

    return groupMessages.filter(
      (message) =>
        message.text?.toLowerCase().includes(normalizedQuery) ||
        message.sender?.username?.toLowerCase().includes(normalizedQuery)
    );
  }, [groupMessages, searchQuery]);

  const pinnedMessages = useMemo(
    () => groupMessages.filter((message) => message.isPinned),
    [groupMessages]
  );

  const handleImageClick = useCallback((index) => {
    setSelectedImageIndex(index);
    setShowMediaGallery(true);
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm">
      {/* Pinned Messages Bar */}
      {pinnedMessages.length > 0 && (
        <PinnedMessagesBar messages={groupMessages} />
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
      <GroupMessageInput groupId={groupId} />

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
