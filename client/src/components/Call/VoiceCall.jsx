import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useStateProvider } from "@/context/StateContext";
const Container = dynamic(()=> import("./Container") ,{ ssr : false});

function VoiceCall() {

const[{voiceCall ,socket,UserInfo},dispatch]=useStateProvider();
     
     useEffect(()=>{
         if (voiceCall.type === "out-going") {
             socket.current.emit ("outgoing-voice-call" , {
                  to : voiceCall.id,
                  from : {
                  id: UserInfo.id,
                  profilePicture : UserInfo.profileImage  ,
                  name: UserInfo.name
                },
                 roomId : voiceCall.roomId,
                 callType :voiceCall.callType
             })
         }
     } ,[voiceCall])
  return  <Container data = {voiceCall} />
}

export default VoiceCall;
