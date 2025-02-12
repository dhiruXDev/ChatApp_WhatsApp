import { useStateProvider } from "@/context/StateContext";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
const Container = dynamic(()=>import("./Container") , {ssr :false});

function VideoCall() {
 
  const[{videoCall ,socket,UserInfo},dispatch]=useStateProvider();
 console.log("Videocall",videoCall);
     useEffect(()=>{
         if (videoCall.type === "out-going") {
             socket.current.emit ("outgoing-video-call" , {
                  to : videoCall.id,
                  from : {
                  id: UserInfo.id,
                  profilePicture : UserInfo.profileImage ,
                  name: UserInfo.name
                },
                 roomId : videoCall.roomId,
                 callType :videoCall.callType
             })
         }
     } ,[videoCall]);
  return  <Container data= {videoCall} />
}

export default VideoCall;
