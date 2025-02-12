import React, { useState } from "react";
import Image from "next/image"
import { FcGoogle } from "react-icons/fc"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
//import { CHECK_URL_API } from "@/utils/ApiRoutes";
import { AUTH_API_ENDPOINTS } from "../utils/ApiRoutes"
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
function Login() {
    const router = useRouter();
    const [{}, dispatch] = useStateProvider();
    // const logInHandler = async () => {
    //     const provider = new GoogleAuthProvider();
    //     //   const {user} = await signInWithPopup(firebaseAuth,provider);
    //     const {user:{displayName: name, email, photoURL: profileImage } } = await signInWithPopup(firebaseAuth, provider);   // photoUrl ko  profileImage me rename kr diye
    //     try {
    //         if (email) {
    //              const { data } = await axios.post(AUTH_API_ENDPOINTS.CHECK_URL_API , { email });
    //              console.log( "dddddd",data);
    //             if (!data.success) {
    //                 // Means New user hai then i have to store their Info globally
    //                 dispatch({ type: reducerCases.SET_NEW_USER, NewUser: true });
    //                 dispatch({ type: reducerCases.SET_USER_INFO, UserInfo: {
    //                         name,
    //                         email,
    //                         profileImage,
    //                         status: ""
    //                     }
    //                 });
    //                 router.push('/onboarding');
    //             }else{
    //                 const{id,name,about,email,profilePicture:profileImage,status} = data.data;
    //                 console.log("XXXXXX",{id,name,email,about,profilePicture:profileImage,status})
    //                 dispatch({
    //                      type : reducerCases.SET_USER_INFO,
    //                      UserInfo: id,name,about,email,profileImage,status
    //                 });
    //                  router.push("/");
    //             }
    //         }
    //     } catch (error) {
    //         console.log("ERROR DURING CHECKING THE USER IS FOUND OR NOT", error);
    //         alert(error.message);
    //     }
    // }

     // Function to handle user login with Google
     
     
     const logInHandler = async () => {
        const provider = new GoogleAuthProvider();
         
        // Sign in with Google and retrieve user info
        const { user: { displayName: name, email, photoURL: profileImage } } = await signInWithPopup(firebaseAuth, provider);
        
        try {
            if (email) {
                // Check if the user already exists in the database
                const { data } = await axios.post(AUTH_API_ENDPOINTS.CHECK_URL_API, { email });
                
                if (!data.success) {
                    // If user is new, set NewUser state and store user info(as global Data as stateProvider) for onboarding
                    dispatch({ type: reducerCases.SET_NEW_USER, NewUser: true });
                    dispatch({ type: reducerCases.SET_USER_INFO, UserInfo: { name, email, profileImage, status: "" } });
                    router.push('/onboarding');  // Redirect to onboarding page
                } else {
                    // If user exists, store retrieved user info in global state
                    const { id, name, about, email, profilePicture: profileImage, status } = data.data;
                    dispatch({
                        type: reducerCases.SET_USER_INFO,
                        UserInfo: { id, name, about, email, profileImage, status }
                    });
                    router.push("/");  // Redirect to the main app page
                }
            }
        } catch (error) {
            console.error("Error checking user existence", error);
            alert(error.message);
        }
    };

    return (
        <div className=" h-screen w-screen  overflow-x-hidden flex  flex-col justify-center gap-y-6 items-center  bg-panel-header-background text-white">
            <div className=" flex gap-x-10 items-center">
                <Image src={'/whatsapp.gif'} alt="Whatsapp" width={300} height={220} />
                <h1 className=" text-7xl  font-semibold">WhatsApp</h1>
            </div>
            <button
                onClick={logInHandler}
                className=" bg-search-input-container-background   hover:bg-opacity-70 duration-150 py-3 px-4  rounded-md  flex gap-x-3">
                <FcGoogle className=" text-3xl " />
                <span className=" text-xl ">LogIn with Google</span>
            </button>
        </div>
    )
}

export default Login;
