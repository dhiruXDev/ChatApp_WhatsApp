import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import reducer from "@/context/StateReducers";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

function SearchMessages() {
  const[{currentChatUser,messages},dispatch]=useStateProvider();
  const[searchStream,setSearchStream] = useState("");
  const [SearchedMessage, setSearchedMessage] = useState([]);
   console.log("meee",messages)
  useEffect(()=>{
    if (searchStream) {
          setSearchedMessage(messages.filter((message)=>message.type === "text" && message.message.includes(searchStream) ));
    }else{
      setSearchedMessage([]);
    }
},[searchStream]);

  return <div className=" w-full h-screen border-conversation-border border-l bg-panel-header-background  z-50 flex flex-col  " >
          <div className="w-full h-16 flex gap-x-5 items-center pl-5 px bg-panel-header-background  z-[100] py-1 ">
              <IoClose 
                  onClick={()=>dispatch({type: reducerCases.SET_MEASSAGE_SEARCH})} 
                   className=" text-2xl text-panel-header-icon cursor-pointer" />
              <span className="  text-white">Search Messages</span>
          </div>

          <div className=" w-full h-full overflow-auto custom-scrollbar bg-search-input-container-background  mt-1  z-[100]">
                 <div className=" flex  flex-col w-full  ">
                      <div className=" w-full bg-search-input-container-background h-14 py-4 px-2 flex gap-x-2 items-center  justify-center   ">
                            <div className=" flex gap-x-2 py-1 px-2   w-[95%]   bg-panel-header-background items-center  focus:border-[1.5px] border-slate-500  rounded-md">
                                    <BiSearchAlt2  className=" text-panel-header-icon text-xl "/>
                                    <input 
                                          placeholder="Search Messages" 
                                          type="text"
                                          className=" bg-transparent outline-none  w-full text-white   "
                                           onChange={(e)=>setSearchStream(e.target.value)}
                                           value={searchStream}
                                          />
                            </div>
                     
                      </div>
                       
                      <div className=" mt-5 text-base  flex items-center justify-center ">
                         <span className="  text-bubble-meta text-center">{ !searchStream.length && `Search for messages with ${currentChatUser.name} `}</span>
                      </div>
                      
                      <div className=" flex flex-col  h-full ">
                         {
                            searchStream.length > 0 && !SearchedMessage.length && <span className="  text-bubble-meta  w-full text-center">No message found</span>
                         }
                         
                         <div className=" flex flex-col w-full h-full ">
                             {
                                  SearchedMessage.map((message)=>( 
                                      <div className=" flex flex-col  gap-y-1 cursor-pointer hover:bg-background-default-hover w-full  border-background-default-hover border-b-[0.1px] px-4 py-3  ">
                                            <span className=" text-sm text-bubble-meta">{calculateTime(message.createdAt)}</span>
                                            <span className="  text-sm text-icon-green">{message.message}</span>
                                       </div>
                                  ))
                             }
                         </div>
                      </div>
                 </div>
          </div>
     </div>;
}

export default SearchMessages;
