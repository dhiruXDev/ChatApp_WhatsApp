import React, { useEffect, useRef, useState } from 'react'
import { BiMessageRoundedDetail } from "react-icons/bi";
import { IoCallOutline } from "react-icons/io5";
import { IoStarOutline } from "react-icons/io5";
import { VscArchive } from "react-icons/vsc";
import { IoSettingsOutline } from "react-icons/io5";
import { MdWifiTetheringErrorRounded } from "react-icons/md";
import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import { Profile } from '../common/Profile';
import { useClickOutside } from '@react-hooks-hub/use-click-outside';
import { EmptyForSidebar } from './EmptyForSidebar';
export const ChatListSidebar = ({}) => {
    const[{UserInfo , userContacts ,contactPage, recentlyUpdatesStatus} , dispatch] =useStateProvider();
    const[ActiveItem , setActiveItem] = useState("message");
    const[showProfileUpdateModal , setShowProfileUpdateModal] = useState(false);
    const[showEmptyModal,setShowEmptyModal] = useState(false);
    const containerRef = useRef(null);
   const [totalUnreadmessage , setTotalUnreadMossage] = useState(0);
    const MetaAiHandler =()=>{
        userContacts.forEach((contact)=>{
             if(contact?.id == -1){
                dispatch({type:reducerCases.CHANGE_CURRENT_CHAT_USER  , 
                    currentChatUser : contact
                })
             }
        })

    }
    useEffect(()=>{
           if (userContacts?.length != 0) {
                     let total =0;
                     userContacts?.map((user)=>{
                        total = total+ user.totalUnreadMessage;
                     })
                     setTotalUnreadMossage(total)
           }
    },[userContacts])
  return (
    <>
                <div className=' w-14 h-full bg-background-default-hover   z-10'>
                    <div className=' w-full h-full relative flex flex-col  justify-between '>
                        <div className=' w-full flex flex-col gap-y-2 items-center justify-center mt-16 pt-2 px-1'>
                            <div onClick={()=>{setActiveItem("message")
                                        dispatch({type : reducerCases.SET_ALL_CONTACTS_PAGE , contactPage:"default"})

                            }}
                                title='Message'
                                className={` ${ActiveItem === "message" && "bg-dropdown-background-hover " } w-full h-9  flex items-center justify-center relative hover:bg-dropdown-background-hover cursor-pointer px-1   rounded-md`}> 
                                    {
                                        ActiveItem === "message" &&<div className='   left-0 absolute w-[3px] h-[60%] bg-green-600 rounded-md '></div>
                                    } 
                                    <BiMessageRoundedDetail  className='  text-white text-2xl rotate-12   '/>
                                    {
                                        totalUnreadmessage > 0 &&  <div className=' w-4 h-4 absolute flex items-center justify-center bg-green-600 rounded-full right-1 -top-2 text-black text-xs '> <span>{totalUnreadmessage}</span> </div>

                                    }
                            </div>
                            <div onClick={()=>{setActiveItem("Call")
                                        dispatch({type : reducerCases.SET_ALL_CONTACTS_PAGE , contactPage:"calllogs"})
                            }}
                                            title='Call' 
                                            className={` ${ActiveItem === "Call" && "bg-dropdown-background-hover " } w-full h-9  flex items-center justify-center relative hover:bg-dropdown-background-hover cursor-pointer px-1   rounded-md`}> 
                                            {
                                                ActiveItem === "Call" &&<div className='   left-0 absolute w-[3px] h-[60%] bg-green-600 rounded-md '></div>
                                            }                                
                                            <IoCallOutline className=' text-white text-xl'/>
                                </div>
                                <div onClick={()=>{setActiveItem("Status")
                                             dispatch({type : reducerCases.SET_ALL_CONTACTS_PAGE , contactPage:"status"})

                                }}
                                                      
                                               title='Status' 
                                                className={` ${ActiveItem === "Status" && "bg-dropdown-background-hover " } w-full h-9  flex items-center justify-center relative hover:bg-dropdown-background-hover cursor-pointer px-1   rounded-md`}> 
                                                {
                                                    ActiveItem === "Status" &&<div className='   left-0 absolute w-[3px] h-[60%] bg-green-600 rounded-md '></div>
                                                }                                 
                                                <MdWifiTetheringErrorRounded className='  text-white text-xl'/>
                                                {
                                                    recentlyUpdatesStatus?.length > 0 && <div className=' w-2 h-2 absolute bg-green-500 rounded-full right-2 top-2'></div>
                                                }
                                </div>
                                <div className=' w-full px-1 mt-2 h-0.5 bg-input-background'>

                                </div>
                                <div
                                        onClick={()=>{ 
                                            MetaAiHandler()
                                            setActiveItem("Meta AI")
                                        }}  title='Meta AI' 
                                            className={` ${ActiveItem === "Meta AI" && "bg-dropdown-background-hover " } w-full h-9  flex items-center justify-center relative hover:bg-dropdown-background-hover cursor-pointer px-1   rounded-md`}> 
                                            {
                                                ActiveItem === "Meta AI" &&<div className='   left-0 absolute w-[3px] h-[60%] bg-green-600 rounded-md '></div>
                                            }          
                                            <img src="/avatars/meta-ai.webp" alt="profile" className=' w-6 h-6 '/>
                                </div>
                                
                        </div>
                        <div className=' w-full flex flex-col gap-y-1 items-center justify-center  pt-2 px-1 pb-2'>
                                <div onClick={()=>setShowEmptyModal(true)} title='Stated Message' className=' w-full h-9  flex items-center justify-center hover:bg-dropdown-background-hover cursor-pointer px-1   rounded-md'> 
                                        <IoStarOutline className=' text-white text-xl'/>
                                </div>
                                <div  onClick={()=>setShowEmptyModal(true)} title='Archive' className=' w-full h-9  flex items-center justify-center hover:bg-dropdown-background-hover cursor-pointer px-1   rounded-md'>
                                        <VscArchive className=' text-white text-xl'/>   
                                    </div>
                                    
                                    <div className=' w-full px-1 mt-2 h-0.5 bg-input-background'>

                                    </div>

                                    <div
                                        onClick={()=>setShowProfileUpdateModal(true)}
                                        title='Setting' className=' w-full h-9 mt-2  flex items-center justify-center hover:bg-dropdown-background-hover cursor-pointer px-1   rounded-md'> 
                                                <IoSettingsOutline className=' text-white text-2xl'/>
                                        </div>

                                    <div
                                    onClick={(e)=>{ 
                                        console.log("Profile Setting clicked")
                                        e.preventDefault()
                                        setShowProfileUpdateModal(true)}}
                                    title='Profile' className=' w-full h-12    flex items-center justify-center hover:bg-dropdown-background-hover cursor-pointer px-1   rounded-md  ' > 
                                        <img src={UserInfo?.profileImage} alt="profile" className=' w-8 h-8 '/>
                                    </div>
                                    
                        </div>
                    </div>
                </div>
                {
                    showProfileUpdateModal && <div className=' '> <Profile setShowProfileUpdateModal={setShowProfileUpdateModal}/></div>
                }
                {
                    showEmptyModal && <EmptyForSidebar setShowEmptyModal={setShowEmptyModal} />
                }
    </>
  )
  
}

