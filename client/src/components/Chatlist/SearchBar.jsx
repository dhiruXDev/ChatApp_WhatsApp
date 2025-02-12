import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import React from "react";
import {BiSearchAlt2} from "react-icons/bi"
import { BsFilter}from "react-icons/bs"
function SearchBar() {
      const[{contactSearch},dispatch]=useStateProvider();

  return(
        <div className=" w-full bg-search-input-container-background h-14 py-4 px-2 flex gap-x-2 items-center  ">
              <div className=" flex gap-x-2 py-1 px-2    w-[88%]  bg-panel-header-background items-center  focus:border-[1.5px] border-slate-500  rounded-md">
                      <BiSearchAlt2  className=" text-panel-header-icon text-xl "/>
                      <input 
                            placeholder="Search or Start a new Chat" 
                            type="text"
                            className=" bg-transparent outline-none  w-full text-white   "
                            value={contactSearch}
                            onChange={e => dispatch({type :  reducerCases.SET_CONTACT_SEARCH ,  contactSearch: e.target.value })}
                            />
              </div>
              <div className=" " >
                    <BsFilter className="text-panel-header-icon text-2xl  ml-2  cursor-pointer  " />
              </div>
        </div>
  )
    
}

export default SearchBar;
