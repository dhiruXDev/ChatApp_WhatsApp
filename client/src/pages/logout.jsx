import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function logout() {
  const[{ socket ,UserInfo},dispatch] =useStateProvider();
  const router = useRouter();
  useEffect(()=>{
    socket.current.on("signout" , UserInfo.id);
    dispatch({type : reducerCases.SET_USER_INFO , UserInfo : undefined});
    signOut(firebaseAuth);   // signOut is provided by firebase
    router.push("/signIn");

  },[socket])
  return <div className=" h-screen w-screen bg-conversation-panel-background absolute z-[1000]  top-20  overflow-hidden ">
        
         </div>;
}

export default logout;