// import React, { useRef, useState } from "react";
// import { BiMessageRoundedDetail } from "react-icons/bi";
// import { IoCallOutline, IoSettingsOutline } from "react-icons/io5";
// import { IoStarOutline } from "react-icons/io5";
// import { VscArchive } from "react-icons/vsc";
// import { MdWifiTetheringErrorRounded } from "react-icons/md";
// import { useStateProvider } from "@/context/StateContext";
// import { reducerCases } from "@/context/constants";
// import { Profile } from "../common/Profile";
// import { useClickOutside } from "@react-hooks-hub/use-click-outside";

// export const ChatListSidebar = () => {
//   const [{ UserInfo, userContacts }, dispatch] = useStateProvider();
//   const [ActiveItem, setActiveItem] = useState("message");
//   const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);

//   const containerRef = useRef(null);

//   // Close modal when clicking outside
//   useClickOutside([containerRef], () => setShowProfileUpdateModal(false));

//   const MetaAiHandler = () => {
//     userContacts.forEach((contact) => {
//       if (contact?.id === -1) {
//         dispatch({
//           type: reducerCases.CHANGE_CURRENT_CHAT_USER,
//           currentChatUser: contact,
//         });
//       }
//     });
//   };

//   return (
//     <>
//       <div className="w-14 h-full bg-background-default-hover z-10">
//         <div className="w-full h-full relative flex flex-col justify-between">
//           {/* Sidebar Icons */}
//           <div className="w-full flex flex-col gap-y-2 items-center justify-center mt-16 pt-2 px-1">
//             {/* Messages */}
//             <div
//               onClick={() => setActiveItem("message")}
//               title="Message"
//               className={`${
//                 ActiveItem === "message" && "bg-dropdown-background-hover"
//               } w-full h-9 flex items-center justify-center relative hover:bg-dropdown-background-hover cursor-pointer px-1 rounded-md`}
//             >
//               {ActiveItem === "message" && (
//                 <div className="left-0 absolute w-[3px] h-[60%] bg-green-600 rounded-md"></div>
//               )}
//               <BiMessageRoundedDetail className="text-white text-2xl rotate-12" />
//             </div>

