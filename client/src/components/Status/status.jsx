import { useStateProvider } from '@/context/StateContext'
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react'
import { StatusAddingModal } from './StatusAddingModal';
import { StatusItem } from './StatusItem';
import { StatusViewer } from './StatusViewer';
import { calculateTime } from '@/utils/CalculateTime';
import { TiPlus } from "react-icons/ti";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiPlus } from "react-icons/fi";
import axios from 'axios';
import { GET_ALL_STATUS_API } from '@/utils/ApiRoutes';
import { reducerCases } from '@/context/constants';

export const Status = () => {
    const[{UserInfo,recentlyUpdatesStatus,viewedStatus,myStatus,socket},dispatch]=useStateProvider();
    const[statusUpdationModal , setStatusUpdationModal] = useState(false);
    const[statusaddingOptionModal,setStatusAddingoptionmodal] = useState(false);
    const[userStatus,setUserStatus] = useState([]);
    const[loading,setLoading] = useState(false);
    const[selectedStatus, setSelectedStatus] = useState(null); // Track clicked status
    
  // useEffect(() => {
  //   if (!recentlyUpdatesStatus) return;
  //   const myStatuses = recentlyUpdatesStatus.filter(element => element.user.id === UserInfo.id);
  //   setUserStatus(myStatuses);  // ✅ Update state once
  // }, [recentlyUpdatesStatus]);

  
  // useEffect(() => {
  //   if (!recentlyUpdatesStatus) return;
  //   const myStatuses = recentlyUpdatesStatus.filter(element => element.user.id === UserInfo.id);
  //   // setUserStatus(myStatuses);  // ✅ Update state once
  //   dispatch({type : reducerCases.SET_MY_STATUS , myStatuses})  
  // }, []);
//recentlyUpdatesStatus,myStatus
   console.log("Inside status",myStatus,recentlyUpdatesStatus)
  return (
    <div className=' w-full h-full flex flex-col   relative border-l-[1px]  border-conversation-border overflow-auto  custom-scrollbar flex-auto bg-conversation-panel-background '>
          {/* Status Header */}
          <div className=' sticky w-full h-16  flex items-center justify-between px-4'>
               <h1 className=' text-white font-semibold  text-2xl'>Status</h1>
               <div className=' flex gap-x-2 items-center justify-center text-white'>
                      <div  onClick={()=>{setStatusUpdationModal(true)}} title='add status' className=' w-9 h-9 p-1.5 flex items-center justify-center hover:bg-photopicker-overlay-background rounded-full  text-center cursor-pointer   duration-150 text-4xl'>
                        <FiPlus/>
                      </div>
                      <div  title='add status' className=' w-9 h-9 p-1.5 flex items-center justify-center hover:bg-photopicker-overlay-background rounded-full  text-center cursor-pointer   duration-150 text-4xl'>
                           <BsThreeDotsVertical />
                      </div>
               </div>
          </div>
          {/* Main status Contetn */}
          <div className=' w-full h-full flex flex-col overflow-auto  custom-scrollbar flex-auto   '>
               {/* Heading Section */}
                  <div onClick={myStatus.length > 0 ? ()=>setSelectedStatus(myStatus[0]) : ()=>setStatusUpdationModal(true)} className=' flex gap-x-4 hover:bg-background-default-hover rounded-md mx-2 py-2 px-2  relative'>
                            <div  className={` relative ${ myStatus.length !==  0  &&" border-green-600 border-[3px]"   }   rounded-full p-0.5 `}>
                                    <Image src={UserInfo?.profileImage} alt='Profile' width={50} height={50}  />
                                   {
                                       myStatus?.length ==  0 && <span className=' text-white  bg-[#00A884] rounded-full text-sm p-0.5 border-[2px] border-black absolute z-[] left-7 bottom-0'><TiPlus/></span>
                                   }
                            </div>
                            <div className=' w-full flex flex-col  gap-y-1 cursor-default     '>
                                <span className=' text-md font-semibold text-white'>My Status</span>
                                <span className={`text-sm text-panel-header-icon ${loading && 'animate-pulse'} `}> {loading ? 'Sending...'   :  myStatus.length > 0 ? `${calculateTime(myStatus?.[0]?.statuses[0]?.createdAt)}` : "Click to add Status update"}</span>
                            </div>
                    </div>
                 
                                   
                {/*Recently added Status  */}
                <div className=' flex flex-col w-full relative px-2  '>
                       <div className=' flex mt-2 '>
                           <span className=' text-panel-header-icon text-base '>Recent updates</span>
                       </div>
                       <div  className=' w-full h-auto flex flex-col gap-y-2  mt-2 '>
                              {
                                recentlyUpdatesStatus?.length == 0 ?  <div className=' w-full h-full   mt-40   text-center text-panel-header-icon text-sm '> <span>No recent updates</span> </div>   : 
                                (
                                  recentlyUpdatesStatus?.map((contact,index)=>(
                                     contact?.user?.id !== UserInfo.id &&   //this is saying when me whatsapp then recentlyview me mt dikhao mere status ko
                                        <div key={index} onClick={()=>{setSelectedStatus(contact)}} >
                                            <StatusItem key={index} data={contact} type='recently'  />
                                        </div>
                                  )) 
                                )
                              }
                       </div>
                </div>
               {/* Viewd Status  */}
          </div>
               {
                statusUpdationModal && <StatusAddingModal setStatusUpdationModal={setStatusUpdationModal} setLoading={setLoading} />
               }
              {/* Status Viewer Modal */}
              {
                 selectedStatus && <StatusViewer selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
              }
         
    </div>
  )
}
 