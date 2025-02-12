import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPauseCircle, FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";
import { FaCircle } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { FaPause } from "react-icons/fa6";
import axios from "axios";
import { ADD_AUDIO_MESSAGE_API, ADD_MESSAGE_API } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
function CaptureAudio({hide , setLoading}) {
  const[{UserInfo,currentChatUser,socket},dispatch]=useStateProvider();

// const [audioChunks, setAudioChunks] = useState([]); // Store all recorded chunks
//const [isPaused, setIsPaused] = useState(false); // Track whether recording is paused

  const[isRecording, setIsRecording] =useState(false);
  const[recordedAudio, setRecordedAudio] =useState(null);
  const[waveForm, setWaveForm] =useState(null);
  const[recordingDuration, setRecordingDuration] =useState(0);
  const[currentPlaybackTime, setCurrentPlayBackTime] =useState(0);
  const[totalDuration, setTotalDuration] =useState(0);
  const[isPlaying, setIsPlaying] =useState(false);
  const[renderAudio ,setRenderAudio]= useState(null);

  const audioRef =useRef(null);
  const mediaRecorderdRef =useRef(null);
  const waveFormRef = useRef(null);
  
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };

  }, [isRecording]);
 
  useEffect(()=>{
    // Initilizing WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container : waveFormRef.current,
      waveColor : "#ccc",
      progressColor : "#4a9eff",
      cursorColor : "#7ae3c3",
      height :20,
      barWidth : 2 ,
      responsive: true,
      
    });
    setWaveForm(wavesurfer);
  
    // when wevesurfer / recording is done i want to false the Isplaying state
    wavesurfer.on("finish",()=>{
      setIsPlaying(false);
      
    })
    return ()=>{
      wavesurfer.destroy();
    }

  },[]);
 


// This is for realtine audio waveform updating 

  // useEffect(() => {
  //   const wavesurfer = WaveSurfer.create({
  //     container: waveFormRef.current,
  //     waveColor: "#ccc",
  //     progressColor: "#4a9eff",
  //     height: 30,
  //     barWidth: 2,
  //     responsive: true,
  //     backend: "WebAudio", // Use WebAudio backend
  //     interact: false, // Disable interaction during recording
  //   });
  //   setWaveForm(wavesurfer);
  
  //   wavesurfer.on("finish", () => {
  //     setIsPlaying(false);
  //   });
  
  //   return () => {
  //     wavesurfer.destroy();
  //   };
  // }, []);
  
  useEffect(()=>{
    if (waveForm) {
       handleStartRecording();
    }
  },[waveForm])

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlayBackTime(recordedAudio.currentTime);
      };
  
      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
  
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [recordedAudio]);
  
  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveForm.stop();
      waveForm.play();
      recordedAudio.play();
      setIsPlaying(true);
      //setIsRecording(false);
    }
  };

 const handlePauseRecording = ()=>{
      waveForm.stop();
      recordedAudio.pause();
      setIsPlaying(false);
 }

// const [playbackPosition, setPlaybackPosition] = useState(0);

// const handlePlayRecording = () => {
//   if (recordedAudio) {
//     // Resume from the paused position
//     waveForm.seekTo(playbackPosition / waveForm.getDuration());
//     waveForm.play();
//     recordedAudio.play();
//     setIsPlaying(true);
//   }
// };

// const handlePauseRecording = () => {
//   if (recordedAudio) {
//     // Store the current playback position
//     setPlaybackPosition(waveForm.getCurrentTime());
//     waveForm.pause();
//     recordedAudio.pause();
//     setIsPlaying(false);
//   }
// };
// useEffect(() => {
//   if (waveForm) {
//     // Reset cursor when playback finishes
//     waveForm.on("finish", () => {
//       setIsPlaying(false);
//       setPlaybackPosition(0); // Reset playback position
//       waveForm.seekTo(0); // Move the cursor back to the start
//     });
//   }
//   return () => {
//     if (waveForm) {
//       waveForm.destroy(); // Clean up
//     }
//   };
// }, [waveForm]);


 const handleStartRecording = ()=>{

      setIsRecording(true);
      setTotalDuration(0);
      setCurrentPlayBackTime(0);
      setRecordingDuration(0);
      // setRecordedAudio(null); 

      navigator.mediaDevices.getUserMedia({audio:true})
              .then((stream)=>{
              //  console.log("Stram",stream);
                const mediaRecorder= new MediaRecorder(stream);
                mediaRecorderdRef.current = mediaRecorder;
                audioRef.current.srcObject = stream;

                const chunks = [];
                mediaRecorder.ondataavailable = (e)=>chunks.push(e.data);
                mediaRecorder.onstop = ()=>{
                  const blob=  new Blob(chunks,{type : "audio/ogg; codec=opus"});
                  const audioUrl = URL.createObjectURL(blob);
                  const audio = new Audio(audioUrl);
                  setRecordedAudio(audio);
                  waveForm.load(audioUrl);
                };
                mediaRecorder.start();
              })
              .catch((err)=>{
                   console.log( "Error during accesing microphone",err);
              })
              
 }

// const handleStartRecording = () => {
//   setIsRecording(true);
//   setTotalDuration(0);
//   setCurrentPlayBackTime(0);
//   setRecordingDuration(0);

//   navigator.mediaDevices.getUserMedia({ audio: true })
//     .then((stream) => {
//       console.log("Stream", stream);
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderdRef.current = mediaRecorder;
//       audioRef.current.srcObject = stream;

//       const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//       const source = audioContext.createMediaStreamSource(stream);
//       waveForm.backend.setAudioContext(audioContext); // Use WaveSurfer's backend for audio context
//       waveForm.loadDecodedBuffer(source); // Load audio data into WaveSurfer

