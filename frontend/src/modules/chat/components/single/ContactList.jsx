import { useChatStore } from "../../store/useChatStore"
import UsersLoadingSkeleton from "../../../../components/UsersLoadingSkeleton"
import NoChatsFound from "./NoChatsFound"
import { useAuthStore } from "../../../auth/useAuthStore"
import { useGetAllContacts } from "../../hooks/useDirectMessages";

const ContactList = () => {
  const { setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { data: allContacts = [], isLoading: isUsersLoading } = useGetAllContacts();

  if (isUsersLoading) {
    return <UsersLoadingSkeleton />
  }

  if (allContacts.length === 0) {
    return <NoChatsFound />
  }

  return (
    <>
      {allContacts.map( (contact) => (
        <div 
          key={ contact._id }
          onClick={ () => setSelectedUser(contact) }
          className="p-4 bg-cyan-500/10 rounded-lg hover:bg-slate-500/20 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${ onlineUsers.includes(contact._id) ? "online" : "offline" }`}>
              <div className="size-12 rounded-full">
                <img src={contact.profilePic || "/avatar.png"} alt={contact.username} />
              </div>
            </div>

            <h4 className="text-slate-200 font-medium truncate">{contact.username}</h4>
          </div>
        </div>
      )) }
    </>
  )
} 
export default ContactList
