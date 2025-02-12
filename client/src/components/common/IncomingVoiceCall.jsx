import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React from "react";
 

function IncomingVoiceCall() {
  
  const[{incomingVoiceCall ,socket},dispatch] = useStateProvider();
 
  const acceptCallHandler = ()=>{
          dispatch({ type :reducerCases.SET_VOICE_CALL , 
                voiceCall : {...incomingVoiceCall , type : "in-coming"}
          });
          socket.current.emit("accept-incoming-call",{ id: incomingVoiceCall.id});
          dispatch({type : reducerCases.SET_INCOMING_VOICE_CALL ,incomingVoiceCall : undefined})
  }

  const rejectCallHandler = ()=>{
           socket.current.emit("reject-voice-call", {from : incomingVoiceCall.id})
           dispatch ({ type : reducerCases.END_CALL});
  }

  return <div className=" h-24 w-80 fixed bottom-8 right-6 mb-0 z-50  bg-conversation-panel-background py-14 px-5  rounded-sm flex  justify-start gap-5  items-center    border-icon-green border-2  text-white text-sm  drop-shadow-3xl ">
            <div >
                 <Image src={incomingVoiceCall.profilePicture} alt="Avatar" height={70} width={70} className=" rounded-full " />
            </div>
            <div className=" flex flex-col  "> 
                 <span className=" text-lg">{incomingVoiceCall.name}</span>
                 <span  className=" text-xs">{'Incoming Voice Call'}</span>
                 <div className=" flex gap-x-3 mt-2 items-center">
                     <button onClick={rejectCallHandler} className=" bg-red-700   text-sm px-3 p-1 rounded-full " >
                         Reject
                     </button>
                     <button onClick={acceptCallHandler} className=" bg-green-700 text-sm px-3 p-1 rounded-full " >
                         Accept
                     </button>
                 </div>
            </div>

  </div>;
}


export default IncomingVoiceCall;
