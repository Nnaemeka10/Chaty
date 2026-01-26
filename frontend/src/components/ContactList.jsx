import { useEffect } from "react"
import { useChatStore } from "../store/useChatStore"
import UsersLoadingSkeleton from "./UsersLoadingSkeleton"
import NoChatsFound from "./NoChatsFound"

const ContactList = () => {
  const {allContacts, isUsersLoading, getAllContacts, setSelectedUser} = useChatStore();

  useEffect( () => {
    getAllContacts();
  }, [getAllContacts]);

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
            <div className={`avatar online`}>
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