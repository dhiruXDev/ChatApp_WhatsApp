import React, { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import MessageBar from "./MessageBar";

function Chat() {
  const[loading,setLoading] =useState(false);
  const handleLoading = (data)=>{
     setLoading(data)
   }
  return  <div className=" w-full flex flex-col  justify-between    border-conversation-border  border-l  overflow-auto  custom-sidebar bg-conversation-panel-background max-h-[100vh]  ">
              <ChatHeader />
              <ChatContainer loading= {loading} />
              <MessageBar setLoading = {handleLoading} />
         </div>;
}

export default Chat;
