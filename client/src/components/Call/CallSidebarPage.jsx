import { useStateProvider } from '@/context/StateContext'
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react'
 
import { TiPlus } from "react-icons/ti";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiPlus } from "react-icons/fi";
import { MdAddIcCall } from "react-icons/md";
import SearchBar from '../Chatlist/SearchBar';
import { BiSearchAlt2 } from 'react-icons/bi';
import axios from 'axios';
import { GET_ALL_CONTACTS } from '@/utils/ApiRoutes';
import Avatar from '../common/Avatar';

export const CallSidebarPage = () => {
    const [searchContact, setSearchContact] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [allContacts, setAllContacts] = useState([]);

    useEffect(() => {
      if (searchTerm.length) {
        const filteredContact = {};
        Object.keys(allContacts).forEach((key) => {
          const filteredUsers = allContacts[key].filter((obj) =>
                 obj.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filteredUsers.length > 0) {
                filteredContact[key] = filteredUsers;
          }
        });
        setSearchContact(filteredContact);
      } else {
        setSearchContact(allContacts);  
      }
    }, [searchTerm])

      useEffect(() => {
    const getContcts = async () => {
      try {
        const { data: { users } } = await axios.get(GET_ALL_CONTACTS);
         
        setAllContacts(users);
        setSearchContact(users);  // with one search contact state i can mange the both UI first searched UI and nomal all contacts UI
      }
      catch (error) {
        console.log("Error during fetching all contacts", error)
      }
    }
    if (!searchTerm) {
        getContcts();
    }
    //  getContcts();   ->> I can also use this but the issue arise , when i search something ,okk and found or not dont't matter ,but when it refresh the contact page vala all contacts become so i used this condiotion , if search data is present the no call for getting all contacts

  }, []);
       
  return (
    <div className=' w-full h-full flex flex-col   relative border-l-[1px]  border-conversation-border overflow-auto  custom-scrollbar flex-auto bg-conversation-panel-background '>
          <div className='   w-full h-fit  flex  flex-col  px-4 pt-4  '>
             <div className=' flex items-center justify-between '>
                        <h1 className='  text-primary-strong font-semibold  text-2xl'>Call</h1>
                        <div className=' text-primary-strong  flex gap-x-2 items-center justify-center  '>
                                <div    title='Connect call' className=' w-9 h-9 p-1.5 flex items-center justify-center hover:bg-photopicker-overlay-background rounded-full  text-center cursor-pointer   duration-150 text-4xl'>
                                    <MdAddIcCall/>
                                </div>
                                <div  title='add status' className=' w-9 h-9 p-1.5 flex items-center justify-center hover:bg-photopicker-overlay-background rounded-full  text-center cursor-pointer   duration-150 text-4xl'>
                                    <BsThreeDotsVertical />
                                </div>
                        </div>
               </div>
               <div>
                     <div className="h-10 w-full bg-panel-header-background flex gap-x-3 mt-3 focus-within:border-green-500   focus-within:border-b-2 items-center px-4 py-2 rounded-md  ">
                               <BiSearchAlt2 className=" text-xl  text-panel-header-icon " />
                               <input
                                 type="text"
                                 placeholder="Search or start a new call"
                                 className=" w-full  text-white  bg-transparent  focus:outline-none  pr-4 "
                                 value={searchTerm}
                                 onChange={(e) => setSearchTerm(e.target.value)}
                               />
                             </div>
               </div>
          </div>
          {/* Main status Contetn */}
          <div className=' w-full h-full flex flex-col overflow-auto  custom-scrollbar flex-auto mt-4 px-2   '>
                 
                {/*Recently added Status  */}
                <div className=' flex flex-col w-full h-full relative px-2  '>
                       <div className=' flex mt-2 '>
                           <span className=' text-panel-header-icon text-base '>Recent updates</span>
                       </div>
                          {  searchTerm.length > 0 ? 
                                Object.keys(searchContact).length > 0 ?
                                (
                                            Object.entries(searchContact).map(([initialLetter, AllUsers]) => (
                                            <div key={Date.now() + initialLetter} className="">
                                                {/* <div className=" text-teal-light py-6 px-6"> {initialLetter} </div> */}
                                                {
                                                AllUsers.map((contacts) => (
                                                    <div className=' flex justify-between items-center w-full bg-photopicker-overlay-background gap-x-2 text-panel-header-icon my-2 py-2 px-2 rounded-md '> 
                                                            <div className=' flex gap-x-2'> 
                                                                    <div> 
                                                                        <Avatar image={contacts.profilePicture} type={'lg'} />
                                                                    </div>
                                                                    <div className=' flex flex-col gap-y-1 '> 
                                                                            <span className=''>{contacts.name}</span>
                                                                            <span className='  text-sm'>{contacts.about}</span>
                                                                    </div>
                                                            </div>
                                                            
                                                            <div className=' flex    relative cursor-pointer   w-10 h-10 bg-green-600 hover:bg-green-700 duration-200 text-black p-2 rounded-full   items-center justify-center   '> 
                                                                    <MdAddIcCall className=''/>
                                                            </div>
                                                    </div>
                                                ))
                                                }
                                            </div>
                                            ))
                                        
                                ) : (
                                    <span className=" text-sm text-bubble-meta  w-full  mt-[50%]  flex items-center justify-center">No result found</span>
                                ) 
                                : 
<div  className=' w-full h-full flex flex-col items-center justify-center   '>
                              <span className=' text-panel-header-icon text-sm'>No Call Logs here ! </span>
                       </div>
                            }

                       
                </div>
               {/* Viewd Status  */}
          </div>
              
         
    </div>
  )
}
