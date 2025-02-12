import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_IMAGE_MESSAGE_API, ADD_MESSAGE_API, META_AI_API } from "@/utils/ApiRoutes";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import next from "next";
import React, { useState, useRef, useEffect } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import PhotoPicker from "../common/PhotoPicker";
import  FormData from "form-data"
import { FaMicrophone } from "react-icons/fa";
import dynamic from "next/dynamic";

const CaptureAudio = dynamic(()=> import("../common/CaptureAudio") , {ssr : false});

function MessageBar({setLoading}) {
    const [message, setMessage] = useState("");
    const [showEmojiPicker ,setShowEmojiPicker] =useState(false);
   // const [grabPhoto,setGrabPhoto] =useState(false);
    const [showAudioRecorder , setShowAudioRecorder]= useState(false);
    const textareaRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const [{ UserInfo, currentChatUser ,socket}, dispatch] = useStateProvider();
   
    const handleEmojiPickerModal = ()=>{
           setShowEmojiPicker(!showEmojiPicker);  
    }

    const handleEmojiClick = (emoji)=>{
             setMessage((prev)=>prev += emoji.emoji)
    }

// For grab photo
    const PhotoPickerChange = async(e)=>{
          try {
             // console.log( e.target.files[0]);
            // console.log( e.target.files);
        const file = e.target.files[0];
        const formdata = new FormData();
        formdata.append("image",file);
 
        const response = await axios.post(ADD_IMAGE_MESSAGE_API , formdata , {
               headers: {
                "Content-Type" : "multipart/form-data"
               },
               params : {
                 from : UserInfo.id,
                 to : currentChatUser.id
               },
        })
        if (response.data.success) {
                socket.current.emit("send-msg" , {
                        to: currentChatUser.id,
                        from : UserInfo.id,
                        message : response.data.message
                });
                // when we sent messagee to reciever it will recieved by reciever nut if i'm sending the message is not showing on my UI ,but after refreshing its showing , solution of this
                dispatch( {type : reducerCases.ADD_MESSAGE , 
                                newMessage : { ...response.data.message},
                                fromSelf : true   // means ?????
                })
        }
                  // When the User Interact with AI ---> Giving back the response from AI
                  if (currentChatUser?.id === -1) {
                    setLoading(true);
                    let AiResponse = "Sorry,  I can't access files from your computer. You can describe the image or upload it to an image hosting site (like Imgur, Mongoose) and provide me  the link."
                    const { data } = await axios.post(ADD_MESSAGE_API, {
                        from: currentChatUser?.id,
                        to: UserInfo?.id,
                        message:AiResponse,
                    });
                    socket.current.emit("send-msg", {
                        from: currentChatUser.id,
                        to: UserInfo.id,
                        message: data.message,
                        });
            
                    dispatch({
                        type: reducerCases.ADD_MESSAGE,
                        newMessage: { ...data.message },
                        fromSelf: true,
                    });
                    setLoading(false);
                     
              }

      } catch (error) {
            console.log("Error ",error)
          }
    }

    const AttachmentFileHandler = () => {
      const data = document.getElementById("photo-picker");
      if (data) {
          data.click(); // Directly trigger the click event
      }
  };
  
    useEffect(()=>{
          const handleClickOutside = (event)=>{
                if(event.target.id !== "emoji-open"){
                      if(emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)){
                         setShowEmojiPicker(false);
                      }
                }
          }
// I'm adding eventListener on whole document (means khi bhi in UI) and in returning im removing the eventListner
          document.addEventListener("click",handleClickOutside);
          return ()=>{ 
               document.removeEventListener("click",handleClickOutside);
          }
    },[])

    const sendMessageHandler = async () => {
        try {
            const { data } = await axios.post(ADD_MESSAGE_API, {
                to: currentChatUser?.id,
                from: UserInfo?.id,
                message
            });
            socket.current.emit("send-msg" , {
                to: currentChatUser.id,
                from : UserInfo.id,
                message : data.message
          });
          // when we sent messagee to reciever it will recieved by reciever nut if i'm sending the message is not showing on my UI ,but after refreshing its showing , solution of this
            dispatch( {type : reducerCases.ADD_MESSAGE , 
                          newMessage : { ...data.message},
                          fromSelf : true   // means ?????
            })
            setMessage("");

        // When the User Interact with AI ---> Giving back the response from AI
              if (currentChatUser?.id === -1) {

                setLoading(true);
                const response = await axios.post(META_AI_API, {
                                    contents: [{ parts: [{ text: message }] }],
                                    });
                console.log("Response from 1 ", response)
                const botMessage = response.data.candidates[0].content.parts[0].text;

                console.log("Response" , botMessage)

                const { data } = await axios.post(ADD_MESSAGE_API, {
                    from: currentChatUser?.id,
                    to: UserInfo?.id,
                    message:botMessage,
                });
                socket.current.emit("send-msg", {
                    from: currentChatUser.id,
                    to: UserInfo.id,
                    message: data.message,
                    });
        
                dispatch({
                    type: reducerCases.ADD_MESSAGE,
                    newMessage: { ...data.message },
                    fromSelf: true,
                });
                setLoading(false);
                 
          }
           
        } catch (error) {
            console.log("Error during sending message ", error);
           // next(error);
        }
    };

    const KeyDownHandler = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessageHandler();
        }
    };

    const autoResize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    return (
        <div className="flex items-end justify-between border-conversation-border border-t bg-panel-header-background gap-x-3 w-full h-auto px-3 py-3 pr-6  z-[5] overflow-hidden   ">
          {
             !showAudioRecorder && (
                <>
                        <div className="flex items-end gap-x-3 text-panel-header-icon w-full pr-6">
                            <BsEmojiSmile 
                                        id="emoji-open"
                                        onClick={handleEmojiPickerModal} 
                                        title="Emoji" 
                                        className="text-xl cursor-pointer" />
                            {
                                    showEmojiPicker && <div  ref={emojiPickerRef} className="  absolute  bottom-[45px] left-[220PX] "> 
                                                                    <EmojiPicker onEmojiClick={handleEmojiClick}  theme="dark"  width={"480px"} className="" /> 
                                                        </div>
                            }
            
                            <ImAttachment  title="Attach file" className="text-xl cursor-pointer"  onClick={AttachmentFileHandler } />
            
                            <textarea
                                ref={textareaRef}
                                placeholder="Type a message"
                                className="text-sm w-full pl-3 bg-transparent text-slate-300 focus:outline-none    resize-none overflow-y-auto max-h-32 custom-scrollbar-hidden "  
                                    onChange={(e) => {
                                            setMessage(e.target.value)
                                            autoResize();
                                        }}
                                value={message}
                                onKeyDown={KeyDownHandler}
                                rows={1}
                                style={{ minHeight: "1.5rem" }} // Sets the initial height of textarea
                            />
                        </div>
                        <div className="flex items-end gap-x-4 text-panel-header-icon pr-3 py-1">
                            {
                                message.length > 0 ? (
                                <MdSend   onClick={sendMessageHandler} className="text-xl cursor-pointer" title="Send Message" />
            
                                ) : ( 
                                    <FaMicrophone title="Recording" onClick={()=>setShowAudioRecorder(true)} className="cursor-pointer  text-xl  "  />
                            )
                            } 
                        </div>
                </>
             )
          }
            {
                 <PhotoPicker  onChange={PhotoPickerChange}  />    
            }
            {
                showAudioRecorder && ( <CaptureAudio setLoading={setLoading}  hide={setShowAudioRecorder} />)
            }
        </div>
    );
}

