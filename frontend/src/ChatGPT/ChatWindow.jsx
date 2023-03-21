import React, { useEffect, useState } from 'react';
import Message from './MessageItem';
import axios from 'axios';


const ChatWindow = ({chat, onProcessing, onSetProcessing }) => {
  // Replace the array with actual message data
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    onSetProcessing(true);
    // fetch the messages
    const apiURL = import.meta.env.VITE_API_URL
    axios.get(apiURL + `/chats/${chat.id}/messages`).then((res)=>{
      console.log(res);
      setMessages(res.data.messages);
    })
    onSetProcessing(false);

  }, [chat])



  const handleSend = async () => {
    onSetProcessing(true);

    // Implement sending the message here
    const apiURL = import.meta.env.VITE_API_URL
    if (input.trim() != "") {
    const result = await axios.post(apiURL+`/chats/${chat.id}/messages`, {content:input})
    console.log(result)
    const newMessage = result.data.message
    setMessages([...messages, newMessage]);  
    }
    setInput('');
    onSetProcessing(false);

  };






  const handleMessageUpdate = async (id, content) => {
    onSetProcessing(true);

    // Implement updating the message here
        const apiURL = import.meta.env.VITE_API_URL
        await axios.put(apiURL+`/chats/${chat.id}/messages/`+ id, {content})
    console.log(id, content)
    const updatedMessages = messages.map((message) =>
    message.id === id ? { ...message, content: content } : message
    );
    setMessages(updatedMessages);
    onSetProcessing(false);


  };




  const handleMessageDelete = async (id) => {
    onSetProcessing(true);

    // Implement deleting the message here

    const apiURL = import.meta.env.VITE_API_URL
    await axios.delete(apiURL+`/chats/${chat.id}/messages/`+ id)
    
    const updatedMessages = messages.filter((message) => message.id !== id);
    setMessages(updatedMessages);

    console.log(id)
    onSetProcessing(false);

  }



  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        {messages.map((message) => (
          <Message key={message.id} message={message} onUpdate={handleMessageUpdate} onDelete={handleMessageDelete} />
        ))}
      </div>
      {onProcessing ? "" :
      <div className="flex mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className={`ml-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded ${onProcessing ? "bg-red-100" : ""}`}
        >
          {/* Send */}
          {onProcessing ? "Processing" : "Send"}

        </button>
      </div>}
    </div>
  );
};

export default ChatWindow;
