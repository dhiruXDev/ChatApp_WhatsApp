import { act } from "react"
import { reducerCases } from "./constants"

export const initialState = {
     UserInfo : undefined,
     NewUser : false,
     contactPage :"default",
     currentChatUser : undefined,
     messages : [],
     socket : undefined,
     messageSearch :false,
     userContacts: [],
     onlineUsers:[],
     contactSearch : [],
     filteredContactSearch :[],
     
     

     voiceCall : undefined,
     videoCall : undefined,
     incomingVoiceCall : undefined,
     incomingVideoCall :undefined,

     loading :false,

     createGroup : false,
     isShowProfileUpdateModal : false,

     recentlyUpdatesStatus : [],
     myStatus : [],
     viewedStatus : []
}

 const reducer =  (state ,action)=>{
       switch(action.type){
        // In case of Set-user-info teh UserInfo that is  globally stored will sent
        case reducerCases.SET_USER_INFO  : {
            return {
                ...state , // Destructuring the Structure
                UserInfo : action.UserInfo     // sending the Userinfo
            }
        }

        // in case of new-user 
        case reducerCases.SET_NEW_USER :{
            return {
                ...state ,
                NewUser : action.NewUser
            }
        }

        // in case of when i clicked on chat icon for loading tha all contacts
        case reducerCases.SET_ALL_CONTACTS_PAGE :{
            return {
                 ...state,
                 contactPage : action.contactPage   // it will tougle the state in  true and False
            }
        }

        // For which user is in now chat , means when i clicked on any user it will be in chatContainer for conversatation
        case reducerCases.CHANGE_CURRENT_CHAT_USER :{
             return {
                 ...state ,
                 currentChatUser : action.currentChatUser
             }
        }

        case reducerCases.SET_MESSAGES :{
            return {
                ...state ,
                messages : action.messages
            }
        }
// Socket.Io
        case reducerCases.SET_SOCKET :{
            return {
                ...state ,
                socket : action.socket
            }
        }
        
        case reducerCases.ADD_MESSAGE :{
            return {
                ...state,
                messages : [...state.messages , action.newMessage]
            }
        }
    /// addddd now for mesage as markas read    
        case reducerCases.MARK_MESSAGE_AS_READ:{
            return{
                 ...state,
                 messages: state.messages.map((message)=>action.messageIds.includes(message.id) ? {...message ,messageStatus:"read"} : message)
            }
        }

        case reducerCases.SET_MEASSAGE_SEARCH : {
            return {
                   ...state,
                   messageSearch : !state.messageSearch
            }
        }
        
        case reducerCases.SET_USER_CONTACTS :{
            return{
                ...state ,
                userContacts: action.userContacts
            }
        }

        // case reducerCases.SET_IS_SHOW_PROFILE_UPDATE_MODAL:{
        //     return {
        //         ...state,
        //         isShowProfileUpdateModal : action.isShowProfileUpdateModal
        //     }
        // }

// Ye vala 
        // case reducerCases.UPDATE_UNREAD_MESSAGES: {
        //     const { userId, unreadMessages } = action.payload;
        //     return {
        //         ...state,
        //         userContacts: state.userContacts.map((contact) =>
        //             contact.id === userId
        //                 ? { ...contact, totalUnreadMessage: unreadMessages }
        //                 : contact
        //         ),
        //     };
        // }

        case reducerCases.SET_ONLINE_USERS :{
            return{
                ...state ,
                onlineUsers : action.onlineUsers
            }
        }
        case reducerCases.SET_CONTACT_SEARCH : {
            const filteredContactSearch = state.userContacts.filter((contact)=> contact.name.toLowerCase().includes(action.contactSearch.toLowerCase()));
            return {
                ...state,
                contactSearch : action.contactSearch,
                filteredContactSearch 
            }
        }

        case reducerCases.SET_VOICE_CALL :{
            return {
                ...state ,
                voiceCall : action.voiceCall
            }
        }
        case reducerCases.SET_VIDEO_CALL :{
            return {
                ...state ,
                videoCall : action.videoCall
            }
        }
        case reducerCases.SET_INCOMING_VOICE_CALL :{
            return {
                ...state ,
                incomingVoiceCall : action.incomingVoiceCall
            }
        }
        case reducerCases.SET_INCOMING_VIDEO_CALL :{
            return {
                ...state ,
                incomingVideoCall : action.incomingVideoCall
            }
        }
        case reducerCases.END_CALL :{
            return {
                ...state ,
                voiceCall : undefined,
                videoCall : undefined,
                incomingVoiceCall : undefined,
                incomingVideoCall :undefined,
            }
        }

        case reducerCases.SET_EXIT_CHAT : {
            return {
                 currentChatUser : undefined
            }
        }

        case reducerCases.SET_LOADING : {
            return{
                loading : action.loading
            }
        }
        case reducerCases.SET_CREATE_GROUP :{
            return {
                createGroup : !state.createGroup
            }
        }

// Status Part
        case reducerCases.SET_RECENTLY_UPDATES_STATUS :{
            return {
                ...state,
                recentlyUpdatesStatus : action.statuses
            }
        }
        case reducerCases.SET_MY_STATUS :{
            return {
                ...state ,
                myStatus : action.myStatuses
            }
        }
        case reducerCases.SET_VIEWED_UPDATE_STATUS :{
            return {
                viewedStatus : state.viewedStatus
            }
        }
        
        default :  return state
       }

    }
export default reducer