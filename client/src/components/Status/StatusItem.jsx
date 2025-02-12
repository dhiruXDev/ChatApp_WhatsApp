import { useStateProvider } from '@/context/StateContext';
import Image from 'next/image';
import React from 'react'
import Avatar from '../common/Avatar';
import { calculateTime } from '@/utils/CalculateTime';

export const StatusItem = ({data ,type}) => {
const[{UserInfo,recentlyUpdatesStatus,viewedStatus}]=useStateProvider();
    console.log("inf",data);

  return (
    <div  className=' w-full  py-2 pl-1  flex gap-x-2 hover:bg-photopicker-overlay-background hover:rounded-md cursor-default duration-150'>
          <div  className={` ${type=='recently' ? " border-green-600" : " border-gray-600"} border-[3px]  rounded-full p-0.5 `}>
                 {/* <Image   className=' rounded-full object-cover' /> */}
                 <Image src={data?.user?.profilePicture} alt='profile' height={42} width={42} />
          </div>
          <div className=' flex flex-col gap-y-1'>
               <span className=' text-white font-semibold '>{data?.user.name} </span>
               <span className=' text-panel-header-icon  text-sm'>{calculateTime(data?.statuses[0].createdAt)}</span>
          </div>
    </div>
  )
}
//