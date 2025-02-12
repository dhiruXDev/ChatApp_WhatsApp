import Image from "next/image";
import React from "react";
import { LiaLockSolid } from "react-icons/lia";
function Empty() {
  return <div className="h-screen flex flex-col py-3  justify-between border-background-default-hover  border-l   bg-panel-header-background  border-b-4 border-b-icon-green"> 
           <div className=" flex flex-col gap-y-2  items-center  justify-center mt-20 ">
               <div className=" flex flex-col items-center text-icon-lighter ">
                    <Image src={"/whatsApp.gif"} alt="WhatsApp" width={300}height={300}  />
                    <span className=" mt-5  text-white text-xl">WhatsApp for windows</span>
                    <p className=" text-sm mt-1">Send and Recieve messages without keeping your phone online.</p>
                    <p className=" text-base">Use whatsApp on up to 4 linked devices and 1 phone at a time.</p>
                </div>
           </div>
           <div className=" flex gap-x-2  items-center justify-center text-icon-lighter    font-medium   "> 
                    <LiaLockSolid  className=" font-extrabold"/>
                    <span className=" text-sm">End-to-end encrypted</span>
                </div>
  </div>;
  
}

export default Empty;
