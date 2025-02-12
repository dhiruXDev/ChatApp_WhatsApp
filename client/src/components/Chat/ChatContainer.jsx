import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useRef, useState } from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import dynamic from "next/dynamic";
import { FaSpinner } from "react-icons/fa";
import { Discuss } from 'react-loader-spinner'
import Image from "next/image";
import { reducerCases } from "@/context/constants";
const VoiceMessage = dynamic(() => import("./VoiceMessage"), { ssr: false });

function ChatContainer ({loading}) {
  const [{ UserInfo, currentChatUser, messages,socket },dispatch] = useStateProvider();
  const messageEndRef = useRef(null);
  const [stickyBanner, setStickyBanner] = useState(null);
  const [isBannerVisible, setIsBannerVisible] = useState(true); // State to manage visibility
  const scrollTimeoutRef = useRef(null);
  const containerRef = useRef(null);
  const bannersRef = useRef([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showImg ,setShowImg] =useState(false);
  const handleToggle = () => setIsExpanded((prev) => !prev);
  
  //----------------- For scrolling smotth --------
// Function to scroll to the latest message
  const scrollToBottom = ()=>{
        messageEndRef.current?.scrollIntoView({behavior: "smooth" })
  }
// Scroll to the latest message whenever messages change
useEffect(() => {
     scrollToBottom();
}, [messages]);
//------------------------------------------------

//------------------------- For Date banner ----------------------- 
  // Helper function to format date
  const formatDate = (date) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Helper function to check if the date is today
  const isToday = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    return (
      today.getDate() === messageDate.getDate() &&
      today.getMonth() === messageDate.getMonth() &&
      today.getFullYear() === messageDate.getFullYear()
    );
  };

  // This is for scrolling the date  banner 
  const handleScroll = () => {
    const container = containerRef.current;
  
    // Show banner when scroll starts
    setIsBannerVisible(true);
  
    // Reset the timer to hide the banner after 3 seconds of no scrolling
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  
    // Set a timeout to hide the banner after 3 seconds of no scroll
    scrollTimeoutRef.current = setTimeout(() => {
      setIsBannerVisible(false);
    }, 3000); // 3 seconds
  
    // Check if any banners should be sticky
    for (let i = 0; i < bannersRef.current.length; i++) {
      const banner = bannersRef.current[i];
      const rect = banner?.getBoundingClientRect();
      if (rect?.top <= 0 && rect.bottom > 0) {
        setStickyBanner(banner.textContent);
        break;
      }
    }
  };
  
  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);
    
    // Cleanup on component unmount
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

