import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const PinnedMessagesBar = ({ messages }) => {
  const pinnedMessages = messages.filter((m) => m.isPinned);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (pinnedMessages.length === 0) return null;

  const currentMessage = pinnedMessages[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? pinnedMessages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === pinnedMessages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="bg-indigo-500/10 border-b border-indigo-500/20 px-4 py-3 animate-in fade-in duration-300">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <span className="text-xs font-semibold text-indigo-400">📌 PINNED</span>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-200 truncate">
            <span className="font-medium">{currentMessage.sender?.username}:</span>{" "}
            {currentMessage.text}
          </p>
        </div>

        {pinnedMessages.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevious}
              className="p-1 hover:bg-indigo-500/20 rounded transition-colors text-indigo-400 hover:text-indigo-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-indigo-400">
              {currentIndex + 1} / {pinnedMessages.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1 hover:bg-indigo-500/20 rounded transition-colors text-indigo-400 hover:text-indigo-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <button
          onClick={() => {
            // TODO: Close pinned messages or implement full pinned messages view
          }}
          className="p-1 hover:bg-indigo-500/20 rounded transition-colors text-indigo-400 hover:text-indigo-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PinnedMessagesBar;
