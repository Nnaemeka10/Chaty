import { useEffect } from "react"
import { useChatStore } from "../store/useChatStore"
import UsersLoadingSkeleton from "./UsersLoadingSkeleton"
import NoChatsFound from "./NoChatsFound"
import { useAuthStore } from "../store/useAuthStore"

const ChatsList = () => {
  const { chats, isUsersLoading, getMyChatPartners, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect( () => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) {
    return <UsersLoadingSkeleton />
  }

  if (chats.length === 0) {
    return <NoChatsFound />
  }
  
  return (
    <>
      {chats.map( (chat) => (
        <div 
          key={ chat._id }
          onClick={ () => setSelectedUser(chat) }
          className="p-4 bg-cyan-500/10 rounded-lg hover:bg-slate-500/20 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${ onlineUsers.includes(chat._id) ? "online" : "offline" }`}>
              <div className="size-12 rounded-full">
                <img src={chat.profilePic || "/avatar.png"} alt={chat.username} />
              </div>
            </div>

            <h4 className="text-slate-200 font-medium truncate">{chat.username}</h4>
          </div>
        </div>
      )) }
    </>
  );
}

export default ChatsList