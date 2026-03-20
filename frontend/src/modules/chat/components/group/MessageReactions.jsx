const MessageReactions = ({ reactions, onRemoveReaction }) => {
  if (!reactions || reactions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          onClick={() => onRemoveReaction(reaction.emoji)}
          className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700/50 hover:bg-slate-700 rounded-full text-xs transition-colors group"
          title={`${reaction.users?.length || 0} reaction${
            reaction.users?.length !== 1 ? "s" : ""
          }`}
        >
          <span className="text-sm">{reaction.emoji}</span>
          <span className="text-slate-400 group-hover:text-slate-300 text-xs">
            {reaction.users?.length || 0}
          </span>
        </button>
      ))}
    </div>
  );
};

export default MessageReactions;
