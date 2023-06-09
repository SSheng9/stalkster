import React, { useState, useEffect } from 'react';
import ChatItem from './ChatItem';
import NewChatButton from './NewChatButton';
import axios from 'axios';

import { Auth, API } from "aws-amplify";

import { useNavigate  } from "react-router-dom";


import { Storage } from 'aws-amplify';


const ChatList = ({ onSelect, selectedChat, onProcessing, onSetProcessing }) => {
  const [chats, setChats] = useState();
  console.log("chats", chats)
  const navigate = useNavigate();

  const [user_id, setIdentityId] = useState(null);


    const getCurrentIdentityId = async () => {
      try {
        const credentials = await Auth.currentCredentials();
        const id = credentials.identityId;
        setIdentityId(id);
      } catch (err) {
        console.log("Error getting current credentials: ", err);
      }
    };


  useEffect(() => {
    // fetch the chats
    getChat();
    getCurrentIdentityId();

  }, []);

  const getChat = async () => {
    onSetProcessing(true);
    // const apiURL = import.meta.env.VITE_API_URL

    // await axios.get(apiURL + '/chats').then((res)=>{
      // console.log(res);
      // setChats(res.data.chats);
      // console.log("chats", chats)
    // })
    await API.get("api", "/chats").then((response) => {
        // alert(JSON.stringify(response, null, 2))
        setChats(response.chats)  
      })
      .catch((error) => {
        // console.log(error)
        alert(error)
      })
      // alert(JSON.stringify(response));


    onSetProcessing(false);

  }

  const updateChat = async (id, newName) => {
    onSetProcessing(true);

    // update the chat
    // const apiURL = import.meta.env.VITE_API_URL
    // const chats = await axios.put(apiURL+"/chats/"+ id, {name:newName})
    // console.log("update",chats)
    // await axios.put(apiURL+"/chats/"+ id, {name:newName})
    console.log("test")
    try{
      await API.put("api", "/chats/" + id,    
      {
         body: {name: newName} ,
        //   headers: {
        //   Authorization: `Bearer ${(await Auth.currentSession())
        //     .getAccessToken()
        //     .getJwtToken()}`,
        // },
      }
      );
    const updatedChats = chats.map((chat) =>
      chat.id === id ? { ...chat, name: newName } : chat
    );
    setChats(updatedChats);

  }catch(error){
    alert(error)
    console.log(error);
  }
  onSetProcessing(false);

}


  const deleteChat = async (id) => {
    onSetProcessing(true);

    // delete the chat
    // const apiURL = import.meta.env.VITE_API_URL
    // await axios.delete(apiURL+"/chats/"+ id)

    const response = await API.get("api", "/chats/" + id + "/messages");
    const messages =response.messages;
    await Storage.remove(messages.find(message => message.chat_id === id)?.content);

   await API.del("api", "/chats/" + id,  
      {
        // headers: {
        //   Authorization: `Bearer ${(await Auth.currentSession())
        //     .getAccessToken()
        //     .getJwtToken()}`,
        // },
      }
    );


    const updatedChats = chats.filter((chat) => chat.id !== id);
    // selectedChat = null;
    onSelect(null)
    setChats(updatedChats);
    onSetProcessing(false);

  };

  const createChat = async (name) => {
    onSetProcessing(true);
    // const history = useHistory();

    // const apiURL = import.meta.env.VITE_API_URL
    // const result = await axios.post(apiURL+"/chats", {name:name})
    try{
    const result = await API.post("api", "/chats",  
    {
       body: {name: name} ,
      // headers: {
      //   Authorization: `Bearer ${(await Auth.currentSession())
      //     .getAccessToken()
      //     .getJwtToken()}`,
      // },
    });
    console.log(result)
    const newChat = result.chat
    setChats([ newChat, ...chats ]);
    console.log("createchat",chats);
    onSetProcessing(false);

  } catch(error){
    alert(error)
    console.log(error);
    navigate("/login")
    onSetProcessing(false);

  }

  };

  return (
    <div className="overflow-y-auto">
       {/* {onProcessing ? "Loading" : ""} */}
       <NewChatButton onCreate={createChat} processing={onProcessing} />

       { chats ? chats.map((chat) => (
        <ChatItem selected={chat.id == selectedChat?.id} key={chat.id} chat={chat} onSelect={onSelect} onUpdate={updateChat} onDelete={deleteChat} user_id = {user_id}/>
      )) :  "Loading"}
    </div>
  );
};

export default ChatList;
