import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GENERATE_CALL_TOKEN, GET_CALL_TOKEN } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
//import { ZegoExpressEngine } from "zego-express-engine-webrtc";

function Container({ data }) {
  const [{ socket, UserInfo }, dispatch] = useStateProvider();
  const [callAccepted, setCallAccepted] = useState(false);
  const [token, setToken] = useState(undefined);
  const [zgVar, setZgVar] = useState(undefined);
  const [localStream, setLocalStream] = useState(undefined);
  const [publicStream, setPublicStream] = useState(undefined);

  let NEXT_PUBLIC_ZEGO_APP_ID= 1437299365 ;
  let NEXT_PUBLIC_ZEGO_SERVER_SECRET_ID="869c5a6f51df53838a359dd3fb959467";

  useEffect(() => {
    if (data.type === "out-going")
      socket.current.on("accept-call", () => setCallAccepted(true));
    else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
  }, [data]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const { data } = await axios.get(`${GENERATE_CALL_TOKEN}/${UserInfo.id}`);
        console.log("token : ", data.token);
        setToken(data.token);
      } catch (err) {
        console.log("Error fetching token: ", err);
      }
    };
    getToken();
  }, [callAccepted]);

  useEffect(() => {
    console.log("Inside the useEffect");
    const startCall = async () => {
      console.log("Inside the start call");
    
      import("zego-express-engine-webrtc").then(
        async ({ ZegoExpressEngine }) => {
    
          const zg = new ZegoExpressEngine(
            NEXT_PUBLIC_ZEGO_APP_ID, NEXT_PUBLIC_ZEGO_SERVER_SECRET_ID
          );
    
          setZgVar(zg);
          console.log("zg", zg);
    
          zg.on("roomStreamUpdate", async (roomID, updateType, streamList, extendedData) => {
            if (updateType === "ADD") {
              const rmVideo = document.getElementById("remote-video");
              const vd = document.createElement(
                data.callType === "video" ? "video" : "audio"
              );
    
              vd.id = streamList[0].streamID;
              vd.autoplay = true;
              vd.playInline = true;
              vd.muted = false;
    
              if (rmVideo) {
                rmVideo.appendChild(vd);
              }
    
              console.log("rmvideo", rmVideo);
    
              try {
                const stream = await zg.startPlayingStream(streamList[0].streamID, {
                  audio: true,
                  video: true,
                });
                vd.srcObject = stream;
    
                // Assuming you want to get stats for the first track
                const track = stream.getTracks()[0];
                if (track instanceof MediaStreamTrack) {
                  zg.RTCPeerConnection.getStats(track).then((stats) => {
                    console.log(stats);
                  }).catch((error) => {
                    console.error("Error getting stats: ", error);
                  });
                } else {
                  console.error("Invalid parameter passed to getStats. Expected a MediaStreamTrack.");
                }
              } catch (error) {
                console.error("Error playing stream: ", error);
              }
            } else if (
              updateType === "DELETE" &&
              zg &&
              localStream &&
              streamList[0].streamID
            ) {
              zg.destroyStream(localStream);
              zg.stopPublishingStream(streamList[0].streamID);
              zg.logoutRoom(data.roomId.toString());
              dispatch({ type: reducerCases.END_CALL });
            }
          });
    
          zg.on("error", (error) => {
            console.error("ZegoExpressEngine error: ", error);
          });
    
          zg.on("roomStateUpdate", (roomID, state, errorCode, extendedData) => {
            if (state === "DISCONNECTED") {
              console.error(`Disconnected from room ${roomID}: `, extendedData);
              // Implement retry logic or re-request the route here
            }
          });
    
          console.log("Token inside the start call", token);
    
          try {
            await zg.loginRoom(
              data.roomId.toString(),
              token,
              { userID: UserInfo.id.toString(), userName: UserInfo.name },
              { userUpdate: true }
            );
    
            const localStream = await zg.createStream({
              camera: {
                audio: true,
                video: data.callType === "video" ? true : false,
              },
            });
            const localVideo = document.getElementById("local-audio");
            const videoElement = document.createElement(
              data.callType === "video" ? "video" : "audio"
            );
            videoElement.id = "video-local-zego";
            videoElement.className = "h-28 w-32";
            videoElement.autoplay = true;
            videoElement.muted = false;
            videoElement.playsInline = true;
            localVideo.appendChild(videoElement);
            const td = document.getElementById("video-local-zego");
            td.srcObject = localStream;
            const streamID = "123" + Date.now();
            setPublicStream(streamID);
            setLocalStream(localStream);
            await zg.startPublishingStream(streamID, localStream);
          } catch (error) {
            console.log("Error during login", error);
          }
        }
      );
    };

    if (token) {
      startCall();
    }
  }, [token]);

  const endCall = () => {
    const id = data.id;
    if (zgVar && localStream && publicStream) {
      zgVar.destroyStream(localStream);
      zgVar.stopPublishingStream(publicStream);
      zgVar.logoutRoom(data.roomId.toString());
    }
    if (data.callType === "voice") {
      socket.current.emit("reject-voice-call", {
        from: id,
      });
    } else {
      socket.current.emit("reject-video-call", {
        from: id,
      });
    }
    dispatch({ type: reducerCases.END_CALL });
  };

  return (
    <div className=" border-conversation-border  border-l w-full  bg-conversation-panel-background  flex  flex-col  h-[100vh]  overflow-hidden  items-center  justify-center  text-white">
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl">{data.name}</span>
        <span className="text-lg">
          {callAccepted && data.callType !== "video"
            ? "Whatsup Voice Call"
            : "Calling..."}
        </span>
      </div>
      {(!callAccepted || data.callType === "audio") && (
        <div className="my-24">
          <Image
            src={data.profilePicture}
            alt="avatar"
            height={300}
            width={300}
            className="rounded-full"
          />
        </div>
      )}
      <div className="my-5 relative" id="remote-video">
        <div className="absolute bottom-5 right-5" id="local-audio"></div>
      </div>
      <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
        <MdOutlineCallEnd
          className="text-3xl cursor-pointer"
          onClick={endCall}
        />
      </div>
    </div>
  );
}

