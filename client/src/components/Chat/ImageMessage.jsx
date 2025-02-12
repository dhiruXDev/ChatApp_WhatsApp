import { useStateProvider } from "@/context/StateContext";
import { BASE_URL } from "@/utils/ApiRoutes";
import React, { useState } from "react";
import Image from "next/image";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { BiCross } from "react-icons/bi";
function ImageMessage({message, }) {
  const[{UserInfo ,currentChatUser}]= useStateProvider();
  const[isShowImg , setShowImg] = useState(false);  
  
  return(
        <>
              <div onClick={()=>{ 
                  setShowImg( true)}}   className= {`p-1 my-1 rounded-lg ${message.senderId === currentChatUser.id ? "bg-incoming-background" : "bg-outgoing-background"} cursor-pointer relative`}>
                 <div  className=" relative">
                      <Image src={`${BASE_URL}/${message.message}`}  alt="Image"  height={300} width={ 300} className=" rounded-lg"/>
                </div> 
                <div className=" flex   gap-x-1 items-center justify-end ">
                       <span className="  text-bubble-meta text-[11px]">{calculateTime(message.createdAt)}</span>
                        <span>
                                {  message.senderId === UserInfo.id && <MessageStatus  messageStatus={ message.recieverId === -1 ? "read" :  message.messageStatus }  /> }
                        </span>
                </div> 
               
         </div>
           {
            isShowImg && 
                         <div className="fixed inset-0 bg-black bg-opacity-80  h-full w-full   flex items-center justify-center z-[100] ">                                  
                                          <button onClick={() =>setShowImg(false)} className="absolute top-5 right-5 z-[1000] text-white text-2xl">
                                             ✖ 
                                         </button>
                                         <div className="relative w-full h-full flex flex-col items-center justify-center">
                                               <div  className="max-w-[500px]   h-[95vh] flex items-center justify-center border-[1.5px]    border-blue-500  rounded-lg shadow-lg p-2 relative ">
                                                        
                                                            <img src={`${BASE_URL}/${message.message}`} alt="Image" className="  w-full h-full relative z-50 rounded-lg   mx-auto  object-cover  "  />
                                                             {/* <Image src={`${BASE_URL}/${message.message}`}  alt="Image" width={500} height={500} className="  relative z-50 rounded-lg   mx-auto      "/> */}
                                                      
                                               </div>
                                         </div>
                         </div>
          }  
       
          
</>
  ) 
  
}

export default ImageMessage;
