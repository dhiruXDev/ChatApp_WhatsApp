import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from 'react-icons/fa';
import { useClickOutside } from '@react-hooks-hub/use-click-outside';
import { useStateProvider } from '@/context/StateContext';
import { calculateTime } from '@/utils/CalculateTime';
import { ThreeDots } from 'react-loader-spinner';
import { BsThreeDotsVertical } from 'react-icons/bs';
import axios from 'axios';
import { DELETE_SETATUS_API } from '@/utils/ApiRoutes';
import { reducerCases } from '@/context/constants';
import { ClipLoader } from 'react-spinners';

export const StatusViewer = ({ selectedStatus, setSelectedStatus }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentStatus, setCurrentStatus] = useState(selectedStatus?.statuses[0] || null);
    const [{UserInfo,recentlyUpdatesStatus,viewedStatus,socket},dispatch]= useStateProvider()
    const[deleteStatusModal ,setDeleteStqtusModal] = useState(false)
    const videoRef = useRef(null);
    const [isDeleting, setIsDeleting] = useState(false); // 🔥 New loading state

    //  const containerREf = useRef(null);
    //  useClickOutside([containerREf],()=>setSelectedStatus(null));
     
    useEffect(() => {
        if (!selectedStatus) return;

        const status = selectedStatus.statuses[currentIndex];
        setCurrentStatus(status); // 🔥 Ensure re-render when changing status

        let duration = 15000; // Default 15s for text/image
        setProgress(0);

        if (status.type === 'video' && videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
                const videoDuration = videoRef.current?.duration * 1000; // Convert to ms
                duration = videoDuration > 30000 ? 30000 : videoDuration; // ✅ Set max 30s
                startProgress(duration);
            };
        } 
        else {
            startProgress(duration);
        }
        return () => clearInterval(progressInterval);
    }, [currentIndex, selectedStatus]);

    let progressInterval;
    const startProgress = (duration) => {
        clearInterval(progressInterval);
        let startTime = Date.now();
        progressInterval = setInterval(() => {
            let elapsedTime = Date.now() - startTime;
            setProgress((elapsedTime / duration) * 100);

            if (elapsedTime >= duration) {
                clearInterval(progressInterval);
                goToNext();
            }
        }, 100);
    };

    const goToNext = () => {
        if (currentIndex < selectedStatus.statuses.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setSelectedStatus(null);
        }
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    if (!selectedStatus || !currentStatus) return null;

    const deleteStatusHandler = async (statusId) => {
        setIsDeleting(true); // Show loading
        setDeleteStqtusModal(false);
        try {
            const res = await axios.post(DELETE_SETATUS_API, {
                userId: UserInfo.id,
                statusId: statusId
            });
    
            if (res.data.success) {
                // 🔥 Filter out the deleted status from the current status list
                const updatedStatuses = selectedStatus.statuses.filter(status => status.id !== statusId);
    
                if (updatedStatuses.length > 0) {
                    setCurrentIndex(0); // Reset to the first status
                    setCurrentStatus(updatedStatuses[0]);
                    setSelectedStatus({ ...selectedStatus, statuses: updatedStatuses }); // ✅ Update state correctly
                } else {
                    setSelectedStatus(null); // Close modal if no status remains
                }
                 // 🔥 Emit the event to inform all users about status deletion
           
            socket.current.emit("status-delete", {
                userId: selectedStatus.user.id,
                statusId
            });
            // 🔥 Update global store
            dispatch({
                type: reducerCases.SET_RECENTLY_UPDATES_STATUS,
                statuses: recentlyUpdatesStatus.map(userStatus =>
                    userStatus.user.id === selectedStatus.user.id
                        ? { ...userStatus, statuses: updatedStatuses }
                        : userStatus
                )
            });
    
                // // 🔥 Update the global store by removing only the deleted status
                // dispatch({
                //     type: reducerCases.SET_RECENTLY_UPDATES_STATUS,
                //     payload: recentlyUpdatesStatus.map(userStatus =>
                //         userStatus.user.id === selectedStatus.user.id
                //             ? { ...userStatus, statuses: updatedStatuses } // ✅ Only update the specific user's statuses
                //             : userStatus
                //     )
                // });
            }
    
        } catch (error) {
            console.log("Error deleting the status", error);
        } finally {
            setIsDeleting(false); // Hide loading
        }
    };
    
   // console.log("current ",currentStatus.content);

   // <ClipLoader color="#dfadad" />
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80   flex items-center justify-center z-50">
            <div className="relative w-full h-full flex flex-col items-center justify-center">
                <button onClick={() => setSelectedStatus(null)} className="absolute top-5 right-5 text-white text-2xl">
                    ✖ 
                </button>
                <div   className="max-w-[500px] w-full h-[95vh] flex items-center justify-center bg-black rounded-lg shadow-lg p-2 relative">
                       {
                          isDeleting &&   <div className=' w-full h-full  bg-opacity-50 absolute top-[50%] z-[100000] '>
                                              <ClipLoader color="#dfadad" />
                                         </div>
                       }
                            <div className="absolute top-5 left-10 right-5 h-1 w-[85%] bg-gray-500 rounded-md">
                                <div className="h-full bg-white rounded-md" style={{ width: `${progress}%` }} />
                            </div>

                            <div className="absolute top-10 left-10 right-5 h-1   rounded-md">
                                <div className=' flex justify-between'>
                                        <div className=' flex  gap-x-2 '>
                                                    <div className='' >
                                                            <Image src={UserInfo?.profileImage} width={70} height={70}  />
                                                    </div>
                                                    <div className=' w-full flex flex-col    cursor-default    '>
                                                        <span className=' text-md font-semibold text-white'>{UserInfo?.id === selectedStatus?.user?.id ? 'My Status' : `${selectedStatus?.user?.name}`}</span>
                                                        <span className=' text-sm text-panel-header-icon '>{calculateTime(selectedStatus.statuses[0].createdAt)}</span> 
                                                    </div>
                                            </div>
                                            {
                                                UserInfo?.id === selectedStatus?.user?.id && <div onClick={()=>setDeleteStqtusModal((prev)=>!prev)} className=' w-9 h-9  text-xl z-[10000]  rounded-full hover:bg-gray-800  text-white flex items-center justify-center cursor-pointer    '> 
                                                                                                    <BsThreeDotsVertical  /> 
                                                                                            </div>
                                            } 
                                            {
                                                deleteStatusModal&& <div className=' absolute right-2 top-8 z-[1000] bg-background-default-hover w-[140px] h-[54px] rounded-md py-2  flex items-center    '>
                                                                        <button onClick={()=>deleteStatusHandler(selectedStatus?.statuses[0]?.id)} className=' w-full hover:bg-gray-900 text-center py-2  text-white'>Delete</button>
                                                                    </div>
                                            }  
                                </div>
                            </div>

                        {currentStatus.type === 'text' && (
                            <div className=' w-full h-full text-xl  flex items-center justify-center' style={{ fontStyle: currentStatus.fontStyle, backgroundColor: currentStatus.backgroundColor }}>
                            <span className="text-white  text-center" >
                                {currentStatus.content}
                            </span>
                        </div>
                        )}
                        {currentStatus.type === 'photo' && (
                            <img src={currentStatus.content} alt="Status" layout="intrinsic" width={500} height={500} />
                        )}
                        {currentStatus.type === 'video' && (
                            <video ref={videoRef} src={currentStatus.content}  autoPlay className="w-full h-full rounded-md" />
                        )}
                    
                </div>

                <div className="absolute bottom-[50%] flex gap-4 justify-between w-[45%] ">
                    <button title='prev' className={`text-white text-lg px-4 py-4 bg-gray-700 ${currentIndex !== 0  &&  "hover:bg-gray-600"}   duration-200 rounded-full`} onClick={goToPrev} disabled={currentIndex === 0}>
                        <FaChevronLeft />
                    </button>

                    <button title='next' className={`text-white text-lg px-4 py-4 bg-gray-700 ${currentIndex !== 0  &&  "hover:bg-gray-600"}   duration-200 rounded-full`}  onClick={goToNext} disabled={currentIndex === selectedStatus.statuses.length - 1}>
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
};




