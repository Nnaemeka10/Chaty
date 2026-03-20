import { useState, useRef, useEffect } from "react";
import {
  Trash2Icon,
  EditIcon,
  CheckCircle2,
  CheckIcon,
  CheckSquare2,
  PinIcon,
  EyeIcon,
  MoreVerticalIcon,
  SmileIcon,
  CheckSquare2Icon,
} from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../../auth/useAuthStore";
import MessageReactions from "./MessageReactions";
import MessageActions from "./MessageActions";
import EmojiReactionPicker from "./EmojiReactionPicker";
import useClickOutside from "../../../../hooks/useClickOutside";

const GroupMessage = ({ message, groupId, isOwnMessage }) => {
  const {
    editGroupMessage,
    deleteGroupMessage,
    reactToMessage,
    togglePinMessage,
    markMessageAsRead,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const [showActions, setShowActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showReadReceipts, setShowReadReceipts] = useState(false);
  const actionsRef = useRef(null);
  const pickerRef = useRef(null);

  useClickOutside(actionsRef, () => setShowActions(false), showActions);
  useClickOutside(pickerRef, () => setShowReactionPicker(false), showReactionPicker);

  const handleSaveEdit = async () => {
    if (editText.trim() !== message.text) {
      await editGroupMessage(groupId, message._id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this message?")) {
      await deleteGroupMessage(groupId, message._id);
    }
  };

  const handleReact = async (emoji) => {
    await reactToMessage(groupId, message._id, emoji);
    setShowReactionPicker(false);
  };

  const handlePin = async () => {
    await togglePinMessage(groupId, message._id, message.isPinned);
    setShowActions(false);
  };

  
useEffect(() => {
  if (!isOwnMessage && !message.readBy?.includes(authUser._id)) {
    markMessageAsRead(groupId, message._id);
  }
}, [isOwnMessage, message.readBy, authUser._id, groupId, message._id, markMessageAsRead]);

  const readCount = message.readBy?.length || 0;
  const unreadIndicator = message.readBy?.includes(authUser._id) ? (
    <CheckSquare2 className="w-4 h-4 text-cyan-400" />
  ) : (
    <CheckIcon className="w-4 h-4 text-slate-500" />
  );

  return (
    <div
      className={`message-group animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isOwnMessage ? "flex flex-col items-end" : "flex flex-col items-start"
      }`}
    >
      {/* Message Bubble */}
      <div
        className={`group flex items-end gap-2 ${
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Sender Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-medium text-indigo-300 border border-indigo-500/30 overflow-hidden ${
            isOwnMessage ? "order-2" : "order-1"
          }`}
          title={message.sender?.username}
        >
          {message.sender?.profilePic ? (
            <img
              src={message.sender.profilePic}
              alt={message.sender.username}
              className="w-full h-full object-cover"
            />
          ) : (
            message.sender?.username[0].toUpperCase()
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col gap-1 ${isOwnMessage ? "items-end" : "items-start"}`}>
          {/* Sender Name */}
          {!isOwnMessage && (
            <span className="text-xs font-medium text-slate-400">
              {message.sender?.username}
            </span>
          )}

          {/* Message Bubble */}
          <div
            className={`relative group/bubble max-w-xs lg:max-w-md px-4 py-2 rounded-2xl transition-all duration-200 ${
              isOwnMessage
                ? "bg-indigo-600 text-white rounded-br-none"
                : "bg-slate-800/80 text-slate-200 rounded-bl-none border border-slate-700/50"
            } ${isEditing ? "ring-2 ring-yellow-400" : ""}`}
          >
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className={`w-full bg-opacity-30 bg-black border border-opacity-50 rounded px-2 py-1 text-sm ${
                    isOwnMessage
                      ? "border-white text-white placeholder-blue-100"
                      : "border-slate-600 text-slate-200 placeholder-slate-500"
                  }`}
                  autoFocus
                />
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={handleSaveEdit}
                    className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditText(message.text);
                    }}
                    className={`px-2 py-1 rounded transition-colors ${
                      isOwnMessage
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-red-700/50 hover:bg-red-700"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Image */}
                {message.image && (
                  <div className="mb-2 rounded-lg overflow-hidden max-w-full">
                    <img
                      src={message.image}
                      alt="Message attachment"
                      className="max-h-64 max-w-xs object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* File */}
                {message.file && (
                  <div className="mb-2 p-3 bg-opacity-20 bg-white rounded-lg flex items-center gap-2">
                    <span className="text-lg">📎</span>
                    <a
                      href={message.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline hover:opacity-80 transition-opacity"
                    >
                      {message.file.split("/").pop()}
                    </a>
                  </div>
                )}

                {/* Text */}
                {message.text && (
                  <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
                )}

                {/* Edited Badge */}
                {message.isEdited && (
                  <span className="text-xs opacity-75 ml-2">(edited)</span>
                )}

                {/* Pinned Badge */}
                {message.isPinned && (
                  <div className="flex items-center gap-1 text-xs opacity-75 mt-1">
                    <PinIcon className="w-3 h-3" />
                    Pinned
                  </div>
                )}
              </>
            )}

            {/* Hover Actions */}
            <div
              className={`absolute -top-10 right-0 flex items-center gap-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-200 ${
                isOwnMessage ? "right-auto" : ""
              }`}
            >
              {/* Reaction Button */}
              <div className="relative" ref={pickerRef}>
                <button
                  onClick={() => setShowReactionPicker(!showReactionPicker)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isOwnMessage
                      ? "hover:bg-indigo-700"
                      : "hover:bg-slate-700/50 text-slate-300"
                  }`}
                  title="Add reaction"
                >
                  <SmileIcon className="w-4 h-4" />
                </button>

                {showReactionPicker && (
                  <EmojiReactionPicker
                    onSelect={handleReact}
                    isOwnMessage={isOwnMessage}
                  />
                )}
              </div>

              {/* More Actions */}
              {isOwnMessage && (
                <div className="relative" ref={actionsRef}>
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="p-1.5 hover:bg-indigo-700 rounded-lg transition-colors"
                    title="More options"
                  >
                    <MoreVerticalIcon className="w-4 h-4" />
                  </button>

                  {showActions && (
                    <MessageActions
                      message={message}
                      onEdit={() => {
                        setIsEditing(true);
                        setShowActions(false);
                      }}
                      onDelete={handleDelete}
                      onPin={handlePin}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Message Meta */}
          <div
            className={`flex items-center gap-2 text-xs ${
              isOwnMessage
                ? "flex-row-reverse justify-end text-slate-400"
                : "text-slate-500"
            }`}
          >
            <span>
              {new Date(message.createdAt).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            {isOwnMessage && (
              <div className="flex items-center gap-1">
                {readCount > 0 ? (
                  <button
                    onClick={() => setShowReadReceipts(!showReadReceipts)}
                    className="flex items-center gap-0.5 hover:text-slate-300 transition-colors relative"
                    title={`Read by ${readCount}`}
                  >
                    <CheckSquare2Icon className="w-3.5 h-3.5" />
                    {showReadReceipts && (
                      <div className="absolute -bottom-10 right-0 bg-slate-900 border border-slate-700/50 rounded-lg px-2 py-1 w-32 text-left whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-200">
                        <p className="text-slate-300">Read by {readCount}</p>
                      </div>
                    )}
                  </button>
                ) : (
                  unreadIndicator
                )}
              </div>
            )}
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <MessageReactions
              reactions={message.reactions}
              onRemoveReaction={(emoji) =>
                reactToMessage(groupId, message._id, emoji)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupMessage;
