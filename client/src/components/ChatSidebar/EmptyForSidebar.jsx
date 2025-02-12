import React from 'react'
import { IoClose } from "react-icons/io5";
export const EmptyForSidebar = ({setShowEmptyModal}) => {
  return (
    <div    className=' absolute left-2    bottom-2 z-[1000]   '> 
    {/* <div className='w-full h-full  bg-dropdown-background-hover bg-opacity-90 z-[-10] absolute top-0 left-0 '></div> */}
    <div className=' w-[215px] h-fit  text-primary-strong  bg-conversation-panel-background border-slate-700 border-[1.5px]  rounded-md z-[100]   '>
            <div className=' w-full h-full px-2 py-2   '>
                            <span className=' text-sm text-panel-header-icon '>This Page is Under Development </span>
            </div>
            <button onClick={()=>setShowEmptyModal(false)} className=' px-2 w-full   mt-2 pb-2 flex justify-center'> 
                <span className=' w-fit  bg-red-600 text-sm  px-4 py-1 rounded-md'>Close</span>
            </button>
    </div>
</div>
  )
}
