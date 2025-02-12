import React from "react";

function Input({name,state,setState,label =false}) {
  return(
       <div>
            {
              label && 
                 <label  htmlFor= {name} className="  text-teal-light px-1 text-base"> {name} </label>
            }
            <div>
                 <input
                    type="text"
                    name={name}
                    value={state}
                    onChange={(e)=>setState(e.target.value)}
                    className=" bg-input-background rounded-md text-white focus:outline-none py-1 px-2 mt-1"
                 />
            </div>
       </div>
  )
}

export default Input;
