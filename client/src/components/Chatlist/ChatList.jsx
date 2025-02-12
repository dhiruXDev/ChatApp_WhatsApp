import React, { useEffect, useState } from "react";
import ChatHeader from "../Chat/ChatHeader";
import SearchBar from "./SearchBar";
import ChatListHeader from "./ChatListHeader";
import List from "./List";
import { useStateProvider } from "@/context/StateContext";
import ContactsList from "./ContactsList";
import { FadeLoader } from "react-spinners";
import { Status } from "../Status/status";
import { CallSidebarPage } from "../Call/CallSidebarPage";

function ChatList({setShowCreateGroupContextMenu}) {
   const[pageType,setPageType]=useState("default");
   const[{contactPage}]= useStateProvider();
   const[loading,setLoading]=useState(false);
   useEffect(()=>{
            if(contactPage === "default"){   // If contactPage is true then all user set as
              setPageType("default");

            }
            else if (contactPage === "newChat"){             // otherwwie set as default
              setPageType("newChat");
            
            }else if(contactPage === "status"){       /// for 
              setPageType("status");
            }
            else if(contactPage === "calllogs"){ // for calling
              setPageType("calllogs");
            }
   },[contactPage])

  return <div className=" w-full flex flex-col bg-panel-header-background  border-slate-700  overflow-auto border-r  z-10  ">
         {
             pageType === "default" &&(
                          <>
                            <ChatListHeader  setShowCreateGroupContextMenu={setShowCreateGroupContextMenu}/>
                            <SearchBar />
                            <List setLoading={setLoading} />
                         </>
             )
         }
         {
           
         }
         {
             pageType === "newChat" && (
               <ContactsList />
             )
         }{
            pageType === "status" && 
                  <Status />
         }
         {
          pageType === "calllogs" && 
                   <CallSidebarPage />
         }

  </div>;
}

export default ChatList;
