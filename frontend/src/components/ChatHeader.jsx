import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { XIcon, ArrowLeftIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();

    const { onlineUsers } = useAuthStore();
    const isOnline = onlineUsers.includes(selectedUser?._id);

    useEffect( () => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setSelectedUser( null );
            };
        };

        window.addEventListener( "keydown", handleEscape );

        return () => {
            window.removeEventListener( "keydown", handleEscape );
        };
    }, [ setSelectedUser ] );


  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-4 md:px-6 flex-1">
        <div className="flex items-center space-x-2 md:space-x-3">
            {/* Back button - visible only on mobile */}
            <button 
                onClick={ () => setSelectedUser( null ) }
                className="md:hidden p-1 rounded-full hover:bg-slate-700/50 transition-colors"
            >
                <ArrowLeftIcon className="w-5 h-5 text-slate-400 hover:text-slate-200" />
            </button>

            <div className={`avatar ${ isOnline ? "online" : "offline" }`}>
                <div className="w-10 md:w-12 rounded-full">
                    <img src={ selectedUser?.profilePic || "/avatar.png" } alt= {selectedUser?.username || "User avatar"} />
                </div>    
            </div>

            <div> 
                <h3 className="text-slate-200 font-medium text-sm md:text-base">{ selectedUser?.username || "Select a user" }</h3>
                <p className="text-slate-400 text-xs md:text-sm">{ isOnline ? "Online" : "Offline" }</p>
            </div>
        </div>

        {/* Close button - hidden on mobile, visible on desktop */}
        <button 
            onClick={ () => setSelectedUser( null ) }
            className="hidden md:block"
        >
            <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
        </button>
    </div>
  )
}

export default ChatHeader