import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { BiSearchAlt2 } from "react-icons/bi"
import { BsThreeDotsVertical } from "react-icons/bs"
import ChatLIstItem from "./ChatLIstItem";
// import   "../../styles/globals.css"
function ContactsList() {
  const [allContacts, setAllContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchContact, setSearchContact] = useState([]);
  // const[{ filteredContactSearch ,contactSearch},dispatch] = useStateProvider(); why its dont work as as written same as search bar
   const [{contactPage},dispatch]=useStateProvider();

  useEffect(() => {
    if (searchTerm.length) {
      const filteredContact = {};
      Object.keys(allContacts).forEach((key) => {
        const filteredUsers = allContacts[key].filter((obj) =>
               obj.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredUsers.length > 0) {
              filteredContact[key] = filteredUsers;
        }
      });
      setSearchContact(filteredContact);
    } else {
      setSearchContact(allContacts);  
    }
  }, [searchTerm])
/// Both are same but there is some  difference bw how im updating the filteredContacts , niche vala comment Useeffec me error hai
//   useEffect(()=>{
//     if(searchTerm.length){
//           const filteredContact = {};
//           Object.keys(allContacts).forEach((key)=>{
//                  filteredContact[key] = allContacts[key].filter((obj)=>{
//                      obj.name.toLowerCase().includes(searchTerm.toLowerCase());
//                  })
//           })
//           setSearchContact(filteredContact);
//           console.log("Filtered")
//     }else{
//       setSearchContact(allContacts); /// with one search contact state i can mange the both UI first searched UI and nomal all contacts UI
//     }
// },[searchTerm])

  useEffect(() => {
    const getContcts = async () => {
      try {
        const { data: { users } } = await axios.get(GET_ALL_CONTACTS);
         
        setAllContacts(users);
        setSearchContact(users);  // with one search contact state i can mange the both UI first searched UI and nomal all contacts UI
      }
      catch (error) {
        console.log("Error during fetching all contacts", error)
      }
    }
    if (!searchTerm) {
        getContcts();
    }
    //  getContcts();   ->> I can also use this but the issue arise , when i search something ,okk and found or not dont't matter ,but when it refresh the contact page vala all contacts become so i used this condiotion , if search data is present the no call for getting all contacts

  }, []);

  return <div className=" w-full h-full flex flex-col gap-y-2 relative  ">
    <div className=" flex  gap-x-10 items-center  h-14  pt-10 px-6  pb-3   ">
      <BiArrowBack onClick={() => dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE ,  contactPage : "default"})} className=" cursor-pointer text-xl text-white font-extrabold" />
      <span className=" text-white   ">New Chat</span>
    </div>

    <div className=" h-full w-full bg-search-input-container-background flex-auto overflow-auto custom-scrollbar "   >
      <div className="   w-full  flex flex-col  flex-grow  px-3  pb-3  ">
        <div className="h-10 w-full bg-panel-header-background flex gap-x-3 mt-3 focus-within:border-green-500   focus-within:border-b-2 items-center px-4 py-2 rounded-md  ">
          <BiSearchAlt2 className=" text-xl  text-panel-header-icon " />
          <input
            type="text"
            placeholder="Search Contacts"
            className=" w-full  text-white  bg-transparent  focus:outline-none  pr-4 "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
      </div>
      {
        Object.keys(searchContact).length > 0 ?
          (
                    Object.entries(searchContact).map(([initialLetter, AllUsers]) => (
                      <div key={Date.now() + initialLetter} className="">
                        <div className=" text-teal-light py-6 px-6"> {initialLetter} </div>
                        {
                          AllUsers.map((contacts) => (
                            <ChatLIstItem
                              data={contacts}
                              isContactsPage={true}
                              key={contacts.id}
                            />
                          ))
                        }
                      </div>
                    ))
                
          ) : (
             <span className=" text-sm text-bubble-meta  w-full  mt-[50%]  flex items-center justify-center">No result founds</span>
          )
      }
    </div>

  </div>;
}

export default ContactsList;
