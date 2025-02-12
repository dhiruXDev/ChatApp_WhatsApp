import React, { useEffect, useState } from "react";
 import Image from "next/image";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";
function Avatar({image,setImage ,type}) {
   const[hover,setHover]=useState(false);
   
   const[isContextMenuVisible,setIsContextMenuVisible] = useState(false);
   const[contextMenuCoordinates,setContextMenuCoordinates] = useState({
       X : 0 ,
       Y : 0
   });
   const[grabPhoto,setGrabPhoto]= useState(false);
   const showContextMenu = (e)=>{
      e.preventDefault();
      setIsContextMenuVisible(true);
      setContextMenuCoordinates({X : e.pageX , Y : e.pageY})
   }
   const[photoLibrary,setPhotoLibrary]=useState(false);
   const[showCapturePhoto ,setShowCapturePhoto] = useState(false);
  
   useEffect(()=>{
        if(grabPhoto){
           const data = document.getElementById("photo-picker");
           data.click();
           document.body.focus= (e)=>{
              setTimeout(()=>{
                setGrabPhoto(false);
              },1000);
            //  setGrabPhoto(false);   ---> 
           }
        }
   },[grabPhoto]);

 const PhotoPickerChange = (e)=>{
      //In this we will save the image in the form of File 
      // VVI: Q may be in Interview how you can store the image or video in Database

     const file = e.target.files[0];
     const reader = new FileReader();
     const data = document.createElement("img");
     reader.onload = function(event){
            data.src = event.target.result ;
            data.setAttribute("data-src",event.target.result);
     }
     reader.readAsDataURL(file);
     setTimeout(() => {
        console.log( "Img src : ",data.src);
        setImage(data.src);
     }, 100);

 }

 
   const contextMenuOptions = [
      { name:"Take a Photo" , callback : ()=>{
          setShowCapturePhoto(true);
      } },

      {name : "Choose From Library" , callback : ()=>{
         setPhotoLibrary(true);
      }} ,

      {name:"Upload Photo" ,callback :()=>{
         setGrabPhoto(true);
      }},

      {name:"Remove Photo" ,callback :()=>{
        setImage("/default_avatar.png");
      }} 
   ]

  return  (
    <>
        <div className=" flex items-center justify-center "> 
             {
                type == "sm" && (
                  <div className="h-10 w-10  relative"> 
                        <Image  src={image} alt="Avtar" className=" rounded-md"   fill/> 
                  </div>
                )
             }

            {
                type == "lg" && (
                  <div className="h-14 w-14  relative"> 
                        <Image  src={image} alt="Avtar" className=" rounded-md"   fill/> 
                  </div>
                )
             }
             {
               type == "md" && (
                  <div className="relative cursor-pointer "> 
                       <div  onMouseEnter={()=>setHover(true)}
                             onMouseLeave={()=>setHover(false)}
                             className= {` ${hover ? "opacity-[1000]" : "opacity-0"} h-32 w-32  flex flex-col gap-y-2 items-center justify-center ml-4 absolute rounded-full z-10 top-0 left-0  bg-photopicker-overlay-background  cursor-pointer `}
                              onClick={(e)=>showContextMenu(e)}
                              id="context-opener"
                             > 
                              
                              <FaCamera id="context-opener"  className=" text-xl "  />
                              <p  id="context-opener" className="">Change <br/> Profile <br/> Picture </p>
                       </div>
                       <div  className=" relative flex items-center justify-center  h-32 w-32 ml-4">
                           <Image  src={image} alt="Avtar" className="rounded-full object-fill h-32 w-32"  fill /> 
                      </div>
                  </div>
                  )
             }
              {
                type == "xl" && (
                  <div className="relative cursor-pointer "> 
                       <div  onMouseEnter={()=>setHover(true)}
                             onMouseLeave={()=>setHover(false)}
                             className= {` ${hover ? "opacity-[1000]" : "opacity-0"} h-60 w-60  flex flex-col gap-y-2 items-center justify-center ml-4 absolute rounded-full z-10 top-0 left-0  bg-photopicker-overlay-background  cursor-pointer `}
                              onClick={(e)=>showContextMenu(e)}
                              id="context-opener"
                             > 
                              
                              <FaCamera id="context-opener"  className=" text-2xl "  />
                              <p  id="context-opener" className="">Change <br/> Profile <br/> Picture </p>
                       </div>
                       <div  className=" relative flex items-center justify-center   h-60 w-60 ml-4">
                           <Image  src={image} alt="Avtar" className="rounded-full object-fill h-60 w-60"  fill /> 
                      </div>
                  </div>
                )
             }
             {
                isContextMenuVisible && (
                  <ContextMenu
                    options={contextMenuOptions}
                    coordinates={contextMenuCoordinates}
                    contextMenu={isContextMenuVisible}
                    setContextMenu={setIsContextMenuVisible}
                  />
                )
             }
             {
                grabPhoto && (
                   <PhotoPicker onChange ={PhotoPickerChange} />
                )
             }
             {
              photoLibrary && (
                     <PhotoLibrary   setPhoto={setImage}  hidePhotoLibrary={setPhotoLibrary} />
              )
             }
             {
              showCapturePhoto && (
                 <CapturePhoto  setPhoto={setImage} handleCapturePhoto={setShowCapturePhoto} />
              )
             }
        </div>
        
   </>
  )
  
}

export default Avatar;
