import Image from "next/image";
import React from "react";
import {IoClose} from "react-icons/io5"
function PhotoLibrary({setPhoto ,hidePhotoLibrary}) {
   const images = [
      "/avatars/1.png",
      "/avatars/2.png",
      "/avatars/3.png",
      "/avatars/4.png",
      "/avatars/5.png",
      "/avatars/6.png",
      "/avatars/7.png",
      "/avatars/8.png",
      "/avatars/9.png"
   ] ;

  return(
         <div className="max-w-[100vw] max-h-[100vh]  left-0 top-0 h-full w-full fixed  flex items-center justify-center  z-50   ">
                 <div className="absolute  h-max w-max   p-2   bg-gray-900 flex flex-col gap-y-6 cursor-pointer rounded-md ">
                         <div onClick={()=>hidePhotoLibrary(false)} className=" flex justify-end  ">
                            <IoClose  className=" h-10 w-10  hover:bg-slate-800"/>
                         </div>
                         <div className=" grid grid-cols-3 grid-rows-3 justify-between items-center  px-10 pb-5 gap-10 ">
                              {
                                 images.map((image,index)=>(
                                        <div  onClick={()=> { setPhoto(images[index]) ;
                                                              hidePhotoLibrary(false)}
                                                     } > 
                                                  <div  className=" h-24 w-24 cursor-pointer  rounded-full relative">
                                                        <Image src={image}  alt="Avatar" fill /> 
                                                  </div>
                                  </div>
                                 ))
                              }
                         </div>
                 </div>
         </div>
  )
}

export default PhotoLibrary;
