import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { GET_INITIAL_CONTACTS_API } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ChatLIstItem from "./ChatLIstItem";
//.custom-scrollbar
function List({setLoading}) {
  const [ {UserInfo , userContacts,messages ,filteredContactSearch } ,dispatch] = useStateProvider();
  const [activeItemId, setActiveItemId] = useState(null);
  
  useEffect (()=>{
            const getContacts = async()=>{
                  setLoading(true);
                    try {
                       const {data: {onlineUsers ,users}} = await axios.get(`${GET_INITIAL_CONTACTS_API}/${UserInfo?.id}`);
                       dispatch({type : reducerCases.SET_USER_CONTACTS , userContacts:users});  
                       dispatch({type : reducerCases.SET_ONLINE_USERS , onlineUsers});  
                       setLoading(false);
                      //  console.log("All COntacts",userContacts)
                } catch (error) {
                    console.log("Error during fetching the contact list ",error)
                }
                setLoading(false);
            } 
              if(UserInfo){
                getContacts() ;
              }
               
  },[UserInfo ,messages]);

  const handleActiveItemChange = (id) => {
    setActiveItemId(id);
  };

  // console.log("Fileterd data ",filteredContactSearch ,userContacts);

  return <div className=" bg-search-input-container-background flex-auto  h-auto max-h-full overflow-auto custom-scrollbar pt-3 "> 
             {
                 filteredContactSearch && filteredContactSearch.length > 0 ? 
                      ( 
                        filteredContactSearch.map((contact)=>( <ChatLIstItem  data={contact} key={contact.id} isActive={false} setActiveItem={() => {}} /> ))
                      )  
                      : 
                      (  
                            userContacts?.map((contact)=>(
                              <ChatLIstItem  data={contact} key={contact.id} isActive={activeItemId === contact.id} setActiveItem={handleActiveItemChange} />             
                            ))
                          
                      )
             }
             
  </div>;
}

export default List;
