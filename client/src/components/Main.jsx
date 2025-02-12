
import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { useStateProvider } from "@/context/StateContext";
import axios from "axios";
import { AUTH_API_ENDPOINTS, BASE_URL, GET_ALL_MESSAGES_API, GET_ALL_STATUS_API } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { reducerCases } from "@/context/constants";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";
import VoiceCall from "./Call/VoiceCall";
import VideoCall from "./Call/VideoCall";
import IncomingCall from "./common/IncomingVoiceCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import IncomingVoiceCall from "./common/IncomingVoiceCall";
import FadeLoader from "react-spinners/FadeLoader";
import { CreateGroupContextMenu } from "./common/CreateGroupContextMenu";
import { Profile } from "./common/Profile";
import { ChatListSidebar } from "./ChatSidebar/ChatListSidebar";
 
function Main() {
  // State to control redirection to login page if user is not authenticated
  const [reDirectLogIn, setRedirectLogIn] = useState(false);
  const[loading,setLoading] = useState(false);
  // Extracting UserInfo from global state and dispatch function for state updates
  const [{ UserInfo ,currentChatUser,messageSearch , message,myStatus, voiceCall,videoCall,incomingVideoCall,incomingVoiceCall ,createGroup , recentlyUpdatesStatus}, dispatch] = useStateProvider();
  const[socketEvent,setSocketEvent]=useState(false);
   
  // Router instance to handle navigation
  const router = useRouter();
  const socket = useRef();
 
  const[showCreateGroupContextMenu , setShowCreateGroupContextMenu] = useState(false);

   const[contextMenuCoordinates,setContextMenuCoordinates] = useState({
         X : 0 ,
         Y : 0
     });
     const showContextMenu = (e)=>{
        e.preventDefault();
        setContextMenuCoordinates({X : e.pageX -60 , Y : e.pageY + 40 })
     }


  // Redirect to login page if reDirectLogIn is true
  useEffect(() => {
    if (reDirectLogIn) {
      router.push("/signIn");
    }
  }, [reDirectLogIn, router]);

  // Check for authentication state and load user information if authenticated
onAuthStateChanged(firebaseAuth, async(currentuser) => {
    // If user is not logged in, set reDirectLogIn to true for login redirection
    if (!currentuser) {
      setRedirectLogIn(true);
    } 
    // If UserInfo is not available in the global state, fetch user data from the backend
    if (!UserInfo && currentuser?.email) {
      setLoading(true);
      try {
        // Making a POST request to check if the user exists in the database
        const { data } = await axios.post(AUTH_API_ENDPOINTS.CHECK_URL_API, {
          email: currentuser.email,
        });
       // console.log("Second", { data });

        if (!data.success) {
            // If user is not found in database, redirect to sign-in page
            router.push("/signIn");
        } 
        else {
            // Destructure user data from the response and store it in the global state
            const { id, name, email,status, about, profilePicture: profileImage } = data.data;
             dispatch({ type: reducerCases.SET_USER_INFO,
                      UserInfo: {id,name,email,profileImage,status,about },
                });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    }
  });

  // Gettin g the message of currentchat user :- 
  useEffect(()=>{
      const getMessages = async ()=>{
               const {data : {messages}} = await axios.get(`${GET_ALL_MESSAGES_API}/${UserInfo?.id}/${currentChatUser?.id}`)
              //  console.log( "Messages" ,messages);               
               dispatch({type : reducerCases.SET_MESSAGES , messages })
      }  
      if (currentChatUser?.id) {
        getMessages();
      }
  },[currentChatUser])



// Socket connection
    useEffect(()=>{
        if (UserInfo) {
//socket.current is a way to reference the current instance of the Socket.IO client .This  is likely a useRef variable if you're working in a React application
// io(BASE_URL): This initializes a new Socket.IO client instance and connects it to the server specified by BASE_URL.
// The emit() function sends an event from the client to the server.
// "add-user" is the name of the event being sent to the server. The server should have a corresponding listener (e.g., socket.on("add-user", callback)).
          socket.current = io(BASE_URL);
          socket.current.emit("add-user",UserInfo.id);
          dispatch({type : reducerCases.SET_SOCKET , socket})
        }
    } ,[UserInfo]);

    useEffect(()=>{
            
          if (socket.current && !socketEvent) {
            
                 socket.current.on("msg-recieve", (data)=>{
                      dispatch({type : reducerCases.ADD_MESSAGE ,  
                                 newMessage : {...data.message},
                                 fromSelf:false,
                      })
                 }) 
                  
                //Update message status
                 socket.current.on("message-read",({from,messageIds})=>{
                       dispatch({
                          type:reducerCases.MARK_MESSAGE_AS_READ,
                          messageIds
                       })
                 })
/// adding status 

              //   socket.current.on("add-new-status", ({ userId, status }) => {
              //     console.log("socket call and incoming status", status);
              //     console.log("Before update:", recentlyUpdatesStatus);
              //     dispatch({
              //         type: reducerCases.SET_RECENTLY_UPDATES_STATUS,
              //         statuses: (() => {
              //             const updatedStatuses = [...recentlyUpdatesStatus]; // Clone array to avoid mutation
              //             const userIndex = updatedStatuses.findIndex(userStatus => userStatus.user.id === userId);
              //             console.log("inside :",userIndex, updatedStatuses);

              //             if (userIndex !== -1) {
              //               console.log("inside")
              //                 // ✅ User exists, update their statuses array immutably
              //                 updatedStatuses[userIndex] = {
              //                     ...updatedStatuses[userIndex],
              //                     statuses: [...updatedStatuses[userIndex].statuses, status]
              //                 };
              //                 console.log("After update:", updatedStatuses);
              //             } else {
              //               console.log("before update else :", updatedStatuses);
              //                 // ✅ User doesn't exist, add a new entry
              //                 updatedStatuses.push({
              //                     user: { id: userId }, // Add user details if needed
              //                     statuses: [status]
              //                 });
              //                 console.log("After update else :", updatedStatuses);
              //             }
              //             console.log("After update:", recentlyUpdatesStatus);
              //             //onsole.log("After update:", updatedStatuses);
              //             return updatedStatuses;
              //         })()
              //     });
              //     console.log("Before update recently :", recentlyUpdatesStatus);

              // });

              socket.current.on("add-new-status", ({ userId, status }) => {
                console.log("socket call and incoming status", status);
               
                if (userId === UserInfo.id) {
                  // ✅ Case 1: If the status belongs to the current user (My Status)
                  console.log("Inside if ")
                  const updatedMyStatus = (() => {
                      if (!myStatus || myStatus.length === 0) {
                          // 🟢 If the user has no previous status, create a new entry
                          return [{ user: status.user, statuses: [status] }];
                      } else {
                          // 🔄 If the user already has statuses, add the new one at the beginning
                          return myStatus.map(userStatus =>
                              userStatus.user.id === userId
                                  ? { ...userStatus, statuses: [status, ...userStatus.statuses] }
                                  : userStatus
                          );
                      }
                  })();
                  console.log("He ",updatedMyStatus);
                  dispatch({
                      type: reducerCases.SET_MY_STATUS,
                      myStatuses: updatedMyStatus
                  });
              } else {
                  // ✅ Case 2 & 3: Handle `recentlyUpdatesStatus`
                  dispatch({
                      type: reducerCases.SET_RECENTLY_UPDATES_STATUS,
                      statuses: (() => {
                          const updatedStatuses = [...recentlyUpdatesStatus]; // Clone to avoid mutation
                          const userIndex = updatedStatuses.findIndex(userStatus => userStatus.user.id === userId);
          
                          if (userIndex !== -1) {
                              // 🔄 If the user exists, add the new status at the beginning
                              updatedStatuses[userIndex] = {
                                  ...updatedStatuses[userIndex],
                                  statuses: [status, ...updatedStatuses[userIndex].statuses]
                              };
                          } else {
                              // 🟢 If the user is new, create a new entry at the beginning
                              updatedStatuses.unshift({
                                  user: status.user, // Add user details if needed
                                  statuses: [status]
                              });
                          }
          
                          return updatedStatuses;
                      })()
                  });
              }
            
                // dispatch({
                //     type: reducerCases.SET_RECENTLY_UPDATES_STATUS,
                //     statuses: (() => {
                //         const updatedStatuses = [...recentlyUpdatesStatus]; // Clone array to avoid mutation
                //         const userIndex = updatedStatuses.findIndex(userStatus => userStatus.user.id === userId);

                //         if (userIndex !== -1) {
                //             // ✅ User exists, add the new status at the beginning
                //             updatedStatuses[userIndex] = {
                //                 ...updatedStatuses[userIndex],
                //                 statuses: [status, ...updatedStatuses[userIndex].statuses] // New status first
                //             };
                //         } else {
                //             // ✅ User doesn't exist, add a new entry at the beginning
                //             updatedStatuses.unshift({ // Use unshift to add the new user at the top
                //                 user: { id: userId }, // Add user details if needed
                //                 statuses: [status]
                //             });
                //         }
                //         return updatedStatuses;
                //     })()
                // });

            });
            //   socket.current.on("delete-status", ({ userId, statusId }) => {
            //     dispatch({
            //         type: reducerCases.SET_RECENTLY_UPDATES_STATUS,
            //         statuses: recentlyUpdatesStatus.map(userStatus =>
            //             userStatus.user.id === userId
            //                 ? { ...userStatus, statuses:userStatus.statuses.filter(status => status.id !== statusId) }
            //                 : userStatus
            //         )
            //     });
            // });
            socket.current.on("delete-status", ({ userId, statusId }) => {
              dispatch({
                  type: reducerCases.SET_RECENTLY_UPDATES_STATUS,
                  statuses: recentlyUpdatesStatus.map(userStatus =>
                      userStatus.user.id === userId
                          ? { ...userStatus, statuses: userStatus.statuses.filter(status => status.id !== statusId) }
                          : userStatus
                  )
              });
          
              // If the logged-in user is deleting their own status, update `myStatus`
              if (userId === UserInfo.id) {
                  dispatch({
                      type: reducerCases.SET_MY_STATUS,
                      myStatus: myStatus.filter(status => status.id !== statusId)
                  });
              }
          });
          
            
                // bad me add kiya gya ahi
                socket.current.on("incoming-voice-call", ({from,roomId,callType})=>{
                   dispatch({type : reducerCases.SET_INCOMING_VOICE_CALL ,  
                              incomingVoiceCall : {...from , roomId,callType}
                   })
                });

                socket.current.on("incoming-video-call", ({from,callType,roomId})=>{
                  console.log("inside main",from,roomId,callType)
                     dispatch({ type : reducerCases.SET_INCOMING_VIDEO_CALL , 
                                incomingVideoCall : {...from,callType,roomId}
                     })
                });

                socket.current.on("video-call-rejected", ()=>{
                      dispatch({type : reducerCases.END_CALL})
                });
                socket.current.on("voice-call-rejected",()=>{
                      dispatch({type : reducerCases.END_CALL})
                });

                socket.current.on("online-users",({onlineUsers})=>{
                  dispatch ({ type : reducerCases.SET_ONLINE_USERS , onlineUsers})
                })
                 setSocketEvent(true);// Other socket event listeners...
          }
           
    },[socket.current,socketEvent, dispatch]);
   
    useEffect(() => {
      console.log("Recently updated statuses:", recentlyUpdatesStatus);
  }, [recentlyUpdatesStatus]);

    // Getting recently status  && viewed status
//   useEffect(()=>{
//     const getallStatus= async()=>{
//                 const res = await axios.get(GET_ALL_STATUS_API);
//                 console.log("All status",res);
//                 const statuses = res.data.statuses
//                // console.log("Statsuss",statuses)
//                 dispatch({type : reducerCases.SET_RECENTLY_UPDATES_STATUS , statuses})
//     }
//       getallStatus(); 
// },[]);
useEffect(() => {
  const getAllStatus = async () => {
      try {
          const res = await axios.get(GET_ALL_STATUS_API);
          console.log("All statuses:", res);

          const Allstatuses = res.data.statuses || []; // Ensure it's an array
          console.log("All statuses after:", Allstatuses);

          // Separate My Status and Other Users' Statuses
          let myStatuses;
          if(Allstatuses){
             myStatuses = Allstatuses.filter((status) => status?.user?.id === UserInfo?.id);
          }
          const statuses = Allstatuses.filter((status) => status?.user?.id !== UserInfo?.id);
          console.log(" seprate",myStatuses,statuses);
          // Dispatch separately
          dispatch({ type: reducerCases.SET_MY_STATUS, myStatuses });
          dispatch({ type: reducerCases.SET_RECENTLY_UPDATES_STATUS, statuses });
          console.log("after all ",myStatus,recentlyUpdatesStatus)
      } catch (error) {
          console.error("Error fetching statuses:", error);
      }
  };
  getAllStatus();
}, [UserInfo]);

  return (
    <>
        {incomingVideoCall && <IncomingVideoCall  />  }
        {incomingVoiceCall && <IncomingVoiceCall /> }
       {
         voiceCall && <div className=" w-full h-screen overflow-hidden ">
             <VoiceCall />
         </div>
       }
      {
         videoCall && <div className=" w-full h-screen overflow-hidden ">
             <VideoCall  />
         </div>
       }
       {
           !videoCall && !voiceCall && 
              <div className="h-screen w-full max-h-screen relative   grid grid-cols-main">
                          {
                            loading ? <div className=" h-full w-full grid place-content-center bg-panel-header-background  border-r-2  border-gray-700 ">
                                            <FadeLoader
                                                  height={7}
                                                  margin={-10}
                                                  radius={1}
                                                  width={2}
                                                  color="#a1a1a5" />
                                        </div> : 
                            (     <div className=" flex  w-full h-[100%] overflow-auto   ">
                                      <ChatListSidebar />
                                      <ChatList  showCreateGroupContextMenu  = {showCreateGroupContextMenu} setShowCreateGroupContextMenu ={setShowCreateGroupContextMenu}/>
                                  </div>
                            )
                          } 
                          {
                              currentChatUser ?
                                  (<div className={messageSearch ? " grid grid-cols-2" : " grid-cols-2"}> 
                                              <Chat />
                                              {
                                                messageSearch && <SearchMessages  />
                                              }
                                      </div>
                                      
                                    ) : <Empty />
                          } 
                          {
                              showCreateGroupContextMenu && <CreateGroupContextMenu   setShowCreateGroupContextMenu={setShowCreateGroupContextMenu}  />
                          }
                          {/* {
                             isShowProfileUpdateModal && <Profile isShowProfileUpdateModal={isShowProfileUpdateModal} setShowProfileUpdateModal={setShowProfileUpdateModal} />
                          } */}
            
                          {/* <Chat />     */}
               </div>
       }

      {/* Main layout with ChatList and Empty components */}
    </>
  );
}

export default Main;