export default MessageBar;


// import { reducerCases } from "@/context/constants";
// import { useStateProvider } from "@/context/StateContext";
// import { ADD_IMAGE_MESSAGE_API, ADD_MESSAGE_API, META_AI_API } from "@/utils/ApiRoutes";
// import axios from "axios";
// import EmojiPicker from "emoji-picker-react";
// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { BsEmojiSmile } from "react-icons/bs";
// import { ImAttachment } from "react-icons/im";
// import { MdSend } from "react-icons/md";
// import PhotoPicker from "../common/PhotoPicker";
// import FormData from "form-data";
// import { FaMicrophone } from "react-icons/fa";
// import dynamic from "next/dynamic";

// const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), { ssr: false });

// function MessageBar({setLoading}) {
//   const [message, setMessage] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [grabPhoto, setGrabPhoto] = useState(false);
//   const [showAudioRecorder, setShowAudioRecorder] = useState(false);
//   const textareaRef = useRef(null);
//   const emojiPickerRef = useRef(null);
//   const [{ UserInfo, currentChatUser, socket }, dispatch] = useStateProvider();

//   const handleEmojiPickerModal = () => {
//     setShowEmojiPicker((prev) => !prev);
//   };

//   const handleEmojiClick = (emoji) => {
//     setMessage((prev) => prev + emoji.emoji); // Avoid direct state mutation
//   };

//   const PhotoPickerChange = async (e) => {
//     try {
//       const file = e.target.files[0];
//       const formData = new FormData();
//       formData.append("image", file);
//       console.log("Onside image picker")
//       const response = await axios.post(ADD_IMAGE_MESSAGE_API, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         params: {
//           from: UserInfo.id,
//           to: currentChatUser.id,
//         },
//       });
//        console.log("Response ")
//       if (response.data.success) {
//         socket.current.emit("send-msg", {
//           to: currentChatUser.id,
//           from: UserInfo.id,
//           message: response.data.message,
//         });

//         dispatch({
//           type: reducerCases.ADD_MESSAGE,
//           newMessage: { ...response.data.message },
//           fromSelf: true,
//         });
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       alert("Failed to upload image. Please try again.");
//     }
//   };