//  * import React, { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
// import { BsThreeDotsVertical } from 'react-icons/bs';
// import { useStateProvider } from '@/context/StateContext';
// import { calculateTime } from '@/utils/CalculateTime';
// import { ClipLoader } from 'react-spinners';
// import axios from 'axios';
// import { DELETE_SETATUS_API } from '@/utils/ApiRoutes';
// import { reducerCases } from '@/context/constants';

// export const StatusViewer = ({ selectedStatus, setSelectedStatus }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [progress, setProgress] = useState(0);
//     const [currentStatus, setCurrentStatus] = useState(selectedStatus?.statuses[0] || null);
//     const [{ UserInfo, recentlyUpdatesStatus }, dispatch] = useStateProvider();
//     const [deleteStatusModal, setDeleteStatusModal] = useState(false);
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [isLoading, setIsLoading] = useState(true); // 🔥 Added loading state
//     const videoRef = useRef(null);

//     useEffect(() => {
//         if (!selectedStatus) return;

//         const status = selectedStatus.statuses[currentIndex];
//         setCurrentStatus(status);
//         setIsLoading(true); // Start loading state

//         let duration = 15000; // Default duration for text/images
//         setProgress(0);

//         if (status.type === 'video' && videoRef.current) {
//             videoRef.current.onloadedmetadata = () => {
//                 const videoDuration = Math.min(videoRef.current.duration * 1000, 30000); 
//                 startProgress(videoDuration);
//                 setIsLoading(false); // Stop loading
//             };
//         } else if (status.type === 'photo') {
//             const img = new Image();
//             img.src = status.content;
//             img.onload = () => setIsLoading(false); // Stop loading when image is ready
//             startProgress(duration);
//         } else {
//             setIsLoading(false); // For text-based statuses
//             startProgress(duration);
//         }

//         return () => clearInterval(progressInterval);
//     }, [currentIndex, selectedStatus]);

