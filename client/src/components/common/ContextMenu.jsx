import React, { useEffect, useRef } from "react";

function ContextMenu({options,coordinates,contextMenu,setContextMenu,}) {
  const contextMenuRef = useRef(null);
  
  useEffect(()=>{
      const handleClickOutside = (event)=>{
         if(event.target.id !== "context-opener"){
            if(contextMenuRef.current && !contextMenuRef.current.contains(event.target)){
                setContextMenu(false);
            }
        }
      };

     document.addEventListener("click",handleClickOutside);
     return ()=>{
          document.removeEventListener("click",handleClickOutside)
     }
  },[]);
  
  const handleClick = (e,callback)=>{
       e.stopPropagation();
       setContextMenu(false);
       callback();
  }

  return (
    <div ref={contextMenuRef} style={{top:coordinates.Y , left :coordinates.X }} className={ ` z-50   text-white bg-dropdown-background rounded-md absolute   `}>
            <ul className=" h-auto text-white flex flex-col items-start justify-between font-semibold  ">
                 {
                    options?.map(({name,callback})=>(
                     <li key={name} onClick={(e)=>handleClick(e,callback)} className="w-full relative hover:bg-dropdown-background-hover  rounded-md  py-2 px-4   text-white   cursor-pointer  "> 
                         {name}  
                     </li>
                    ))
                 }
            </ul>
     </div>
  )
}
export default ContextMenu;
 
//   options.map(({name,callback})...    ---> {name,callback} this means im destructureing the  object array   