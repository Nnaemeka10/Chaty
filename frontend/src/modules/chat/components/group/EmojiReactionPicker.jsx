const EMOJIS = [
  "👍",
  "❤️",
  "😂",
  "😮",
  "😢",
  "🔥",
  "🎉",
  "🚀",
  "👏",
  "💯",
  "⭐",
  "👌",
];

const EmojiReactionPicker = ({ onSelect, isOwnMessage }) => {
  return (
    <div
      className={`absolute top-full mt-1 bg-slate-900 border border-slate-700/50 rounded-lg shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-200 w-fit ${
        isOwnMessage ? "right-0" : "left-0"
      }`}
    >
      <div className="flex flex-wrap gap-1 max-w-xs">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="w-8 h-8 rounded-lg hover:bg-slate-700/50 flex items-center justify-center text-lg hover:scale-125 transition-transform duration-150 active:scale-95"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiReactionPicker;