//             {/* Calls */}
//             <div
//               onClick={() => setActiveItem("Call")}
//               title="Call"
//               className={`${
//                 ActiveItem === "Call" && "bg-dropdown-background-hover"
//               } w-full h-9 flex items-center justify-center relative hover:bg-dropdown-background-hover cursor-pointer px-1 rounded-md`}
//             >
//               {ActiveItem === "Call" && (
//                 <div className="left-0 absolute w-[3px] h-[60%] bg-green-600 rounded-md"></div>
//               )}
//               <IoCallOutline className="text-white text-xl" />
//             </div>

//             {/* Status */}
//             <div
//               onClick={() => setActiveItem("Status")}
//               title="Status"
//               className={`${
//                 ActiveItem === "Status" && "bg-dropdown-background-hover"
//               } w-full h-9 flex items-center justify-center relative hover:bg-dropdown-background-hover cursor-pointer px-1 rounded-md`}
//             >
//               {ActiveItem === "Status" && (
//                 <div className="left-0 absolute w-[3px] h-[60%] bg-green-600 rounded-md"></div>
//               )}
//               <MdWifiTetheringErrorRounded className="text-white text-xl" />
//             </div>

//             {/* Divider */}
//             <div className="w-full px-1 mt-2 h-0.5 bg-input-background"></div>

//             {/* Meta AI */}
//             <div
//               onClick={() => {
//                 MetaAiHandler();
//                 setActiveItem("Meta AI");
//               }}
//               title="Meta AI"
//               className={`${
//                 ActiveItem === "Meta AI" && "bg-dropdown-background-hover"
//               } w-full h-9 flex items-center justify-center relative hover:bg-dropdown-background-hover cursor-pointer px-1 rounded-md`}
//             >
//               {ActiveItem === "Meta AI" && (
//                 <div className="left-0 absolute w-[3px] h-[60%] bg-green-600 rounded-md"></div>
//               )}
//               <img src="/avatars/meta-ai.webp" alt="profile" className="w-6 h-6" />
//             </div>
//           </div>

//           {/* Bottom Sidebar Icons */}
//           <div className="w-full flex flex-col gap-y-1 items-center justify-center pt-2 px-1 pb-2">
//             <div
//               title="Stated Message"
//               className="w-full h-9 flex items-center justify-center hover:bg-dropdown-background-hover cursor-pointer px-1 rounded-md"
//             >
//               <IoStarOutline className="text-white text-xl" />
//             </div>

//             <div
//               title="Archive"
//               className="w-full h-9 flex items-center justify-center hover:bg-dropdown-background-hover cursor-pointer px-1 rounded-md"
//             >
//               <VscArchive className="text-white text-xl" />
//             </div>

//             {/* Divider */}
//             <div className="w-full px-1 mt-2 h-0.5 bg-input-background"></div>

//             {/* Settings */}
//             <div
//               onClick={() => setShowProfileUpdateModal(true)}
//               title="Setting"
//               className="w-full h-9 mt-2 flex items-center justify-center hover:bg-dropdown-background-hover cursor-pointer px-1 rounded-md"
//             >
//               <IoSettingsOutline className="text-white text-2xl" />
//             </div>

//             {/* Profile */}
//             <div
//               onClick={(e) => {
                 
//                 setShowProfileUpdateModal(true);
//               }}
//               title="Profile"
//               className="w-full h-12 flex items-center justify-center hover:bg-dropdown-background-hover cursor-pointer px-1 rounded-md"
//             >
//               <img src={UserInfo?.profileImage} alt="profile" className="w-8 h-8" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Profile Modal */}
//       {showProfileUpdateModal && (
//         <div
//           ref={containerRef}
//           className="absolute top-0 left-16 w-64 h-auto bg-white rounded-lg shadow-lg z-50 p-4"
//         >
//           <Profile setShowProfileUpdateModal={setShowProfileUpdateModal} />
//         </div>
//       )}
//     </>
//   );
// };

