import React from "react";
import { BsCheck, BsCheckAll } from "react-icons/bs";

function MessageStatus({messageStatus}) {
  return  (
           <>
                  {
                   messageStatus === "sent" && <BsCheck  className=" text-xl text-bubble-meta"/>
                  }
                  {
                    messageStatus === "delivered" && <BsCheckAll className=" text-lg text-bubble-meta" />
                  }
                  {
                   messageStatus === "read" && <BsCheckAll className=" text-lg  text-icon-ack" />
                  }
           </>
  )
}

export default MessageStatus;
