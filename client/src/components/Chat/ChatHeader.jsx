import React, { useState } from "react";
import Avatar from "../common/Avatar";
import {MdCall} from "react-icons/md"
import {IoVideocam} from "react-icons/io5"
import {BiSearchAlt2} from "react-icons/bi"
import {BsThreeDotsVertical} from "react-icons/bs"
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";
function ChatHeader() {
   const[{UserInfo , currentChatUser ,onlineUsers},dispatch] = useStateProvider();
   const[isContextMenuVisible,setIsContextMenuVisible] = useState(false);
   const[contextMenuCoordinates,setContextMenuCoordinates] = useState({
       X : 0 ,
       Y : 0
   });
   const showContextMenu = (e)=>{
      e.preventDefault();
      setIsContextMenuVisible(true);
      setContextMenuCoordinates({X : e.pageX-85 , Y : e.pageY+50})
   }

   const contextMenuOption =  [
        {
                name :"Close Chat",
                callback : async ()=>{
                        dispatch({type : reducerCases.SET_EXIT_CHAT})
                }
        }
]
   const voiceCallHandler = ()=>{
         dispatch ({type : reducerCases.SET_VOICE_CALL ,  
                voiceCall : {
                        ...currentChatUser,
                        type : "out-going",
                        roomId : Date.now(),
                        callType : "voice",
                }
         })
   }

   const videoCallHandler = ()=>{
        dispatch({ type : reducerCases.SET_VIDEO_CALL , 
                videoCall : {
                        ...currentChatUser,
                        type :"out-going",
                        callType : "video",
                        roomId :Date.now()
                }
        })
   }

  return <div className="  bg-panel-header-background h-16 px-2 py-3 flex items-center justify-between  z-[5] ">
                 <div className=" flex gap-x-3 items-center  ">
                         <Avatar type={"sm"}  image={currentChatUser?.profilePicture} />
                         <div className=" flex flex-col ">
                              <span className=" text-primary-strong"> {currentChatUser?.name}</span>
                              <span className=" text-secondary text-sm"> 
                                { currentChatUser?.id === -1 ? "Llama 3.2 ✨" : currentChatUser?.id === UserInfo?.id
                                                ? "Message Yourself"
                                                : onlineUsers?.includes(currentChatUser.id) ? "Online"  : "Offline"     
                                }
                              </span> 
                         </div>
                 </div>
                 <div className=" flex gap-x-4 items-center  pr-4 ">
                      {  currentChatUser.id !== -1 && <div className=" flex gap-x-2  ">
                            <MdCall onClick={ voiceCallHandler}  className=" text-xl text-panel-header-icon cursor-pointer   "/>
                            <IoVideocam onClick={videoCallHandler} className=" text-xl text-panel-header-icon cursor-pointer  " />
                        </div>}
                        
                         <BiSearchAlt2 onClick={()=> dispatch({type: reducerCases.SET_MEASSAGE_SEARCH})}  className=" text-xl text-panel-header-icon cursor-pointer  "/>
                         <BsThreeDotsVertical id="context-opener" onClick={ (e)=>showContextMenu(e)}  className=" text-xl text-panel-header-icon cursor-pointer  " />   
                         {
                                isContextMenuVisible && (
                                <ContextMenu
                                        options={contextMenuOption}
                                        coordinates={contextMenuCoordinates}
                                        contextMenu={isContextMenuVisible}
                                        setContextMenu={setIsContextMenuVisible}
                                />
                                  )
         }
                 </div>

                 
         </div>;
         
}

export default ChatHeader;
