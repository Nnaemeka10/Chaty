import  { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const { 
    selectedUser, 
    messages, 
    getMessagesByUserId, 
    isMessagesLoading,
    subscribeToNewMessages,
    unsubscribeFromNewMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  
  useEffect( () => {
    getMessagesByUserId( selectedUser?._id );

    subscribeToNewMessages()

    return () => unsubscribeFromNewMessages();
  }, [ selectedUser, getMessagesByUserId, subscribeToNewMessages, unsubscribeFromNewMessages ] );

  useEffect( () => {
    if ( messageEndRef.current ) {
        messageEndRef.current.scrollIntoView( { behavior: "smooth" } );
    } 
    }, [ messages ] );

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6"> 
            {messages.map( ( message ) => (
              <div 
                key={ message._id }
                className= {`chat ${ message.senderId === authUser._id ? "chat-end" : "chat-start" }`}
              >
                <div className={`chat-bubble relative ${ message.senderId === authUser._id ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200" }`}>
                  { message.image && (
                    <img 
                      src={ message.image }
                      alt="Sent image"
                      className="rounded-lg h-48 object-cover" /> 
                  )}

                  { message.text && (
                    <p className="mt-2">{ message.text }</p>
                  )}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    { new Date( message.createdAt ).toLocaleTimeString( undefined, { hour: "2-digit", minute: "2-digit" } ) }
                  </p>
                </div>
              </div>
            ) )}
            <div ref={messageEndRef}/>
          </div>
        ): isMessagesLoading ? <MessagesLoadingSkeleton /> : (
          <NoChatHistoryPlaceholder name={ selectedUser?.username || "user" } />
        )}
      </div>

      <MessageInput />
    </>
  )
}

export default ChatContainer