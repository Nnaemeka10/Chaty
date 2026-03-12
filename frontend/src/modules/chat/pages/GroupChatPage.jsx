import { MessageCircleIcon } from "lucide-react";

const GroupChatPage = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20">
          <MessageCircleIcon className="w-10 h-10 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-100">Group Chat</h2>
        <p className="text-slate-400 max-w-sm">
          Group chat feature is coming soon. Stay tuned for real-time messaging
          with your group members.
        </p>
      </div>
    </div>
  );
};

export default GroupChatPage;
