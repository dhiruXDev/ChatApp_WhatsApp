import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";

function ChatLIstItem({data,isContactsPage=false ,isActive, setActiveItem}) {
  const[{UserInfo,currentChatUser},dispatch] = useStateProvider();
  
  const handleClickedContact = ()=>{    
      if (!isContactsPage) {
            setActiveItem(data.id);
            dispatch ({ type : reducerCases.CHANGE_CURRENT_CHAT_USER  , 
                  currentChatUser : { 
                        name : data.name,
                        about : data.about,
                        profilePicture : data.profilePicture,
                        email : data.email,
                        id: UserInfo.id === data.senderId ? data.recieverId : data.senderId
                  }
            })
      }else{
            dispatch({ type :reducerCases.CHANGE_CURRENT_CHAT_USER , currentChatUser: {...data} })
            dispatch({type : reducerCases.SET_ALL_CONTACTS_PAGE});
      }
  }
  if(isActive){
      data.totalUnreadMessage = 0 ;
  }
 // console.log("Data",data)
// Ye vala  addd kiye the -----> 

//   useEffect(() => {
//       if (socket) {
//           socket.on("new-message", (newMessage) => {
//               // Check if the new message belongs to the current user’s chat and update state
//               if (newMessage.recieverId === UserInfo.id || newMessage.senderId === UserInfo.id) {
//                   // You can dispatch a Redux or context action to update your state with the new message
//                   dispatch({
//                       type: reducerCases.UPDATE_USER_CONTACTS,
//                       payload: newMessage,
//                   });
//               }
//           });
//       }
//       return () => {
//           if (socket) {
//               socket.off("new-message");
//           }
//       };
//   }, [socket, UserInfo, dispatch]);

//   useEffect(() => {
//       // Listening for new messages
//       socket.on("new-message", (newMessage) => {
//           // Update state with the new message or unread status change
//           if (newMessage.senderId !== UserInfo.id) {
//               dispatch({
//                   type: reducerCases.UPDATE_UNREAD_MESSAGES,
//                   payload: { userId: data.id, totalUnreadMessages: data.totalUnreadMessage + 1 },
//               });
//           }
//       });
  
//       return () => socket.off("new-message");
//   }, [socket, data.id, dispatch, UserInfo]);
  
  //console.log("Data ",data);

  return ( 
         <div  onClick={handleClickedContact}className={`flex items-center cursor-pointer my-1  ${isActive ? "bg-background-default-hover  mx-3 rounded-md" : "hover:bg-background-default-hover  mx-3 rounded-md " }`} >
                 <div className=" flex items-center  min-w-fit py-2 px-2 ">
                         <Avatar image={data?.profilePicture} type={"lg"}   />
                 </div>
                 <div className=" w-full flex flex-col  justify-center pb-2 px-2 ">
                       <div className=" flex flex-col  border-background-default-hover border-b  px-2 pb-2">
                            <div  className=" flex justify-between"> 
                                    <div > 
                                          <span className=" text-white ">{data.name}</span> 
                                    </div>
                                    {
                                      !isContactsPage && 
                                       <div className={`${ !data.totalUnreadMessage > 0 ? " text-secondary " : !isActive ? " text-icon-green" : " text-secondary "  } text-xs `}> 
                                                  { calculateTime(data.createdAt)}
                                        </div>
                                    }
                            </div>
                            <div className=" flex justify-between w-full">
                                     <span className=" text-secondary text-sm ">
                                            { isContactsPage ?  data?.about || "\u000A0" : 
                                                <div className=" flex  gap-x-1 items-center  max-w-[200px] lg:max-w-[200px] sm:max-w-[250px] md:max-w-[300px]  xl:max-w-[300px]: ">
                                                       {
                                                             data.senderId === UserInfo.id && <MessageStatus  messageStatus={data.messageStatus} />
                                                       }
                                                       {
                                                            data.type === "text" &&  <span className=" truncate" > {data.message.length > 35 ? data.message.slice(0,35)+'.....' : data.message }</span>
                                                       }
                                                       {
                                                            data.type ==="audio" && <div className=" flex items-center gap-x-1 "> 
                                                                <FaMicrophone className="  text-panel-header-icon" /> Audio
                                                             </div>
                                                       }
                                                       {
                                                            data.type === "Image" && <span className=" flex items-center gap-x-1">
                                                                      <FaCamera className=" text-panel-header-icon" /> Image
                                                                    </span>
                                                       }
                                                </div>
                                            }
                                     </span>
                                          { !isActive && data.totalUnreadMessage > 0 &&  <span className=" text-xs px-[6px] py-[0.2px]   rounded-full bg-icon-green  text-black ">  {data.totalUnreadMessage}</span>} 
                            </div>
                       </div>
                   
                 </div>
         </div>
      )
}

export default ChatLIstItem;