export default Container;

// import { reducerCases } from "@/context/constants";
// import { useStateProvider } from "@/context/StateContext";
// import { GENERATE_CALL_TOKEN } from "@/utils/ApiRoutes";
// import axios from "axios";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { MdOutlineCallEnd } from "react-icons/md";
// import { connect } from "socket.io-client";
// import { ZegoExpressEngine } from "zego-express-engine-webrtc";
 
// function Container({data}) {
//   const[{ UserInfo,socket},dispatch]= useStateProvider();
//   const[callAccepted, setCallAccepted] = useState(false);
//   const[token ,setToken] = useState(undefined);
//   const[zgVar ,setZgVar] =useState(undefined);
//   const[localStream ,setLocalStream]= useState(undefined);
//   const[publishStream ,setPublishStream] =useState(undefined);
//  console.log("Data hai ",data);

//    const endCall = ()=>{
//      const id = data.id;
//      if(zgVar && localStream && publishStream){
//        zgVar.destroyStream(localStream);
//        zgVar.stopPublishingStream(publishStream);
//        zgVar.logoutRoom(data.roomId.toString());

//      }
//      if (data.callType == "voice") {
//           socket.current.emit("reject-voice-call" , { from : id });    
//       }
//      else{
//           socket.current.emit("reject-video-call",{from :id}); 
//       }
//      dispatch( {type : reducerCases.END_CALL })
//    }
 
//    useEffect(()=>{
//        if (data.type === "out-going") {
//            socket.current.on("accept-call", ()=> setCallAccepted(true));
//        }else{
//           setTimeout(()=>{
//                setCallAccepted(true)
//           },1000)
//        }
//   } , [data]);

//    useEffect(()=>{
//        try {
//           const getToken = async()=>{
//                const {data : { token : returnedToken}} = await axios.get(`${GENERATE_CALL_TOKEN}/${UserInfo.id}`);
//                 setToken(returnedToken);
//                 console.log("Token ", returnedToken );
//                 console.log("Type ",returnedToken.type);
//           }
//           getToken();
//        } catch (error) {
//             console.log("errror during calling generating token",error);
//        }
//   },[callAccepted]);