//   useEffect(() => {
//     if (grabPhoto) {
//       const data = document.getElementById("photo-picker");
//       data.click();
//       document.body.onclick = () => {
//         setTimeout(() => setGrabPhoto(false), 1000);
//       };
//     }
//   }, [grabPhoto]);

//   const handleClickOutside = useCallback((event) => {
//     if (event.target.id !== "emoji-open" && emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
//       setShowEmojiPicker(false);
//     }
//   }, []);

//   useEffect(() => {
//     document.addEventListener("click", handleClickOutside);
//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, [handleClickOutside]);

//   const sendMessageHandler = async () => {
//     try {
//       const { data } = await axios.post(ADD_MESSAGE_API, {
//         to: currentChatUser?.id,
//         from: UserInfo?.id,
//         message,
//       });

//       socket.current.emit("send-msg", {
//         to: currentChatUser.id,
//         from: UserInfo.id,
//         message: data.message,
//         });
        

//       dispatch({
//         type: reducerCases.ADD_MESSAGE,
//         newMessage: { ...data.message },
//         fromSelf: true,
//       });

//       setMessage("");

//       // When the User Interact with AI ---> Giving back the response from AI
//       if (currentChatUser?.id === -1) {

//                 setLoading(true);
//                 const response = await axios.post(META_AI_API, {
//                                     contents: [{ parts: [{ text: message }] }],
//                                     });
//                 console.log("Response from 1 ", response)
//                 const botMessage = response.data.candidates[0].content.parts[0].text;

//                 console.log("Response" , botMessage)

//                 const { data } = await axios.post(ADD_MESSAGE_API, {
//                     from: currentChatUser?.id,
//                     to: UserInfo?.id,
//                     message:botMessage,
//                 });
//                 socket.current.emit("send-msg", {
//                     from: currentChatUser.id,
//                     to: UserInfo.id,
//                     message: data.message,
//                     });
        
//                 dispatch({
//                     type: reducerCases.ADD_MESSAGE,
//                     newMessage: { ...data.message },
//                     fromSelf: true,
//                 });
//                 setLoading(false);
                 
//       }  

      
//     } catch (error) {
//       console.error("Error during sending message:", error);
//       alert("Failed to send message. Please try again.");
//     }
//   };

//   const KeyDownHandler = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessageHandler();
//     }
//   };

//   const autoResize = () => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//     }
//   };

//   return (
//     <div className="flex items-end justify-between border-conversation-border border-t bg-panel-header-background gap-x-3 w-full h-auto px-3 py-3 pr-6 z-10 overflow-hidden">
//       {!showAudioRecorder && (
//         <>
//           <div className="flex items-end gap-x-3 text-panel-header-icon w-full pr-6">
//             <BsEmojiSmile
//               id="emoji-open"
//               onClick={handleEmojiPickerModal}
//               title="Emoji"
//               className="text-xl cursor-pointer"
//             />
//             {showEmojiPicker && (
//               <div ref={emojiPickerRef} className="absolute bottom-[45px] left-[220px]">
//                 <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" width={"480px"} />
//               </div>
//             )}

//             <ImAttachment title="Attach file" className="text-xl cursor-pointer" onClick={() => setGrabPhoto(true)} />

//             <textarea
//               ref={textareaRef}
//               placeholder="Type a message"
//               className="text-sm w-full pl-3 bg-transparent text-slate-300 focus:outline-none resize-none overflow-y-auto max-h-32 custom-scrollbar-hidden"
//               onChange={(e) => {
//                 setMessage(e.target.value);
//                 autoResize();
//               }}
//               value={message}
//               onKeyDown={KeyDownHandler}
//               rows={1}
//               style={{ minHeight: "1.5rem" }}
//             />
//           </div>
//           <div className="flex items-end gap-x-4 text-panel-header-icon pr-3 py-1">
//             {message.length > 0 ? (
//               <MdSend onClick={sendMessageHandler} className="text-xl cursor-pointer" title="Send Message" />
//             ) : (
//               <FaMicrophone title="Recording" onClick={() => setShowAudioRecorder(true)} className="cursor-pointer text-xl" />
//             )}
//           </div>
//         </>
//       )}
//       {grabPhoto && <PhotoPicker onChange={PhotoPickerChange} />}
//       {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
//     </div>
//   );
// }

// export default MessageBar;



// // Errrorrrrrrrrrrrrr   5:35:30    
//     useEffect(()=>{
//         if(grabPhoto){
//            const data = document.getElementById("photo-picker");
//            data.click();
//            document.body.focus= (e)=>{
//               setTimeout(()=>{
//                 setGrabPhoto(false);
//               },1000);
//             //  setGrabPhoto(false);   ---> 
//            }
//         }
//    },[grabPhoto]);
   
////////////////////////////////////////////////////////////////////