//     let progressInterval;
//     const startProgress = (duration) => {
//         clearInterval(progressInterval);
//         let startTime = Date.now();
//         progressInterval = setInterval(() => {
//             let elapsedTime = Date.now() - startTime;
//             setProgress((elapsedTime / duration) * 100);
//             if (elapsedTime >= duration) {
//                 clearInterval(progressInterval);
//                 goToNext();
//             }
//         }, 100);
//     };

//     const goToNext = () => {
//         if (currentIndex < selectedStatus.statuses.length - 1) {
//             setCurrentIndex((prev) => prev + 1);
//         } else {
//             setSelectedStatus(null);
//         }
//     };

//     const goToPrev = () => {
//         setCurrentIndex((prev) => Math.max(prev - 1, 0));
//     };

//     const deleteStatusHandler = async (statusId) => {
//         setIsDeleting(true);
//         setDeleteStatusModal(false);
//         try {
//             const res = await axios.post(DELETE_SETATUS_API, {
//                 userId: UserInfo.id,
//                 statusId: statusId
//             });

//             if (res.data.success) {
//                 const updatedStatuses = selectedStatus.statuses.filter(status => status.id !== statusId);
//                 if (updatedStatuses.length > 0) {
//                     setCurrentIndex(0);
//                     setCurrentStatus(updatedStatuses[0]);
//                     setSelectedStatus({ ...selectedStatus, statuses: updatedStatuses });
//                 } else {
//                     setSelectedStatus(null);
//                 }

//                 dispatch({
//                     type: reducerCases.SET_RECENTLY_UPDATES_STATUS,
//                     payload: recentlyUpdatesStatus.map(userStatus =>
//                         userStatus.user.id === selectedStatus.user.id
//                             ? { ...userStatus, statuses: updatedStatuses }
//                             : userStatus
//                     )
//                 });
//             }

//         } catch (error) {
//             console.log("Error deleting the status", error);
//         } finally {
//             setIsDeleting(false);
//         }
//     };

//     if (!selectedStatus || !currentStatus) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
//             <div className="relative w-full h-full flex flex-col items-center justify-center">
//                 <button onClick={() => setSelectedStatus(null)} className="absolute top-5 right-5 text-white text-2xl">
//                     ✖ 
//                 </button>

//                 <div className="max-w-[500px] w-full h-[95vh] flex items-center justify-center bg-black rounded-lg shadow-lg p-2 relative">
//                     {isDeleting && (
//                         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                             <ClipLoader color="#dfadad" />
//                         </div>
//                     )}

//                     {/* Progress Bar */}
//                     <div className="absolute top-5 left-10 right-5 h-1 w-[85%] bg-gray-500 rounded-md">
//                         <div className="h-full bg-white rounded-md" style={{ width: `${progress}%` }} />
//                     </div>

//                     {/* Profile and Delete Options */}
//                     <div className="absolute top-10 left-10 right-5">
//                         <div className="flex justify-between">
//                             <div className="flex gap-x-2">
//                                 <Image src={UserInfo?.profileImage} width={70} height={70} />
//                                 <div className="flex flex-col">
//                                     <span className="text-md font-semibold text-white">
//                                         {UserInfo?.id === selectedStatus?.user?.id ? 'My Status' : selectedStatus.user.name}
//                                     </span>
//                                     <span className="text-sm text-gray-400">
//                                         {calculateTime(selectedStatus.statuses[0].createdAt)}
//                                     </span>
//                                 </div>
//                             </div>

//                             {UserInfo.id === selectedStatus.user.id && (
//                                 <div onClick={() => setDeleteStatusModal(prev => !prev)}
//                                     className="w-9 h-9 text-xl rounded-full hover:bg-gray-800 text-white flex items-center justify-center cursor-pointer">
//                                     <BsThreeDotsVertical />
//                                 </div>
//                             )}

//                             {deleteStatusModal && (
//                                 <div className="absolute right-2 top-8 bg-gray-700 w-[140px] h-[54px] rounded-md py-2 flex items-center">
//                                     <button onClick={() => deleteStatusHandler(selectedStatus.statuses[0].id)}
//                                         className="w-full hover:bg-gray-900 text-center py-2 text-white">
//                                         Delete
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Content with Loading Blur */}
//                     <div className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${
//                         isLoading ? "blur-md" : ""
//                     }`}>
//                         {isLoading && (
//                             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
//                                 <ClipLoader color="white" />
//                             </div>
//                         )}

//                         {currentStatus.type === 'text' && (
//                             <div className="text-white text-center" style={{ fontStyle: currentStatus.fontStyle, backgroundColor: currentStatus.backgroundColor }}>
//                                 {currentStatus.content}
//                             </div>
//                         )}

//                         {currentStatus.type === 'photo' && (
//                             <Image src={currentStatus.content} layout="intrinsic" width={500} height={500} />
//                         )}

//                         {currentStatus.type === 'video' && (
//                             <video ref={videoRef} src={currentStatus.content} autoPlay className="w-full h-full rounded-md" />
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

//  */