import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoChatsFound() {
    const { setActiveTab } = useChatStore();
    
    return (
        <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
                <MessageCircleIcon className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
                <h4 className="text-slate-200 font-medium mb-1"> No Conversations Yet</h4>
                <p className="text-slate-400 text-sm px-6">Start a chat by selecting a contact or searching for users.</p>
            </div>
            <button
                onClick={ () => setActiveTab("contacts") }
                className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-sm transition-colors"
            >
                Find Contacts
            </button>
        </div>
    );
}

export default NoChatsFound;