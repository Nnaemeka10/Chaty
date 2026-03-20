const TypingIndicator = ({ users }) => {
  if (!users || users.length === 0) return null;

  const userList = users.map((u) => u.username).join(", ");
  const isMultiple = users.length > 1;

  return (
    <div className="flex items-center gap-2 px-4 py-2 mb-2 animate-in fade-in duration-300">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
      </div>
      <span className="text-xs text-slate-400">
        {userList} {isMultiple ? "are" : "is"} typing...
      </span>
    </div>
  );
};

export default TypingIndicator;
