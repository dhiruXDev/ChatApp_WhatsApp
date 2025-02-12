// signup vala page hai 
import React, { useEffect, useState } from "react";
import Image from "next/image"
import Input from "@/components/common/Input";
import Avatar from "@/components/common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import axios from "axios";
import { AUTH_API_ENDPOINTS } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
import { useRouter } from "next/router";

function onboarding() {
   const[{ UserInfo ,NewUser},dispatch]=useStateProvider();
   const router = useRouter();
   const[name,setName] = useState(UserInfo?.name  || "");
   const[about,setAbout] =useState("");
   const[image,setImage] = useState("/default_avatar.png" );
   const[loading ,setLoading]=useState(false);

// Redirect based on user and new user status 
//    useEffect(()=>{
//         if(!NewUser && !UserInfo?.email){
//               router.push("/signIn");
//         }else if(!NewUser && !UserInfo?.email){
//             router.push("/");
//         }
//    },[NewUser,UserInfo,router])



// Redirect based on user and new user status
    useEffect(() => {
        if (!UserInfo?.email) {
            router.push(NewUser ? "/signIn" : "/");
        }
    }, [NewUser, UserInfo, router]);


// Handle profile creation and store user data in DB
   const onboardClickHandler = async () => {
    // alert("Onboarding");
    if (validateDetails()) {  // Check if required fields are valid
        const email = UserInfo.email;
        // alert("Onboarding2");
        try {
            // alert("Onboarding3");
            setLoading(true);
            const { data } = await axios.post(AUTH_API_ENDPOINTS.ONBOARD_USER_API, {
                email,
                name,
                about,
                profilePicture: image,
            });
            // console.log("alls res",data);
            if (data.success) {
                dispatch({ type: reducerCases.SET_NEW_USER, NewUser: false });
                dispatch({
                    type: reducerCases.SET_USER_INFO,
                    UserInfo: { name, status: about, email, profileImage: image },
                });
                router.push("/");  // Navigate to the main app page
            }
        } catch (error) {
            console.error("Error during onboarding", error);
        } finally {
            setLoading(false);
        }
    } else {
        alert("Name must be at least 3 characters");  // Show validation message
    }
};

   const validateDetails = ()=>{
        if(name.length < 3){
             return false;
        }else{
            return true;
        }
   }
  return (
    <div className=" w-screen h-screen overflow-x-hidden bg-panel-header-background  flex items-center justify-center">
          <div className=" flex flex-col gap-y-3">
              <div className=" flex gap-x-5 items-center">
                  <Image  src={'/whatsapp.gif'} alt="Whatsapp"  width={280 } height={220} />
                   <div className="text-6xl font-medium text-white">WhatsApp</div>
              </div>
              <div className="  text-white flex flex-col gap-y-3 items-center justify-center">
                      <h1  className=" text-xl   text-center -ml-14 ">Create Your Profile</h1>
                      <div className=" flex gap-x-2 items-center justify-center ">
                          <div className=" flex flex-col gap-y-2">
                              <Input name={"Display name"} label ={true} state={name} setState={setName} />
                              <Input  name={"About"} label={true} state={about} setState={setAbout}  />
                              <div  onClick={onboardClickHandler}  className=" cursor-pointer flex items-center justify-center bg-slate-900 hover:bg-slate-950 duration-150 text-white font-semibold  py-2 px-2 rounded-md mt-2 ">
                                    <span >
                                          Create Profile
                                    </span>
                              </div>
                          </div>
                           <div>
                               <Avatar image={image} setImage={setImage} type={"xl"} />
                           </div>
                           
                      </div>
              </div>
          </div>
   </div>
  )
}

export default onboarding;
