import { EditIcon, Trash2Icon, PinIcon } from "lucide-react";

const MessageActions = ({ message, onEdit, onDelete, onPin }) => {
  return (
    <div className="absolute right-0 top-full mt-2 bg-slate-900 border border-slate-700/50 rounded-lg shadow-lg overflow-hidden z-50 w-48 animate-in fade-in zoom-in-95 duration-200">
      <button
        onClick={onEdit}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-slate-100 text-sm text-left"
      >
        <EditIcon className="w-4 h-4" />
        Edit Message
      </button>

      <button
        onClick={onPin}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-slate-100 text-sm text-left"
      >
        <PinIcon className="w-4 h-4" />
        {message.isPinned ? "Unpin" : "Pin"} Message
      </button>

      <div className="border-t border-slate-700/50" />

      <button
        onClick={onDelete}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300 text-sm text-left"
      >
        <Trash2Icon className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
};

export default MessageActions;
