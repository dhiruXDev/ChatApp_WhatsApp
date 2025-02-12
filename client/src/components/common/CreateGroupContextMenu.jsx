import { useStateProvider } from '@/context/StateContext'
import React, { useState } from 'react'
import Avatar from './Avatar';
import { FaArrowLeft } from "react-icons/fa6";
import { SiTicktick } from "react-icons/si";
import { TiTick } from "react-icons/ti";
export const CreateGroupContextMenu = ({setShowCreateGroupContextMenu}) => {
  const[{userContacts} ]= useStateProvider();
  const [selectedMembers, setSelectedMembers] = useState([]);  
  
  const addGroupMemberHandler = (user) => {
    setSelectedMembers((prev) =>
      prev.find((member) => member.id === user.id)? prev.filter((member) => member.id !== user.id): [...prev, user]
    );

  };
  const createGroupHandler =()=>{
        
  }

  return (
    <div className=' absolute top-10 z-[1000]   left-40  w-[320px] max-h-[460px]  pt-3 text-primary-strong  bg-conversation-panel-background border-slate-700 border-[1.5px]  rounded-md   '>
            <div className=' flex   gap-x-4 border-b-[1px] pb-4  border-y-input-background items-center'>
                 <div onClick={()=>setShowCreateGroupContextMenu(false)}  className=' ml-2 w-8 h-8 hover:bg-background-default-hover  cursor-pointer duration-200    rounded-full flex items-center  justify-center  '>< FaArrowLeft className='  text-icon-lighter  text-lg  ' /></div>  
                  <h1 className='  text-xl  '>Create Group</h1>
                  {
                       selectedMembers?.length > 0 &&  <span className=' text-icon-lighter  text-sm mt-1 '>{selectedMembers?.length}/{userContacts?.length}</span>
                  }
             </div>
             {
                  userContacts?.length === 0 ? ( <div className=' flex w-full h-full items-center justify-center py-10 '> <span className=' text-icon-lighter text-sm '>No contacts found</span> </div>) 
                  : 
                   <div className='custom-scrollbar max-h-[400px] overflow-y-auto  mt-2   '>
                      <p  className=' pl-4 pb-2 text-sm text-icon-lighter'>All contacts</p>
                      {
                         userContacts?.map((user,id)=>(
                            user.id !== -1 &&   //  Removing the  Ai from userContacts 
                               <div key={id} onClick={()=>addGroupMemberHandler(user)} className=' px-4 flex gap-x-3 items-center py-2  bg-transparent cursor-pointer  hover:bg-background-default-hover duration-150 relative'> 
                                   <Avatar image={user?.profilePicture} type={"sm"}  />
                                   <div className=' flex flex-col'>
                                           <span  className=' text-base   text-gray-200'>{user?.name}</span>
                                           <span className=' text-xs text-icon-lighter'>{user?.about.length > 30 ?  user?.about.slice(0,30)+"..." : user?.about}</span>
                                     </div>
                                    {
                                       selectedMembers.find((member) => member.id === user.id)  && <div className='absolute right-5 w-5 h-5  bg-green-600   text-black rounded-full flex items-center justify-center'> <TiTick className=' ' /> </div>
                                    }
                               </div>
                          ))
                        }
                        {
                          selectedMembers?.length > 0 && <div className=' flex justify-center mt-5 pb-4'> <button onClick={createGroupHandler} className=' bg-green-600    text-black  font-normal px-3 py-1.5 text-sm  rounded-md hover:bg-green-500 duration-150   '>Create group</button> </div>
                        }
                  </div>
             }
    </div>
  )
}
  