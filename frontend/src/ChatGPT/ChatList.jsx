import React, { useState, useEffect } from 'react';
import ChatItem from './ChatItem';
import NewChatButton from './NewChatButton';
import axios from 'axios';


const ChatList = ({ onSelect, selectedChat, onProcessing, onSetProcessing }) => {
  const [chats, setChats] = useState();
  console.log("chats", chats)

  useEffect(() => {
    // fetch the chats
    getChat()
  }, []);

  const getChat = async () => {
    onSetProcessing(true);
    const apiURL = import.meta.env.VITE_API_URL

    await axios.get(apiURL + '/chats').then((res)=>{
      // console.log(res);
      setChats(res.data.chats);
      console.log("chats", chats)

    })
    onSetProcessing(false);

  }

  const updateChat = async (id, newName) => {
    onSetProcessing(true);

    // update the chat
    const apiURL = import.meta.env.VITE_API_URL
    // const chats = await axios.put(apiURL+"/chats/"+ id, {name:newName})
    // console.log("update",chats)
    await axios.put(apiURL+"/chats/"+ id, {name:newName})

    const updatedChats = chats.map((chat) =>
      chat.id === id ? { ...chat, name: newName } : chat
    );
    setChats(updatedChats);
    onSetProcessing(false);

  };


  const deleteChat = async (id) => {
    onSetProcessing(true);

    // delete the chat
    const apiURL = import.meta.env.VITE_API_URL
    await axios.delete(apiURL+"/chats/"+ id)
    const updatedChats = chats.filter((chat) => chat.id !== id);
    // selectedChat = null;
    onSelect(null)
    setChats(updatedChats);
    onSetProcessing(false);

  };

  const createChat = async (name) => {
    onSetProcessing(true);

    const apiURL = import.meta.env.VITE_API_URL
    const result = await axios.post(apiURL+"/chats", {name:name})
    console.log(result)
    const newChat = result.data.chat
    setChats([...chats, newChat]);
    onSetProcessing(false);

  };

  return (
    <div className="overflow-y-auto">
       {/* {onProcessing ? "Loading" : ""} */}
       
       { chats ? chats.map((chat) => (
        <ChatItem selected={chat.id == selectedChat?.id} key={chat.id} chat={chat} onSelect={onSelect} onUpdate={updateChat} onDelete={deleteChat}/>
      )) :  "Loading"}
      <NewChatButton onCreate={createChat} processing={onProcessing} />
    </div>
  );
};

export default ChatList;
