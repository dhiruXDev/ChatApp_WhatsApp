import React, { useEffect, useRef } from "react";
import {IoClose} from "react-icons/io5"
function CapturePhoto({setPhoto,handleCapturePhoto}) {
   const videoRef = useRef(null);
   useEffect(()=>{
      let stream ;
      const startCamera = async()=>{
        stream = await navigator.mediaDevices.getUserMedia({
          video:true,
          audio :false
        })
        videoRef.current.srcObject  = stream;
      };

      startCamera();
      console.log("Camera",stream)
      return ()=>{
        stream?.getTracks().forEach((track) => {track.stop()});
      }
   } ,[]);
   const capturePhoto =()=>{
       const canvas = document.createElement("canvas");
       canvas.getContext("2d").drawImage(videoRef.current,0,0,300,150);
       setPhoto(canvas.toDataURL("image/jpeg"));
       handleCapturePhoto(false)
   }
  return (
          <div className=" absolute h-[70%] w-[40%] top-[20%] left-1/3  z-50 rounded-md  bg-gray-900 p-4 flex flex-col gap-y-3 items-center justify-center">
                  <div   onClick={()=>handleCapturePhoto(false)} className="  flex  justify-end flex-col items-end">
                        <IoClose  className=" h-10 w-10  cursor-pointer hover:scale-110  duration-200 ease-linear"/>
                  </div>

                  <div className=" flex justify-center  rounded-md">
                       <video id="video" autoPlay  width={400} ref={videoRef}></video>
                  </div>

                  <button  onClick={capturePhoto} className=" hover:scale-110  duration-200 ease-linear h-16 w-16 rounded-full bg-white border-8 border-blue-400 cursor-pointer mt-3 ">
                    
                  </button>
          </div>
  )
}

export default CapturePhoto;