//    useEffect(()=>{
//              try {
//                  const startCall = async()=>{
//                         import("zego-express-engine-webrtc").then(
//                             async({ZegoExpressEngine})=>{
//                                    const zg = new ZegoExpressEngine(process.env.NEXT_PUBLIC_ZEGO_APP_ID , process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET_ID);
//                                    setZgVar(zg);

//                                    zg.on("roomStreamUpdate",async(roomID, updateType,streamList,extendedData) => {
//                                          if (updateType === "Add") {
//                                                  const rmVideo = document.getElementById("remote-video");
//                                                  const vd = document.createElement(data.callType === "video" ? "video" : "audio" );
//                                                  vd.id = streamList[0].streamID;
//                                                  vd.autoplay =true;
//                                                  vd.playsInline = true;
//                                                  vd.muted = false;

//                                                  if (rmVideo) {
//                                                       rmVideo.appendChild(vd);
//                                                  }
//                                                  console.log("rmVideo 5",rmVideo)
//                                                  zg.startPlayingStream(streamList[0].streamID , {
//                                                  audio: true,
//                                                  video : true
//                                                  }).then ((stream) => vd.srcObject =  stream)
//                                                  console.log("6",zg);
//                                          }else if(updateType==="DELETE" && zg && localStream && streamList[0].streamID){
//                                                 zg.destroyStream(localStream); console.log("7 ",localStream);
//                                                  zg.stopPublishingStream(streamList[0].streamID);
//                                                  zg.logoutRoom(data.roomId.toString());
//                                                  dispatch({type : reducerCases.END_CALL})
//                                          }
//                                    });
//                                    await zg.loginRoom(data.roomId.toString(),token,
//                                                                  {userID :UserInfo.id.toString() , userName:UserInfo.name},
//                                                                  {userUpdate :true});  // userId == userID cahnge
                                                                 
                                                                 
//                                    const stream = await zg.createStream({
//                                                         camera : {
//                                                               audio : true,
//                                                               video : data.callType === "video" ? true : false
//                                                         }
//                                                  });
//                                    const localVideo = document.getElementById ("local-audio");
//                                    const videoElement = document.createElement(  data.callType === "video" ? "video" : "audio");
                                   
//                                    videoElement.id = "video-local-zego";
//                                    videoElement.className =  "h-28 w-32";
//                                    videoElement.autoplay = true;
//                                    videoElement.muted = false;
//                                    videoElement.playsInline = true;
//                                    console.log("videoele",videoElement)
//                                    localVideo.appendChild(videoElement);

//                                    const td= document.getElementById("video-local-zego"); console.log("10",td)
//                                    td.srcObject= stream; console.log("11",localVideo)
//                                    // const streamID = String(123 + Date.now());
//                                    const streamID = "123" + Date.now();
//                                    console.log("StreamId",streamID)
//                                    setPublishStream(streamID);
//                                    setLocalStream(stream);
//                                    zg.startPublishingStream (streamID,stream);
//                             }
//                         )
//                  }

//                  if(token){
//                      startCall();
//                  }
              
//              } catch (error) {
//                console.log("Error during setting teh call",error);
//                console.error(error.message);
//              }
//    },[token])

  
//   return <div className=" w-full h-screen flex items-center flex-col bg-conversation-panel-background text-white border-conversation-border border-l ">
//                <div className=" w-full flex flex-col gap-y-10 items-center mt-24">
//                       <div className=" flex flex-col gap-y-3 items-center" >
//                             <span className=" text-5xl   text-white">{data.name}</span>
//                             <span className=" text-xl"> { callAccepted &&  data.callType !== "video" ? "on going call" : "Calling..."}</span>
//                        </div>
//                        <div >
//                               <Image alt="Avatar" src={data.profilePicture} height={300} width={300} className=" rounded-full " />
//                        </div>
//                        {/* Calling Feature ke liye */}
//                        <div className=" my-5 relative"  id="remote-video" >
//                               <div id="local-audio" className=" absolute right-5 bottom-5"></div>
//                        </div>
//                        <div className=" h-16 w-16 mt-5 bg-red-600  cursor-pointer flex items-center justify-center rounded-full "> 
//                             <MdOutlineCallEnd onClick={endCall}  className=" text-4xl hover:animate-bounce " />
//                        </div>
//                </div>
//         </div>;
// }

// export default Container;

   
