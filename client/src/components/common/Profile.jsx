import { useStateProvider } from '@/context/StateContext';
import React, { useEffect, useRef, useState } from 'react'
import { FiCamera } from "react-icons/fi";
import { GoPerson } from "react-icons/go";
import { MdOutlineMail } from "react-icons/md";
import Avatar from './Avatar';
import axios from 'axios';
import { reducerCases } from '@/context/constants';
import { EDIT_PROFILE_DETAILS_API, EDIT_PROFILE_IMAGE_API } from '@/utils/ApiRoutes';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useClickOutside } from '@react-hooks-hub/use-click-outside';
import { IoClose } from "react-icons/io5";

export const Profile = ({setShowProfileUpdateModal ,}) => {
    const[{UserInfo, contactPage ,userContacts},dispatch] =useStateProvider();
    const[logOutshowModal,setLogOutShowModal] = useState(false);
    const[profileLoading,setprofileLoading] = useState(false);
    const[detailsLoading,setDetailsLoading] = useState(false);
    
    const[image,setImage] = useState(UserInfo?.profileImage);  /// By default it will be the image of the user , As changing the image will be the change on the UI
    const[formData,setFormData] = useState({name:"", email:"", about:""});
    const router = useRouter();
    
//     const containerRef = useRef(null);

//      const handleClickOutside = (event) => {
//              console.log("first click outside",event.target,event);
//              console.log(containerRef.current)
//              if (containerRef.current ) {
//                  setShowProfileUpdateModal(false);
//              }
//          };
     
           
// // THis will close the modal when clicked outside the modal
 
//      useClickOutside([containerRef],handleClickOutside)
// THis is the custom hook which will close the modal when clicked outside the modal
//-------------------------------------------------------------
        const detailsChangerHandler = async()=>{
                const toastId =  toast.success("Please fill the details to update");
                if(formData.name === "" && formData.email === "" && formData.about === ""){
                        toast.error("Please fill the details to update");
                        return;
               }
               
                formData.name =  formData.name === "" ?  UserInfo.name :  formData.name;
                formData.email =  formData.email === "" ?  UserInfo.email :  formData.email;
                formData.about =  formData.about === "" ?  UserInfo.about :  formData.about;

                setDetailsLoading(true);
                try {
                       const res = await axios.post(`${EDIT_PROFILE_DETAILS_API}/${UserInfo.id}` , formData); 
                       console.log("Response from the server",res);
                          if(res.data.success){
                                dispatch({type:reducerCases.SET_USER_INFO,UserInfo:{...UserInfo,name:res.data.data.name, 
                                                                                                email:res.data.data.email,
                                                                                                about:res.data.data.about}}
                                                                                                );
                          }  
                          toast.success("Profile is Updated Succesfully")
                        setFormData({name:"", email:"", about:""});
                        setDetailsLoading(false);
                } catch (error) {
                        console.log("error during updating the Profile", error);

                }
                setDetailsLoading(false);
        }
        const changeHandler = (e)=>{
                e.preventDefault();
                setFormData((prevData)=>(
                        {
                                ...prevData,
                                [e.target.name] : e.target.value
                        }
                ))
        }

        const logOutHandler =(e)=>{
        //    e.preventDefault();
           router.push("/logout");// it will redirect to the logout page
        }
           
        const profileImageUploadHandler = async()=>{
                setprofileLoading(true);
                 try {   
                        const Picture = image;
                        console.log("Files is ",Picture);
                         const res = await axios.post(`${EDIT_PROFILE_IMAGE_API}/${UserInfo?.id}` ,{Picture});
                         console.log("Response from Uploading image ",res);
                         if(res.data.success){
                                setImage(res.data.data.profilePicture); 
                                dispatch({type : reducerCases.SET_USER_INFO,UserInfo : {...UserInfo,
                                        profileImage:image}})    
                         }
                         toast.success("Profile Picture is Updated Succesfully")
                 } catch (error) {
                        console.log("error during updating the Profile", error);

                }
                setprofileLoading(false);
        }
  return (
    <div  className=' absolute left-2 bottom-2 z-[1000]  ease-in-out duration-200 '> 
                {/* <div className='w-full h-full  bg-dropdown-background-hover bg-opacity-90 z-[-10] absolute top-0 left-0 '></div> */}
                <div className=' w-[425px] h-fit relative    text-primary-strong  bg-conversation-panel-background border-slate-700 border-[1.5px]  rounded-md z-[100]   '>
                        <button onClick={()=>setShowProfileUpdateModal(false)} className=' w-full  flex justify-end items-end  mt-2    '> <IoClose title='Close' className=' mr-4 w-fit h-fit text-red-800 text-2xl   hover:bg-panel-header-background px-1 py-1  rounded-full ' /> </button>
                        <div className=' w-full h-full flex flex-col gap-y-1   '>
                                {/* Profiel Section */}
                                <div className=' flex flex-col items-center  pt-2 px-4  '>
                                        <h1 className=' text-xl text-panel-header-icon '>Profile</h1>
                                        <span className=' text-icon-lighter text-sm'>Your Profile Information</span>
                                        <div className=' flex items-center justify-center mt-4 '>
                                                {/* This will automatically give the option for taking image , or chossing image  */}
                                                <div className=' flex-col   flex items-center justify-center group '>
                                                     <Avatar type={"md"} image={image}  setImage ={setImage} />
                                                     <div className='  relative -top-8 left-12 right-0 bottom-0 w-8 h-8  group-hover:opacity-20 bg-green-600  text-black rounded-full flex items-center justify-center'> 
                                                        <FiCamera className=' ' /> 
                                                     </div>
                                                       {
                                                         profileLoading && <span className=' absolute   bottom-0 text-base text-icon-lighter  animate-pulse'>Loading...</span>
                                                       }
                                                </div> 
                                        </div>
                                        {
                                                 
                                                <div  className={` ${image == UserInfo?.profileImage ? "opacity-0" : "opacity-100"}  w-full  flex  justify-end `}>
                                                     <button onClick={profileImageUploadHandler} className={` bg-green-600 hover:bg-green-700 duration-150 text-base text-black py-1.5 px-4 rounded-md ${detailsLoading && 'animate-pulse'} `} >{detailsLoading ? "Saving..." : "Save"}</button>
                                                </div>
                                        } 
                                </div> 
                                <div className=' w-full flex flex-col    px-4     gap-y-2  border-b-[1px] border-b-gray-800 pb-3'>
                                        {/* Email, about Section */}
                                        <div className='  flex flex-col gap-y-3 '>
                                                <div className=' flex flex-col gap-y-1'>
                                                        <label htmlFor='name' className=' text-sm  text-panel-header-icon flex  items-center  gap-x-1'><GoPerson className='  text-xl'/>  Full Name</label>
                                                        <input type='text'
                                                                id='name'
                                                                name='name'
                                                                placeholder={UserInfo?.name}
                                                                onChange={changeHandler}
                                                                value={formData.name}
                                                                className='w-full h-10  px-3 py-2 border-slate-700 border-[1.5px] rounded-md  text-sm placeholder:text-sm bg-input-background  text-white focus:outline-none focus:border-b-2 focus:border-b-green-700'
                                                        />
                                                </div>
                                                <div className=' flex flex-col gap-y-1'>
                                                        <label htmlFor='email' className=' text-sm  text-panel-header-icon flex  items-center  gap-x-1'><MdOutlineMail className='  text-xl'/>Email</label>
                                                        <input type='email'
                                                                id='email'
                                                                name='email'
                                                                placeholder={UserInfo?.email}
                                                                onChange={changeHandler}
                                                                value={formData.email}
                                                                className='w-full h-10  px-3 py-2 text-sm placeholder:text-sm border-slate-700 border-[1.5px] rounded-md  bg-input-background text-white focus:outline-none focus:border-b-2 focus:border-b-green-700'
                                                        />
                                                </div>
                                                <div className=' flex flex-col gap-y-1'>
                                                        <label htmlFor= 'about' className=' text-sm  text-panel-header-icon flex  items-center  gap-x-1'>About</label>
                                                        <input type='text'
                                                                id='about'
                                                                name='about'
                                                                placeholder = {UserInfo?.about ? UserInfo?.about : "Hey there! I am using ChatApp"}
                                                                onChange={changeHandler}
                                                                value={formData.about}
                                                                className='w-full h-10  px-3 py-2 text-sm placeholder:text-sm border-slate-700 border-[1.5px] rounded-md  bg-input-background text-white focus:outline-none focus:border-b-2 focus:border-b-green-700'
                                                        />
                                                </div>
                                        </div>
                                        <div  className=' w-full  flex  justify-end '>
                                                <button onClick={detailsChangerHandler} className={` bg-green-600 hover:bg-green-700 duration-150 text-base text-black py-1.5 px-4 rounded-md ${detailsLoading && 'animate-pulse'} `} >{detailsLoading ? "Saving..." : "Save"}</button>
                                        </div>
                                </div> 
                                        {/* button Section */}
                                        <div className=' w-full flex flex-col   gap-y-5 mt-1   px-4 pb-7  '>
                                                <button onClick={()=>setLogOutShowModal(true)} className=' w-fit  bg-photopicker-overlay-background rounded-md  px-7 py-1.5 text-red-300  hover:bg-dropdown-background-hover duration-200  hover:text-red-500'>Logout</button>
                                                <span className=' text-icon-lighter text-xs'>Chat history on this computer will be cleared when you logOut</span>
                                        </div>
                                
                                {
                                        logOutshowModal && 
                                        <div className='w-full h-full   z-[100] absolute   flex  flex-col items-center  justify-center    '>
                                                <div className='w-full h-full  bg-dropdown-background-hover rounded-md  bg-opacity-90 z-[-100] absolute top-0 left-0  '></div>
                                        <div className=' w-fit h-fit border-slate-700 border-[1.5px]  rounded-md   bg-dropdown-background-hover flex flex-col gap-y-1 py-4 px-4'> 
                                                <span className=' text-lg text-white'>Chat history will be cleared !</span>
                                                <span className=' text-sm text-icon-lighter'>Are you sure ? </span>
                                                        <div className=' flex gap-x-3 pt-1'>
                                                                <button onClick={()=>{ setLogOutShowModal(false) ; 
                                                                                        logOutHandler();
                                                                }} className=' w-20 h-8  bg-green-600 hover:bg-green-700 duration-150 text-black rounded-md'>Yes</button>
                                                                <button onClick={()=>setLogOutShowModal(false)} className=' w-20 h-8  bg-red-500 hover:bg-red-600 duration-150 text-black rounded-md'>No</button>
                                                        </div>
                                                </div>
                                        </div>
                                }
                        </div>
                </div>
    </div>
  )
}
