import React, { useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { LuType } from "react-icons/lu";
import { IoColorPaletteOutline } from "react-icons/io5";
import { FaRegImage, FaVideo } from "react-icons/fa";
import { MdSend } from 'react-icons/md';
import axios from 'axios';
import { UPLOAD_STATUS_API } from '@/utils/ApiRoutes';
import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import toast from 'react-hot-toast';

export const StatusAddingModal = ({ setStatusUpdationModal ,setLoading }) => {
    const[{UserInfo,socket,recentlyUpdatesStatus},dispatch] = useStateProvider();
    const [statusType, setStatusType] = useState("text");
    const [backgroundColor, setBackgroundColor] = useState("#cccc00");
    const [customFontStyle, setCustomFontStyle] = useState("serif");
    const [textStatus, setTextStatus] = useState("");
    const [mediaFile, setMediaFile] = useState(null);
    const [textLines, setTextLines] = useState([]);
    const [direction, setDirection] = useState("up");

    const colors = ["#ff7733", "#1aff1a", "#cccc00", "#ff66d9", "#800060", "#4d79ff", "#b35900", "#00ace6"];
    const fontStyles = ['serif', 'sans-serif', 'monospace', 'light', 'semibold'];

    const generateCustomColor = () => {
        const indx = Math.floor(Math.random() * colors.length);
        setBackgroundColor(colors[indx]);
    };

    const generateCustomFontStyle = () => {
        const indx = Math.floor(Math.random() * fontStyles.length);
        setCustomFontStyle(fontStyles[indx]);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log("File",file);
        //setMediaFile(file);
        if (file) {
            setMediaFile({ file, preview: URL.createObjectURL(file) }); 
        }

    };
 
    const handleTextChange = (e) => {
        const text = e.target.value;
        const lines = text.split("\n");
        if (lines.length > 5 && direction === "up") {
            setDirection("down");
        } else if (lines.length === 1) {
            setDirection("up");
        }
        setTextStatus(text);
        setTextLines(lines);
    };

    const addingStatusHandler = async () => {
        setLoading(true);
        setStatusUpdationModal(false);
        const formData = new FormData();
        formData.append("statusType", statusType);
        formData.append("userId",UserInfo.id);

        if (statusType === "text") {
            formData.append("text", textStatus);
            formData.append("fontStyle", customFontStyle);
            formData.append("backgroundColor", backgroundColor);
        } else if (mediaFile) {
            // Append the actual file instead of just the URL
            const fileInput = document.querySelector('input[type="file"]');
             formData.append("file", mediaFile.file); 
        }
    
        try {
            const response = await axios.post(UPLOAD_STATUS_API, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            console.log("Response from addStatus:", response.data);
            console.log("Response from addStatus:", response.data.status);
            if (response.data.success) {

                toast.success("Status uploaded successfully!");
                setStatusUpdationModal(false);
                const addedStatus = response.data.status;
                
                // 🔥 Emit event to notify other users
                socket.current.emit("add-status", {
                    userId: UserInfo.id,
                    status: addedStatus
                });

                // 🔥 Update global store
                // dispatch({
                //     type: reducerCases.SET_RECENTLY_UPDATES_STATUS,
                //     statuses: recentlyUpdatesStatus.map(userStatus =>
                //         userStatus.user.id === UserInfo.id
                //             ? { ...userStatus, statuses:[...userStatus.statuses, addedStatus] } 
                //             : userStatus
                //     )
                // });
                

            } else {
                alert("Error uploading status");
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload status.");
        }
        setLoading(false);
    };
    
    return (
        <div className=" fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80  z-[100] ">
            <div className={`relative h-[620px] w-[420px] rounded-md flex flex-col !z-50 `} style={{ backgroundColor }}>
                {/* Header Section */}
                <div className='z-[1000] fixed w-[420px]'>
                    <div className='flex justify-between items-center px-2 py-2'>
                        <div onClick={() => setStatusUpdationModal(false)} className='h-8 w-8 bg-gray-800 hover:bg-black text-lg text-white rounded-full cursor-pointer flex items-center justify-center'>
                            <RxCross2 />
                        </div>
                        <div className='flex gap-x-4'>
                            <div onClick={generateCustomFontStyle} className='h-8 w-8 bg-gray-800 hover:bg-black text-lg text-white rounded-full cursor-pointer flex items-center justify-center'>
                                <LuType />
                            </div>
                            <div onClick={generateCustomColor} className='h-8 w-8 bg-gray-800 hover:bg-black text-lg text-white rounded-full cursor-pointer flex items-center justify-center'>
                                <IoColorPaletteOutline />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Content Section */}
                <div className='flex-1 flex flex-col items-center justify-center h-[calc(100%-90px)] w-full relative'>
                    {statusType === "text" &&  
                        <textarea 
                            value={textStatus} 
                            onChange={handleTextChange} 
                            className={`w-full h-full py-2 text-center text-xl outline-none bg-transparent placeholder:text-white placeholder:text-center caret-green-600 resize-none transition-transform px-3 duration-500 custom-scrollbar overflow-x-hidden  ${direction === "up" ? "translate-y-1/3" : "-translate-y-10"}`}
                            style={{ fontFamily: customFontStyle }}
                            placeholder='Type a status...'
                            rows={5}
                        />
                    }
                    {statusType === "photo" && mediaFile && (
                        <img src={mediaFile.preview} alt="Uploaded" className='max-h-full rounded-sm object-cover' />
                    )}
                    {statusType === "video" && mediaFile && (
                        <video src={mediaFile.preview} controls className='max-h-full rounded-sm' />
                    )}
                </div>
                {/* Footer Section */}
                <div className='flex justify-between items-center h-12 px-2 py-2 text-white bg-panel-header-background bg-opacity-80 rounded-b-md'>
                    <div className='flex gap-x-1'>
                        <label className={`${statusType === 'video' ? "bg-gray-900 bg-opacity-50" : ""} cursor-pointer flex items-center gap-1 px-3 py-1 text-sm rounded-2xl text-white hover:bg-gray-900 hover:bg-opacity-50`} onClick={() => setStatusType("video")}>  
                            Video
                            <input type="file" accept="video/*" className='hidden' onChange={handleFileChange} />
                        </label>
                        <label className={`${statusType === 'photo' ? "bg-gray-900 bg-opacity-50" : ""} cursor-pointer flex items-center gap-1 px-3 py-1 text-sm rounded-2xl text-white hover:bg-gray-900 hover:bg-opacity-50`} onClick={() => setStatusType("photo")}>  
                            Photo
                            <input type="file" accept="image/*" className='hidden' onChange={handleFileChange} />
                        </label>  
                        <button onClick={() => setStatusType("text")} className={`px-4 py-1 text-sm rounded-2xl text-white ${statusType === 'text' ? "bg-gray-900 bg-opacity-50" : ""} hover:bg-gray-900 hover:bg-opacity-50`}>Text</button>
                    </div>
                    <button onClick={addingStatusHandler} title='Share' className='flex items-center justify-center text-black  bg-green-500  duration-150 text-2xl px-2 text-right py-2 rounded-full hover:bg-green-600 hover:bg-opacity-50'>
                        <MdSend />
                    </button>
                </div>
            </div>
        </div>
    );
};