//       const chunks = [];
//       mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
//       mediaRecorder.onstop = () => {
//         const blob = new Blob(chunks, { type: "audio/ogg; codec=opus" });
//         const audioUrl = URL.createObjectURL(blob);
//         const audio = new Audio(audioUrl);
//         setRecordedAudio(audio);
//         waveForm.load(audioUrl); // Load full recording after stop
//       };

//       mediaRecorder.start();
//     })
//     .catch((err) => {
//       console.log("Error during accessing microphone", err);
//     });
// };


 const handleStopRecording = () => {
  if (mediaRecorderdRef.current && isRecording) {
    setIsRecording(false);
    mediaRecorderdRef.current.stop();
    waveForm.stop();

    const audioChunks = [];
    mediaRecorderdRef.current.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorderdRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/ogg; codecs=opus" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl); // Keep audio consistent
      setRecordedAudio(audio);
      waveForm.load(audioUrl);

      const audiosBlob = new Blob(audioChunks, { type: "audio/mp3" });
      const audioFile = new File([audiosBlob],"recording.mp3");
      setRenderAudio(audioFile);

    };
  }
};

const formatTime = (time) => {
  if (isNaN(time)) return "00:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};
 const sendRecording = async()=>{
  handleStopRecording();
        try {
            const formdata = new FormData();
            formdata.append("audio",renderAudio);
            const response = await axios.post(ADD_AUDIO_MESSAGE_API , formdata , {
                  headers: {
                        "Content-Type" : "multipart/form-data"
                  },
                  params : {
                    from : UserInfo.id,
                    to : currentChatUser.id
                  },
            })
            if (response.data.success) {
                  socket.current.emit("send-msg" , {
                          to: currentChatUser.id,
                          from : UserInfo.id,
                          message : response.data.message
                  });
                    dispatch({type : reducerCases.ADD_MESSAGE , 
                                newMessage : { ...response.data.message},
                                fromSelf : true  
                  })
            // Clear the recording data and update the state after sending the data 
                setIsPlaying(false);
                setRecordedAudio(null);
                setRenderAudio(null);
                setIsPlaying(false); 
                setCurrentPlayBackTime(0);
                setTotalDuration(0);
                hide();  // For hiding the bar recoring bar
            }
            console.log("Inside send Recording ")
            // Response to AI 
            if (currentChatUser.id === -1) {
              console.log("Inside send Recording 1")
              setLoading(true);
              let AiResponse = "Sorry,  I can't access files from your computer. You can describe the Audio or upload it to an any Audio/Video hosting site (like Imgur, Mongoose) and provide me  the link , I'll give you the best response."
              const { data } = await axios.post(ADD_MESSAGE_API, {
                  from: currentChatUser?.id,
                  to: UserInfo?.id,
                  message:AiResponse,
              });
              socket.current.emit("send-msg", {
                  from: currentChatUser.id,
                  to: UserInfo.id,
                  message: data.message,
                  });
              dispatch({
                  type: reducerCases.ADD_MESSAGE,
                  newMessage: { ...data.message },
                  fromSelf: true,
              });
              setLoading(false); 
        }
        console.log("Inside send Recording 3")
              
            } catch (error) {
              console.log("Error ",error)
            }
 }
 
  return <div className=" flex items-center gap-x-2 justify-end w-full h-full  pr-2">
          <div className="  text-panel-header-icon text-lg  justify-end ">
             <FaTrashCan  title="Discard voice message" className=" cursor-pointer " onClick={()=>hide()} />
          </div>
          <div className=" flex items-center gap-x-2   bg-input-background rounded-2xl  px-2 py-0.5 "  >
                 { 
                    isRecording ? (
                       <div className="  text-red-500 animate-pulse   text-center flex gap-x-3 items-center py-1 pr-2  "><FaCircle className="text-xs " /> <span className="  text-xs">Recording { (totalDuration)}s</span> </div>
                    ) : (
                      <div>
                        {
                          recordedAudio && (
                            <> 
                                {
                                  !isPlaying ? (<FaPlay  onClick={handlePlayRecording} className="  px-1   text-lg   text-bubble-meta" />) 
                                                : 
                                                <FaPause  onClick={handlePauseRecording} className="  px-1 text-lg  text-bubble-meta " />
                                }
                            </>
                          )
                        }
                      </div> 
                    )
                 }
                {/* this div for wave form */}
                <div ref={waveFormRef}  hidden = {isRecording}  className=" w-40  " />
                {/* <div ref={waveFormRef} hidden={!isRecording && !recordedAudio} className="w-40" /> */}
                {
                   recordedAudio && isPlaying && ( <span className=" text-white pl-2 pr-1">{formatTime(currentPlaybackTime)}</span>)
                }

                {
                   recordedAudio && !isPlaying && (<span className=" text-white pl-2 pr-1">{formatTime(totalDuration)}</span>)
                }

                <audio ref={audioRef} hidden className="" />


          </div>
          <div className=" ml-2 mr-4 text-bubble-meta">
                     {
                        !isRecording ? ( <FaMicrophone title={"Resume recording"} className=" cursor-pointer text-red-500 " onClick={handleStartRecording} />) 
                                        : 
                                       (<FaPause  title="Pause recording" className="  text-white text-lg "  onClick={handleStopRecording} />)
                     }
                </div>
           <div>
                    <MdSend title="Send" onClick={sendRecording} className=" text-xl cursor-pointer text-panel-header-icon " />
          </div>
  </div>;
}

export default CaptureAudio;
