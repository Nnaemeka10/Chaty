import { create } from "zustand"
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../../auth/useAuthStore";


export const useChatStore = create( (set, get) => ( {
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

    // Group chat state
    groupMessages: [],
    groupMembers: [],
    typingUsers: [],
    isGroupMessagesLoading: false,
    groupChatPartners: [], // Personal chats initiated from group

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

    // ============ GROUP CHAT METHODS ============
    
    // Get all messages for a group
    getGroupMessages: async(groupId) => {
        set( { isGroupMessagesLoading: true } );
        try {
            const res = await axiosInstance.get( `/messages/group/${groupId}` );
            set( { groupMessages: res.data.messages } );
            console.log("Fetched group messages:", res.data);
            return res.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch group messages");
        } finally {
            set( { isGroupMessagesLoading: false } );
        }
    },

    // Send message to group
    sendGroupMessage: async( groupId, messageData ) => {
        const { groupMessages } = get();
        const { authUser } = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`;

        // Optimistic update
        const optimisticMessage = {
            _id: tempId,
            groupId,
            senderId: authUser._id,
            sender: authUser,
            text: messageData.text,
            image: messageData.image || null,
            file: messageData.file || null,
            reactions: [],
            readBy: [authUser._id],
            isPinned: false,
            isEdited: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isOptimistic: true,
        };

        set( { groupMessages: [ ...groupMessages, optimisticMessage ] } );

        try {
            const res = await axiosInstance.post( `/messages/group/${groupId}`, messageData );
            // Replace optimistic message with real one
            set( { 
                groupMessages: groupMessages.map( m => m._id === tempId ? res.data : m )
            } );
        } catch (error) {
            // Remove optimistic message on error
            set( { groupMessages: groupMessages.filter( m => m._id !== tempId ) } );
            toast.error(error?.response?.data?.message || "Failed to send message");
        }
    },

    // React to a message
    reactToMessage: async( groupId, messageId, emoji ) => {
        const { groupMessages } = get();
        const { authUser } = useAuthStore.getState();

        // Optimistic update
        const updatedMessages = groupMessages.map( m => {
            if ( m._id === messageId ) {
                const existingReaction = m.reactions?.find( r => r.emoji === emoji );
                if ( existingReaction ) {
                    if ( existingReaction.users?.includes(authUser._id) ) {
                        // Remove reaction
                        return {
                            ...m,
                            reactions: m.reactions.map( r => 
                                r.emoji === emoji 
                                    ? { ...r, users: r.users.filter( u => u !== authUser._id ) }
                                    : r
                            ).filter( r => r.users.length > 0 )
                        };
                    } else {
                        // Add to existing reaction
                        return {
                            ...m,
                            reactions: m.reactions.map( r =>
                                r.emoji === emoji
                                    ? { ...r, users: [...(r.users || []), authUser._id] }
                                    : r
                            )
                        };
                    }
                } else {
                    // Create new reaction
                    return {
                        ...m,
                        reactions: [...(m.reactions || []), { emoji, users: [authUser._id] }]
                    };
                }
            }
            return m;
        } );
        set( { groupMessages: updatedMessages } );

        try {
            await axiosInstance.post( `/messages/group/${groupId}/${messageId}/react`, { emoji } );
        } catch (error) {
            toast.error(`${error?.response?.data?.message || "Failed to react to message"}`);
        }
    },

    // Edit a message
    editGroupMessage: async( groupId, messageId, newText ) => {
        const { groupMessages } = get();

        // Optimistic update
        set( { 
            groupMessages: groupMessages.map( m =>
                m._id === messageId 
                    ? { ...m, text: newText, isEdited: true, updatedAt: new Date().toISOString() }
                    : m
            )
        } );

        try {
            await axiosInstance.put( `/messages/group/${groupId}/${messageId}`, { text: newText } );
        } catch (error) {
            toast.error(`${error?.response?.data?.message || "Failed to edit message"}`);
        }
    },

    // Delete a message
    deleteGroupMessage: async( groupId, messageId ) => {
        const { groupMessages } = get();

        // Optimistic update
        set( { groupMessages: groupMessages.filter( m => m._id !== messageId ) } );

        try {
            await axiosInstance.delete( `/messages/group/${groupId}/${messageId}` );
        } catch (error) {
            toast.error(`${error?.response?.data?.message || "Failed to delete message"}`);
        }
    },

    // Pin/Unpin a message
    togglePinMessage: async( groupId, messageId, isPinned ) => {
        const { groupMessages } = get();

        // Optimistic update
        set( { 
            groupMessages: groupMessages.map( m =>
                m._id === messageId ? { ...m, isPinned: !isPinned } : m
            )
        } );

        try {
            await axiosInstance.post( `/messages/group/${groupId}/${messageId}/pin`, { isPinned: !isPinned } );
        } catch (error) {
            toast.error(`${error?.response?.data?.message || "Failed to pin message"}`);
        }
    },

    // Mark message as read
    markMessageAsRead: async( groupId, messageId ) => {
        const { groupMessages } = get();
        const { authUser } = useAuthStore.getState();

        // Optimistic update
        set( {
            groupMessages: groupMessages.map( m =>
                m._id === messageId && !m.readBy?.includes(authUser._id)
                    ? { ...m, readBy: [...(m.readBy || []), authUser._id] }
                    : m
            )
        } );

        try {
            await axiosInstance.post( `/messages/group/${groupId}/${messageId}/read` );
        } catch (error) {
            toast.error(`${error?.response?.data?.message || "Failed to mark message as read"}`);
        }
    },

    // Subscribe to group messages
    subscribeToGroupMessages: (groupId) => {
        const socket = useAuthStore.getState().socket;
        const { isSoundEnabled } = get();

        if (!socket) return;

        socket.on( `newGroupMessage-${groupId}`, (newMessage) => {
            const currentMessages = get().groupMessages;
            set( { groupMessages: [...currentMessages, newMessage] } );

            if (isSoundEnabled) {
                const notificationSound = new Audio( "/notification_sound.mp3" );
                notificationSound.currentTime = 0;
                notificationSound.play().catch( (error) => {
                    console.error("Failed to play notification sound:", error);
                } );
            }
        } );

        // Subscribe to typing indicators
        socket.on( `userTyping-${groupId}`, (data) => {
            const { userId, username } = data;
            const { typingUsers } = get();
            
            if (!typingUsers.some( u => u.userId === userId )) {
                set( { typingUsers: [...typingUsers, { userId, username }] } );
                
                // Remove after 3 seconds
                setTimeout( () => {
                    set( { typingUsers: get().typingUsers.filter( u => u.userId !== userId ) } );
                }, 3000 );
            }
        } );

        // Subscribe to message reactions
        socket.on( `messageReaction-${groupId}`, (data) => {
            const { messageId, emoji, userId, action } = data;
            const { groupMessages } = get();

            set( {
                groupMessages: groupMessages.map( m => {
                    if ( m._id === messageId ) {
                        const reactions = [...(m.reactions || [])];
                        const reactionIndex = reactions.findIndex( r => r.emoji === emoji );

                        if ( action === 'add' ) {
                            if ( reactionIndex > -1 ) {
                                reactions[reactionIndex].users = [...new Set([...reactions[reactionIndex].users, userId])];
                            } else {
                                reactions.push( { emoji, users: [userId] } );
                            }
                        } else if ( action === 'remove' ) {
                            if ( reactionIndex > -1 ) {
                                reactions[reactionIndex].users = reactions[reactionIndex].users.filter( u => u !== userId );
                                if ( reactions[reactionIndex].users.length === 0 ) {
                                    reactions.splice( reactionIndex, 1 );
                                }
                            }
                        }
                        return { ...m, reactions };
                    }
                    return m;
                } )
            } );
        } );

        // Subscribe to message edits
        socket.on( `messageEdited-${groupId}`, (data) => {
            const { messageId, newText } = data;
            const { groupMessages } = get();

            set( {
                groupMessages: groupMessages.map( m =>
                    m._id === messageId 
                        ? { ...m, text: newText, isEdited: true, updatedAt: new Date().toISOString() }
                        : m
                )
            } );
        } );

        // Subscribe to message deletions
        socket.on( `messageDeleted-${groupId}`, (data) => {
            const { messageId } = data;
            const { groupMessages } = get();

            set( { groupMessages: groupMessages.filter( m => m._id !== messageId ) } );
        } );

        // Subscribe to message pins
        socket.on( `messagePinned-${groupId}`, (data) => {
            const { messageId, isPinned } = data;
            const { groupMessages } = get();

            set( {
                groupMessages: groupMessages.map( m =>
                    m._id === messageId ? { ...m, isPinned } : m
                )
            } );
        } );

        // Subscribe to read receipts
        socket.on( `messageRead-${groupId}`, (data) => {
            const { messageId, userId } = data;
            const { groupMessages } = get();

            set( {
                groupMessages: groupMessages.map( m =>
                    m._id === messageId && !m.readBy?.includes(userId)
                        ? { ...m, readBy: [...(m.readBy || []), userId] }
                        : m
                )
            } );
        } );
    },

    unsubscribeFromGroupMessages: (groupId) => {
        const socket = useAuthStore.getState().socket;

        if (!socket) return;

        socket.off( `newGroupMessage-${groupId}` );
        socket.off( `userTyping-${groupId}` );
        socket.off( `messageReaction-${groupId}` );
        socket.off( `messageEdited-${groupId}` );
        socket.off( `messageDeleted-${groupId}` );
        socket.off( `messagePinned-${groupId}` );
        socket.off( `messageRead-${groupId}` );
    },

    // Emit typing indicator
    emitTyping: (groupId, username) => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.emit( `typing-${groupId}`, { username, timestamp: Date.now() } );
        }
    },

    // Personal chat from group (Inbox feature)
    initiateGroupChatWithUser: (userId, user) => {
        const { groupChatPartners } = get();
        
        // Check if chat already exists
        if (!groupChatPartners.find( u => u._id === userId )) {
            set( { groupChatPartners: [...groupChatPartners, user] } );
        }
    },

    removeGroupChatPartner: (userId) => {
        const { groupChatPartners } = get();
        set( { groupChatPartners: groupChatPartners.filter( u => u._id !== userId ) } );
    },

    setGroupMembers: (members) => set( { groupMembers: members } ),
    setTypingUsers: (users) => set( { typingUsers: users } ),

} ) )