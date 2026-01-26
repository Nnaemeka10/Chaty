import { create } from "zustand"
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create( (set, get) => ( {
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
        set( { isSoundEnabled: !get().isSoundEnabled } );
    },

    setActiveTab: (tab) => set( { activeTab: tab }),

    setSelectedUser: (selectedUser) => set( {selectedUser } ),
    
    getAllContacts: async() => {
        set ( {isUsersLoading: true } );
        try {
            const res = await axiosInstance.get( "/messages/contacts" );
            set( { allContacts: res.data });
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set ( { isUsersLoading: false } );
        }
    },

    getMyChatPartners: async() => {
       set ( {isUsersLoading: true } );
        try {
            const res = await axiosInstance.get( "/messages/chats" );
            set( { chats: res.data });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch chats")
        } finally {
            set ( { isUsersLoading: false } );
        }   
    },

    getMessagesByUserId: async(userId) => {
        set ( {isMessagesLoading: true } );
        try {
            const res = await axiosInstance.get( `/messages/${userId}` );
            set( { messages: res.data });
            return res.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch messages")
        } finally {
            set ( { isMessagesLoading: false } );
        }
    },

    sendMessage: async( messageData ) => {
        const { selectedUser, messages} = get();
        const {authUser} = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isOptimistic: true,
        };

        set( { messages: [ ...messages, optimisticMessage ] } );

        try {
            const res = await axiosInstance.post( `/messages/send/${selectedUser._id}`, messageData );
            set( { messages: [ ...messages, res.data ] } );

        } catch (error) {
            set({ messages: messages});
            toast.error(error?.response?.data?.message || "Failed to send message")
        }
    },

    subscribeToNewMessages: () => {
        const { selectedUser, isSoundEnabled } = get();

        if(!selectedUser) return;

        const socket  = useAuthStore.getState().socket;

        socket.on( "newMessage", ( newMessage ) => {
            const isMessageSentForSelectedUser = newMessage.senderId === selectedUser._id;

            if ( !isMessageSentForSelectedUser ) return;


            const currentMessages = get().messages;
            set( { messages: [ ...currentMessages, newMessage ]  } );

            if( isSoundEnabled ) {
                const notificationSound = new Audio( "/notification_sound.mp3" );

                notificationSound.currentTime = 0;
                notificationSound.play().catch( (error) => {
                    console.error("Failed to play notification sound:", error);
                } );
            }
        } );
    },

    unsubscribeFromNewMessages: () => {
        const socket  = useAuthStore.getState().socket;
        socket.off( "newMessage" );
    },

} ) )