useEffect(() => {
  const handleScroll = () => {
    const container = containerRef.current;
    const banners = bannersRef.current;

    // Iterate over banners and check if it's about to stick
    for (let i = 0; i < banners.length; i++) {
      const banner = banners[i];
      const rect = banner?.getBoundingClientRect();

      // Check if banner is near the top and ready to stick
      if (rect?.top <= 0 && rect.bottom > 0) {
        setStickyBanner(banner.textContent);
        break;
      }
    }
  };

  const container = containerRef.current;
  container.addEventListener("scroll", handleScroll);

  return () => {
    container.removeEventListener("scroll", handleScroll);
  };
}, []);
  // Variable to track the last date
  let lastMessageDate = null;

  useEffect(() => {
    if (currentChatUser && messages?.length > 0) {
      const unreadMessages = messages.filter(
        (message) => message.senderId === currentChatUser.id && message.messageStatus !== "read"
      );
     

      if (unreadMessages.length > 0) {
        socket.current.emit("mark-as-read", {
          from: UserInfo.id,
          to: currentChatUser.id,
          messageIds: unreadMessages.map((message) => message.id),
        });

        dispatch({
          type: reducerCases.MARK_MESSAGE_AS_READ,
          messageIds: unreadMessages.map((message) => message.id),
        });
        
      }
    }
  }, [currentChatUser, messages, socket, UserInfo, dispatch]);

  return (

    <div className="h-[85vh] w-full   pr-1  ">
             <div className="w-full h-full bg-chat-background bg-fixed opacity-5 absolute left-0 top-0  "></div>
                 <div  ref={containerRef}  className="relative flex flex-col h-full overflow-auto  custom-scrollbar py-3 px-2">
                                {/* Display sticky banner */}
                                {isBannerVisible && stickyBanner && (
                                  <div className="sticky top-0   mx-auto px-4 bg-black  rounded-md text-xs text-gray-400 py-2 hover:bg-transparent duration-500 select-none ">
                                    {stickyBanner}
                                  </div>
                                )}
                      <div className="flex flex-col w-full justify-end">
                        {
                            messages?.map((message, index) => {
                                  const messageDate = isToday(message.createdAt) ? "Today": formatDate(message.createdAt);
                                  const showBanner = messageDate !== lastMessageDate;
                                  lastMessageDate = messageDate;
                            return (
                              <div key={message.id}>
                                      {/* Display date banner */}
                                      {
                                            showBanner && (
                                            <div ref={(el) => bannersRef.current.push(el)} className="text-center w-fit sticky    mx-auto px-4  rounded-md text-xs text-gray-400 py-2     hover:bg-transparent duration-500 bg-black   select-none   ">
                                                    {messageDate}
                                            </div>
                                      )}

                                      {/* Display message */}
                                      <div key={message.id} className= {` flex ${message.senderId == UserInfo.id ? " justify-end" : message.senderId === currentChatUser.id ? "justify-start" : "justify-end"} w-full `}>
                                                              {
                                                                  message.type === "text" && ( 
                                                                          <div className= {` max-w-[45%]  ${message.senderId === currentChatUser.id ? "bg-incoming-background" : "bg-outgoing-background"}  flex  flex-col    my-1 pr-3 mr1    text-white   rounded-md  pt-1 px-2  `}>                           
                                                                                  {
                                                                                    message.senderId === -1 ? (() => {
                                                                                                // Process AI message formatting
                                                                                                const AiMessage = message.message.split("**");
                                                                                                  let newFormattedAiMessage = "";
                                                                                                  for (let i = 0; i < AiMessage.length; i++) {
                                                                                                        if (i === 0 || i % 2 === 1) {
                                                                                                          newFormattedAiMessage += AiMessage[i];
                                                                                                        } else {
                                                                                                          newFormattedAiMessage += `<i>${AiMessage[i]}</i>`;
                                                                                                        }
                                                                                                  }
                                                                                                const finalFormattedMessage = newFormattedAiMessage.split("*").join("<br><br>");
                                                                                                    // Handle Read More/Read Less
                                                                                                    const wordCount = finalFormattedMessage.split(/\s+/).length;
                                                                                                    const isLongMessage = wordCount > 100;

                                                                                                    const truncatedMessage = isLongMessage
                                                                                                      ? finalFormattedMessage.split(/\s+/).slice(0, 100).join(" ") + "..."
                                                                                                      : finalFormattedMessage;

                                                                                                    return (
                                                                                                      <>
                                                                                                        <span className="break-words text-sm" dangerouslySetInnerHTML={{__html: isExpanded || !isLongMessage ? finalFormattedMessage : truncatedMessage, }}/>
                                                                                                          
                                                                                                        {isLongMessage && (
                                                                                                          <button onClick={handleToggle} className="text-blue-500 text-sm mt-2   text-left  ">
                                                                                                                <span className=" hover:text-green-400 ">{isExpanded ? "Read Less..." : "Read More...."}</span>  
                                                                                                          </button>
                                                                                                        )}
                                                                                                      </>
                                                                                                    );
                                                                                                  })()
                                                                                                  // return (
                                                                                                  //         <span className="break-all text-sm     text-primary-strong" dangerouslySetInnerHTML={{ __html: finalFormattedMessage }} />
                                                                                                  //   );
                                                                                                  // } 
                                                                                                //  )()
                                                                                  : 
                                                                                      <span className=" break-all text-sm"> {message.message}</span>
                                                                                  }
                                                                                  
                                                                                  <div className=" flex gap-1 justify-end   min-w-fit "> 
                                                                                        <span className=" text-bubble-meta text-[11px] ">{calculateTime(message.createdAt)} </span>  
                                                                                        <span className=" ">
                                                                                                  {
                                                                                                      message.senderId === UserInfo.id  &&   <MessageStatus messageStatus={ message.recieverId === -1 ? "read" :  message.messageStatus }   />
                                                                                                  } 
                                                                                        </span>
                                                                                  </div>
                                                                          </div>)
                                                                }
                                                                {
                                                                  message.type === "Image" &&(
                                                                        <ImageMessage   message={message} setShowImg={setShowImg} />
                                                                  )
                                                                }
                                                                {
                                                                  message.type === "audio" && <VoiceMessage  message = {message}/>
                                                                }
                                      </div>
                      
                              </div>
                                    
                            );

                         })
                    }
                     {
                            loading && (
                              <div className="relative mt-3 w-fit max-w-xs bg-incoming-background  text-left px-3 py-1 rounded-[3px]">
                                {/* Bubble pointer */}
                                <div className="absolute top-[2.8px] left-[-3px] w-4 h-3 bg-incoming-background  rotate-[60deg] origin-center"></div>
                                {/* Thinking text */}
                                <span className="animate-pulse text-[#d1d6db] text-sm">Thinking...</span>
                              </div>
                            )
                      }
                      { 
                            currentChatUser.id == -1 && messages?.length == 0 && 
                                   <div className=" w-full h-full relative flex items-center justify-center">  
                                         <Image src={"/avatars/emptyChatAiUI.gif"}  width={700} height={700} className=" mx-auto my-auto mt-10 " />
                                   </div>
                      }
                           {/* Add a dummy div at the bottom for scrolling */}
                        <div ref={messageEndRef}></div>
                    </div>

                 </div>     
    </div>
    
  );
}

export default React.memo(ChatContainer);

