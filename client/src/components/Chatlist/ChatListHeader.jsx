import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import {BsFillChatLeftTextFill , BsThreeDotsVertical} from "react-icons/bs"
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";
import { useRouter } from "next/router";
import { MdGroups } from "react-icons/md";
import { CreateGroupContextMenu } from "../common/CreateGroupContextMenu";
 function ChatListHeader({setShowCreateGroupContextMenu}) {
   const[{UserInfo, contactPage ,userContacts},dispatch] =useStateProvider();
   const[isContextMenuVisible,setIsContextMenuVisible] = useState(false);
   const[contextMenuCoordinates,setContextMenuCoordinates] = useState({
       X : 0 ,
       Y : 0
   });
 
   const router =useRouter();
   const showContextMenu = (e)=>{
      e.preventDefault();
      setIsContextMenuVisible(true);
      setContextMenuCoordinates({X : e.pageX -60 , Y : e.pageY + 40 })
   }
   
   const contextMenuOption = [
        {
          name : "Logout",
          callback : async (params) => {
               setIsContextMenuVisible(false);
               router.push("/logout");
          }
        }
   ];

   const handleContactPage= ()=>{
          dispatch({ type:reducerCases.SET_ALL_CONTACTS_PAGE  , contactPage :"newChat"})   // it will tougle the state in true or false no nedd to write here true or false
   }

   const createGroupHandler = (e)=>{
           e.preventDefault();
           setShowCreateGroupContextMenu((prev)=>!prev);
         // dispatch({type : reducerCases.SET_CREATE_GROUP})   // automatically it will tougle 
   }

  return (
     <div className=" h-16 px-4  py-3 flex items-center  justify-between relative">
            <div>
               <Avatar type={"sm"} alt='profile' image={UserInfo?.profileImage}   />
            </div>
            <div className=" flex gap-x-4 items-center   text-panel-header-icon  ">
                  <MdGroups onClick={(e)=>createGroupHandler(e)}  className=" cursor-pointer text-2xl" title="Create group"/>
                 <BsFillChatLeftTextFill onClick={handleContactPage} className=" cursor-pointer text-xl  " title="New Chat" />
                 <BsThreeDotsVertical id="context-opener" onClick={(e)=>showContextMenu(e)} className=" cursor-pointer text-xl " title="Menu" />
                        {
                        isContextMenuVisible && 
                        <ContextMenu 
                           options={contextMenuOption}
                           coordinates={contextMenuCoordinates}
                           contextMenu={isContextMenuVisible}
                           setContextMenu={setIsContextMenuVisible}
                        />
                     }
            </div>
            {/* {
                  showCreateGroupContextMenu&& <CreateGroupContextMenu  />
            } */}
     </div>
  )
}

export default ChatListHeader;
