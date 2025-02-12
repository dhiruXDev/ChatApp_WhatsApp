import { useStateProvider } from "@/context/StateContext";
import { BASE_URL } from "@/utils/ApiRoutes";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Avatar from "../common/Avatar";
import { FaPause, FaPlay } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { reducerCases } from "@/context/constants";

function VoiceMessage({ message }) {
  const [{ UserInfo, currentChatUser,  },dispatch] = useStateProvider();
  const [audioMessage, setAudioMessage] = useState(null);
  const [currentPlaybackTime, setCurrentPlayBackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  
  const[currentlyPlaying,setCurrentlyPlaying] =useState(null)
  
  const waveFormRef = useRef(null); // DOM reference
  const waveForm = useRef(null); // WaveSurfer instance

  useEffect(() => {
    if (waveForm.current === null) {
      waveForm.current = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#ccc",
        progressColor: "#4a9eff",
        cursorColor: "#7ae3c3",
        height: 25,
        barWidth: 2,
        responsive: true,
      });

      // When recording end/finish
      waveForm.current.on("finish", () => {
        setIsPlaying(false);
        waveForm.current.seekTo(0) ; // move the cursor to start
        setCurrentPlayBackTime(0);
        setHasPlayed(false);

      });
    }

    return () => {
      if (waveForm.current) {
        waveForm.current.destroy();
        waveForm.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const audioURL = `${BASE_URL}/${message.message}`;
    const audio = new Audio(audioURL);
    setAudioMessage(audio);

    if (waveForm.current) {
      waveForm.current.load(audioURL);
      waveForm.current.on("ready", () => {
        setTotalDuration(waveForm.current.getDuration());
      });
    }

    return () => {
      if (waveForm.current) {
        waveForm.current.unAll();
      }
    };
  }, [message.message]);

  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setCurrentPlayBackTime(audioMessage.currentTime);
      };

      audioMessage.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [audioMessage]);

  const handlePlayAudio = () => { 
    if (audioMessage && waveForm.current) {
        // if (currentlyPlaying && currentlyPlaying != audioMessage) {
             
        //      currentlyPlaying.pause(); 
        //      setCurrentlyPlaying(null);
        // }
        waveForm.current.play(); 
        audioMessage.play();
        setIsPlaying(true); 
        setHasPlayed(true);
        //setCurrentlyPlaying(audioMessage)  
        } 

  }; 

  const handlePauseAudio = () => {
     if (audioMessage && waveForm.current) {
        waveForm.current.pause(); 
        audioMessage.pause();
        setIsPlaying(false); 
       // setCurrentlyPlaying(null)
      }
   };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`rounded-lg flex items-center gap-x-3 text-sm py-3 px-2 my-1  ${
        message.senderId === currentChatUser.id ? "bg-incoming-background" : "bg-outgoing-background"
      }`}
    >
      <div className="">
        <Avatar type={"sm"} image={currentChatUser?.profilePicture} />
      </div>

      <div className=" text-bubble-meta ">
        {!isPlaying ? <FaPlay onClick={handlePlayAudio} className=" hover:text-yellow-50 duration-200" /> : <FaPause onClick={handlePauseAudio} className=" hover:text-yellow-50 duration-200" />}
      </div>

      <div className="relative -mt-2  ">
        <div ref={waveFormRef} className="w-60 " />
       
        <div className="flex text-bubble-meta justify-between  w-full  absolute bottom-[-20px] ">
          
          <span className=" text-xs">{formatTime(hasPlayed ? currentPlaybackTime : totalDuration)}  </span>
          
          <div className="flex  text-[11px] ">
            <span>{calculateTime(message.createdAt)}</span>
                  {message.senderId === UserInfo.id && <MessageStatus messageStatus={ message.recieverId === -1 ? "read" :  message.messageStatus } />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;



// import { useStateProvider } from "@/context/StateContext";
// import { BASE_URL } from "@/utils/ApiRoutes";
// import Image from "next/image";
// import React, { useEffect, useRef, useState } from "react";
// import WaveSurfer from "wavesurfer.js";
// import Avatar from "../common/Avatar";
// import { FaPause, FaPlay } from "react-icons/fa";
// import { calculateTime } from "@/utils/CalculateTime";
// import MessageStatus from "../common/MessageStatus";

// function VoiceMessage({message}) {

//    const[{UserInfo,currentChatUser }] = useStateProvider();
//    const [audioMessage, setAudioMessage] = useState(null);
//    const[currentPlaybackTime, setCurrentPlayBackTime] =useState(0);
//    const[totalDuration, setTotalDuration] =useState(0);
//    const[isPlaying, setIsPlaying] = useState(false)
 
//    const waveFormRef = useRef(null);  // DOM reference
//    const waveForm = useRef(null);      // WaveSurfer instance
   
//  console.log("message",message)
//    useEffect(()=>{
//       if(waveForm.current === null){
//         waveForm.current = WaveSurfer.create({
//           container : waveFormRef.current,
//           waveColor : "#ccc",
//           progressColor : "#4a9eff",
//           cursorColor : "#7ae3c3",
//           height :30,
//           barWidth : 2 ,
//           responsive: true,
//         });

//         waveForm.current.on("finish",()=>{
//            setIsPlaying(false);
//         })
//       }
      
//       return ()=>{
//         waveForm.current.destroy();
//       }
//    },[]);

//    useEffect(()=>{

//      const audioURL = `${BASE_URL}/${message.message}`;
//      const audio = new Audio(audioURL);
//      setAudioMessage(audio);

//       console.log("val",waveForm.current);
//       waveForm?.current?.load(audioURL);
//       waveForm.current.on("ready",()=>{
//         setTotalDuration(waveForm.current.getDuration());
//       });
     
//    } ,[message.message]);

//    useEffect(() => {
//     if (audioMessage) {
//       const updatePlaybackTime = () => {
//         setCurrentPlayBackTime(audioMessage.currentTime);
//       };
  
//       audioMessage.addEventListener("timeupdate", updatePlaybackTime);
//       return () => {
//         audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
//       };
//     }
//   }, [audioMessage]);

//    const handlePlayAudio = ()=>{
//     if(audioMessage){
//       waveForm.current.stop();
//       waveForm.current.play();
//       audioMessage.play();
//       setIsPlaying(true);
//     }
//    }

//    const handlePauseAudio= ()=>{
//        waveForm.current.stop();
//        audioMessage.pause();
//        setIsPlaying(false);
//    }
// const formatTime = (time) => {
//   if (isNaN(time)) return "00:00";
//   const minutes = Math.floor(time / 60);
//   const seconds = Math.floor(time % 60);
//   return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
// };
// return   <div className= {` rounded-lg  flex items-center gap-x-1 text-sm py-2 px-2 
//                               ${message.senderId === currentChatUser.id ? "bg-incoming-background" : "bg-outgoing-background"}`}>
//           <div className="">
//               <Avatar  type={"lg"} image={currentChatUser?.profilePicture}  />
//            </div>
//            <div>
//                 {
//                   !isPlaying ? <FaPlay  onClick={handlePlayAudio} /> : <FaPause onClick={handlePauseAudio} />
//                 }
//            </div>
//            <div className=" relative">
//                  <div  ref={waveFormRef}  className=" w-60     "   />
//                  <div className=" flex  text-bubble-meta ">
//                      <span>{formatTime( isPlaying ? currentPlaybackTime : totalDuration)}</span>
//                      <div className=" flex ">
//                            <span>{calculateTime(message.createdAt)}</span>
//                            {
//                               message.senderId === currentChatUser.id && <MessageStatus messageStatus={message.status} />
//                            }
//                      </div>
//                  </div>
//            </div>
//          </div>;
// }

// export default VoiceMessage;
